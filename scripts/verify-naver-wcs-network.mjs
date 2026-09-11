import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const pageUrl = process.env.NAVER_WCS_QA_URL ?? "http://127.0.0.1:3018/";
const debugPort = 9234;
const requests = [];
const consoleMessages = [];
const failedRequests = [];
const requestUrls = new Map();
const hostResolverRules = process.env.NAVER_WCS_QA_HOST_RESOLVER_RULES;
const disableHttpsUpgrades = process.env.NAVER_WCS_QA_DISABLE_HTTPS_UPGRADES === "true";
const browser = spawn("/usr/bin/chromium", [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--no-proxy-server",
  ...(disableHttpsUpgrades ? ["--disable-features=HttpsUpgrades"] : []),
  `--remote-debugging-port=${debugPort}`,
  ...(hostResolverRules ? [`--host-resolver-rules=${hostResolverRules}`] : []),
  "about:blank",
], { stdio: "ignore" });

async function waitForDebugger() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      return await fetch(`http://127.0.0.1:${debugPort}/json/version`).then(response => response.json());
    } catch {
      await delay(100);
    }
  }
  throw new Error("Chromium DevTools endpoint did not become ready.");
}

const version = await waitForDebugger();
const socket = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let id = 0;
let sessionId = null;
const pending = new Map();
socket.addEventListener("message", event => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const handler = pending.get(message.id);
    pending.delete(message.id);
    message.error ? handler?.reject(new Error(message.error.message)) : handler?.resolve(message.result);
    return;
  }
  if (message.sessionId !== sessionId) return;
  if (message.method === "Network.requestWillBeSent") {
    const url = message.params.request.url;
    requestUrls.set(message.params.requestId, url);
    if (url.includes("wcs.naver.net")) requests.push(url);
  }
  if (message.method === "Network.loadingFailed") {
    failedRequests.push({
      url: requestUrls.get(message.params.requestId) ?? null,
      errorText: message.params.errorText,
      blockedReason: message.params.blockedReason ?? null,
    });
  }
  if (message.method === "Runtime.consoleAPICalled") {
    consoleMessages.push(message.params.args.map(arg => arg.value ?? arg.description ?? arg.type));
  }
});

function send(method, params = {}) {
  const messageId = ++id;
  socket.send(JSON.stringify({ id: messageId, method, params, ...(sessionId ? { sessionId } : {}) }));
  return new Promise((resolve, reject) => pending.set(messageId, { resolve, reject }));
}

const target = await send("Target.createTarget", { url: "about:blank" });
const attached = await send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
sessionId = attached.sessionId;
await Promise.all([send("Network.enable"), send("Page.enable"), send("Runtime.enable")]);
await send("Page.navigate", { url: pageUrl });
await delay(5_000);

const state = await send("Runtime.evaluate", {
  expression: `({
    href: window.location.href,
    readyState: document.readyState,
    bodyTextLength: document.body?.innerText.length ?? 0,
    scriptCount: document.querySelectorAll('#star-pibu-naver-wcs').length,
    account: window.wcs_add?.wa ?? null,
    hasInflow: typeof window.wcs?.inflow === 'function',
    hasCommonTracking: typeof window.wcs_do === 'function'
  })`,
  returnByValue: true,
});

if (state.exceptionDetails) throw new Error(JSON.stringify(state.exceptionDetails));

console.log(JSON.stringify({ pageUrl, requests, failedRequests, consoleMessages, ...(state.result.value ?? { evaluationMissing: true }) }, null, 2));
socket.close();
browser.kill("SIGTERM");

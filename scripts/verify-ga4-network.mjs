import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const pageUrl = process.env.GA4_QA_URL ?? "http://127.0.0.1:3018/";
const debugPort = 9233;
const requests = [];
const hostResolverRules = process.env.GA4_QA_HOST_RESOLVER_RULES;
const browser = spawn("/usr/bin/chromium", [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--no-proxy-server",
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
  if (message.sessionId !== sessionId || message.method !== "Network.requestWillBeSent") return;
  const url = message.params.request.url;
  if (url.includes("googletagmanager.com/gtag/js") || url.includes("google-analytics.com/g/collect")) {
    requests.push(url);
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
await Promise.all([
  send("Network.enable"),
  send("Page.enable"),
  send("Runtime.enable"),
]);
await send("Page.navigate", { url: pageUrl });
await delay(5_000);
const state = await send("Runtime.evaluate", {
  expression: `({
    scriptCount: document.querySelectorAll('#star-pibu-ga4').length,
    ga4ConfigCount: (window.dataLayer ?? []).filter(entry => entry?.[0] === 'config').length,
    ga4PageViewCount: (window.dataLayer ?? []).filter(entry => entry?.[0] === 'event' && entry?.[1] === 'page_view').length,
    eventHasQueryString: (window.dataLayer ?? []).some(entry => entry?.[0] === 'event' && entry?.[1] === 'page_view' && /[?#]/.test(entry?.[2]?.page_path ?? ''))
  })`,
  returnByValue: true,
});

if (state.exceptionDetails) {
  throw new Error(JSON.stringify(state.exceptionDetails));
}

console.log(JSON.stringify({ pageUrl, requests, ...(state.result.value ?? { evaluationMissing: true, rawResult: state.result }) }, null, 2));
socket.close();
browser.kill("SIGTERM");

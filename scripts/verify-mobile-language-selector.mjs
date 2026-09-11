import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const pageUrl = process.env.MOBILE_LANGUAGE_QA_URL ?? "https://3000-iv3fexptaw6oytybjg5v1-0e278b5d.sg2.manus.computer/";
const debugPort = 9235;
const browser = spawn("/usr/bin/chromium", [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--ignore-certificate-errors",
  "--no-proxy-server",
  `--remote-debugging-port=${debugPort}`,
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
  if (!message.id) return;
  const handler = pending.get(message.id);
  pending.delete(message.id);
  message.error ? handler?.reject(new Error(message.error.message)) : handler?.resolve(message.result);
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
  send("Page.enable"),
  send("Runtime.enable"),
  send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true }),
]);
await send("Page.navigate", { url: pageUrl });
await delay(4_000);

const evaluate = expression => send("Runtime.evaluate", { expression, returnByValue: true });
const before = await evaluate(`(() => {
  const language = Array.from(document.querySelectorAll('button[aria-label="언어 선택"]')).find(button => button.offsetParent !== null);
  const menu = document.querySelector('button[aria-label="메뉴 열기"]');
  const rect = element => element ? (() => { const r = element.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; })() : null;
  return {
    language: rect(language), menu: rect(menu),
    drawerLanguageSectionCount: document.querySelectorAll('.mobile-menu-lang-section').length,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
  };
})()`);
await evaluate(`Array.from(document.querySelectorAll('button[aria-label="언어 선택"]')).find(button => button.offsetParent !== null)?.click()`);
await delay(150);
const after = await evaluate(`(() => {
  const listbox = Array.from(document.querySelectorAll('[role="listbox"][aria-label="언어 목록"]')).find(element => element.offsetParent !== null);
  const r = listbox?.getBoundingClientRect();
  const trigger = Array.from(document.querySelectorAll('button[aria-label="언어 선택"]')).find(button => button.offsetParent !== null);
  return { expanded: trigger?.getAttribute('aria-expanded'), optionCount: listbox?.querySelectorAll('[role="option"]').length ?? 0, listbox: r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null };
})()`);

console.log(JSON.stringify({ pageUrl, before: before.result.value, after: after.result.value }, null, 2));
socket.close();
browser.kill("SIGTERM");

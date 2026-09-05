import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";

const pageUrl = process.env.FONT_QA_URL ?? "http://127.0.0.1:3014/";
const primaryUrl = "PretendardVariable-korean-primary_693508b2.woff2";
const secondaryUrl = "PretendardVariable-korean-secondary_441758ac.woff2";
const symbols = ["─", "々", "✅", "❌", "⚕", "✨", "⚡", "✦", "⭐", "⏳", "☰", "✈", "⏱"];
const audit = JSON.parse(readFileSync(new URL("../reports/korean-glyph-audit.json", import.meta.url), "utf8"));
const auditedPrimaryCodePoints = new Set(audit.primarySubset.codePoints);
const debugPort = 9228;
const requested = [];

const browser = spawn("/usr/bin/chromium", [
  "--headless=new", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${debugPort}`, "about:blank",
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
const pending = new Map();
let mainSessionId = null;
let loadFinished = false;
socket.addEventListener("message", event => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const resolver = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) resolver?.reject(new Error(message.error.message));
    else resolver?.resolve(message.result);
    return;
  }
  if (message.sessionId !== mainSessionId) return;
  if (message.method === "Network.responseReceived") {
    const { response, type } = message.params;
    if (type === "Font" || response.url.includes("PretendardVariable-korean-")) {
      requested.push({ url: response.url, status: response.status, contentType: response.mimeType ?? null });
    }
  }
  if (message.method === "Page.loadEventFired") loadFinished = true;
});

function send(method, params = {}, sessionId) {
  const messageId = ++id;
  socket.send(JSON.stringify({ id: messageId, method, params, ...(sessionId ? { sessionId } : {}) }));
  return new Promise((resolve, reject) => pending.set(messageId, { resolve, reject }));
}

const target = await send("Target.createTarget", { url: "about:blank" });
const attached = await send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
mainSessionId = attached.sessionId;
await Promise.all([
  send("Network.enable", {}, mainSessionId),
  send("Page.enable", {}, mainSessionId),
  send("Runtime.enable", {}, mainSessionId),
  send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false }, mainSessionId),
]);
await send("Page.navigate", { url: pageUrl }, mainSessionId);
for (let attempt = 0; attempt < 100 && !loadFinished; attempt += 1) await delay(100);
const dimensions = await send("Runtime.evaluate", {
  expression: "({ height: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight), viewport: window.innerHeight })",
  returnByValue: true,
}, mainSessionId);
const { height, viewport } = dimensions.result.value;
for (let offset = 0; offset < height; offset += viewport) {
  await send("Runtime.evaluate", { expression: `window.scrollTo(0, ${offset})` }, mainSessionId);
  await delay(350);
}
await send("Runtime.evaluate", { expression: "window.scrollTo(0, 0)" }, mainSessionId);
await delay(2_000);

const evaluation = await send("Runtime.evaluate", {
  expression: `(${((candidates) => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const visible = new Set();
  const renderedTextNodes = [];
  while (walker.nextNode()) {
    const parent = walker.currentNode.parentElement;
    if (!parent || parent.getBoundingClientRect().width === 0 || parent.getBoundingClientRect().height === 0) continue;
    renderedTextNodes.push(walker.currentNode.textContent ?? "");
    for (const symbol of candidates) if (walker.currentNode.textContent?.includes(symbol)) visible.add(symbol);
  }
  return {
    loadedFaces: Array.from(document.fonts).map(face => ({ family: face.family, status: face.status })),
    resourceFonts: performance.getEntriesByType("resource")
      .map(entry => entry.name)
      .filter(name => name.includes("PretendardVariable-korean-")),
    visibleSymbols: candidates.filter(symbol => visible.has(symbol)),
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
    bodyFontFamily: getComputedStyle(document.body).fontFamily,
    bodyTextLength: document.body.innerText.length,
    renderedHangul: Array.from(new Set(document.body.innerText.match(/[\uAC00-\uD7A3]/gu) ?? []))
      .map(char => char.codePointAt(0))
      .sort((a, b) => a - b),
    renderedTextNodes,
  };
}).toString()})(${JSON.stringify(symbols)})`,
  awaitPromise: true,
  returnByValue: true,
}, mainSessionId);
const result = evaluation.result.value;

console.log(JSON.stringify({
  pageUrl,
  primaryRequested: requested.filter(item => item.url.includes(primaryUrl)),
  secondaryRequested: requested.filter(item => item.url.includes(secondaryUrl)),
  timedPrimaryRequests: result.resourceFonts.filter(url => url.includes(primaryUrl)),
  timedSecondaryRequests: result.resourceFonts.filter(url => url.includes(secondaryUrl)),
  visibleSymbols: result.visibleSymbols,
  loadedPretendardFaces: result.loadedFaces.filter(face => face.family.includes("Pretendard")),
  bodyFontFamily: result.bodyFontFamily,
  bodyTextLength: result.bodyTextLength,
  renderedHangulOutsideAuditedPrimary: result.renderedHangul
    .filter(codePoint => !auditedPrimaryCodePoints.has(codePoint))
    .map(codePoint => String.fromCodePoint(codePoint)),
  missingGlyphTextNodes: result.renderedTextNodes.filter(text =>
    Array.from(text).some(char => /[\uAC00-\uD7A3]/u.test(char) && !auditedPrimaryCodePoints.has(char.codePointAt(0))),
  ),
  documentWidth: result.documentWidth,
  viewportWidth: result.viewportWidth,
  noHorizontalOverflow: result.documentWidth <= result.viewportWidth + 1,
}, null, 2));

socket.close();
browser.kill("SIGTERM");

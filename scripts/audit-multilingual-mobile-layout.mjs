import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const baseUrl = process.env.MULTILINGUAL_LAYOUT_BASE_URL ?? "http://127.0.0.1:3000";
const reportPath = new URL("../reports/multilingual-mobile-layout-audit.json", import.meta.url);
const captureDir = process.env.MULTILINGUAL_LAYOUT_CAPTURE_DIR;
const debugPort = 9254;
const locales = ["en", "ja", "zh", "zh-tw"];
const routeSuffixes = ["", "/equipment3", "/treatments/ulthera", "/about", "/doctors", "/foreign-guide"];
const targets = [375, 390].flatMap(width => locales.flatMap(locale => routeSuffixes.map(suffix => ({
  locale,
  path: `/${locale}${suffix}`,
  width,
  label: `${locale}${suffix || "/"}-${width}`,
}))));

const chromium = (await import("node:child_process")).spawn("/usr/bin/chromium", [
  "--headless=new", "--no-sandbox", "--disable-gpu", "--ignore-certificate-errors",
  `--remote-debugging-port=${debugPort}`, "about:blank",
], { stdio: "ignore" });

async function debuggerVersion() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try { return await fetch(`http://127.0.0.1:${debugPort}/json/version`).then(response => response.json()); }
    catch { await delay(100); }
  }
  throw new Error("Chromium DevTools endpoint did not become ready.");
}

const version = await debuggerVersion();
const socket = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});
let messageId = 0;
const pending = new Map();
let sessionId = null;
let loaded = false;
socket.addEventListener("message", event => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const request = pending.get(message.id);
    pending.delete(message.id);
    message.error ? request?.reject(new Error(message.error.message)) : request?.resolve(message.result);
  } else if (message.sessionId === sessionId && message.method === "Page.loadEventFired") {
    loaded = true;
  }
});
function call(method, params = {}, session = sessionId) {
  const id = ++messageId;
  socket.send(JSON.stringify({ id, method, params, ...(session ? { sessionId: session } : {}) }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

const target = await call("Target.createTarget", { url: "about:blank" }, null);
const attached = await call("Target.attachToTarget", { targetId: target.targetId, flatten: true }, null);
sessionId = attached.sessionId;
await Promise.all([call("Page.enable"), call("Runtime.enable")]);
if (captureDir) mkdirSync(captureDir, { recursive: true });

const results = [];
for (const definition of targets) {
  loaded = false;
  await call("Emulation.setDeviceMetricsOverride", {
    width: definition.width, height: 844, deviceScaleFactor: 1, mobile: true,
  });
  await call("Page.navigate", { url: new URL(definition.path, baseUrl).toString() });
  for (let attempt = 0; attempt < 90 && !loaded; attempt += 1) await delay(100);
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const mounted = await call("Runtime.evaluate", {
      expression: "Boolean(document.querySelector('#root')?.childElementCount)", returnByValue: true,
    });
    if (mounted.result.value) break;
    await delay(100);
  }
  await delay(500);
  const height = await call("Runtime.evaluate", {
    expression: "Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)", returnByValue: true,
  });
  for (let y = 0; y < (height.result.value ?? 844); y += 700) {
    await call("Runtime.evaluate", { expression: `window.scrollTo(0, ${y})` });
    await delay(80);
  }
  await call("Runtime.evaluate", { expression: "window.scrollTo(0, 0)" });
  await delay(200);
  const layout = await call("Runtime.evaluate", {
    expression: `(() => {
      const isVisible = element => {
        const style = getComputedStyle(element); const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      };
      const id = element => ({ tag: element.tagName.toLowerCase(), className: String(element.className || '').slice(0, 120), width: Math.round(element.getBoundingClientRect().width), height: Math.round(element.getBoundingClientRect().height) });
      const inlineOverflow = [...document.querySelectorAll('h1,h2,h3,p,li,a,button,label,span')]
        .filter(isVisible)
        .filter(element => { const rect = element.getBoundingClientRect(); return rect.left < -1 || rect.right > window.innerWidth + 1; })
        .slice(0, 20).map(id);
      const clippedText = [...document.querySelectorAll('h1,h2,h3,p,li,a,button,label,span')]
        .filter(isVisible)
        .filter(element => element.scrollWidth > element.clientWidth + 1 && element.clientWidth > 0)
        .slice(0, 20).map(id);
      const smallControls = [...document.querySelectorAll('button,a[href]')]
        .filter(isVisible)
        .filter(element => { const rect = element.getBoundingClientRect(); return rect.width < 44 || rect.height < 44; })
        .slice(0, 30).map(id);
      return {
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        rootTextLength: document.querySelector('#root')?.innerText.length ?? 0,
        rootVisible: Boolean(document.querySelector('#root')?.getBoundingClientRect().height),
        documentLanguage: document.documentElement.lang,
        inlineOverflow, clippedText, smallControls,
      };
    })()`,
    returnByValue: true,
  });
  const data = layout.result.value ?? {};
  results.push({ ...definition, ...data, noHorizontalOverflow: data.documentWidth <= data.viewportWidth + 1 });
  if (captureDir && definition.width === 390 && ["", "/equipment3"].includes(definition.path.replace(`/${definition.locale}`, ""))) {
    const shot = await call("Page.captureScreenshot", { format: "png" });
    writeFileSync(join(captureDir, `${definition.locale}-${definition.path.endsWith("equipment3") ? "equipment" : "home"}.png`), Buffer.from(shot.data, "base64"));
  }
}

const summary = {
  targetCount: results.length,
  horizontalOverflowCount: results.filter(result => !result.noHorizontalOverflow).length,
  inlineOverflowCount: results.filter(result => result.inlineOverflow.length > 0).length,
  clippedTextCount: results.filter(result => result.clippedText.length > 0).length,
  unmountedCount: results.filter(result => !result.rootVisible || result.rootTextLength === 0).length,
};
writeFileSync(reportPath, `${JSON.stringify({ baseUrl, summary, results }, null, 2)}\n`);
socket.close();
chromium.kill("SIGTERM");
console.log(JSON.stringify(summary));

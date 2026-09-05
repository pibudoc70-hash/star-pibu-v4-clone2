import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";

const baseUrl = process.env.CSS_COVERAGE_BASE_URL ?? "http://127.0.0.1:3000";
const outputPath = new URL("../reports/css-coverage-audit.json", import.meta.url);
const debugPort = 9231;

const targets = [
  { path: "/", viewport: [1280, 720], label: "home-desktop" },
  { path: "/", viewport: [390, 844], label: "home-mobile" },
  { path: "/equipment3", viewport: [1280, 720], label: "equipment-list-desktop" },
  { path: "/equipment3", viewport: [390, 844], label: "equipment-list-mobile" },
  { path: "/equipment3/ulthera-prime", viewport: [1280, 720], label: "equipment-detail" },
  { path: "/treatments/ulthera", viewport: [1280, 720], label: "treatment-detail" },
  { path: "/about", viewport: [1280, 720], label: "about" },
  { path: "/doctors", viewport: [390, 844], label: "doctors-mobile" },
  { path: "/directions", viewport: [1280, 720], label: "directions" },
  { path: "/notice", viewport: [1280, 720], label: "notice-list" },
  { path: "/research", viewport: [1280, 720], label: "research" },
  { path: "/non-covered", viewport: [390, 844], label: "non-covered-mobile" },
  { path: "/privacy", viewport: [1280, 720], label: "privacy" },
  { path: "/en", viewport: [1280, 720], label: "landing-en" },
  { path: "/ja", viewport: [390, 844], label: "landing-ja-mobile" },
  { path: "/zh", viewport: [1280, 720], label: "landing-zh" },
  { path: "/zh-tw", viewport: [390, 844], label: "landing-zh-tw-mobile" },
  { path: "/en/treatments/ulthera", viewport: [1280, 720], label: "treatment-en" },
];

const browser = spawn("/usr/bin/chromium", [
  "--headless=new", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${debugPort}`, "about:blank",
], { stdio: "ignore" });

async function waitForDebugger() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
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
let mainSessionId = null;
let loadFinished = false;
const pending = new Map();
const styleSheets = new Map();
const styleSheetTexts = new Map();

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
  if (message.method === "Page.loadEventFired") loadFinished = true;
  if (message.method === "CSS.styleSheetAdded") {
    const { header } = message.params;
    styleSheets.set(header.styleSheetId, header);
  }
});

function send(method, params = {}, sessionId) {
  const messageId = ++id;
  socket.send(JSON.stringify({ id: messageId, method, params, ...(sessionId ? { sessionId } : {}) }));
  return new Promise((resolve, reject) => pending.set(messageId, { resolve, reject }));
}

function addRange(ranges, start, end) {
  ranges.push([start, end]);
}

function unionLength(ranges) {
  const ordered = [...ranges].sort((a, b) => a[0] - b[0]);
  let total = 0;
  let start = -1;
  let end = -1;
  for (const [nextStart, nextEnd] of ordered) {
    if (start === -1) {
      [start, end] = [nextStart, nextEnd];
    } else if (nextStart > end) {
      total += end - start;
      [start, end] = [nextStart, nextEnd];
    } else {
      end = Math.max(end, nextEnd);
    }
  }
  return total + (start === -1 ? 0 : end - start);
}

function ruleCandidates(text, usedRanges) {
  const candidates = [];
  const rangeIsUsed = (start, end) => usedRanges.some(([usedStart, usedEnd]) => usedStart < end && usedEnd > start);
  const pattern = /(^|\n)\s*([^@{}][^{]+?)\s*\{/g;
  for (const match of text.matchAll(pattern)) {
    const selector = match[2].trim();
    const start = match.index + match[1].length;
    const end = text.indexOf("}", start);
    if (end === -1 || rangeIsUsed(start, end + 1)) continue;
    if (!selector.startsWith(".") || selector.includes("\n") || selector.includes(",")) continue;
    candidates.push({ selector, startOffset: start, endOffset: end + 1 });
  }
  return candidates;
}

const target = await send("Target.createTarget", { url: "about:blank" });
const attached = await send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
mainSessionId = attached.sessionId;
await Promise.all([
  send("Network.enable", {}, mainSessionId),
  send("Page.enable", {}, mainSessionId),
  send("Runtime.enable", {}, mainSessionId),
  send("DOM.enable", {}, mainSessionId),
  send("CSS.enable", {}, mainSessionId),
]);

const allUsage = new Map();
const perTarget = [];

for (const targetDefinition of targets) {
  const [width, height] = targetDefinition.viewport;
  loadFinished = false;
  await send("Emulation.setDeviceMetricsOverride", {
    width, height, deviceScaleFactor: 1, mobile: width < 600,
  }, mainSessionId);
  await send("CSS.startRuleUsageTracking", {}, mainSessionId);
  await send("Page.navigate", { url: new URL(targetDefinition.path, baseUrl).toString() }, mainSessionId);
  for (let attempt = 0; attempt < 120 && !loadFinished; attempt += 1) await delay(100);
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const mounted = await send("Runtime.evaluate", {
      expression: "Boolean(document.querySelector('#root')?.childElementCount)",
      returnByValue: true,
    }, mainSessionId);
    if (mounted.result.value) break;
    await delay(100);
  }
  await delay(500);

  const dimensions = await send("Runtime.evaluate", {
    expression: "({ height: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight), viewport: window.innerHeight })",
    returnByValue: true,
  }, mainSessionId);
  const dimensionValue = dimensions.result.value ?? { height, viewport: height };
  const { height: pageHeight, viewport } = dimensionValue;
  for (let offset = 0; offset < pageHeight; offset += viewport) {
    await send("Runtime.evaluate", { expression: `window.scrollTo(0, ${offset})` }, mainSessionId);
    await delay(180);
  }

  // Exercise the first accessible disclosure or menu control without submitting any form.
  await send("Runtime.evaluate", {
    expression: `(() => {
      const control = [...document.querySelectorAll('button[aria-expanded="false"], summary')]
        .find(element => element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0);
      control?.click();
      return Boolean(control);
    })()`,
    returnByValue: true,
  }, mainSessionId);
  await delay(300);

  await send("Runtime.evaluate", {
    expression: `(() => {
      const element = [...document.querySelectorAll('a, button')]
        .find(node => node.getBoundingClientRect().width > 0 && node.getBoundingClientRect().height > 0);
      if (!element) return false;
      element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      element.focus({ preventScroll: true });
      return true;
    })()`,
    returnByValue: true,
  }, mainSessionId);
  await send("Runtime.evaluate", { expression: "window.scrollTo(0, 0)" }, mainSessionId);
  await delay(300);

  const layout = await send("Runtime.evaluate", {
    expression: `(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      rootTextLength: document.querySelector('#root')?.innerText.length ?? 0,
      rootVisible: Boolean(document.querySelector('#root')?.getBoundingClientRect().height),
      title: document.title,
    }))()`,
    returnByValue: true,
  }, mainSessionId);

  const stopped = await send("CSS.stopRuleUsageTracking", {}, mainSessionId);
  const usedCount = stopped.ruleUsage.filter(rule => rule.used).length;
  perTarget.push({
    label: targetDefinition.label,
    path: targetDefinition.path,
    viewport: { width, height },
    pageMeasurementAvailable: Boolean(dimensions.result.value),
    ...layout.result.value,
    noHorizontalOverflow: (layout.result.value?.documentWidth ?? width) <= (layout.result.value?.viewportWidth ?? width) + 1,
    trackedRules: stopped.ruleUsage.length,
    usedRules: usedCount,
  });
  for (const rule of stopped.ruleUsage) {
    if (!allUsage.has(rule.styleSheetId)) allUsage.set(rule.styleSheetId, []);
    if (rule.used) addRange(allUsage.get(rule.styleSheetId), rule.startOffset, rule.endOffset);
    if (!styleSheetTexts.has(rule.styleSheetId)) {
      try {
        const { text } = await send("CSS.getStyleSheetText", { styleSheetId: rule.styleSheetId }, mainSessionId);
        styleSheetTexts.set(rule.styleSheetId, text);
      } catch {
        // Browser-owned sheets can disappear during a route transition and are not deletion candidates.
      }
    }
  }
}

const styleSheetResults = [];
for (const [styleSheetId, usedRanges] of allUsage) {
  const header = styleSheets.get(styleSheetId);
  if (!header || !(/\/src\/|\/__static\/assets\/|\/assets\//.test(header.sourceURL))) continue;
  const text = styleSheetTexts.get(styleSheetId);
  if (!text) continue;
  const usedBytes = unionLength(usedRanges);
  styleSheetResults.push({
    sourceURL: header.sourceURL,
    totalBytes: text.length,
    usedBytes,
    usedPercent: Number(((usedBytes / text.length) * 100).toFixed(2)),
    neverUsedSimpleClassCandidates: ruleCandidates(text, usedRanges).slice(0, 250),
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  scope: {
    targetCount: targets.length,
    includesScroll: true,
    includesFirstDisclosure: true,
    includesForcedHoverAndFocus: true,
  },
  targets: perTarget,
  styleSheets: styleSheetResults,
  observedStyleSheets: [...styleSheets.values()].map(header => ({
    sourceURL: header.sourceURL,
    isInline: header.isInline,
  })),
  limitation: "Coverage is evidence only. A rule absent from these interactions must be source-reference reviewed before removal.",
};
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));

socket.close();
browser.kill("SIGTERM");

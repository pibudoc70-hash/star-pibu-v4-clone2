import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn, spawnSync } from "node:child_process";

const projectRoot = resolve(import.meta.dirname, "..");
const publicRoot = join(projectRoot, "dist", "public");
const viewport = { width: 390, height: 844 };
const maxFirstScreenInformationHeight = 700;
const maxSummaryHeight = 250;
const maxFaqHeight = 320;
const serverPort = Number(process.env.PAIN_HEIGHT_TEST_PORT ?? 4176);
const chromePort = Number(process.env.PAIN_HEIGHT_CHROME_PORT ?? 9243);
const profileDir = "/tmp/star-pibu-pain-height-ci";

const delay = (ms) => new Promise(resolvePromise => setTimeout(resolvePromise, ms));

function findChrome() {
  for (const candidate of [process.env.CHROME_BIN, "chromium", "google-chrome", "google-chrome-stable"]) {
    if (!candidate) continue;
    if (spawnSync("which", [candidate], { stdio: "ignore" }).status === 0) return candidate;
  }
  throw new Error("Chromium or Google Chrome is required for the 390px height regression check.");
}

async function waitForDebugger() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      if ((await fetch(`http://127.0.0.1:${chromePort}/json/version`)).ok) return;
    } catch {
      // Chrome is starting.
    }
    await delay(200);
  }
  throw new Error("Chrome DevTools did not become ready.");
}

async function waitForProductionApp() {
  for (let attempt = 0; attempt < 45; attempt += 1) {
    try {
      if ((await fetch(`http://127.0.0.1:${serverPort}/`)).ok) return;
    } catch {
      // The production app is still starting.
    }
    await delay(250);
  }
  throw new Error("Production app did not become ready for the 390px height regression check.");
}

function createCdp(webSocketUrl) {
  const ws = new WebSocket(webSocketUrl);
  let nextId = 1;
  const callbacks = new Map();
  ws.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const callback = callbacks.get(message.id);
    callbacks.delete(message.id);
    if (message.error) callback?.reject(new Error(message.error.message));
    else callback?.resolve(message.result);
  });
  const opened = new Promise((resolvePromise, reject) => {
    ws.addEventListener("open", resolvePromise, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  return {
    async ready() { await opened; },
    send(method, params = {}) {
      const id = nextId++;
      ws.send(JSON.stringify({ id, method, params }));
      return new Promise((resolvePromise, reject) => callbacks.set(id, { resolve: resolvePromise, reject }));
    },
    async evaluate(expression) {
      const result = await this.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
      return result.result.value;
    },
    close() { ws.close(); },
  };
}

if (!existsSync(join(publicRoot, "index.html"))) {
  throw new Error("Production build is required. Run `pnpm build` before `pnpm test:pain-height`.");
}

const app = spawn(process.execPath, [join(projectRoot, "dist", "index.js")], {
  env: { ...process.env, NODE_ENV: "production", PORT: String(serverPort) },
  stdio: "ignore",
});
const chrome = spawn(findChrome(), [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  `--remote-debugging-port=${chromePort}`,
  `--user-data-dir=${profileDir}`,
  "about:blank",
], { stdio: "ignore" });

try {
  await waitForProductionApp();
  await waitForDebugger();
  const tabs = await (await fetch(`http://127.0.0.1:${chromePort}/json/list`)).json();
  const cdp = createCdp(tabs[0].webSocketDebuggerUrl);
  await cdp.ready();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", { ...viewport, deviceScaleFactor: 3, mobile: true });
  await cdp.send("Page.navigate", { url: `http://127.0.0.1:${serverPort}/` });
  await delay(5000);

  for (const progress of [0.16, 0.28, 0.4, 0.52, 0.68, 0.84, 1]) {
    await cdp.evaluate(`window.scrollTo(0, Math.round((document.documentElement.scrollHeight - innerHeight) * ${progress}))`);
    await delay(750);
    if (await cdp.evaluate(`Boolean(document.querySelector('#treatment-mobile-category-list button'))`)) break;
  }
  await cdp.evaluate(`(() => {
    const button = [...document.querySelectorAll('#treatment-mobile-category-list button')]
      .find(element => element.textContent?.trim() === '통증관리');
    if (!button) return false;
    button.click();
    return true;
  })()`);
  await delay(1200);

  const result = await cdp.evaluate(`(() => {
    const root = document.querySelector('section[aria-labelledby="pain-management-guide-title"]');
    if (!root) return { found: false };
    const header = root.querySelector('[data-testid="pain-management-header"]');
    const summary = root.querySelector('[data-testid="pain-management-summary"]');
    const trustStrip = root.querySelector('[data-testid="pain-trust-strip"]');
    const faq = root.querySelector('[data-testid="pain-faq"]');
    const height = element => Math.round(element.getBoundingClientRect().height * 10) / 10;
    return {
      found: true,
      height: height(root),
      width: Math.round(root.getBoundingClientRect().width * 10) / 10,
      externalPanelExists: Boolean(root.querySelector('[data-testid="pain-mobile-panel"]')),
      firstStageOpen: root.querySelector('[data-testid="pain-mobile-stage-1"]')?.open ?? null,
      secondStageOpen: root.querySelector('[data-testid="pain-mobile-stage-2"]')?.open ?? null,
      thirdStageOpen: root.querySelector('[data-testid="pain-mobile-stage-3"]')?.open ?? null,
      trustIsDetails: trustStrip?.tagName === 'DETAILS',
      summaryHeight: height(summary),
      trustStripHeight: height(trustStrip),
      faqHeight: height(faq),
      firstScreenInformationHeight: Math.round((height(header) + height(summary) + height(trustStrip)) * 10) / 10,
      viewport: { width: innerWidth, height: innerHeight },
    };
  })()`);
  const firstStageWasCollapsed = await cdp.evaluate(`(() => {
    const firstStageSummary = document.querySelector('[data-testid="pain-mobile-stage-1"] summary');
    if (!firstStageSummary) return false;
    firstStageSummary.click();
    return true;
  })()`);
  await delay(250);
  const collapsedSummaryHeight = await cdp.evaluate(`(() => {
    const summary = document.querySelector('[data-testid="pain-management-summary"]');
    return Math.round((summary?.getBoundingClientRect().height ?? 0) * 10) / 10;
  })()`);
  await cdp.evaluate(`(() => {
    const firstStageSummary = document.querySelector('[data-testid="pain-mobile-stage-1"] summary');
    if (!firstStageSummary) return;
    firstStageSummary.click();
  })()`);
  await delay(250);
  cdp.close();

  if (!result?.found) throw new Error("Pain Management did not mount in the production 390px browser check.");
  if (result.externalPanelExists) throw new Error("Pain Management must not use an outer mobile disclosure at 390px.");
  if (!result.firstStageOpen || result.secondStageOpen || result.thirdStageOpen) throw new Error("Only the first mobile pain-management stage must be open by default at 390px.");
  if (result.trustIsDetails) throw new Error("Mobile trust guidance must be persistently visible instead of a details disclosure.");
  if (result.firstScreenInformationHeight > maxFirstScreenInformationHeight) throw new Error(`Pain Management first-screen information height ${result.firstScreenInformationHeight}px exceeds ${maxFirstScreenInformationHeight}px at 390px.`);
  if (!firstStageWasCollapsed || collapsedSummaryHeight > maxSummaryHeight) throw new Error(`Pain Management collapsed summary height ${collapsedSummaryHeight}px exceeds ${maxSummaryHeight}px at 390px.`);
  if (result.faqHeight > maxFaqHeight) throw new Error(`Pain Management FAQ height ${result.faqHeight}px exceeds ${maxFaqHeight}px at 390px.`);

  console.log(`390px pain-management: root ${result.height}px; first-screen ${result.firstScreenInformationHeight}px; expanded summary ${result.summaryHeight}px; collapsed summary ${collapsedSummaryHeight}px; FAQ ${result.faqHeight}px`);
} finally {
  chrome.kill("SIGTERM");
  app.kill("SIGTERM");
}

import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { basename, extname, join, normalize, resolve } from "node:path";
import { spawn, spawnSync } from "node:child_process";

const projectRoot = resolve(import.meta.dirname, "..");
const publicRoot = join(projectRoot, "dist", "public");
const viewport = { width: 390, height: 844 };
const maxCollapsedHeight = 700;
const serverPort = Number(process.env.PAIN_HEIGHT_TEST_PORT ?? 4176);
const chromePort = Number(process.env.PAIN_HEIGHT_CHROME_PORT ?? 9243);
const profileDir = "/tmp/star-pibu-pain-height-ci";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const delay = (ms) => new Promise(resolvePromise => setTimeout(resolvePromise, ms));

function findChrome() {
  for (const candidate of [process.env.CHROME_BIN, "chromium", "google-chrome", "google-chrome-stable"]) {
    if (!candidate) continue;
    if (spawnSync("which", [candidate], { stdio: "ignore" }).status === 0) return candidate;
  }
  throw new Error("Chromium or Google Chrome is required for the 390px height regression check.");
}

function createStaticServer() {
  return createServer(async (req, res) => {
    const requestedPath = new URL(req.url ?? "/", "http://127.0.0.1").pathname;
    const safePath = normalize(requestedPath).replace(/^(\.\.([/\\]|$))+/, "");
    const candidate = join(publicRoot, safePath === "/" ? "index.html" : safePath);
    const filePath = existsSync(candidate) && (await stat(candidate)).isFile() ? candidate : join(publicRoot, "index.html");
    res.writeHead(200, { "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream" });
    createReadStream(filePath).pipe(res);
  });
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

const server = createStaticServer();
const chrome = spawn(findChrome(), [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  `--remote-debugging-port=${chromePort}`,
  `--user-data-dir=${profileDir}`,
  "about:blank",
], { stdio: "ignore" });

try {
  await new Promise(resolvePromise => server.listen(serverPort, "127.0.0.1", resolvePromise));
  await waitForDebugger();
  const tabs = await (await fetch(`http://127.0.0.1:${chromePort}/json/list`)).json();
  const cdp = createCdp(tabs[0].webSocketDebuggerUrl);
  await cdp.ready();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", { ...viewport, deviceScaleFactor: 3, mobile: true });
  await cdp.send("Page.navigate", { url: `http://127.0.0.1:${serverPort}/` });
  await delay(2500);

  for (const progress of [0.16, 0.28, 0.4, 0.52]) {
    await cdp.evaluate(`window.scrollTo(0, Math.round((document.documentElement.scrollHeight - innerHeight) * ${progress}))`);
    await delay(750);
    if (await cdp.evaluate(`Boolean(document.querySelector('section[aria-labelledby="pain-management-guide-title"]'))`)) break;
  }

  const result = await cdp.evaluate(`(() => {
    const root = document.querySelector('section[aria-labelledby="pain-management-guide-title"]');
    if (!root) return { found: false };
    const panel = root.querySelector('[data-testid="pain-mobile-panel"]');
    const rect = root.getBoundingClientRect();
    return {
      found: true,
      height: Math.round(rect.height * 10) / 10,
      width: Math.round(rect.width * 10) / 10,
      panelOpen: panel?.open ?? null,
      viewport: { width: innerWidth, height: innerHeight },
    };
  })()`);
  cdp.close();

  if (!result?.found) throw new Error("Pain Management did not mount in the production 390px browser check.");
  if (result.panelOpen) throw new Error("Pain Management must be collapsed by default at 390px.");
  if (result.height > maxCollapsedHeight) throw new Error(`Pain Management collapsed height ${result.height}px exceeds ${maxCollapsedHeight}px at 390px.`);

  console.log(`390px pain-management height: ${result.height}px (limit: ${maxCollapsedHeight}px)`);
} finally {
  chrome.kill("SIGTERM");
  await new Promise(resolvePromise => server.close(resolvePromise));
}

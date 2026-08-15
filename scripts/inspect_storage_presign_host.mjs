const key = process.argv[2];
if (!key) throw new Error("Usage: node scripts/inspect_storage_presign_host.mjs <safe-storage-key>");

const base = process.env.BUILT_IN_FORGE_API_URL;
const token = process.env.BUILT_IN_FORGE_API_KEY;
if (!base || !token) throw new Error("Storage environment is unavailable");

const endpoint = new URL("v1/storage/presign/get", `${base.replace(/\/+$/, "")}/`);
endpoint.searchParams.set("path", key);
const response = await fetch(endpoint, {
  headers: { Authorization: `Bearer ${token}` },
  redirect: "error",
  signal: AbortSignal.timeout(5000),
});
if (!response.ok) throw new Error(`Presign request failed (${response.status})`);
const payload = await response.json();
if (!payload || typeof payload.url !== "string") throw new Error("Presign response has no URL");
const url = new URL(payload.url);
const assetResponse = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(8000) });
console.log(JSON.stringify({
  protocol: url.protocol,
  hostname: url.hostname,
  port: url.port || null,
  assetOk: assetResponse.ok,
  contentType: assetResponse.headers.get("content-type"),
}));

import express from "express";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import { buildPinpointAdvertisingRedirect, registerRedirects } from "./redirects";

const servers: Array<ReturnType<express.Express["listen"]>> = [];

afterEach(async () => {
  await Promise.all(servers.splice(0).map(server => new Promise<void>(resolve => server.close(() => resolve()))));
});

async function withRedirectServer(callback: (baseUrl: string) => Promise<void>) {
  const app = express();
  registerRedirects(app);
  const server = await new Promise<ReturnType<express.Express["listen"]>>(resolve => {
    const listener = app.listen(0, () => resolve(listener));
  });
  servers.push(server);
  const { port } = server.address() as AddressInfo;
  await callback(`http://127.0.0.1:${port}`);
}

describe("legacy Naver pinpoint advertising landing redirect", () => {
  it("forwards the legacy path to the fixed nail-fungus equipment tab", async () => {
    await withRedirectServer(async baseUrl => {
      const response = await fetch(`${baseUrl}/event/pinpoint.html`, { redirect: "manual" });

      expect(response.status).toBe(302);
      expect(response.headers.get("location")).toBe(
        "https://star-pibu.co.kr/equipment3?tab=%EC%86%90%C2%B7%EB%B0%9C%ED%86%B1%EB%AC%B4%EC%A2%80",
      );
    });
  });

  it("preserves advertising parameters but cannot allow the old tab parameter to replace the fixed destination", () => {
    const target = new URL(buildPinpointAdvertisingRedirect(
      "/event/pinpoint.html?n_media=27758&n_query=%ED%95%80%ED%8F%AC%EC%9D%B8%ED%8A%B8&utm_source=naver&tab=%EC%97%AC%EB%93%9C%EB%A6%84",
    ));

    expect(target.origin).toBe("https://star-pibu.co.kr");
    expect(target.pathname).toBe("/equipment3");
    expect(target.searchParams.get("tab")).toBe("손·발톱무좀");
    expect(target.searchParams.get("n_media")).toBe("27758");
    expect(target.searchParams.get("n_query")).toBe("핀포인트");
    expect(target.searchParams.get("utm_source")).toBe("naver");
    expect(target.searchParams.getAll("tab")).toHaveLength(1);
  });
});

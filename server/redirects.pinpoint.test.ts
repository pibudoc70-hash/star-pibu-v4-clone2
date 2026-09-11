import express from "express";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import { buildAdvertisingRedirect, registerRedirects } from "./redirects";

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

const advertisingLandingCases = [
  ["/event/pinpoint.html", "https://star-pibu.co.kr/equipment3?tab=%EC%86%90%C2%B7%EB%B0%9C%ED%86%B1%EB%AC%B4%EC%A2%80"],
  ["/event/01.html", "https://star-pibu.co.kr/equipment3?tab=%EC%83%89%EC%86%8C%C2%B7%EB%AC%B8%EC%8B%A0"],
  ["/event/eyeline.html", "https://star-pibu.co.kr/equipment3?tab=%EC%83%89%EC%86%8C%C2%B7%EB%AC%B8%EC%8B%A0"],
  ["/event/encore.html", "https://star-pibu.co.kr/equipment3?tab=%ED%9D%89%ED%84%B0%C2%B7%EB%AA%A8%EA%B3%B5"],
  ["/event/art.html", "https://star-pibu.co.kr/equipment3?tab=%EC%97%AC%EB%93%9C%EB%A6%84"],
  ["/hongjo.php", "https://star-pibu.co.kr/equipment3?tab=%ED%99%8D%EC%A1%B0%C2%B7%ED%98%88%EA%B4%80"],
  ["/event/xtrac.html", "https://star-pibu.co.kr/equipment3?tab=%EB%B0%B1%EB%B0%98%EC%A6%9D"],
  ["/event/eye.html", "https://star-pibu.co.kr/equipment3?tab=%EB%88%88%EB%B0%91%EC%A7%80%EB%B0%A9%EC%9E%AC%EB%B0%B0%EC%B9%98"],
  ["/event/clip.html", "https://star-pibu.co.kr/equipment3?tab=%EC%86%90%C2%B7%EB%B0%9C%ED%86%B1%EB%AC%B4%EC%A2%80"],
  ["/event/multi.html", "https://star-pibu.co.kr/equipment3?tab=%EC%83%89%EC%86%8C%C2%B7%EB%AC%B8%EC%8B%A0"],
] as const;

describe("legacy Naver advertising landing redirects", () => {
  it.each(advertisingLandingCases)("forwards %s to its fixed equipment tab", async (legacyPath, expectedDestination) => {
    await withRedirectServer(async baseUrl => {
      const response = await fetch(`${baseUrl}${legacyPath}`, { redirect: "manual" });

      expect(response.status).toBe(302);
      expect(response.headers.get("location")).toBe(expectedDestination);
    });
  });

  it("preserves campaign parameters and prevents a legacy tab from replacing the assigned category", () => {
    const target = new URL(buildAdvertisingRedirect(
      "/event/01.html?n_media=27758&n_query=%EB%AC%B8%EC%8B%A0%EC%A0%9C%EA%B1%B0&utm_source=naver&utm_term=first&utm_term=second&tab=%EC%97%AC%EB%93%9C%EB%A6%84",
      "https://star-pibu.co.kr/equipment3?tab=%EC%83%89%EC%86%8C%C2%B7%EB%AC%B8%EC%8B%A0",
    ));

    expect(target.origin).toBe("https://star-pibu.co.kr");
    expect(target.pathname).toBe("/equipment3");
    expect(target.searchParams.get("tab")).toBe("색소·문신");
    expect(target.searchParams.get("n_media")).toBe("27758");
    expect(target.searchParams.get("n_query")).toBe("문신제거");
    expect(target.searchParams.get("utm_source")).toBe("naver");
    expect(target.searchParams.getAll("utm_term")).toEqual(["first", "second"]);
    expect(target.searchParams.getAll("tab")).toHaveLength(1);
  });
});

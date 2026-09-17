import express from "express";
import { request } from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import { buildAdvertisingRedirect, isLegacyHomePath, registerRedirects } from "./redirects";

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

async function requestWithHost(url: string, host: string): Promise<{ status: number; location: string | undefined }> {
  return new Promise((resolve, reject) => {
    const req = request(url, { headers: { Host: host } }, response => {
      response.resume();
      response.once("end", () => {
        resolve({ status: response.statusCode ?? 0, location: response.headers.location });
      });
    });
    req.once("error", reject);
    req.end();
  });
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

const legacyPermanentRedirectCases = [
  ["/event/ulthera/index.html", "https://starpibuclinic.cafe24.com/event/ulthera/index.html"],
  ["/event/thermage/index.html", "https://starpibuclinic.cafe24.com/event/thermage/index.html"],
  ["/sub/sub_04_01.html", "http://www.star-pibu.co.kr/zzboard"],
  ["/sub/sub_04_02.html", "http://www.star-pibu.co.kr/zzboard"],
  ["/sub/sub_04_03.html", "http://www.star-pibu.co.kr/zzboard"],
] as const;

const legacyHomeRedirectCases = [
  "/cha/sub/sub_04_01",
  "/sub/obsolete-detail.html",
  "/jpn/sub/old-page.html",
  "/eng/notice/view.php?id=10",
  "/chn/board/list.php",
  "/twn/customer/faq.html",
  "/main/index.html",
  "/board/view.php?id=10",
  "/notice/old-notice.html",
  "/bbs/board.php",
  "/community/list.html",
  "/customer/consult.php",
  "/en/sub/sub_01_01.html",
  "/zh/board/list.php",
  "/zh-tw/notice/view.html",
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

describe("specified permanent legacy landing redirects", () => {
  it.each(legacyPermanentRedirectCases)("redirects %s with 301 to the supplied legacy destination", async (legacyPath, expectedDestination) => {
    await withRedirectServer(async baseUrl => {
      const response = await fetch(`${baseUrl}${legacyPath}`, { redirect: "manual" });

      expect(response.status).toBe(301);
      expect(response.headers.get("location")).toBe(expectedDestination);
    });
  });
});

describe("unmapped old-site path families", () => {
  it.each(legacyHomeRedirectCases)("redirects %s to the new home with 301", async legacyPath => {
    await withRedirectServer(async baseUrl => {
      const response = await fetch(`${baseUrl}${legacyPath}`, { redirect: "manual" });

      expect(response.status).toBe(301);
      expect(response.headers.get("location")).toBe("https://star-pibu.com/");
    });
  });

  it("keeps explicit sub mappings ahead of the broad legacy fallback", async () => {
    await withRedirectServer(async baseUrl => {
      const response = await fetch(`${baseUrl}/sub/sub_03_07.html`, { redirect: "manual" });

      expect(response.status).toBe(301);
      expect(response.headers.get("location")).toBe("https://star-pibu.com/equipment3/%EC%8D%A8%EB%A7%88%EC%A7%80-flx?tab=%EB%A6%AC%ED%94%84%ED%8C%85%C2%B7%ED%83%84%EB%A0%A5");
    });
  });

  it.each(["/about", "/equipment3", "/en", "/en/treatments/ulthera", "/zh", "/zh-tw", "/zh-tw/equipment3"])(
    "does not classify current live route %s as a legacy path",
    currentPath => {
      expect(isLegacyHomePath(currentPath)).toBe(false);
    },
  );

  it.each(["/en/sub/old.html", "/zh/board/list.php", "/zh-tw/notice/view.html"])(
    "classifies only safely identifiable old structure %s",
    legacyPath => {
      expect(isLegacyHomePath(legacyPath)).toBe(true);
    },
  );

  it("redirects every m.star-pibu.co.kr path to the new home before other maps", async () => {
    await withRedirectServer(async baseUrl => {
      const response = await requestWithHost(`${baseUrl}/sub/sub_03_07.html?legacy=1`, "m.star-pibu.co.kr");

      expect(response.status).toBe(301);
      expect(response.location).toBe("https://star-pibu.com/");
    });
  });
});

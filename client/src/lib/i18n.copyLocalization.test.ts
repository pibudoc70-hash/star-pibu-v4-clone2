import { describe, expect, it } from "vitest";
import { en } from "./i18n.en";
import { ja } from "./i18n.ja";
import { zh } from "./i18n.zh";
import { LIFTING_POSITIONING_TITLES } from "../../../shared/liftingPositioning";

describe("승인된 다국어 정적 카피", () => {
  it("영문 FAQ는 모호한 XERF 읽는 법과 직역 표현을 사용하지 않는다", () => {
    const xfer = en.faq.items.find((item) => item.equipment === "XERF");
    const underEye = en.faq.items.find((item) => item.equipment === "Under-eye Fat Repositioning");

    expect(xfer).toBeDefined();
    expect(xfer?.questions[2]?.a).toContain("keep the skin well moisturized");
    expect(underEye?.questions[0]).toMatchObject({
      q: "What is under-eye fat repositioning?",
      a: expect.stringContaining("reduce under-eye hollows"),
    });
    expect(en.youtube.sectionTitle).toBe("Skin Care Tips from Our Dermatologists");
  });

  it("일본어 정적 카피는 현지 장비명과 일본어 가운뎃점을 사용한다", () => {
    const serialized = JSON.stringify(ja);

    expect(serialized).toContain("サーマクールFLX");
    expect(serialized).toContain("ウルセラプライム");
    expect(serialized).toContain("XERF（ザーフ）");
    expect(serialized).toContain("リフトアップ");
    expect(serialized).not.toMatch(/リフティング|サーマジ|ウルセラピー プライム|セルフ（XERF）|·/);
  });

  it("중국어 간체 정적 카피는 통용 장비명과 자연스러운 통증 묘사를 사용한다", () => {
    const serialized = JSON.stringify(zh);

    expect(serialized).toContain("热玛吉FLX");
    expect(serialized).toContain("丽珠兰（Rejuran）");
    expect(serialized).toContain("像橡皮筋轻弹一下的感觉");
    expect(serialized).toContain("纹身去除");
    expect(serialized).not.toMatch(/热磁治疗FLX|利朱兰|弹射感|文身/);
  });

  it("공통 lifting 제목은 en·ja·zh locale별 정본을 제공한다", () => {
    expect(LIFTING_POSITIONING_TITLES.en).toEqual({
      summary: "Dermatologist-led lifting care",
      faq: "Lifting & pain-management FAQ",
    });
    expect(LIFTING_POSITIONING_TITLES.ja).toEqual({
      summary: "皮膚科専門医によるリフトアップ診療",
      faq: "リフトアップ施術と痛みの管理に関するよくある質問",
    });
    expect(LIFTING_POSITIONING_TITLES.zh).toEqual({
      summary: "皮肤科专科医生亲诊的提升治疗",
      faq: "提升治疗与疼痛管理常见问题",
    });
  });
});

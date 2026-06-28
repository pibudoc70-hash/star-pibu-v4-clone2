/**
 * ManagementDevicesSection 번역 완전성 회귀 방지 테스트
 *
 * 이 테스트는 ManagementDevicesSection의 모든 장비 항목이
 * 4개 언어(ko/en/ja/zh) 모두 name과 shortDesc를 갖추고 있는지 검증합니다.
 * 단 하나라도 누락되면 CI에서 즉시 탐지됩니다.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

// [REFACTOR] devices 배열이 ManagementDevicesSection.tsx → lib/clinic-data.ts 로 이동됨 (6단계 리팩토링 체크리스트 2)
const FILE = resolve(__dirname, "../lib/clinic-data.ts");
const source = readFileSync(FILE, "utf-8");

// Device 객체 블록 파싱
function extractDevices(src: string): Array<Record<string, string>> {
  const results: Array<Record<string, string>> = [];
  // id: "N" 으로 시작하는 블록 찾기
  const blockRegex = /\{\s*id:\s*"(\d+)"[^}]*\}/gs;
  let m: RegExpExecArray | null;
  while ((m = blockRegex.exec(src)) !== null) {
    const block = m[0];
    const obj: Record<string, string> = {};
    const fieldRegex = /(\w+):\s*"([^"]*)"/g;
    let fm: RegExpExecArray | null;
    while ((fm = fieldRegex.exec(block)) !== null) {
      obj[fm[1]] = fm[2];
    }
    results.push(obj);
  }
  return results;
}

const REQUIRED_FIELDS = [
  "name",
  "nameEn",
  "nameJa",
  "nameZh",
  "shortDesc",
  "shortDescEn",
  "shortDescJa",
  "shortDescZh",
] as const;

describe("ManagementDevicesSection — 번역 완전성", () => {
  const devices = extractDevices(source);

  it("장비 항목이 1개 이상 존재해야 한다", () => {
    expect(devices.length).toBeGreaterThan(0);
  });

  it("모든 장비 항목이 8개 언어 필드를 모두 갖춰야 한다", () => {
    const missing: string[] = [];
    for (const device of devices) {
      for (const field of REQUIRED_FIELDS) {
        if (!device[field] || device[field].trim() === "") {
          missing.push(`id=${device.id} 누락 필드: ${field}`);
        }
      }
    }
    if (missing.length > 0) {
      throw new Error(
        `번역 누락 항목 ${missing.length}건:\n${missing.join("\n")}`
      );
    }
  });

  it("모든 장비의 nameEn은 영문자를 포함해야 한다", () => {
    const invalid: string[] = [];
    for (const device of devices) {
      if (device.nameEn && !/[A-Za-z]/.test(device.nameEn)) {
        invalid.push(`id=${device.id} nameEn="${device.nameEn}" — 영문자 없음`);
      }
    }
    if (invalid.length > 0) {
      throw new Error(`nameEn 영문자 누락:\n${invalid.join("\n")}`);
    }
  });

  it("모든 장비의 nameJa는 일본어 문자를 포함해야 한다 (LDM 제외)", () => {
    const invalid: string[] = [];
    for (const device of devices) {
      // LDM은 영문 그대로 사용
      if (device.id === "14") continue;
      if (device.nameJa && !/[\u3040-\u30FF\u4E00-\u9FFF]/.test(device.nameJa)) {
        invalid.push(`id=${device.id} nameJa="${device.nameJa}" — 일본어 문자 없음`);
      }
    }
    if (invalid.length > 0) {
      throw new Error(`nameJa 일본어 문자 누락:\n${invalid.join("\n")}`);
    }
  });

  it("모든 장비의 nameZh는 중국어 문자를 포함해야 한다", () => {
    const invalid: string[] = [];
    for (const device of devices) {
      if (device.nameZh && !/[\u4E00-\u9FFF]/.test(device.nameZh)) {
        invalid.push(`id=${device.id} nameZh="${device.nameZh}" — 중국어 문자 없음`);
      }
    }
    if (invalid.length > 0) {
      throw new Error(`nameZh 중국어 문자 누락:\n${invalid.join("\n")}`);
    }
  });
});

import { describe, expect, it } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(__dirname, "../..");
const readClient = (relativePath: string) =>
  fs.readFileSync(path.join(ROOT, "client/src", relativePath), "utf-8");

describe("공개 화면 접근성 마크업 회귀 방지", () => {
  it("WelcomePopup은 배경 닫기 동작을 시맨틱 버튼으로 제공한다", () => {
    const source = readClient("components/WelcomePopup.tsx");

    expect(source).toMatch(/className="absolute inset-0 cursor-default"/);
    expect(source).toMatch(/aria-label="팝업 닫기"/);
    expect(source).toMatch(/className=\{`popup-modal[^`]*relative z-10/);
  });

  it("ManagementDevicesSection은 모달 배경 닫기와 dialog 레이어를 분리한다", () => {
    const source = readClient("components/ManagementDevicesSection.tsx");

    expect(source).toMatch(/aria-label="관리 장비 안내 닫기"/);
    expect(source).toMatch(/className="relative z-10 w-full max-w-xl/);
    expect(source).toMatch(/aria-modal="true"/);
  });

  it("TreatmentsSection은 이미지 탭 토글에 시맨틱 버튼을 사용한다", () => {
    const source = readClient("components/TreatmentsSection.tsx");

    expect(source).toMatch(/aria-label=\{`\$\{t\.name\} 상세 정보 보기`\}/);
    expect(source).toMatch(/focus-visible:ring-\[var\(--color-gold-primary\)\]/);
    expect(source).toMatch(/pointer-events-auto flex items-center/);
  });

  it("EventShareButton은 전파 차단을 캡처 단계에서 처리한다", () => {
    const source = readClient("components/EventShareButton.tsx");

    expect(source).toMatch(/onClickCapture=\{\(e\) => e\.stopPropagation\(\)\}/);
    expect(source).not.toMatch(/<div className="relative" onClick=/);
  });

  it("Equipment3 상세 히어로는 모바일 고정 헤더 아래에서 제목을 시작한다", () => {
    const source = readClient("pages/Equipment3Detail.tsx");

    expect(source).toContain("pt-[calc(8rem+env(safe-area-inset-top))] pb-12 md:py-12");
  });

  it("Equipment3 상세 로딩은 전체 화면 스피너 대신 구조를 유지하는 접근 가능한 스켈레톤을 제공한다", () => {
    const source = readClient("pages/Equipment3Detail.tsx");

    expect(source).toContain("function EquipmentDetailLoading");
    expect(source).toContain('<main id="main-content" aria-busy="true" aria-label={label}>');
    expect(source).toContain('<p className="sr-only" role="status">{label}</p>');
    expect(source).toContain("return <EquipmentDetailLoading label={LABELS.loading} isDarkMode={isDarkMode} />;");
    expect(source).not.toContain('className="flex items-center justify-center min-h-screen"');
  });
});

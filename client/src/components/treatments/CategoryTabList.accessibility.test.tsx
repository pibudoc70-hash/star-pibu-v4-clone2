/**
 * CategoryTabList — WAI-ARIA tablist 접근성 회귀 테스트
 *
 * [P1] 접근성 테스트 신규 추가:
 *   - role="tablist" 구조 검증
 *   - aria-label, aria-orientation 속성 검증
 *   - roving tabindex 정책 검증 (활성 탭 0, 비활성 탭 -1)
 *   - aria-selected 상태 검증
 *   - 키보드 네비게이션 (ArrowRight/ArrowLeft/Home/End)
 *   - 탭 변경 콜백 호출 검증
 */
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CategoryTabList from "./CategoryTabList";
import type { Category } from "@/types/treatment";

// ── 테스트 픽스처 ─────────────────────────────────────────────────────────────

const MOCK_CATEGORIES: Category[] = [
  { id: "best",   labelKo: "베스트",   labelEn: "Best",   labelJa: "ベスト",   labelZh: "最佳" },
  { id: "laser",  labelKo: "레이저",   labelEn: "Laser",  labelJa: "レーザー", labelZh: "激光" },
  { id: "skin",   labelKo: "피부관리", labelEn: "Skin",   labelJa: "スキン",   labelZh: "皮肤" },
];

// CATEGORY_ICON_MAP 모킹 — 실제 아이콘 컴포넌트 대신 단순 SVG
vi.mock("@/data/treatments/categories", () => ({
  CATEGORY_ICON_MAP: {},
  getCatLabel: (cat: Category, lang: string) => {
    if (lang === "ko") return cat.labelKo;
    if (lang === "en") return cat.labelEn;
    return cat.labelKo;
  },
}));

// CategoryTabButton 모킹 — 실제 스타일 없이 접근성 속성만 렌더
vi.mock("./CategoryTabButton", () => ({
  default: ({
    id,
    label,
    isActive,
    onClick,
    role,
    "aria-selected": ariaSelected,
    tabIndex,
    onKeyDown,
  }: {
    id: string;
    label: string;
    isActive: boolean;
    onClick: (id: string) => void;
    role?: string;
    "aria-selected"?: boolean;
    tabIndex?: number;
    onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
    [key: string]: unknown;
  }) => (
    <button
      id={`cat-tab-${id}`}
      data-active={isActive}
      role={role}
      aria-selected={ariaSelected}
      tabIndex={tabIndex}
      onClick={() => onClick(id)}
      onKeyDown={onKeyDown}
    >
      {label}
    </button>
  ),
}));

// ── 헬퍼 ─────────────────────────────────────────────────────────────────────

function renderTabList(activeId = "best", onTabChange = vi.fn()) {
  return render(
    <CategoryTabList
      categories={MOCK_CATEGORIES}
      activeId={activeId}
      lang="ko"
      onTabChange={onTabChange}
    />
  );
}

// ── 테스트 ────────────────────────────────────────────────────────────────────

describe("CategoryTabList — WAI-ARIA 구조", () => {
  it("role=tablist 요소가 렌더된다", () => {
    renderTabList();
    const tablists = screen.getAllByRole("tablist");
    // 모바일(grid) + 데스크탑(flex) 두 개 렌더
    expect(tablists.length).toBeGreaterThanOrEqual(1);
  });

  it("aria-label이 기본값 '시술 카테고리'로 설정된다", () => {
    renderTabList();
    const tablists = screen.getAllByRole("tablist");
    tablists.forEach((tl) => {
      expect(tl).toHaveAttribute("aria-label", "시술 카테고리");
    });
  });

  it("aria-orientation='horizontal'이 설정된다", () => {
    renderTabList();
    const tablists = screen.getAllByRole("tablist");
    tablists.forEach((tl) => {
      expect(tl).toHaveAttribute("aria-orientation", "horizontal");
    });
  });

  it("커스텀 ariaLabel prop이 적용된다", () => {
    render(
      <CategoryTabList
        categories={MOCK_CATEGORIES}
        activeId="best"
        lang="ko"
        onTabChange={vi.fn()}
        ariaLabel="치료 카테고리 선택"
      />
    );
    const tablists = screen.getAllByRole("tablist");
    tablists.forEach((tl) => {
      expect(tl).toHaveAttribute("aria-label", "치료 카테고리 선택");
    });
  });
});

describe("CategoryTabList — 탭 버튼 속성", () => {
  it("각 탭 버튼에 role=tab이 설정된다", () => {
    renderTabList();
    // 모바일+데스크탑 두 세트이므로 categories.length * 2
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBe(MOCK_CATEGORIES.length * 2);
  });

  it("활성 탭의 aria-selected=true, 비활성 탭은 false", () => {
    renderTabList("laser");
    const tabs = screen.getAllByRole("tab");
    const laserTabs = tabs.filter((t) => t.textContent === "레이저");
    const otherTabs = tabs.filter((t) => t.textContent !== "레이저");

    laserTabs.forEach((t) => expect(t).toHaveAttribute("aria-selected", "true"));
    otherTabs.forEach((t) => expect(t).toHaveAttribute("aria-selected", "false"));
  });

  it("활성 탭의 tabIndex=0, 비활성 탭은 -1 (roving tabindex)", () => {
    renderTabList("skin");
    const tabs = screen.getAllByRole("tab");
    const skinTabs = tabs.filter((t) => t.textContent === "피부관리");
    const otherTabs = tabs.filter((t) => t.textContent !== "피부관리");

    skinTabs.forEach((t) => expect(t).toHaveAttribute("tabindex", "0"));
    otherTabs.forEach((t) => expect(t).toHaveAttribute("tabindex", "-1"));
  });

  it("탭 버튼 id가 cat-tab-{id} 형식으로 설정된다", () => {
    renderTabList();
    MOCK_CATEGORIES.forEach((cat) => {
      const btns = document.querySelectorAll(`#cat-tab-${cat.id}`);
      // 모바일+데스크탑 두 세트
      expect(btns.length).toBeGreaterThanOrEqual(1);
    });
  });
});

describe("CategoryTabList — 탭 클릭 상호작용", () => {
  it("탭 클릭 시 onTabChange가 해당 id로 호출된다", () => {
    const onTabChange = vi.fn();
    renderTabList("best", onTabChange);

    // 데스크탑 세트의 '레이저' 탭 클릭 (첫 번째 세트)
    const laserTabs = screen.getAllByText("레이저");
    fireEvent.click(laserTabs[0]);

    expect(onTabChange).toHaveBeenCalledWith("laser");
    expect(onTabChange).toHaveBeenCalledTimes(1);
  });

  it("현재 활성 탭 클릭 시에도 onTabChange가 호출된다", () => {
    const onTabChange = vi.fn();
    renderTabList("best", onTabChange);

    const bestTabs = screen.getAllByText("베스트");
    fireEvent.click(bestTabs[0]);

    expect(onTabChange).toHaveBeenCalledWith("best");
  });
});

describe("CategoryTabList — 키보드 네비게이션", () => {
  let onTabChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onTabChange = vi.fn();
    renderTabList("best", onTabChange);
  });

  it("ArrowRight: 다음 탭으로 이동", () => {
    const bestTabs = screen.getAllByRole("tab", { name: "베스트" });
    fireEvent.keyDown(bestTabs[0], { key: "ArrowRight" });
    expect(onTabChange).toHaveBeenCalledWith("laser");
  });

  it("ArrowLeft: 이전 탭으로 이동 (첫 번째에서 마지막으로 순환)", () => {
    const bestTabs = screen.getAllByRole("tab", { name: "베스트" });
    fireEvent.keyDown(bestTabs[0], { key: "ArrowLeft" });
    // 첫 번째(best)에서 ArrowLeft → 마지막(skin)
    expect(onTabChange).toHaveBeenCalledWith("skin");
  });

  it("ArrowDown: 다음 탭으로 이동 (ArrowRight와 동일)", () => {
    const bestTabs = screen.getAllByRole("tab", { name: "베스트" });
    fireEvent.keyDown(bestTabs[0], { key: "ArrowDown" });
    expect(onTabChange).toHaveBeenCalledWith("laser");
  });

  it("ArrowUp: 이전 탭으로 이동 (ArrowLeft와 동일)", () => {
    const bestTabs = screen.getAllByRole("tab", { name: "베스트" });
    fireEvent.keyDown(bestTabs[0], { key: "ArrowUp" });
    expect(onTabChange).toHaveBeenCalledWith("skin");
  });

  it("Home: 첫 번째 탭으로 이동", () => {
    const laserTabs = screen.getAllByRole("tab", { name: "레이저" });
    fireEvent.keyDown(laserTabs[0], { key: "Home" });
    expect(onTabChange).toHaveBeenCalledWith("best");
  });

  it("End: 마지막 탭으로 이동", () => {
    const bestTabs = screen.getAllByRole("tab", { name: "베스트" });
    fireEvent.keyDown(bestTabs[0], { key: "End" });
    expect(onTabChange).toHaveBeenCalledWith("skin");
  });

  it("마지막 탭에서 ArrowRight → 첫 번째 탭으로 순환", () => {
    const skinTabs = screen.getAllByRole("tab", { name: "피부관리" });
    fireEvent.keyDown(skinTabs[0], { key: "ArrowRight" });
    expect(onTabChange).toHaveBeenCalledWith("best");
  });

  it("관련 없는 키(Enter, Space 등)는 onTabChange를 호출하지 않는다", () => {
    const bestTabs = screen.getAllByRole("tab", { name: "베스트" });
    fireEvent.keyDown(bestTabs[0], { key: "Enter" });
    fireEvent.keyDown(bestTabs[0], { key: " " });
    fireEvent.keyDown(bestTabs[0], { key: "Tab" });
    expect(onTabChange).not.toHaveBeenCalled();
  });
});

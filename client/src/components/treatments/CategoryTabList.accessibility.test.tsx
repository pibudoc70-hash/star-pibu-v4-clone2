/**
 * CategoryTabList — native pressed-button filter 접근성 회귀 테스트
 *
 * 카드 목록을 교체하는 filter에는 tablist/panel 연결이 아니라,
 * native button과 aria-pressed 상태를 사용한다.
 */
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CategoryTabList from "./CategoryTabList";
import type { Category } from "@/types/treatment";

const MOCK_CATEGORIES: Category[] = [
  { id: "best", labelKo: "베스트", labelEn: "Best", labelJa: "ベスト", labelZh: "最佳" },
  { id: "laser", labelKo: "레이저", labelEn: "Laser", labelJa: "レーザー", labelZh: "激光" },
  { id: "skin", labelKo: "피부관리", labelEn: "Skin", labelJa: "スキン", labelZh: "皮肤" },
];

vi.mock("@/data/treatments/categories", () => ({
  CATEGORY_ICON_MAP: {},
  getCatLabel: (cat: Category, lang: string) => {
    if (lang === "ko") return cat.labelKo;
    if (lang === "en") return cat.labelEn;
    return cat.labelKo;
  },
}));

vi.mock("./CategoryTabButton", () => ({
  default: ({
    label,
    isActive,
    onClick,
    id,
  }: {
    label: string;
    isActive: boolean;
    onClick: (id: string) => void;
    id: string;
  }) => (
    <button type="button" aria-pressed={isActive} data-active={isActive} onClick={() => onClick(id)}>
      {label}
    </button>
  ),
}));

function renderFilter(activeId = "best", onTabChange = vi.fn()) {
  return render(
    <CategoryTabList
      categories={MOCK_CATEGORIES}
      activeId={activeId}
      lang="ko"
      onTabChange={onTabChange}
    />,
  );
}

describe("CategoryTabList — native filter button semantics", () => {
  it("이름이 있는 두 개의 filter group을 렌더한다", () => {
    renderFilter();
    const groups = screen.getAllByRole("group", { name: "시술 카테고리" });
    expect(groups).toHaveLength(2);
  });

  it("tablist·tab·aria-selected 패턴을 렌더하지 않는다", () => {
    renderFilter();
    expect(screen.queryAllByRole("tablist")).toHaveLength(0);
    expect(screen.queryAllByRole("tab")).toHaveLength(0);
    expect(document.querySelectorAll("[aria-selected]")).toHaveLength(0);
  });

  it("활성 filter만 aria-pressed=true로 노출한다", () => {
    renderFilter("laser");
    for (const button of screen.getAllByRole("button", { name: "레이저" })) {
      expect(button).toHaveAttribute("aria-pressed", "true");
    }
    for (const button of screen.getAllByRole("button", { name: "베스트" })) {
      expect(button).toHaveAttribute("aria-pressed", "false");
    }
  });

  it("click으로 선택 변경 callback을 유지한다", () => {
    const onTabChange = vi.fn();
    renderFilter("best", onTabChange);
    fireEvent.click(screen.getAllByRole("button", { name: "레이저" })[0]);
    expect(onTabChange).toHaveBeenCalledWith("laser");
    expect(onTabChange).toHaveBeenCalledTimes(1);
  });

  it("Arrow/Home/End key를 filter 변경 단축키로 가로채지 않는다", () => {
    const onTabChange = vi.fn();
    renderFilter("best", onTabChange);
    const button = screen.getAllByRole("button", { name: "베스트" })[0];

    for (const key of ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"]) {
      fireEvent.keyDown(button, { key });
    }

    expect(onTabChange).not.toHaveBeenCalled();
  });
});

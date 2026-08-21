import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

const routerState = vi.hoisted(() => ({
  location: "/en/price-list",
  navigate: vi.fn(),
  setLang: vi.fn(),
}));

vi.mock("wouter", () => ({
  useLocation: () => [routerState.location, routerState.navigate],
}));

vi.mock("@/contexts/LangContext", () => ({
  useLang: () => ({ setLang: routerState.setLang }),
}));

vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/SeoHead", () => ({
  default: () => null,
  BASE_URL: "https://star-pibu.com",
  LANG_TO_OG_LOCALE: { en: "en_US", ja: "ja_JP", zh: "zh_CN", "zh-TW": "zh_TW" },
  OG_IMAGE_LOCALIZED: { en: "", ja: "", zh: "", "zh-TW": "" },
  SITE_NAME_LOCALIZED: { en: "STAR", ja: "STAR", zh: "STAR", "zh-TW": "STAR" },
}));

import ForeignPriceList from "./ForeignPriceList";

afterEach(() => {
  cleanup();
  routerState.navigate.mockClear();
  routerState.setLang.mockClear();
});

describe("ForeignPriceList mobile table UX", () => {
  const cases = [
    ["/en/price-list", "Swipe horizontally to view all price details."],
    ["/ja/price-list", "横にスワイプして料金詳細を確認できます。"],
    ["/zh/price-list", "左右滑动即可查看完整价格详情。"],
    ["/zh-tw/price-list", "左右滑動即可查看完整價格詳情。"],
  ] as const;

  it.each(cases)("renders the %s mobile table scroll contract in the DOM", (location, scrollHint) => {
    routerState.location = location;
    render(<ForeignPriceList />);

    expect(screen.getAllByText(scrollHint).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("tablist")).toHaveClass("overflow-x-auto", "sm:flex-wrap", "sm:overflow-visible");

    const table = screen.getAllByRole("table")[0]!;
    expect(table.parentElement).toHaveAttribute("aria-label", scrollHint);
    expect(table.parentElement).toHaveClass("overflow-x-auto", "overscroll-x-contain", "touch-pan-x");
    expect(screen.getAllByRole("columnheader")[0]).toHaveClass("sticky", "left-0");
    expect(screen.getAllByRole("cell")[0]).toHaveClass("sticky", "left-0", "break-words");
    expect(screen.getAllByRole("cell")[1]).toHaveClass("break-words");
  });
});

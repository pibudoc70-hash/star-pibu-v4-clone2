import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import CategoryTabList from "./CategoryTabList";
import { CATEGORIES } from "@/data/treatments/categories";

describe("CategoryTabList filter semantics", () => {
  const categories = CATEGORIES.slice(0, 2);

  it("uses native pressed buttons rather than a tablist pattern", () => {
    render(
      <CategoryTabList
        categories={categories}
        activeId="best"
        lang="ko"
        onTabChange={vi.fn()}
      />,
    );

    expect(screen.queryAllByRole("tablist")).toHaveLength(0);
    expect(screen.queryAllByRole("tab")).toHaveLength(0);

    for (const button of screen.getAllByRole("button", { name: "Best 시술" })) {
      expect(button).toHaveAttribute("aria-pressed", "true");
    }
    for (const button of screen.getAllByRole("button", { name: "리프팅·탄력" })) {
      expect(button).toHaveAttribute("aria-pressed", "false");
    }
  });

  it("keeps category selection behavior through native button activation", () => {
    const onTabChange = vi.fn();
    render(
      <CategoryTabList
        categories={categories}
        activeId="best"
        lang="ko"
        onTabChange={onTabChange}
      />,
    );

    fireEvent.click(screen.getAllByRole("button", { name: "리프팅·탄력" })[0]);

    expect(onTabChange).toHaveBeenCalledWith("lifting");
  });
});

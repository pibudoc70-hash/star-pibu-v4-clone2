import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import PainManagementGuide from "./PainManagementGuide";

describe("PainManagementGuide mobile accordion", () => {
  it("keeps the three mobile stages compact until their native disclosure is opened", () => {
    render(<PainManagementGuide lang="ko" />);

    const firstStage = screen.getByTestId("pain-mobile-stage-1");
    const firstSummary = firstStage.querySelector("summary");

    expect(screen.getByTestId("pain-management-summary")).toHaveClass("md:hidden");
    expect(screen.getByTestId("pain-management-summary-desktop")).toHaveClass("hidden", "md:grid");
    expect(firstStage).not.toHaveAttribute("open");
    expect(firstSummary).toBeInTheDocument();
    expect(firstSummary).toHaveClass("grid", "min-h-[68px]", "grid-cols-[2.5rem_minmax(0,1fr)_auto]");
    expect(within(firstStage).getByText("자세히 보기")).toBeInTheDocument();

    fireEvent.click(firstSummary!);

    expect(firstStage).toHaveAttribute("open");
    expect(within(firstStage).getByText("접기")).toBeInTheDocument();
    expect(within(firstStage).getByText("시술 전 마취 크림을 충분히 도포해 표면 통증 부담을 낮춥니다. 대부분의 시술에서 기본으로 적용됩니다.")).toBeInTheDocument();
  });

  it("keeps localized accordion labels and the approved English step copy", () => {
    render(<PainManagementGuide lang="en" />);

    const firstStage = screen.getByTestId("pain-mobile-stage-1");
    const firstSummary = firstStage.querySelector("summary");

    expect(within(firstStage).getByText("View details")).toBeInTheDocument();
    fireEvent.click(firstSummary!);
    expect(within(firstStage).getByText("Collapse")).toBeInTheDocument();
    expect(within(firstStage).getByText("1. Topical anesthetic")).toBeInTheDocument();
  });

  it("uses a compact, locale-safe mobile title treatment without changing desktop type", () => {
    render(<PainManagementGuide lang="ko" />);

    const thirdStageTitle = within(screen.getByTestId("pain-mobile-stage-3")).getByRole("heading", { name: "수면진정 / 수면마취" });

    expect(thirdStageTitle).toHaveClass("break-keep", "text-[15px]", "leading-[1.25]", "sm:text-base", "sm:leading-5");
    expect(within(screen.getByTestId("pain-mobile-stage-3")).getByText("자세히 보기")).toHaveClass("sr-only", "sm:not-sr-only");
  });

  it("uses compact implicit rows and vertical padding for the mobile guidance panel", () => {
    render(<PainManagementGuide lang="ko" />);

    const guidancePanel = screen.getByTestId("pain-trust-strip");
    const firstBadge = within(guidancePanel).getByText("수면마취 운영 경험 20년 이상").closest("article");

    expect(guidancePanel).toHaveClass("mt-3", "auto-rows-max", "content-start", "sm:mt-4");
    expect(firstBadge).toHaveClass("items-center", "px-4", "py-3", "sm:p-4");
  });

  it("keeps mobile heading and FAQ spacing compact while restoring desktop spacing", () => {
    render(<PainManagementGuide lang="ko" />);

    const panel = document.getElementById("pain-management-guide-title")?.closest("section");
    const header = document.getElementById("pain-management-guide-title")?.closest("header");
    const caption = document.getElementById("pain-management-summary-caption");
    const heading = document.getElementById("pain-management-guide-title");
    const faq = screen.getByTestId("pain-faq");
    const firstFaq = screen.getByTestId("pain-faq-item-1");
    const firstFaqSummary = firstFaq.querySelector("summary");
    const firstFaqAnswer = firstFaq.querySelector("p");

    expect(panel).toHaveClass("p-4", "sm:p-8");
    expect(header).toHaveClass("mb-3", "sm:mb-8");
    expect(heading).toHaveClass("mt-2", "sm:mt-3");
    expect(caption).toHaveClass("mt-2", "sm:mt-3");
    expect(faq).toHaveClass("mt-4", "p-3.5", "sm:mt-5", "sm:p-5");
    expect(firstFaqSummary).toHaveClass("min-h-11", "py-2.5", "sm:py-3");
    expect(firstFaqAnswer).toHaveClass("pb-3", "sm:pb-4");
    expect(screen.getByText("통증 정도와 마취 방식은 개인의 건강 상태 및 시술 부위에 따라 다르며, 상담을 통해 최종 결정됩니다.")).toHaveClass("mt-3", "sm:mt-4");
  });
});

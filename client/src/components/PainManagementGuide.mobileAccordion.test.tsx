import React from "react";
import { readFileSync } from "node:fs";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import PainManagementGuide from "./PainManagementGuide";

describe("PainManagementGuide mobile disclosure", () => {
  it("keeps the three-stage guide visible without an outer mobile disclosure and opens only the first stage by default", () => {
    render(<PainManagementGuide lang="ko" />);

    const firstStage = screen.getByTestId("pain-mobile-stage-1");
    const secondStage = screen.getByTestId("pain-mobile-stage-2");
    const thirdStage = screen.getByTestId("pain-mobile-stage-3");

    expect(screen.queryByTestId("pain-mobile-panel")).not.toBeInTheDocument();
    expect(screen.getByTestId("pain-management-summary")).toBeInTheDocument();
    expect(screen.getByTestId("pain-trust-strip")).toBeInTheDocument();
    expect(screen.getByTestId("pain-faq")).toBeInTheDocument();
    expect(firstStage).toHaveAttribute("open");
    expect(secondStage).not.toHaveAttribute("open");
    expect(thirdStage).not.toHaveAttribute("open");
    expect(within(firstStage).getByText("연고마취")).toBeInTheDocument();
    expect(within(screen.getByTestId("pain-trust-strip")).getByText("수면마취 운영 경험 20년 이상")).toBeInTheDocument();
    expect(screen.getAllByText("통증 정도와 마취 방식은 개인의 건강 상태 및 시술 부위에 따라 다르며, 상담을 통해 최종 결정됩니다.")).not.toHaveLength(0);
  });

  it("retains localized visible first-stage and trust guidance copy without a whole-panel toggle", () => {
    render(<PainManagementGuide lang="en" />);

    expect(screen.queryByTestId("pain-mobile-panel")).not.toBeInTheDocument();
    expect(within(screen.getByTestId("pain-mobile-stage-1")).getByText("1. Topical anesthetic")).toBeInTheDocument();
    expect(screen.getByLabelText("Guidance for safe care")).toBeInTheDocument();
  });

  it("keeps the 68px stage target, timeline marker, and native stage disclosure interaction", () => {
    render(<PainManagementGuide lang="ko" />);

    const firstStage = screen.getByTestId("pain-mobile-stage-1");
    const firstStageSummary = firstStage.querySelector("summary");
    expect(firstStageSummary).toHaveClass("min-h-[68px]", "focus-visible:ring-2");
    expect(firstStage).toHaveAttribute("open");
    expect(screen.getByTestId("pain-management-summary").querySelector('[aria-hidden="true"]')).toBeInTheDocument();

    fireEvent.click(firstStageSummary!);
    expect(firstStage).not.toHaveAttribute("open");
  });

  it("keeps the caption accessible while visually hiding it only below sm and preserves the desktop three-column guide", () => {
    render(<PainManagementGuide lang="ko" />);

    const source = readFileSync("client/src/components/PainManagementGuide.tsx", "utf8");
    expect(screen.getByTestId("pain-management-summary").closest(".md\\:hidden")).toHaveClass("md:hidden");
    expect(screen.getByTestId("pain-management-summary-desktop").closest(".hidden")).toHaveClass("hidden", "md:block");
    expect(screen.getByTestId("pain-management-summary-desktop")).toHaveClass("md:grid-cols-3");
    expect(screen.getByText("시술 특성과 개인의 통증 민감도를 먼저 확인한 뒤, 꼭 필요한 단계만 원장님이 직접 검토하고 결정합니다.")).toHaveClass("sr-only", "sm:not-sr-only");
    expect(source).not.toContain('data-testid="pain-mobile-panel"');
  });

  it("keeps mobile FAQs closed initially and allows only one answer open at a time", () => {
    render(<PainManagementGuide lang="ko" />);

    const firstFaq = screen.getByTestId("pain-faq-item-1");
    const secondFaq = screen.getByTestId("pain-faq-item-2");

    expect(firstFaq).not.toHaveAttribute("open");
    expect(secondFaq).not.toHaveAttribute("open");

    fireEvent.click(firstFaq.querySelector("summary")!);
    expect(firstFaq).toHaveAttribute("open");

    fireEvent.click(secondFaq.querySelector("summary")!);
    expect(firstFaq).not.toHaveAttribute("open");
    expect(secondFaq).toHaveAttribute("open");
  });

  it("supports a compact dark native accordion presentation for the Special Event area", () => {
    render(<PainManagementGuide lang="ko" presentation="event-accordion" />);

    const accordion = screen.getByTestId("pain-management-event-accordion");
    const disclosure = accordion.querySelector("details")!;
    const summary = disclosure.querySelector("summary");
    const requestedSummary = "통증에 대한 부담까지 고려하는 것이 시술 계획의 중요한 시작입니다";

    expect(accordion).toHaveClass("mt-12", "!p-0", "md:hidden");
    expect(disclosure).not.toHaveAttribute("open");
    expect(summary).toHaveClass("min-h-[76px]", "focus-visible:ring-2");
    expect(within(summary!).getByText(requestedSummary)).toBeInTheDocument();
    expect(within(summary!).queryByText("PAIN MANAGEMENT")).not.toBeInTheDocument();
    expect(within(summary!).queryByText("개인별 통증관리 3단계")).not.toBeInTheDocument();

    fireEvent.click(summary!);
    expect(disclosure).toHaveAttribute("open");
    expect(within(accordion).getByText("리프팅 시술에서 통증에 대한 걱정은 자연스러운 일입니다. 스타피부과는 시술 특성과 개인의 통증 민감도를 먼저 확인한 뒤, 꼭 필요한 단계만 원장님이 직접 검토하고 결정합니다.")).toBeInTheDocument();
    expect(within(accordion).getAllByText(requestedSummary)).toHaveLength(1);
    expect(accordion.querySelector('section[aria-label="개인별 통증관리 3단계"]')).toBeInTheDocument();
  });

  it("prevents global mobile section padding from increasing the closed Special Event accordion", () => {
    const styles = readFileSync("client/src/index.css", "utf8");

    expect(styles).toContain('section#pain-management[data-testid="pain-management-event-accordion"]');
    expect(styles).toContain("section#events {\n      padding-bottom: 3rem !important;");
    expect(styles).toContain('[data-testid="pain-management-summary"]');
    expect(styles).toContain('[data-testid="pain-trust-strip"]');
    expect(styles).toContain('[data-testid="pain-faq"]');
    expect(styles).toContain("padding-top: 0 !important;");
    expect(styles).toContain("padding-bottom: 0 !important;");
  });
});

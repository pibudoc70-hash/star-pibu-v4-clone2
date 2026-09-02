import React from "react";
import { readFileSync } from "node:fs";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import PainManagementGuide from "./PainManagementGuide";

describe("PainManagementGuide mobile disclosure", () => {
  it("keeps the full mobile guide collapsed behind one native disclosure until the user opens it", () => {
    render(<PainManagementGuide lang="ko" />);

    const panel = screen.getByTestId("pain-mobile-panel");
    const summary = panel.querySelector("summary");

    expect(panel).not.toHaveAttribute("open");
    expect(summary).toBeInTheDocument();
    expect(within(panel).getByText("통증관리 3단계와 FAQ 보기")).toBeInTheDocument();
    expect(within(panel).getByText("개인별 통증관리 3단계")).toBeInTheDocument();
    expect(screen.getByTestId("pain-management-summary")).toBeInTheDocument();
    expect(screen.getByTestId("pain-trust-strip")).toBeInTheDocument();
    expect(screen.getByTestId("pain-faq")).toBeInTheDocument();

    fireEvent.click(summary!);

    expect(panel).toHaveAttribute("open");
    expect(within(panel).getByText("통증관리 접기")).toBeInTheDocument();
    expect(within(panel).getByText("연고마취")).toBeInTheDocument();
    expect(within(panel).getByText("수면마취 운영 경험 20년 이상")).toBeInTheDocument();
    expect(within(panel).getByText("통증 정도와 마취 방식은 개인의 건강 상태 및 시술 부위에 따라 다르며, 상담을 통해 최종 결정됩니다.")).toBeInTheDocument();
  });

  it("retains localized whole-panel labels and approved localized detail copy", () => {
    render(<PainManagementGuide lang="en" />);

    const panel = screen.getByTestId("pain-mobile-panel");
    const summary = panel.querySelector("summary");

    expect(within(panel).getByText("View pain-management steps and FAQ")).toBeInTheDocument();
    fireEvent.click(summary!);
    expect(within(panel).getByText("Close pain management")).toBeInTheDocument();
    expect(within(panel).getByText("1. Topical anesthetic")).toBeInTheDocument();
    expect(within(panel).getByText("Guidance for safe care")).toBeInTheDocument();
  });

  it("keeps the 68px stage target, nested native disclosures, and focus-visible treatment inside the opened panel", () => {
    render(<PainManagementGuide lang="ko" />);

    const panel = screen.getByTestId("pain-mobile-panel");
    const panelSummary = panel.querySelector("summary");
    fireEvent.click(panelSummary!);

    const firstStage = screen.getByTestId("pain-mobile-stage-1");
    const firstStageSummary = firstStage.querySelector("summary");
    expect(firstStageSummary).toHaveClass("min-h-[68px]", "focus-visible:ring-2");
    expect(firstStage).not.toHaveAttribute("open");

    fireEvent.click(firstStageSummary!);
    expect(firstStage).toHaveAttribute("open");
    expect(within(firstStage).getByText("접기")).toBeInTheDocument();
  });

  it("uses md as the only mobile-to-desktop boundary while preserving the desktop three-column guide", () => {
    render(<PainManagementGuide lang="ko" />);

    const source = readFileSync("client/src/components/PainManagementGuide.tsx", "utf8");
    expect(screen.getByTestId("pain-mobile-panel")).toHaveClass("md:hidden");
    expect(screen.getByTestId("pain-management-summary-desktop").closest(".hidden")).toHaveClass("hidden", "md:block");
    expect(screen.getByTestId("pain-management-summary-desktop")).toHaveClass("md:grid-cols-3");
    expect(source).not.toContain("sm:");
  });
});

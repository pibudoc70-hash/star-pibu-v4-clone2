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
});

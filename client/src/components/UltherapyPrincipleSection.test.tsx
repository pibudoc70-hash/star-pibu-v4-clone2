import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import UltherapyPrincipleSection from "./UltherapyPrincipleSection";

describe("UltherapyPrincipleSection", () => {
  it("renders the supplied procedure principle as semantic HTML rather than image-only content", () => {
    render(<UltherapyPrincipleSection />);

    expect(screen.getByRole("heading", { name: "울쎄라, 피부 속에서 시작되는 탄력 리프팅" })).toBeTruthy();
    expect(screen.getByText("미세집속 초음파 에너지를 필요한 깊이에 정밀하게 전달합니다.")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "피부층과 목표 깊이" })).toBeTruthy();
    expect(screen.getByText("1.5mm · 표피")).toBeTruthy();
    expect(screen.getByText("3.0mm · 진피")).toBeTruthy();
    expect(screen.getByText("4.5mm · 피하지지층")).toBeTruthy();
    expect(screen.getAllByRole("listitem")).toHaveLength(7);
    expect(screen.getByRole("heading", { name: "4단계 시술 원리" })).toBeTruthy();
    expect(screen.getByText("피부층 확인")).toBeTruthy();
    expect(screen.getByText("콜라겐 리모델링")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "회복 과정 타임라인" })).toBeTruthy();
    expect(screen.getByText("시술 직후")).toBeTruthy();
    expect(screen.getByText("수개월 후")).toBeTruthy();
    expect(screen.getByLabelText("시술 전 안내").textContent).toContain("시술 전 의료진 상담이 필요합니다.");
  });
});

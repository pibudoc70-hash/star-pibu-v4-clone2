import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import TreatmentDetail from "./TreatmentDetail";

vi.mock("wouter", () => ({ useRoute: () => [false, {}] }));
vi.mock("@/contexts/LangContext", () => ({
  useLang: () => ({
    lang: "ko",
    t: { treatmentDetail: { notFound: "시술을 찾을 수 없습니다.", backToHome: "홈으로" } },
  }),
}));

describe("TreatmentDetail legacy route", () => {
  it("renders the not-found state immediately instead of an effect-driven loading spinner", () => {
    const { container } = render(<TreatmentDetail />);

    expect(screen.getByRole("heading", { name: "시술을 찾을 수 없습니다." })).toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).not.toBeInTheDocument();
  });
});

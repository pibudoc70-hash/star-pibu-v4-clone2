import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Equipment2Detail from "./Equipment2Detail";

vi.mock("wouter", () => ({
  useParams: () => ({ slug: "missing-device" }),
  useLocation: () => ["/equipment2/missing-device", vi.fn()],
}));
vi.mock("@/contexts/LangContext", () => ({ useLang: () => ({ lang: "ko" }) }));
vi.mock("@/hooks/useLocalizedText", () => ({ useLocalizedText: () => ({ getText: (ko: string) => ko }) }));
vi.mock("@/lib/trpc", () => ({
  trpc: { treatments: { bySlug: { useQuery: () => ({ data: undefined, isLoading: false, isError: true }) } } },
}));

describe("Equipment2Detail error navigation", () => {
  it("uses a native link to return to the equipment list", () => {
    render(<Equipment2Detail />);

    expect(screen.getByRole("link", { name: "목록으로 돌아가기" })).toHaveAttribute("href", "/equipment2");
  });
});

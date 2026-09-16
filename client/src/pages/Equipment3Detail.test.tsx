import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Equipment3Detail from "./Equipment3Detail";

let queryResult = { data: undefined, isLoading: false, isError: true };

vi.mock("wouter", () => ({
  useParams: () => ({ slug: "missing-device" }),
  useLocation: () => ["/equipment3/missing-device?tab=skin", vi.fn()],
  useSearch: () => "?tab=skin",
}));
vi.mock("@/contexts/LangContext", () => ({ useLang: () => ({ lang: "ko" }) }));
vi.mock("@/hooks/useLocalizedText", () => ({ useLocalizedText: () => ({ getText: (ko: string) => ko }) }));
vi.mock("@/hooks/useChatConfig", () => ({ useChatConfig: () => ({ chatUrl: "#", reserveUrl: "#", chatBg: "", chatColor: "" }) }));
vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/lib/trpc", () => ({
  trpc: { equipment3: { bySlug: { useQuery: () => queryResult } } },
}));

describe("Equipment3Detail error navigation", () => {
  it("uses a native link preserving the tab back path", () => {
    render(<Equipment3Detail />);
    expect(screen.getByRole("link", { name: "목록으로 돌아가기" })).toHaveAttribute("href", "/equipment3?tab=skin");
  });

  it("keeps an encoded Korean slug as the public detail-route input", () => {
    expect(decodeURIComponent("%EC%9A%B8%EC%8D%A8%EB%9D%BC%ED%94%BC-%ED%94%84%EB%9D%BC%EC%9E%84")).toBe("울써라피-프라임");
  });

  it("keeps the loading hero clear of the fixed desktop header", () => {
    queryResult = { data: undefined, isLoading: true, isError: false };
    const { container } = render(<Equipment3Detail />);
    const hero = container.querySelector(".equipment-detail__loading-hero");

    expect(hero).toHaveClass("pt-[calc(8rem+env(safe-area-inset-top))]");
    expect(hero).toHaveClass("md:pt-[calc(8rem+env(safe-area-inset-top))]");
    expect(hero).toHaveClass("md:pb-12");
    expect(hero).not.toHaveClass("md:py-12");
    queryResult = { data: undefined, isLoading: false, isError: true };
  });
});

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Equipment3Detail from "./Equipment3Detail";

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
  trpc: { equipment3: { bySlug: { useQuery: () => ({ data: undefined, isLoading: false, isError: true }) } } },
}));

describe("Equipment3Detail error navigation", () => {
  it("uses a native link preserving the tab back path", () => {
    render(<Equipment3Detail />);
    expect(screen.getByRole("link", { name: "목록으로 돌아가기" })).toHaveAttribute("href", "/equipment3?tab=skin");
  });
});

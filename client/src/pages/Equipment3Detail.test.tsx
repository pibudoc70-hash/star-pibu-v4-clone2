import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import Equipment3Detail from "./Equipment3Detail";

let queryResult = { data: undefined as Record<string, unknown> | undefined, isLoading: false, isError: true };
let activeLang = "ko";
let cachedItems: Record<string, unknown>[] | undefined;
let lastQueryOptions: Record<string, unknown> | undefined;
const equipmentDetailSource = readFileSync(resolve(process.cwd(), "client/src/pages/Equipment3Detail.tsx"), "utf8");
const modalSource = readFileSync(resolve(process.cwd(), "client/src/components/treatments/EquipmentTreatmentModal.tsx"), "utf8");

vi.mock("wouter", () => ({
  useParams: () => ({ slug: "missing-device" }),
  useLocation: () => ["/equipment3/missing-device?tab=skin", vi.fn()],
  useSearch: () => "?tab=skin",
}));
vi.mock("@/contexts/LangContext", () => ({ useLang: () => ({ lang: activeLang }) }));
vi.mock("@/hooks/useLocalizedText", () => ({ useLocalizedText: () => ({ getText: (ko: string) => ko }) }));
vi.mock("@/hooks/useChatConfig", () => ({ useChatConfig: () => ({ chatUrl: "#", reserveUrl: "#", chatBg: "", chatColor: "" }) }));
vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({ equipment3: { list: { getData: () => cachedItems } } }),
    equipment3: {
      bySlug: {
        useQuery: (_input: unknown, options: Record<string, unknown>) => {
          lastQueryOptions = options;
          return queryResult;
        },
      },
    },
  },
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

  it("uses the foreign list cache as the detail query's immediate initial value", () => {
    const cachedItem = {
      id: 1,
      slug: "missing-device",
      name: "캐시 시술",
      nameEn: "Cached Treatment",
      category: "피부관리",
      categoryEn: "Skin Care",
      desc: "",
      detail: "",
      effect: "",
      caution: "",
      sessions: "",
      time: "",
      recovery: "",
      faqs: "[]",
      images: "[]",
      imageUrl: null,
      bgImageUrl: null,
      badge: "",
    };
    activeLang = "en";
    cachedItems = [cachedItem];
    queryResult = { data: cachedItem, isLoading: false, isError: false };

    render(<Equipment3Detail />);

    expect(lastQueryOptions?.initialData).toBe(cachedItem);
    activeLang = "ko";
    cachedItems = undefined;
    queryResult = { data: undefined, isLoading: false, isError: true };
  });

  it("uses localized authored content for Ultherapy Prime and Thermage FLX instead of the generic detail fallback", () => {
    expect(equipmentDetailSource).toContain("isUltherapyPrimeSlug(item.slug)");
    expect(equipmentDetailSource).toContain('const isThermageFlx = item.slug === "써마지FLX";');
    expect(equipmentDetailSource).toContain("<UltherapyPrimeDesktopHero lang={lang} treatment={isThermageFlx ? \"thermage\" : \"ultherapy\"} />");
    expect(equipmentDetailSource).toContain("<UltherapyPrimeDesktopContent lang={lang} youtubeUrl={isThermageFlx ? null : item.youtubeUrl} treatment={isThermageFlx ? \"thermage\" : \"ultherapy\"} />");
    expect(equipmentDetailSource).not.toContain("lang === \"ko\" && isUltherapyPrimeSlug");
    expect(equipmentDetailSource).toContain("!isAuthoredLiftingDetail ? EQUIPMENT_EXPLANATORY_INFOGRAPHICS[item.slug");
  });

  it("renders a cached foreign list item immediately while refreshing the single-item query", () => {
    expect(equipmentDetailSource).toContain("const cachedForeignItem = lang === \"ko\"");
    expect(equipmentDetailSource).toContain("utils.equipment3.list.getData()?.find((candidate) => candidate.slug === slug)");
    expect(equipmentDetailSource).toContain("initialData: cachedForeignItem");
  });

  it("keeps main-card modal navigation on the foreign detail route so the list cache is retained", () => {
    expect(modalSource).toContain('const localizedDetailUrl = detailUrl && lang !== "ko"');
    expect(modalSource).toContain("setLocation(localizedDetailUrl)");
  });
});

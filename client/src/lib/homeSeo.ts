import {
  COMMON_HREFLANGS,
  buildBreadcrumbJsonLd,
  buildFAQPageJsonLd,
  buildPersonListJsonLd,
  buildVideoObjectListJsonLd,
  OG_IMAGE_LOCALIZED,
  SITE_NAME_LOCALIZED,
} from "@/lib/seoHelpers";
import { VERIFIED_YOUTUBE_VIDEO_SEO } from "@shared/verifiedYoutubeVideoSeo";
import { CLINIC_DOCTORS } from "@/lib/clinic-data";

export const HOME_SEO_META = {
  title: "부산 서면 스타피부과 | 부산울쎄라ㅣ부산써마지ㅣ부산 리프팅ㅣ피부과전문의 3인 진료",
  description:
    "부산 서면 스타피부과(서면로 74 아이온시티빌딩 4F)는 20년 이상 경력 피부과 전문의 3인이 울세라피·써마지 FLX·눈밑지방재배치·리주란힐러·피코레이저 등 50종 프리미엄 레이저를 직접 담당합니다. 영어·일본어·중국어 외국인 환자 진료 가능. 전화 051-818-2300.",
  keywords: "부산피부과, 부산울쎄라, 부산써마지, 부산리프팅, 부산울쎄라피",
  canonical: "https://star-pibu.com",
  ogImage: OG_IMAGE_LOCALIZED.ko,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogSiteName: SITE_NAME_LOCALIZED.ko,
  ogLocale: "ko_KR",
  ogLocaleAlternates: ["en_US", "ja_JP", "zh_CN"],
  hreflangs: COMMON_HREFLANGS,
  pageType: "home" as const,
};

type HomeFaqItem = { question: string; answer: string };

export function buildHomeJsonLd(faqItems: HomeFaqItem[], locale = "ko") {
  const verifiedVideoSchema = locale === "ko"
    ? buildVideoObjectListJsonLd([...VERIFIED_YOUTUBE_VIDEO_SEO])
    : null;

  return [
    buildBreadcrumbJsonLd([{ name: "홈", url: "https://star-pibu.com" }]),
    buildFAQPageJsonLd(faqItems),
    buildPersonListJsonLd(CLINIC_DOCTORS),
    ...(verifiedVideoSchema ? [verifiedVideoSchema] : []),
  ];
}

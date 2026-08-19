import type { Doctor } from "./doctors-data";

export interface DoctorsSeoContent {
  title: string;
  description: string;
  keywords: string;
  pageTitle: string;
  pageTagline: string;
}

const DOCTORS_SEO_CONTENT: Record<string, DoctorsSeoContent> = {
  ko: {
    title: "피부과전문의 3인 | 부산 서면 스타피부과",
    description: "부산 서면 스타피부과 피부과전문의 3인 소개. 조시형 원장(써마지 FLX 자문의, 눈밑지방재배치 4,000례), 우혜진 원장, 이기욱 원장. 20년 이상의 임상 경험으로 안전하고 자연스러운 피부 치료를 제공합니다.",
    keywords: "스타피부과 의료진, 부산 피부과전문의, 조시형 원장, 우혜진 원장, 이기욱 원장, 서면피부과 전문의, 부산피부과 의사, 써마지 자문의, 눈밑지방재배치 전문의",
    pageTitle: "피부과전문의 3인",
    pageTagline: "피부의 격(格)이 바뀌는 순간, 전문의의 안목이 차이를 만듭니다.",
  },
  en: {
    title: "3 Board-Certified Dermatologists | Star Dermatology Busan",
    description: "Meet the 3 board-certified dermatologists at Star Dermatology, Seomyeon, Busan. Dr. Jo Si-Hyung (Thermage FLX advisor, 4,000+ under-eye fat repositioning cases), Dr. Woo Hye-Jin, Dr. Lee Gi-Wook. Over 20 years of clinical expertise.",
    keywords: "Star Dermatology doctors, Busan dermatologist, Dr Jo Si-Hyung, board-certified dermatologist Busan, Seomyeon dermatology",
    pageTitle: "3 Board-Certified Dermatologists",
    pageTagline: "When your skin transforms, the specialist's insight makes all the difference.",
  },
  ja: {
    title: "皮膚科専門医3名 | 釜山 서면 スター皮膚科",
    description: "釜山서면スター皮膚科の皮膚科専門医3名をご紹介します。趙時亨院長（써마지FLX顧問医、目の下の脂肪再配置4,000例以上）、禹惠珍院長、李基旭院長。20年以上の臨床経験。",
    keywords: "スター皮膚科 医師, 釜山皮膚科専門医, 趙時亨院長, 皮膚科専門医 釜山",
    pageTitle: "皮膚科専門医 3名",
    pageTagline: "肌の格が変わる瞬間、専門医の眼力が違いを生む。",
  },
  zh: {
    title: "3位皮肤科专科医生 | 釜山서면 STAR皮肤科",
    description: "釜山서면STAR皮肤科三位皮肤科专科医生介绍。赵时亨院长（써마지FLX顾问医、眼下脂肪重置4,000例以上）、禹慧珍院长、李基旭院长。20年以上临床经验。",
    keywords: "STAR皮肤科 医生, 釜山皮肤科专科医生, 赵时亨院长, 皮肤科专科医生 釜山",
    pageTitle: "3位皮肤科专科医生",
    pageTagline: "肌肤蜕变的瞬间，专科医生的眼光创造不同。",
  },
};

type PhysicianSchemaInput = Pick<
  Doctor,
  | "name"
  | "image"
  | "jobTitleEn"
  | "schemaDescription"
  | "intro"
  | "alumniOf"
  | "memberOf"
  | "award"
  | "sameAs"
  | "availableService"
>;

export function getDoctorsSeoContent(lang: string): DoctorsSeoContent {
  return DOCTORS_SEO_CONTENT[lang] ?? DOCTORS_SEO_CONTENT.ko;
}

export function buildPhysicianJsonLd(
  doctors: PhysicianSchemaInput[],
  siteName: string,
  baseUrl: string
) {
  return doctors.map((doctor) => ({
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    jobTitle: doctor.jobTitleEn ?? "Dermatologist",
    description: doctor.schemaDescription ?? doctor.intro?.[0] ?? "",
    image: `${baseUrl}${doctor.image}`,
    worksFor: {
      "@type": "MedicalBusiness",
      name: siteName,
      url: baseUrl,
    },
    ...(doctor.alumniOf && {
      alumniOf: doctor.alumniOf.map((alumnus) => ({
        "@type": "EducationalOrganization",
        name: alumnus.name,
        ...(alumnus.url && { url: alumnus.url }),
      })),
    }),
    ...(doctor.memberOf && {
      memberOf: doctor.memberOf.map((membership) => ({
        "@type": "Organization",
        name: membership.name,
        ...(membership.url && { url: membership.url }),
      })),
    }),
    ...(doctor.award && { award: doctor.award }),
    ...(doctor.sameAs && { sameAs: doctor.sameAs }),
    ...(doctor.availableService && {
      availableService: doctor.availableService.map((service) => ({
        "@type": "MedicalProcedure",
        name: service,
      })),
    }),
  }));
}

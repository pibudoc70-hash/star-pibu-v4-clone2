/**
 * doctors-data.ts — 의료진 정적 데이터
 *
 * [R12-P1-2] DoctorsSection.tsx에서 데이터 레이어 분리
 * - 이미지 URL, Doctor 타입, doctors 배열을 별도 파일로 관리
 * - DoctorsSection은 표현(렌더링)만 담당
 */
import React from "react";
import { Award, GraduationCap, Stethoscope, Zap } from "lucide-react";

// ── CDN 기반 이미지 URL ──────────────────────────────────────────────────────

export const DR_JO_IMAGE_DESKTOP_JPG =
  "/manus-storage/dr-jo_5bffd5d8.webp";
export const DR_JO_IMAGE_MOBILE_WEBP = "/manus-storage/dr-jo_5bffd5d8.webp";

export const DR_WOO_IMAGE_DESKTOP_JPG =
  "/manus-storage/dr-woo_290d95d4.webp";
export const DR_WOO_IMAGE_MOBILE_WEBP = "/manus-storage/dr-woo_290d95d4.webp";

export const DR_LEE_IMAGE_DESKTOP_JPG =
  "/manus-storage/dr-lee_72d3f92b.webp";
export const DR_LEE_IMAGE_MOBILE_WEBP = "/manus-storage/dr-lee_72d3f92b.webp";

export const DR_JO_CARD_IMAGE =
  "/manus-storage/dr-jo_5bffd5d8.webp";

// ── 디자인 토큰 ──────────────────────────────────────────────────────────────
export const GOLD = "#d2ac67";
export const GOLD_LIGHT = "#f9f3e8";
export const GOLD_MID = "#e8d5a3";

// ── 타입 ─────────────────────────────────────────────────────────────────────
export interface Doctor {
  id: number;
  slug: string;
  name: string;
  nameEn: string;
  title: string;
  image: string;
  cardImage?: string;
  cardImagePosition?: string;
  mobileImage?: string;
  mobileObjectPosition?: string;
  badge: string;
  intro: string[];
  credentials: { icon: React.ElementType; label: string; text: string }[];
  specialties: string[];
  /** 공식 학술 DB 또는 병원 연구 페이지로 교차 확인된 연구·발표·연수 활동 */
  researchActivities?: DoctorResearchActivity[];
  /** 대만 번체 전용 연구·발표·연수 활동 번역 */
  researchActivitiesZhTw?: DoctorResearchActivity[];

  // ── JSON-LD 스키마 전용 필드 (신규) ──
  /** schema.org Person.jobTitle (영문) */
  jobTitleEn?: string;
  /** schema.org Person.description — 검색엔진용 요약 */
  schemaDescription?: string;
  /** schema.org Person.alumniOf */
  alumniOf?: { name: string; url?: string }[];
  /** schema.org Person.memberOf */
  memberOf?: { name: string; url?: string }[];
  /** schema.org Person.award */
  award?: string[];
  /** schema.org Person.sameAs */
  sameAs?: string[];
  /** schema.org Person.availableService */
  availableService?: string[];
}

export interface DoctorResearchActivity {
    title: string;
    detail: string;
    sourceLabel: string;
    sourceUrl: string;
}

// ── 의료진 데이터 ─────────────────────────────────────────────────────────────
export const doctors: Doctor[] = [
  {
    id: 0,
    slug: "cho",
    name: "조시형 원장",
    nameEn: "Dr. JO SI-HYUNG",
    title: "피부과 전문의 · 의학박사",
    image: DR_JO_IMAGE_DESKTOP_JPG,
    cardImage: DR_JO_CARD_IMAGE,
    cardImagePosition: "center 15%",
    mobileImage: DR_JO_IMAGE_MOBILE_WEBP,
    badge: "원장",
    intro: [
      "2006년 부산 서면에서 첫 진료를 시작한 이래, 어느덧 20년이 넘는 시간 동안 수많은 환자분들의 피부 고민을 마주해 왔습니다.",
      "피부 치료는 단순히 장비를 사용하는 기술이 아니라, 환자의 피부 상태를 정확히 읽어내는 '안목'에서 시작됩니다. 무리한 시술보다는 가장 안전하고 자연스러운 결과를 지향합니다.",
      "피부과 전문의로서 상담부터 시술, 통증과 마취 관리에 이르는 전 과정을 직접 살피며 개인 상태에 맞는 진료 계획을 안내합니다.",
      "앞으로도 변함없이 정직하고 숙련된 진료로 여러분의 피부 건강을 지켜드리겠습니다.",
    ],
    credentials: [
      { icon: Award, label: "자격", text: "피부과 전문의" },
      { icon: GraduationCap, label: "학력", text: "부산대학병원 피부과 수련" },
      { icon: GraduationCap, label: "학력", text: "인제대 피부과 교수역임" },
      { icon: GraduationCap, label: "학력", text: "인제대, 부산대 외래교수역임" },
      { icon: Award, label: "경력", text: "부산경남울산피부과의사회 회장 역임" },
      { icon: Zap, label: "자문의", text: "써마지 FLX 자문의" },
      { icon: Award, label: "경력", text: "미국 피부과 학회 정회원(AAD)" },
      { icon: Stethoscope, label: "현직", text: "현) 스타피부과 원장" },
    ],
    specialties: [
      "눈밑지방재배치", "리프팅", "울쎄라", "써마지",
      "흉터치료", "색소치료", "백반증", "문신제거", "보톡스", "필러",
    ],
    researchActivities: [
      {
        title: "액취증·다한증 치료 연구",
        detail: "액취증·다한증 치료 관련 공동연구로, PubMed에서 저자 Si-Hyung Cho와 논문 서지를 확인할 수 있습니다.",
        sourceLabel: "PubMed",
        sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/16681657/",
      },
      {
        title: "융합성 망상 유두종증 항생제 치료 증례",
        detail: "JAAD에 게재된 융합성 망상 유두종증의 항생제 치료 증례 연구입니다.",
        sourceLabel: "PubMed",
        sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/11260541/",
      },
      {
        title: "한관종 절연침 치료 연구",
        detail: "표피 손상을 줄이는 절연침을 이용한 한관종 치료 관련 국제 학술지 연구입니다.",
        sourceLabel: "PubMed",
        sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/20711282/",
      },
      {
        title: "남성형 탈모 임상 연구",
        detail: "대한피부과학회지에 수록된 남성형 탈모 임상 양상 연구입니다.",
        sourceLabel: "스타피부과 연구·발표",
        sourceUrl: "/research",
      },
      {
        title: "고주파 주사요법 라이브 시연",
        detail: "대경피부미용치료 심포지엄에서 이마·미간·하안검 주름 치료 관련 라이브 시연과 발표를 진행했습니다.",
        sourceLabel: "스타피부과 연구·발표",
        sourceUrl: "/research",
      },
      {
        title: "아시아 미용피부외과 학술대회 초청 발표",
        detail: "Asian Academy of Cosmetic & Dermatologic Surgery에서 미용피부과·피부외과 주제로 초청 발표했습니다.",
        sourceLabel: "스타피부과 연구·발표",
        sourceUrl: "/research",
      },
      {
        title: "국내 피부과 학회 임상 발표",
        detail: "대한피부과학회 학술대회에서 희귀 증례와 흉터 레이저박피·프락셀 병합치료 관련 공동 발표를 확인할 수 있습니다.",
        sourceLabel: "스타피부과 연구·발표",
        sourceUrl: "/research",
      },
      {
        title: "해외 전문가 과정 및 연수",
        detail: "미국·브라질·독일·싱가포르에서 국소마취 지방흡입, 지방이식, 화학박피, 실리프팅 관련 전문가 과정을 이수했습니다.",
        sourceLabel: "스타피부과 연구·발표",
        sourceUrl: "/research",
      },
    ],
    researchActivitiesZhTw: [
      { title: "腋臭與多汗症治療研究", detail: "這項腋臭與多汗症治療的共同研究，可於 PubMed 以作者 Si-Hyung Cho 查閱論文書目。", sourceLabel: "PubMed", sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/16681657/" },
      { title: "融合性網狀乳頭瘤症的抗生素治療病例", detail: "這是刊登於 JAAD、探討融合性網狀乳頭瘤症抗生素治療病例的研究。", sourceLabel: "PubMed", sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/11260541/" },
      { title: "以絕緣針治療汗管瘤的研究", detail: "這是關於使用絕緣針治療汗管瘤、以減少表皮損傷的國際期刊研究。", sourceLabel: "PubMed", sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/20711282/" },
      { title: "男性型落髮臨床研究", detail: "這是收錄於《大韓皮膚科學會誌》的男性型落髮臨床表現研究。", sourceLabel: "STAR皮膚科研究與發表", sourceUrl: "/research" },
      { title: "高頻注射療法現場示範", detail: "於大慶皮膚美容治療研討會，進行額頭、眉間與下眼瞼皺紋治療的現場示範與發表。", sourceLabel: "STAR皮膚科研究與發表", sourceUrl: "/research" },
      { title: "亞洲美容皮膚外科學術大會受邀發表", detail: "於 Asian Academy of Cosmetic & Dermatologic Surgery 以美容皮膚科與皮膚外科為主題受邀發表。", sourceLabel: "STAR皮膚科研究與發表", sourceUrl: "/research" },
      { title: "國內皮膚科學會臨床發表", detail: "可確認於大韓皮膚科學會學術大會共同發表罕見病例及疤痕雷射磨皮與飛梭雷射合併治療。", sourceLabel: "STAR皮膚科研究與發表", sourceUrl: "/research" },
      { title: "海外專家課程與研修", detail: "於美國、巴西、德國及新加坡完成局部麻醉抽脂、脂肪移植、化學換膚與埋線拉提相關專家課程。", sourceLabel: "STAR皮膚科研究與發表", sourceUrl: "/research" },
    ],

    // ── JSON-LD 스키마 전용 필드 ──
    jobTitleEn: "Dermatologist, MD, PhD",
    schemaDescription:
      "20년 이상의 임상 경험을 보유한 피부과 전문의. 눈밑지방재배치 4,000례 이상의 경험으로 국내 최고 수준의 기술을 자랑합니다. 써마지 FLX 공식 자문의로 활동 중입니다.",
    alumniOf: [
      { name: "부산대학교 의과대학", url: "https://med.pusan.ac.kr" },
      { name: "인제대학교 의과대학", url: "https://med.inje.ac.kr" },
    ],
    memberOf: [
      { name: "대한피부과학회", url: "https://www.derma.or.kr" },
      { name: "대한피부과의사회", url: "https://www.kda.or.kr" },
      { name: "미국피부과학회(AAD)", url: "https://www.aad.org" },
      { name: "부산경남울산피부과의사회" },
    ],
    award: [
      "써마지 FLX 공식 자문의 위촉",
      "눈밑지방재배치 4,000례 달성",
    ],
    sameAs: [
      "https://www.youtube.com/@starpibu",
      "https://blog.naver.com/starpibu",
      "https://instagram.com/starpibu",
    ],
    availableService: [
      "눈밑지방재배치", "울쎄라피 프라임", "써마지 FLX",
      "리주란힐러", "피코레이저", "흉터치료",
    ],
  },
  {
    id: 1,
    slug: "woo",
    name: "우혜진 원장",
    nameEn: "Dr. WOO HYE-JIN",
    title: "피부과 전문의",
    image: DR_WOO_IMAGE_DESKTOP_JPG,
    cardImage: DR_WOO_IMAGE_DESKTOP_JPG,
    cardImagePosition: "center 15%",
    mobileImage: DR_WOO_IMAGE_MOBILE_WEBP,
    badge: "원장",
    intro: [
      "피부과 전문의로서 환자분들의 피부 건강을 최우선으로 생각합니다.",
      "상담부터 시술, 통증과 마취 관리까지 피부과 전문의가 직접 확인하며 개인 상태에 맞는 진료 계획을 안내합니다.",
      "정확한 진단과 맞춤형 치료를 통해 최고의 결과를 제공하기 위해 노력하겠습니다.",
    ],
    credentials: [
      { icon: Award, label: "자격", text: "피부과 전문의" },
      { icon: GraduationCap, label: "학력", text: "카톨릭의대 피부과 수련" },
      { icon: GraduationCap, label: "학력", text: "카톨릭의대 피부과 외래교수 역임" },
      { icon: Stethoscope, label: "학회", text: "대한 피부과 학회 정회원" },
      { icon: Stethoscope, label: "학회", text: "미국 피부과 학회 정회원(AAD)" },
      { icon: Award, label: "경력", text: "전) 고운세상 김양제 피부과원장" },
    ],
    specialties: [
      "리프팅", "울쎄라", "써마지", "흉터치료",
      "색소치료", "피부질환", "문신제거", "손발톱무좀", "보톡스",
    ],
    researchActivities: [
      {
        title: "두피 분절상 신경섬유종증 증례 보고",
        detail: "가톨릭대학교 소속 저자로 확인되는 피부과 증례 보고이며, KCI에서 논문 서지를 확인할 수 있습니다.",
        sourceLabel: "KCI",
        sourceUrl: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART000885244",
      },
      {
        title: "선형 국소 탄력섬유증 증례 보고",
        detail: "가톨릭대학교 의과대학 피부과 소속 Hye Jin Woo 저자로 확인되는 피부과 증례 논문입니다.",
        sourceLabel: "PubMed",
        sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/10759963/",
      },
    ],
    researchActivitiesZhTw: [
      { title: "頭皮節段型神經纖維瘤症病例報告", detail: "這是可確認作者所屬為天主教大學的皮膚科病例報告，論文書目可於 KCI 查閱。", sourceLabel: "KCI", sourceUrl: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART000885244" },
      { title: "線狀局限性彈力纖維症病例報告", detail: "這是作者所屬為天主教大學醫學院皮膚科的 Hye Jin Woo 皮膚科病例論文。", sourceLabel: "PubMed", sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/10759963/" },
    ],

    // ── JSON-LD 스키마 전용 필드 ──
    jobTitleEn: "Dermatologist, MD",
    schemaDescription:
      "카톨릭의대에서 수련한 피부과 전문의. 리프팅, 울쎄라피 프라임, 써마지 FLX 등 최신 장비를 활용한 시술에 전문성을 갖추고 있습니다.",
    alumniOf: [
      { name: "카톨릭대학교 의과대학", url: "https://med.catholic.ac.kr" },
    ],
    memberOf: [
      { name: "대한피부과학회", url: "https://www.derma.or.kr" },
      { name: "대한피부과의사회", url: "https://www.kda.or.kr" },
      { name: "미국피부과학회(AAD)", url: "https://www.aad.org" },
    ],
    award: [
      "카톨릭의대 피부과 외래교수 역임",
    ],
    sameAs: [
      "https://www.youtube.com/@starpibu",
      "https://blog.naver.com/starpibu",
      "https://instagram.com/starpibu",
    ],
    availableService: [
      "울쎄라피 프라임", "써마지 FLX", "리주란힐러",
      "피코레이저", "흉터치료", "색소치료",
    ],
  },
  {
    id: 2,
    slug: "lee",
    name: "이기욱 원장",
    nameEn: "Dr. LEE GI-WOOK",
    title: "피부과 전문의 · 의학박사",
    image: DR_LEE_IMAGE_DESKTOP_JPG,
    cardImage: DR_LEE_IMAGE_DESKTOP_JPG,
    cardImagePosition: "center 15%",
    mobileImage: DR_LEE_IMAGE_MOBILE_WEBP,
    badge: "원장",
    intro: [
      "의학박사로서 최신 피부과학 지식을 바탕으로 환자분들께 최고 수준의 의료 서비스를 제공합니다.",
      "피부과 전문의가 상담부터 시술, 통증과 마취 관리까지 직접 살피고 개인 상태에 맞는 진료 계획을 안내합니다.",
      "안전하고 효과적인 치료를 통해 여러분의 피부 건강을 지켜드리겠습니다.",
    ],
    credentials: [
      { icon: Award, label: "자격", text: "피부과 전문의" },
      { icon: GraduationCap, label: "학력", text: "고신대학교 의과대학 의학박사" },
      { icon: GraduationCap, label: "학력", text: "고신대학교 의과대학 피부과 외래교수" },
      { icon: Stethoscope, label: "학회", text: "대한 피부과학회 정회원" },
      { icon: Stethoscope, label: "학회", text: "대한 피부과의사회 정회원" },
      { icon: Award, label: "경력", text: "전) 아름다운피부과 원장" },
    ],
    specialties: [
      "리프팅", "울쎄라", "써마지", "색소치료",
      "백반증", "피부질환", "문신제거", "손발톱무좀",
    ],
    // ── JSON-LD 스키마 전용 필드 ──
    jobTitleEn: "Dermatologist, MD, PhD",
    schemaDescription:
      "고신대학교 의과대학 의학박사. 리프팅, 색소치료, 백반증 치료 등 다양한 피부질환 치료에 전문성을 갖추고 있습니다.",
    alumniOf: [
      { name: "고신대학교 의과대학", url: "https://med.ksu.ac.kr" },
    ],
    memberOf: [
      { name: "대한피부과학회", url: "https://www.derma.or.kr" },
      { name: "대한피부과의사회", url: "https://www.kda.or.kr" },
    ],
    award: [
      "고신대학교 의과대학 피부과 외래교수 역임",
    ],
    sameAs: [
      "https://www.youtube.com/@starpibu",
      "https://blog.naver.com/starpibu",
      "https://instagram.com/starpibu",
    ],
    availableService: [
      "울쓰라피 프라임", "써마지 FLX", "색소치료",
      "백반증", "피부질환", "흥터치료",
    ],
  },
];

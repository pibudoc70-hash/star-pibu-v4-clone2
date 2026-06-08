/**
 * Research Page - 연구 및 발표 활동
 *
 * [PAGE LIFECYCLE] 한국어 전용 정적 페이지
 * - route: /research (App.tsx live)
 * - canonical: /research
 * - 본문: 조시형 원장의 논문·학회 발표 정적 데이터 (한국어 전용)
 * - noindex: 없음 (전체 색인 허용)
 *
 * [DATA SOURCE] 공식 블로그 + PubMed + Google Scholar + KCI
 *
 * 국제 SCI/SCIE 저널 게재 논문:
 *   1. Tumescent liposuction with dermal curettage for treatment of axillary osmidrosis
 *      and hyperhidrosis — Dermatologic Surgery 32(4):505-511, 2006 (PMID: 16681657, 인용 116회)
 *   2. Six cases of confluent and reticulated papillomatosis alleviated by various antibiotics
 *      — J Am Acad Dermatol 44(4):652-655, 2001 (PMID: 11260541, 인용 128회)
 *   3. Syringomas treated by intralesional insulated needles without epidermal damage
 *      — Annals of Dermatology 22(3):367-369, 2010 (PMID: 20711282, 인용 30회)
 *   4. Scrotal eczema-like lesion of secondary syphilis in an HIV-positive patient
 *      — Acta Dermato-Venereologica 85(6):536-537, 2005 (PMID: 16396809)
 *   5. Treatment of molluscum contagiosum with topical diphencyprone therapy
 *      — Acta Dermato-Venereologica 85(6):529-530, 2005 (PMID: 16396805)
 *   6. Idiopathic calcinosis of the areola of the nipple
 *      — Journal of Dermatology 27(2):121-123, 2000 (PMID: 10721661)
 *   7. A Case of Multiple Agminated Spitz Nevi Showing Desmoplastic Changes
 *      — Korean Journal of Dermatology, 1998
 *
 * 국내 학술지 게재 논문:
 *   8.  A Clinical Study of Androgenetic Alopecia — Korean Journal of Dermatology 42:1431-1439, 2004
 *   9.  흉터에서 레이저박피와 프락셀 병합치료 — 대한피부과학회지 44(2), 2006
 *   10. 압박성 탈모증의 임상적 고찰 — 대한피부과학회지 43(9), 2005
 *   11. PMMA로 치료한 칼자국상 흉터 — 대한피부과학회지
 */
import MainLayout from "@/components/MainLayout";
import SeoHead from "@/components/SeoHead";

// ── 논문 데이터 ──────────────────────────────────────────────────────────────
interface Paper {
  id: number;
  title: string;
  titleEn?: string;
  journal: string;
  year: string;
  authors: string;
  detail: string;
  category: "international" | "domestic";
  pmid?: string;
  doi?: string;
  citations?: number;
}

const PAPERS: Paper[] = [
  // ── 국제 SCI/SCIE 저널 ──────────────────────────────────────────────────
  {
    id: 1,
    title: "액취증·다한증에 대한 튜메슨트 지방흡입 및 진피소파술 치료",
    titleEn: "Tumescent Liposuction with Dermal Curettage for Treatment of Axillary Osmidrosis and Hyperhidrosis",
    journal: "Dermatologic Surgery",
    year: "2006",
    authors: "Lee D, Cho Si-Hyung, Kim YC, Park JH, Lee SS, Park SW",
    detail: "43명 환자를 대상으로 튜메슨트 지방흡입 + 진피소파술 병합치료의 효과를 분석. 72.1%에서 우수~양호 결과 확인. 미국피부외과학회 공식 저널 게재. Vol.32(4):505-511.",
    category: "international",
    pmid: "16681657",
    doi: "10.1111/j.1524-4725.2006.32103.x",
    citations: 116,
  },
  {
    id: 2,
    title: "다양한 항생제로 호전된 융합성 망상 유두종증 6례",
    titleEn: "Six Cases of Confluent and Reticulated Papillomatosis Alleviated by Various Antibiotics",
    journal: "Journal of the American Academy of Dermatology (JAAD)",
    year: "2001",
    authors: "Jang HS, Oh CK, Cha JH, Cho Si-Hyung, Kwon KS",
    detail: "미노사이클린·퓨시딘산·클라리스로마이신 등 다양한 항생제로 호전된 융합성 망상 유두종증 6례 보고. 항생제 치료가 CRP의 1차 치료임을 제안. Vol.44(4):652-655.",
    category: "international",
    pmid: "11260541",
    doi: "10.1067/mjd.2001.112577",
    citations: 128,
  },
  {
    id: 3,
    title: "표피 손상 없이 병변 내 절연 침으로 치료한 한관종",
    titleEn: "Syringomas Treated by Intralesional Insulated Needles without Epidermal Damage",
    journal: "Annals of Dermatology",
    year: "2010",
    authors: "Hong SK, Lee HJ, Cho Si-Hyung, Seo JK, Lee D, Sung HS",
    detail: "절연 침을 이용한 병변 내 치료로 표피 손상 없이 한관종을 선택적으로 제거하는 방법 보고. 2례 증례 보고. Vol.22(3):367-369.",
    category: "international",
    pmid: "20711282",
    doi: "10.5021/ad.2010.22.3.367",
    citations: 30,
  },
  {
    id: 4,
    title: "HIV 양성 환자에서 습진 유사 병변으로 나타난 2기 매독",
    titleEn: "Scrotal Eczema-like Lesion of Secondary Syphilis in an HIV-positive Patient",
    journal: "Acta Dermato-Venereologica",
    year: "2005",
    authors: "Kang SH, Lee D, Park JH, Kang MS, Cho Si-Hyung, Park SW",
    detail: "HIV 양성 환자에서 음낭 습진 유사 병변으로 발현된 2기 매독 증례 보고. 비전형적 피부 발현 형태의 임상적 의의 기술. Vol.85(6):536-537.",
    category: "international",
    pmid: "16396809",
    citations: 15,
  },
  {
    id: 5,
    title: "국소 다이펜시프론 요법으로 치료한 전염성 연속종",
    titleEn: "Treatment of Molluscum Contagiosum with Topical Diphencyprone Therapy",
    journal: "Acta Dermato-Venereologica",
    year: "2005",
    authors: "Kang SH, Lee D, Park JH, Cho Si-Hyung, Lee SS, Park SW",
    detail: "국소 다이펜시프론(DPCP) 면역요법을 이용한 전염성 연속종 치료 효과 보고. 소아·성인 환자 대상 임상 연구. Vol.85(6):529-530.",
    category: "international",
    pmid: "16396805",
    citations: 27,
  },
  {
    id: 6,
    title: "유두 유륜의 특발성 석회증",
    titleEn: "Idiopathic Calcinosis of the Areola of the Nipple",
    journal: "Journal of Dermatology",
    year: "2000",
    authors: "Oh CK, Kwon KS, Cho Si-Hyung, Jang HS",
    detail: "유두 유륜 부위에 발생한 특발성 석회증 증례 보고. 음낭 석회증과 유사한 임상 양상을 보이는 희귀 증례. Vol.27(2):121-123.",
    category: "international",
    pmid: "10721661",
    citations: 17,
  },
  {
    id: 7,
    title: "섬유형성 변화를 보이는 다발성 집합성 Spitz 모반 1례",
    titleEn: "A Case of Multiple Agminated Spitz Nevi Showing Desmoplastic Changes",
    journal: "Korean Journal of Dermatology",
    year: "1998",
    authors: "Yim CS, Cho Si-Hyung, Jang HS, Kwon KS",
    detail: "16세 남아의 얼굴 우측에 발생한 다발성 집합성 Spitz 모반 증례. 섬유형성 기질 내 진피 전층에 분포하는 모반 세포 확인. 국내 최초 보고.",
    category: "international",
    pmid: undefined,
    citations: 2,
  },
  // ── 국내 학술지 ──────────────────────────────────────────────────────────
  {
    id: 8,
    title: "남성형 탈모증의 임상적 고찰",
    titleEn: "A Clinical Study of Androgenetic Alopecia",
    journal: "대한피부과학회지 (Korean Journal of Dermatology)",
    year: "2004",
    authors: "강효준, 강승훈, 이상석, 조시형, 박성욱",
    detail: "인제대 부산백병원 피부과에서 7년간(1997–2003) 진료한 남성형 탈모증 환자 1,500명의 임상 양상 분석. 연령·가족력·치료 방법 등 체계적 고찰. Vol.42:1431-1439.",
    category: "domestic",
  },
  {
    id: 9,
    title: "흉터에서 레이저박피와 프락셀 병합치료",
    journal: "대한피부과학회지",
    year: "2006",
    authors: "성재영, 조시형, 우혜진, 임정준, 허준, 김양제",
    detail: "흉터 치료 시 레이저 박피술과 프락셀(Fraxel) 레이저 병합치료의 임상적 효과 비교 연구. Vol.44(2).",
    category: "domestic",
  },
  {
    id: 10,
    title: "압박성 탈모증의 임상적 고찰",
    journal: "대한피부과학회지",
    year: "2005",
    authors: "이드보라, 강미선, 이상석, 조시형, 박성욱",
    detail: "Pressure Alopecia(압박성 탈모증)의 임상 양상 및 치료 결과에 대한 체계적 고찰. SCOPUS 등재. Vol.43(9).",
    category: "domestic",
  },
  {
    id: 11,
    title: "PMMA로 치료한 칼자국상 흉터",
    journal: "대한피부과학회지",
    year: "2000년대",
    authors: "조시형 외",
    detail: "PMMA(폴리메틸메타크릴레이트) 필러를 이용한 칼자국 형태의 흉터 치료 효과 및 임상 결과 보고.",
    category: "domestic",
  },
];

// ── 학회 발표 데이터 ──────────────────────────────────────────────────────────
interface Presentation {
  id: number;
  title: string;
  event: string;
  year: string;
  detail: string;
}

const PRESENTATIONS: Presentation[] = [
  {
    id: 1,
    title: "Internal Radiofrequency Therapy for Forehead Frown and Lower Eyelid Wrinkles",
    event: "대경피부미용치료 심포지엄 라이브 시연",
    year: "2004",
    detail: "고주파 주사 요법을 이용한 이마·미간·하안검 주름 치료 라이브 시연 및 임상 결과 발표",
  },
  {
    id: 2,
    title: "Cosmetic Dermatology & Dermatologic Surgery",
    event: "6th Asian Academy of Cosmetic & Dermatologic Surgery",
    year: "2004",
    detail: "아시아 미용피부과·피부외과 학술대회 초청 연자 발표",
  },
  {
    id: 3,
    title: "미용피부외과 최신 지견",
    event: "2004 피부미용외과 학회",
    year: "2004",
    detail: "국내 피부미용외과 학회 초청 강연 참여",
  },
  {
    id: 4,
    title: "우측 제3수지 근위 추벽 내측에 발생한 심재성 수장족저 사마귀 1예",
    event: "대한피부과학회 제57차 춘계학술대회 (일반포스터)",
    year: "2005",
    detail: "박정훈, 이드보라, 이상석, 조시형, 박성욱 공동 발표. 희귀 임상 증례 보고",
  },
  {
    id: 5,
    title: "흉터에서 레이저박피와 프락셀 병합치료",
    event: "대한피부과학회 제58차 학술대회",
    year: "2006",
    detail: "성재영, 조시형, 우혜진, 임정준, 허준, 김양제 공동 발표. 흉터 치료 병합요법의 임상 결과 발표",
  },
];

// ── 해외 연수 데이터 ──────────────────────────────────────────────────────────
interface Training {
  id: number;
  title: string;
  location: string;
  detail: string;
}

const TRAININGS: Training[] = [
  {
    id: 1,
    title: "Klein's Tumescent Liposuction Course",
    location: "미국",
    detail: "튜메슨트 용액을 이용한 국소마취 지방흡입술 창시자 Dr. Klein 주최 전문가 과정 이수",
  },
  {
    id: 2,
    title: "FAMI Basic and Advanced Course",
    location: "미국",
    detail: "지방 주입 미용 시술(Fat Autograft Muscle Injection) 기초 및 고급 과정 이수",
  },
  {
    id: 3,
    title: "Clara Santos's Exoderm Course",
    location: "브라질",
    detail: "Exoderm 화학박피 전문가 과정 이수",
  },
  {
    id: 4,
    title: "Meisher's Liposuction Course",
    location: "독일",
    detail: "독일 Meisher 지방흡입 전문가 과정 이수",
  },
  {
    id: 5,
    title: "Dr. Woofle's Feather Lift Course",
    location: "싱가포르",
    detail: "실 리프팅(Feather Lift) 전문가 과정 이수",
  },
];

// ── 카테고리 뱃지 ─────────────────────────────────────────────────────────────
function CategoryBadge({ category }: { category: Paper["category"] }) {
  if (category === "international") {
    return (
      <span
        className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ backgroundColor: "var(--color-gold-pale)", color: "var(--color-gold-primary)" }}
      >
        국제 저널
      </span>
    );
  }
  return (
    <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
      국내 학술지
    </span>
  );
}

// ── 섹션 헤더 ─────────────────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="mb-10 text-center">
      <div
        className="inline-flex items-center justify-center w-14 h-14 rounded-full text-2xl mb-4"
        style={{ backgroundColor: "var(--color-gold-pale)" }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 text-sm md:text-base">{subtitle}</p>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function Research() {
  const intlPapers = PAPERS.filter((p) => p.category === "international");
  const domPapers = PAPERS.filter((p) => p.category === "domestic");

  return (
    <MainLayout>
      <SeoHead
        title="연구 및 발표 활동 | 스타피부과 조시형 원장"
        description="스타피부과 조시형 원장의 국내외 학술 논문, 학회 발표, 해외 연수 이력을 소개합니다. JAAD·Dermatologic Surgery 등 SCI 국제 저널 7편, 국내 학술지 4편 게재."
        canonical="/research"
        ogUrl="/research"
        ogLocale="ko_KR"
      />

      {/* 페이지 히어로 */}
      <section
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
      >
        <div className="container mx-auto px-4 text-center">
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-3"
            style={{ color: "var(--color-gold-primary)" }}
          >
            Research &amp; Publications
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            연구 및 발표 활동
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            스타피부과 조시형 원장은 20년 이상의 임상 경험을 바탕으로 국내외 학술지에 논문을 게재하고,
            대한피부과학회 및 국제 학술대회에서 연구 결과를 발표해 왔습니다.
          </p>
          {/* 통계 요약 */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {[
              { label: "국제 SCI/SCIE 저널", value: `${intlPapers.length}편` },
              { label: "국내 학술지", value: `${domPapers.length}편` },
              { label: "총 피인용 횟수", value: "200회+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="text-3xl font-bold"
                  style={{ color: "var(--color-gold-primary)" }}
                >
                  {stat.value}
                </p>
                <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 국제 저널 논문 섹션 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeader
            icon="🌐"
            title="국제 학술지 게재 논문"
            subtitle="JAAD·Dermatologic Surgery 등 SCI/SCIE 국제 저명 학술지에 게재된 논문입니다."
          />
          <ol className="space-y-6" aria-label="국제 저널 논문 목록">
            {intlPapers.map((paper) => (
              <li
                key={paper.id}
                className="rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
                style={{ borderLeftWidth: "4px", borderLeftColor: "var(--color-gold-primary)" }}
              >
                <div className="flex flex-wrap items-start gap-2 mb-2">
                  <CategoryBadge category={paper.category} />
                  {paper.citations !== undefined && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                      인용 {paper.citations}회
                    </span>
                  )}
                </div>
                {/* 한국어 제목 */}
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-0.5 leading-snug">
                  {paper.title}
                </h3>
                {/* 영문 제목 */}
                {paper.titleEn && (
                  <p className="text-sm text-gray-500 italic mb-2 leading-snug">{paper.titleEn}</p>
                )}
                {/* 저널명 */}
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: "var(--color-gold-primary)" }}
                >
                  {paper.journal}
                </p>
                {/* 상세 설명 */}
                <p className="text-sm text-gray-600 leading-relaxed">{paper.detail}</p>
                {/* PubMed 링크 */}
                {paper.pmid && (
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    aria-label={`PubMed에서 논문 보기 (PMID: ${paper.pmid})`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    PubMed 원문 보기 (PMID: {paper.pmid})
                  </a>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 국내 학술지 논문 섹션 */}
      <section className="py-16" style={{ backgroundColor: "#f8f6f2" }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeader
            icon="📄"
            title="국내 학술지 게재 논문"
            subtitle="대한피부과학회지 등 국내 저명 학술지에 게재된 연구 논문입니다."
          />
          <ol className="space-y-6" aria-label="국내 학술지 논문 목록">
            {domPapers.map((paper) => (
              <li
                key={paper.id}
                className="rounded-xl border border-gray-100 p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                style={{ borderLeftWidth: "4px", borderLeftColor: "#4a90d9" }}
              >
                <div className="flex flex-wrap items-start gap-2 mb-2">
                  <CategoryBadge category={paper.category} />
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-0.5 leading-snug">
                  {paper.title}
                </h3>
                {paper.titleEn && (
                  <p className="text-sm text-gray-500 italic mb-2 leading-snug">{paper.titleEn}</p>
                )}
                <p className="text-sm font-semibold text-blue-700 mb-1">{paper.journal}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{paper.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 학회 발표 섹션 */}
      <section className="py-16" style={{ backgroundColor: "var(--color-gold-pale)" }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeader
            icon="🎤"
            title="주요 학회 초청 강연 및 발표"
            subtitle="국내외 피부과 학술대회에서의 초청 강연 및 연구 발표 이력입니다."
          />
          <ol className="space-y-5" aria-label="학회 발표 목록">
            {PRESENTATIONS.map((pres) => (
              <li
                key={pres.id}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500 font-medium">{pres.event}</span>
                </div>
                <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1 leading-snug">
                  {pres.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{pres.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 해외 연수 섹션 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeader
            icon="✈️"
            title="해외 전문가 연수"
            subtitle="세계 최고 전문가들로부터 이수한 해외 전문가 과정입니다."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" role="list" aria-label="해외 연수 목록">
            {TRAININGS.map((tr) => (
              <div
                key={tr.id}
                role="listitem"
                className="rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "var(--color-gold-pale)", color: "var(--color-gold-primary)" }}
                  >
                    {tr.location}
                  </span>
                </div>
                <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1">{tr.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{tr.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 소속 학회 섹션 */}
      <section className="py-16" style={{ backgroundColor: "var(--color-gold-pale)" }}>
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeader
            icon="🏛️"
            title="소속 학회 및 단체"
            subtitle="조시형 원장이 정회원으로 활동 중인 국내외 학술 단체입니다."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "대한피부과학회 정회원",
              "대한비만학회 정회원",
              "대한코스메틱피부과학회 정회원",
              "대한임상메조테라피연구회 회원",
              "미국피부과학회 정회원 (AAD)",
              "대한미용피부외과학회 정회원",
              "대한레이저학회 정회원",
              "부산경남 피부과 개원의 협의회 학술이사",
              "부산경남 피부과 지회 이사",
            ].map((org, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm"
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: "var(--color-gold-primary)" }}
                  aria-hidden="true"
                />
                <span className="text-sm text-gray-700 font-medium">{org}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

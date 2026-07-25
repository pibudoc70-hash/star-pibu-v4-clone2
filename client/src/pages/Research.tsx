/**
 * Research Page - 연구 및 발표 활동
 *
 * [PAGE LIFECYCLE] 다국어 지원 페이지 (ko/en/ja/zh)
 * - routes: /research, /en/research, /ja/research, /zh/research
 * - canonical: /{lang}/research (ko는 /research)
 * - 본문: t.researchPage 기반 i18n 다국어 번역
 * - noindex: 없음 (전체 색인 허용)
 *
 * [DATA SOURCE] 공식 블로그 + PubMed + Google Scholar + KCI
 */
import MainLayout from "@/components/MainLayout";
import SeoHead, { buildHreflangs, LANG_TO_OG_LOCALE } from "@/components/SeoHead";
import { buildBreadcrumbJsonLd, buildFAQPageJsonLd, BASE_URL, buildResearcherJsonLd, buildScholarlyArticleListJsonLd, JsonLdSchema } from "@/lib/seoHelpers";
import { useLang } from "@/contexts/LangContext";

// ── 논문 메타데이터 (번역 불가 고정 데이터) ────────────────────────────────────
interface PaperMeta {
  id: number;
  titleEn?: string;
  journal: string;
  year: string;
  authors: string;
  category: "international" | "domestic";
  pmid?: string;
  doi?: string;
  citations?: number;
}

const PAPER_META: PaperMeta[] = [
  {
    id: 1,
    titleEn: "Tumescent Liposuction with Dermal Curettage for Treatment of Axillary Osmidrosis and Hyperhidrosis",
    journal: "Dermatologic Surgery",
    year: "2006",
    authors: "Lee D, Cho Si-Hyung, Kim YC, Park JH, Lee SS, Park SW",
    category: "international",
    pmid: "16681657",
    doi: "10.1111/j.1524-4725.2006.32103.x",
    citations: 116,
  },
  {
    id: 2,
    titleEn: "Six Cases of Confluent and Reticulated Papillomatosis Alleviated by Various Antibiotics",
    journal: "Journal of the American Academy of Dermatology (JAAD)",
    year: "2001",
    authors: "Jang HS, Oh CK, Cha JH, Cho Si-Hyung, Kwon KS",
    category: "international",
    pmid: "11260541",
    doi: "10.1067/mjd.2001.112577",
    citations: 128,
  },
  {
    id: 3,
    titleEn: "Syringomas Treated by Intralesional Insulated Needles without Epidermal Damage",
    journal: "Annals of Dermatology",
    year: "2010",
    authors: "Hong SK, Lee HJ, Cho Si-Hyung, Seo JK, Lee D, Sung HS",
    category: "international",
    pmid: "20711282",
    doi: "10.5021/ad.2010.22.3.367",
    citations: 30,
  },
  {
    id: 4,
    titleEn: "Scrotal Eczema-like Lesion of Secondary Syphilis in an HIV-positive Patient",
    journal: "Acta Dermato-Venereologica",
    year: "2005",
    authors: "Kang SH, Lee D, Park JH, Kang MS, Cho Si-Hyung, Park SW",
    category: "international",
    pmid: "16396809",
    citations: 15,
  },
  {
    id: 5,
    titleEn: "Treatment of Molluscum Contagiosum with Topical Diphencyprone Therapy",
    journal: "Acta Dermato-Venereologica",
    year: "2005",
    authors: "Kang SH, Lee D, Park JH, Cho Si-Hyung, Lee SS, Park SW",
    category: "international",
    pmid: "16396805",
    citations: 27,
  },
  {
    id: 6,
    titleEn: "Idiopathic Calcinosis of the Areola of the Nipple",
    journal: "Journal of Dermatology",
    year: "2000",
    authors: "Oh CK, Kwon KS, Cho Si-Hyung, Jang HS",
    category: "international",
    pmid: "10721661",
    citations: 17,
  },
  {
    id: 7,
    titleEn: "A Case of Multiple Agminated Spitz Nevi Showing Desmoplastic Changes",
    journal: "Korean Journal of Dermatology",
    year: "1998",
    authors: "Yim CS, Cho Si-Hyung, Jang HS, Kwon KS",
    category: "international",
    citations: 2,
  },
  {
    id: 8,
    titleEn: "A Clinical Study of Androgenetic Alopecia",
    journal: "대한피부과학회지 (Korean Journal of Dermatology)",
    year: "2004",
    authors: "강효준, 강승훈, 이상석, 조시형, 박성욱",
    category: "domestic",
  },
  {
    id: 9,
    journal: "대한피부과학회지",
    year: "2006",
    authors: "성재영, 조시형, 우혜진, 임정준, 허준, 김양제",
    category: "domestic",
  },
  {
    id: 10,
    journal: "대한피부과학회지",
    year: "2005",
    authors: "이드보라, 강미선, 이상석, 조시형, 박성욱",
    category: "domestic",
  },
  {
    id: 11,
    journal: "대한피부과학회지",
    year: "2000년대",
    authors: "조시형 외",
    category: "domestic",
  },
];

// ── 카테고리 뱃지 ─────────────────────────────────────────────────────────────
function CategoryBadge({ category, labelIntl, labelDomestic }: {
  category: "international" | "domestic";
  labelIntl: string;
  labelDomestic: string;
}) {
  if (category === "international") {
    return (
      <span
        className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ backgroundColor: "var(--color-gold-pale)", color: "var(--color-gold-primary)" }}
      >
        {labelIntl}
      </span>
    );
  }
  return (
    <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
      {labelDomestic}
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
  const { t, lang } = useLang();
  const rp = t.researchPage;

  const intlMeta = PAPER_META.filter((p) => p.category === "international");
  const domMeta = PAPER_META.filter((p) => p.category === "domestic");

  // i18n 번역 데이터와 메타데이터 병합
  const intlPapers = intlMeta.map((meta) => ({
    ...meta,
    ...rp.papers.find((p) => p.id === meta.id),
  }));
  const domPapers = domMeta.map((meta) => ({
    ...meta,
    ...rp.papers.find((p) => p.id === meta.id),
  }));

  const canonicalPath = lang === "ko" ? "/research" : `/${lang}/research`;
  const hreflangs = buildHreflangs("/research", "/en/research", "/ja/research", "/zh/research");

  // AEO: 논문 목록에 현재 언어 제목 주입
  const papersForJsonLd = PAPER_META.map((meta) => {
    const localized = rp.papers.find((p: { id: number; title?: string }) => p.id === meta.id);
    return { ...meta, resolvedTitle: localized?.title };
  });

  const researchJsonLd: JsonLdSchema[] = [
    buildBreadcrumbJsonLd([
      {
        name: lang === "en" ? "Home" : lang === "ja" ? "ホーム" : lang === "zh" ? "首页" : "홈",
        url: BASE_URL + "/",
      },
      { name: rp.heroTitle, url: BASE_URL + canonicalPath },
    ]),
    buildResearcherJsonLd(),
    buildScholarlyArticleListJsonLd(papersForJsonLd),
  ];

  // 한국어 페이지에만 FAQ 추가
  if (lang === "ko") {
    researchJsonLd.push(
      buildFAQPageJsonLd([
        {
          question: "부산에서 국제 학술지에 논문을 게재한 피부과 전문의가 있나요?",
          answer:
            "부산 서면 스타피부과 조시형 대표원장은 JAAD(Journal of the American Academy of Dermatology), Dermatologic Surgery, Annals of Dermatology, Acta Dermato-Venereologica, Journal of Dermatology 등 SCI/SCIE 국제 저명 학술지에 7편의 논문을 게재했습니다. PubMed에서 PMID로 원문을 확인할 수 있습니다.",
        },
        {
          question: "조시형 원장의 논문 인용 실적은 어느 정도인가요?",
          answer:
            "국제 학술지 게재 논문의 누적 인용 횟수는 200회 이상입니다. 대표적으로 융합성 망상 유두종증 항생제 치료 논문(JAAD, 2001)이 128회, 액취증·다한증 튜메슨트 지방흡입 및 진피소파술 논문(Dermatologic Surgery, 2006)이 116회 인용되었습니다.",
        },
        {
          question: "액취증·다한증 수술 논문을 발표한 부산 피부과는 어디인가요?",
          answer:
            "부산 서면 스타피부과 조시형 원장은 2006년 미국피부외과학회 공식 저널 Dermatologic Surgery에 액취증·다한증에 대한 튜메슨트 지방흡입 및 진피소파술 병합치료 논문(PMID 16681657)을 게재했습니다. 43명 환자를 대상으로 72.1%에서 우수~양호한 결과를 확인한 연구입니다.",
        },
        {
          question: "남성형 탈모 임상 연구 실적이 있는 부산 피부과가 있나요?",
          answer:
            "조시형 원장은 인제대 부산백병원 피부과에서 7년간(1997–2003) 진료한 남성형 탈모증 환자 1,500명의 임상 양상을 분석한 연구를 대한피부과학회지(Vol.42:1431-1439, 2004)에 게재했습니다.",
        },
        {
          question: "조시형 원장의 해외 전문가 연수 경력은 어떻게 되나요?",
          answer:
            "미국에서 튜메슨트 국소마취 지방흡입술 창시자 Dr. Klein 주최 전문가 과정과 지방 주입 미용 시술(FAMI) 기초·고급 과정을 이수했고, 브라질 Exoderm 화학박피 과정, 독일 Meisher 지방흡입 과정, 싱가포르 실 리프팅(Feather Lift) 과정을 이수했습니다.",
        },
      ]),
    );
  }

  return (
    <MainLayout>
      <SeoHead
        title={lang === "ko"
          ? "연구 및 발표 활동 | 스타피부과 조시형 원장"
          : lang === "en"
          ? "Research & Publications | Star Dermatology Dr. Cho Si-Hyung"
          : lang === "ja"
          ? "研究・発表活動 | スター皮膚科 趙時亨院長"
          : "研究及学术活动 | Star皮肤科 赵时亨院长"}
        description={rp.heroDesc}
        canonical={canonicalPath}
        ogUrl={canonicalPath}
        ogLocale={LANG_TO_OG_LOCALE[lang]}
        hreflangs={hreflangs}
        keywords={
          lang === "ko"
            ? "부산피부과 논문, 조시형 원장 논문, 피부과 전문의 연구실적, PubMed 부산피부과, 대한피부과학회지, 액취증 논문, 남성형 탈모 연구, JAAD 논문"
            : lang === "en"
            ? "Busan dermatology research, Dr. Cho Si-Hyung publications, PubMed dermatologist Korea, JAAD paper, dermatologic surgery research"
            : lang === "ja"
            ? "釜山皮膚科 論文, 趙時亨 研究, 皮膚科専門医 学術活動, PubMed 韓国皮膚科"
            : "釜山皮肤科 论文, 赵时亨 研究, 皮肤科专科 学术活动, PubMed 韩国皮肤科"
        }
        jsonLd={researchJsonLd}
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
            {rp.heroEyebrow}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {rp.heroTitle}
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {rp.heroDesc}
          </p>
          {/* 통계 요약 */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {[
              { label: rp.statIntl, value: `${intlMeta.length}` },
              { label: rp.statDomestic, value: `${domMeta.length}` },
              { label: rp.statCitations, value: "200+" },
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
          {/* PubMed 저자 검색 버튼 */}
          <div className="mt-8">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/?term=Cho+Si-Hyung%5BAuthor%5D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-colors hover:opacity-80"
              style={{
                backgroundColor: "rgba(210,172,103,0.15)",
                color: "var(--color-gold-primary)",
              }}
            >
              {lang === "ko" ? "PubMed에서 전체 논문 검색"
               : lang === "en" ? "Search all papers on PubMed"
               : lang === "ja" ? "PubMedで全論文を検索"
               : "在PubMed搜索全部论文"}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* 국제 저널 논문 섹션 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeader
            icon="🌐"
            title={rp.intlJournalTitle}
            subtitle={rp.intlJournalSubtitle}
          />
          <ol className="space-y-6" aria-label={rp.intlJournalTitle}>
            {intlPapers.map((paper) => (
              <li
                key={paper.id}
                className="rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
                style={{ borderLeftWidth: "4px", borderLeftColor: "var(--color-gold-primary)" }}
              >
                <div className="flex flex-wrap items-start gap-2 mb-2">
                  <CategoryBadge
                    category={paper.category}
                    labelIntl={rp.badgeIntl}
                    labelDomestic={rp.badgeDomestic}
                  />
                  {paper.citations !== undefined && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                      {rp.badgeCitations.replace("{n}", String(paper.citations))}
                    </span>
                  )}
                </div>
                {/* 번역된 제목 */}
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-0.5 leading-snug">
                  {"title" in paper && paper.title ? paper.title : paper.titleEn ?? ""}
                </h3>
                {/* 영문 제목 (ko가 아닐 때는 숨김) */}
                {lang === "ko" && paper.titleEn && (
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
                {"detail" in paper && paper.detail && (
                  <p className="text-sm text-gray-600 leading-relaxed">{paper.detail}</p>
                )}
                {/* PubMed 링크 */}
                {paper.pmid && (
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    aria-label={rp.pubmedLabel.replace("{pmid}", paper.pmid)}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {rp.pubmedLabel.replace("{pmid}", paper.pmid)}
                  </a>
                )}
                {paper.doi && (
                  <a
                    href={`https://doi.org/${paper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5"
                      />
                    </svg>
                    <span className="break-all">DOI: {paper.doi}</span>
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
            title={rp.domesticJournalTitle}
            subtitle={rp.domesticJournalSubtitle}
          />
          <ol className="space-y-6" aria-label={rp.domesticJournalTitle}>
            {domPapers.map((paper) => (
              <li
                key={paper.id}
                className="rounded-xl border border-gray-100 p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                style={{ borderLeftWidth: "4px", borderLeftColor: "#4a90d9" }}
              >
                <div className="flex flex-wrap items-start gap-2 mb-2">
                  <CategoryBadge
                    category={paper.category}
                    labelIntl={rp.badgeIntl}
                    labelDomestic={rp.badgeDomestic}
                  />
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-0.5 leading-snug">
                  {"title" in paper && paper.title ? paper.title : paper.titleEn ?? ""}
                </h3>
                {lang === "ko" && paper.titleEn && (
                  <p className="text-sm text-gray-500 italic mb-2 leading-snug">{paper.titleEn}</p>
                )}
                <p className="text-sm font-semibold text-blue-700 mb-1">{paper.journal}</p>
                {"detail" in paper && paper.detail && (
                  <p className="text-sm text-gray-600 leading-relaxed">{paper.detail}</p>
                )}
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
            title={rp.presentationsTitle}
            subtitle={rp.presentationsSubtitle}
          />
          <ol className="space-y-5" aria-label={rp.presentationsTitle}>
            {rp.presentations.map((pres) => (
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
            title={rp.trainingsTitle}
            subtitle={rp.trainingsSubtitle}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" role="list" aria-label={rp.trainingsTitle}>
            {rp.trainings.map((tr) => (
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
            title={rp.membershipsTitle}
            subtitle={rp.membershipsSubtitle}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rp.memberships.map((org, idx) => (
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

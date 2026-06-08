/**
 * Research Page - 연구 및 발표 활동
 *
 * [PAGE LIFECYCLE] 한국어 전용 정적 페이지
 * - route: /research (App.tsx live)
 * - canonical: /research
 * - 본문: 조시형 원장의 논문·학회 발표 정적 데이터 (한국어 전용)
 * - noindex: 없음 (전체 색인 허용)
 *
 * [DATA SOURCE] 공식 블로그 (blog.naver.com/starpibu/90117899646) + KISS 학술 DB
 * 논문 목록:
 *   1. PMMA로 치료한 칼자국상 흉터 (대한피부과학회지)
 *   2. 이마와 미간 주름에 대한 International Radiofrequency 주사의 치료 효과에 대한
 *      임상, 조직학적 고찰 (대한피부과학회 제56차 학술대회 발표)
 *   3. 흉터에서 레이저박피와 프락셀 병합치료 (대한피부과학회지 44권 2호, 2006)
 *   4. 겨드랑이 액취증과 다한증에서의 지방흡입과 진피소파술을 이용한 치료
 *      (미국피부외과학회지 / J Eur Acad Dermatol Venereol, 2008)
 *   5. 압박성 탈모증의 임상적 고찰 (대한피부과학회지 43권 9호, 2005)
 * 주요 학회 초청강연:
 *   1. 대경피부미용치료 심포지엄 라이브 시연
 *      (Internal radiofrequency therapy for forehead frown and lower eyelid wrinkles)
 *   2. 6th Asian Academy of Cosmetic & Dermatologic Surgery
 *   3. 2004 피부미용외과 학회
 *   4. 대한피부과학회 제57차 춘계학술대회 포스터 발표 (2005)
 */
import MainLayout from "@/components/MainLayout";
import SeoHead from "@/components/SeoHead";

// ── 논문 데이터 ──────────────────────────────────────────────────────────────
interface Paper {
  id: number;
  title: string;
  journal: string;
  year: string;
  detail: string;
  category: "journal" | "conference";
}

const PAPERS: Paper[] = [
  {
    id: 1,
    title: "PMMA로 치료한 칼자국상 흉터",
    journal: "대한피부과학회지",
    year: "2000년대",
    detail: "PMMA(폴리메틸메타크릴레이트) 필러를 이용한 칼자국 형태의 흉터 치료 효과 및 임상 결과 보고",
    category: "journal",
  },
  {
    id: 2,
    title: "흉터에서 레이저박피와 프락셀 병합치료",
    journal: "대한피부과학회지 제44권 제2호",
    year: "2006",
    detail: "성재영, 조시형, 우혜진, 임정준, 허준, 김양제 공저. 흉터 치료 시 레이저 박피술과 프락셀 병합치료의 임상적 효과 비교 연구",
    category: "journal",
  },
  {
    id: 3,
    title: "겨드랑이 액취증과 다한증에서의 지방흡입과 진피소파술을 이용한 치료",
    journal: "미국피부외과학회지 (J Eur Acad Dermatol Venereol)",
    year: "2008",
    detail: "Tumescent superficial liposuction with curettage for treatment of axillary bromhidrosis. 43명 환자 대상 임상 연구, 72.1%에서 우수~양호 결과 확인. 국제 SCI급 저널 게재",
    category: "journal",
  },
  {
    id: 4,
    title: "압박성 탈모증의 임상적 고찰",
    journal: "대한피부과학회지 제43권 제9호",
    year: "2005",
    detail: "이드보라, 강미선, 이상석, 조시형, 박성욱 공저. Pressure Alopecia의 임상 양상 및 치료 결과에 대한 체계적 고찰 (SCOPUS 등재)",
    category: "journal",
  },
  {
    id: 5,
    title: "이마와 미간 주름에 대한 International Radiofrequency 주사의 치료 효과에 대한 임상, 조직학적 고찰",
    journal: "대한피부과학회 제56차 학술대회",
    year: "2004",
    detail: "고주파(Radiofrequency) 주사 요법을 이용한 이마·미간 주름 개선 효과의 임상적·조직학적 분석 발표",
    category: "conference",
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
  if (category === "journal") {
    return (
      <span
        className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ backgroundColor: "var(--color-gold-pale)", color: "var(--color-gold-primary)" }}
      >
        학술지 게재
      </span>
    );
  }
  return (
    <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
      학회 발표
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
  return (
    <MainLayout>
      <SeoHead
        title="연구 및 발표 활동 | 스타피부과 조시형 원장"
        description="스타피부과 조시형 원장의 학술 논문, 학회 발표, 해외 연수 이력을 소개합니다. 대한피부과학회지, 미국피부외과학회지 등 국내외 저명 학술지 게재 및 국제 학회 초청 강연 이력."
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
        </div>
      </section>

      {/* 논문 섹션 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeader
            icon="📄"
            title="학술 논문"
            subtitle="국내외 저명 학술지에 게재된 연구 논문 목록입니다."
          />
          <ol className="space-y-6" aria-label="학술 논문 목록">
            {PAPERS.map((paper) => (
              <li
                key={paper.id}
                className="rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
                style={{ borderLeftWidth: "4px", borderLeftColor: "var(--color-gold-primary)" }}
              >
                <div className="flex flex-wrap items-start gap-2 mb-2">
                  <CategoryBadge category={paper.category} />
                  <span className="text-xs text-gray-400 font-medium">{paper.year}</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 leading-snug">
                  {paper.title}
                </h3>
                <p
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--color-gold-primary)" }}
                >
                  {paper.journal}
                </p>
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
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "var(--color-gold-pale)", color: "var(--color-gold-primary)" }}
                  >
                    {pres.year}
                  </span>
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

/**
 * TreatmentPage - 시술별 독립 상세 페이지
 * URL: /treatments/:slug
 * SEO: 각 페이지마다 고유 title, description, JSON-LD MedicalProcedure 스키마 적용
 */
import { useEffect } from "react";
import { useLang } from "@/contexts/LangContext";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Clock, RefreshCw, CalendarDays, MessageCircle, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";

// ── 시술 데이터 타입 ──────────────────────────────────────────────────────────
interface TreatmentData {
  slug: string;
  name: string;
  nameEn: string;
  category: string;
  badge?: string;
  badgeColor?: string;
  image: string;
  cardBannerImage?: string;
  desc: string;
  detail: string;
  effect: string;
  caution: string;
  time: string;
  recovery: string;
  sessions: string;
  youtubeUrl?: string;
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  // JSON-LD
  schemaBodyLocation?: string;
}

// ── 시술 데이터 ───────────────────────────────────────────────────────────────
const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e";
const CDN2 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB";

const TREATMENT_DATA: Record<string, TreatmentData> = {
  ulthera: {
    slug: "ulthera",
    name: "울쎄라피 프라임",
    nameEn: "Ultherapy Prime",
    category: "리프팅·탄력",
    badge: "인기",
    badgeColor: "#C8860A",
    image: `${CDN}/울쎄라피프라임_1_0daba485.png`,
    cardBannerImage: `${CDN2}/sub_03_01_52_3b05391b.jpg`,
    desc: "리프팅 만족도 1위 울쎄라피의 최신 업그레이드 버전. 더 넓은 면적을 빠르게 커버하며 탁월한 리프팅 효과.",
    detail: "울쎄라피 프라임은 기존 울쎄라피 대비 더 넓은 면적을 빠르게 커버하는 최신 업그레이드 버전입니다. 집속 초음파(HIFU) 에너지를 피부 깊은 층인 SMAS(근막층)까지 정확하게 전달하여 피부 속에서부터 리프팅 효과를 유도합니다. FDA 승인을 받은 비수술 리프팅 시술로, 시술 후 즉시 일상 복귀가 가능합니다. 시술 효과는 시술 후 2~3개월부터 서서히 나타나며 6개월까지 지속적으로 개선됩니다.",
    effect: "얼굴 리프팅, 턱선 개선, 피부 탄력 향상, 주름 완화, SMAS층 자극",
    caution: "시술 중 일시적인 열감이나 따끔거림이 있을 수 있습니다. 시술 후 1~2일간 약간의 붓기나 붉기가 나타날 수 있으나 정상 반응입니다. 시술 후 자외선 차단제를 매일 사용하세요.",
    time: "60~90분",
    recovery: "당일 일상",
    sessions: "1~2회 (6~12개월 간격)",
    youtubeUrl: "https://www.youtube.com/embed/VeADRwws0e8",
    schemaBodyLocation: "얼굴, 목, 데콜테",
    seoTitle: "울쎄라피 프라임 | 부산 스타피부과 - 리프팅 만족도 1위",
    seoDescription: "부산 서면 스타피부과의 울쎄라피 프라임 시술 안내. HIFU 집속 초음파로 SMAS층까지 자극하는 FDA 승인 비수술 리프팅. 시술 당일 일상 복귀 가능. 피부과 전문의 직접 시술.",
    seoKeywords: "울쎄라피 프라임, 울쎄라, HIFU, 부산리프팅, 부산피부과, 스타피부과, 서면피부과, 비수술리프팅, 피부탄력, 주름개선",
  },
  thermage: {
    slug: "thermage",
    name: "써마지 FLX",
    nameEn: "Thermage FLX",
    category: "리프팅·탄력",
    badge: "자문의",
    badgeColor: "#9C5FA5",
    image: `${CDN}/써마지FLX_20a90462.png`,
    cardBannerImage: `${CDN2}/sub_03_01_24_9648a599.jpg`,
    desc: "4세대 고주파 리프팅의 정점. 피부 깊은 층 콜라겐을 자극해 탄력 개선과 주름 완화에 탁월. 조시형 원장 공식 자문의.",
    detail: "써마지 FLX는 4세대 고주파(RF) 리프팅 장비로, 피부 깊은 층의 콜라겐을 가열하여 즉각적인 수축 효과와 함께 장기적인 콜라겐 재생을 유도합니다. 스타피부과 조시형 원장은 써마지 공식 자문의로, 최적의 파라미터 설정과 시술 노하우를 보유하고 있습니다. 진동 기능(AccuREP)이 탑재되어 시술 중 불편감을 최소화하며, 시술 후 즉시 일상 복귀가 가능합니다. 눈가·볼·목·바디 등 다양한 부위에 적용 가능합니다.",
    effect: "피부 탄력 개선, 얼굴 리프팅, 주름 완화, 콜라겐 재생, 눈가·목 탄력 개선",
    caution: "시술 중 열감이 느껴지는 것은 정상 반응입니다. 시술 후 일시적인 붉기나 붓기가 나타날 수 있으나 수 시간 내 가라앉습니다. 임산부, 금속 임플란트 보유자는 시술 전 반드시 상담이 필요합니다.",
    time: "45~90분",
    recovery: "당일 일상",
    sessions: "1~2회 (6~12개월 간격)",
    youtubeUrl: "https://www.youtube.com/embed/epfNHt3wJ1k",
    schemaBodyLocation: "얼굴, 목, 눈가, 바디",
    seoTitle: "써마지 FLX | 부산 스타피부과 - 조시형 원장 공식 자문의",
    seoDescription: "부산 서면 스타피부과의 써마지 FLX 시술 안내. 4세대 고주파 리프팅으로 콜라겐 재생 및 피부 탄력 개선. 조시형 원장 공식 자문의. 시술 당일 일상 복귀 가능.",
    seoKeywords: "써마지 FLX, 써마지, Thermage, 고주파리프팅, 부산리프팅, 부산피부과, 스타피부과, 서면피부과, 콜라겐재생, 피부탄력",
  },
  "under-eye-fat": {
    slug: "under-eye-fat",
    name: "눈밑지방재배치",
    nameEn: "Under-eye Fat Repositioning",
    category: "눈밑·성형",
    badge: "BEST",
    badgeColor: "#4A6FA5",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/treat-eyelid-new-6Qge5k6ndWTS5nFXDZSXRF.webp",
    cardBannerImage: `${CDN2}/눈밑지방_4c0b8a51.png`,
    desc: "4,000례 이상의 경험으로 다크서클과 눈밑 볼록함을 동시에 개선. 지방을 재배치하여 자연스러운 눈밑 라인을 만드는 스타피부과 대표 시술.",
    detail: "눈밑지방재배치술은 눈 아래 과잉 축적된 지방을 제거하지 않고 꺼진 눈물고랑(tear trough) 부위로 재배치하여 다크서클과 눈밑 볼록함을 동시에 개선하는 시술입니다. 스타피부과는 4,000례 이상의 풍부한 시술 경험을 보유하고 있으며, 절개를 최소화하여 흉터 위험을 낮춥니다. 지방을 제거하지 않고 재배치하는 방식이므로 시술 후 지방 공동이나 외관 변형이 거의 없고, 자연스러운 눈밑 라인을 기대할 수 있습니다.",
    effect: "다크서클 개선, 눈밑 볼록함 해소, 눈물고랑 음영 완화, 자연스러운 눈밑 라인, 피로해 보이는 인상 개선",
    caution: "시술 후 3~7일간 붓기와 멍이 나타날 수 있으며, 완전한 결과 확인까지 4~8주가 소요됩니다. 시술 후 1주일간 격렬한 운동과 음주를 피하고, 엎드려 자는 자세를 삼가세요. 눈을 비비거나 강하게 누르는 행동을 피하고, 선글라스 착용으로 자외선을 차단하세요.",
    time: "30~60분",
    recovery: "3~7일",
    sessions: "1회 (반영구적 효과)",
    youtubeUrl: "https://www.youtube.com/embed/Y2ia8A-nBjw",
    schemaBodyLocation: "눈밑, 눈물고랑",
    seoTitle: "눈밑지방재배치 | 부산 스타피부과 - 4,000례 이상 경험",
    seoDescription: "부산 서면 스타피부과의 눈밑지방재배치 시술 안내. 4,000례 이상의 풍부한 경험. 다크서클과 눈밑 볼록함을 동시에 개선하는 스타피부과 대표 시술. 피부과 전문의 직접 시술.",
    seoKeywords: "눈밑지방재배치, 다크서클, 눈밑볼록, 눈물고랑, 부산피부과, 스타피부과, 서면피부과, 눈밑시술, 눈밑지방, 피부과전문의",
  },
};

// ── JSON-LD 구조화 데이터 생성 ─────────────────────────────────────────────
function buildJsonLd(t: TreatmentData) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "name": t.name,
    "alternateName": t.nameEn,
    "description": t.desc,
    "procedureType": "https://schema.org/CosmeticProcedure",
    "image": t.image,
    "url": `https://www.star-pibu.com/treatments/${t.slug}`,
    "bodyLocation": t.schemaBodyLocation || "피부",
    "preparation": t.caution,
    "followup": `회복 기간: ${t.recovery}. ${t.caution}`,
    "howPerformed": t.detail,
    "provider": {
      "@type": "MedicalBusiness",
      "name": "스타피부과",
      "url": "https://www.star-pibu.com",
      "telephone": "051-818-2300",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "서면로 74 아이온시티빌딩 4층",
        "addressLocality": "부산진구",
        "addressRegion": "부산광역시",
        "postalCode": "47252",
        "addressCountry": "KR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 35.1567,
        "longitude": 129.0596
      }
    }
  };
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function TreatmentPage() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { lang } = useLang();
  const slug = params.slug;
  const treatment = TREATMENT_DATA[slug];

  useEffect(() => {
    if (!treatment) return;

    // 페이지 제목
    document.title = treatment.seoTitle;

    // 메타 description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", treatment.seoDescription);

    // 메타 keywords
    let metaKw = document.querySelector('meta[name="keywords"]');
    if (!metaKw) {
      metaKw = document.createElement("meta");
      metaKw.setAttribute("name", "keywords");
      document.head.appendChild(metaKw);
    }
    metaKw.setAttribute("content", treatment.seoKeywords);

    // OG 태그
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", treatment.seoTitle);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", treatment.seoDescription);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", `https://www.star-pibu.com/treatments/${slug}`);
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute("content", treatment.image);

    // JSON-LD 구조화 데이터
    const existingLd = document.getElementById("treatment-page-jsonld");
    if (existingLd) existingLd.remove();
    const ldScript = document.createElement("script");
    ldScript.id = "treatment-page-jsonld";
    ldScript.type = "application/ld+json";
    ldScript.text = JSON.stringify(buildJsonLd(treatment));
    document.head.appendChild(ldScript);

    return () => {
      const ld = document.getElementById("treatment-page-jsonld");
      if (ld) ld.remove();
    };
  }, [treatment, slug]);

  // 시술을 찾지 못한 경우
  if (!treatment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600 text-lg">시술 정보를 찾을 수 없습니다.</p>
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-[#4A6FA5] hover:underline"
        >
          <ArrowLeft size={16} />
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  const effectItems = treatment.effect.split(",").map((s) => s.trim()).filter(Boolean);
  const cautionItems = treatment.caution.split(".").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* ── 히어로 배너 ── */}
      <div
        className="relative text-white overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a2a4a 0%, #2D4A7A 60%, #4A6FA5 100%)",
          minHeight: "280px",
        }}
      >
        {/* 배경 이미지 */}
        {treatment.cardBannerImage && (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(${treatment.cardBannerImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        <div className="relative container mx-auto px-4 py-12">
          {/* 뒤로가기 */}
          <button
            onClick={() => setLocation("/")}
            className="inline-flex items-center gap-2 mb-6 text-white/80 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            홈으로
          </button>

          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold tracking-widest mb-2 text-white/70 uppercase">
                {treatment.nameEn}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{treatment.name}</h1>
              <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-xl">
                {treatment.desc}
              </p>
            </div>
            {treatment.badge && (
              <span
                className="px-4 py-2 rounded-full text-sm font-bold text-white flex-shrink-0"
                style={{ backgroundColor: treatment.badgeColor || "#4A6FA5", opacity: 0.95 }}
              >
                {treatment.badge}
              </span>
            )}
          </div>

          {/* 핵심 정보 3종 */}
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Clock size={15} className="text-white/70" />
              <span className="text-sm text-white/90">{treatment.time}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <RefreshCw size={15} className="text-white/70" />
              <span className="text-sm text-white/90">회복 {treatment.recovery}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <CalendarDays size={15} className="text-white/70" />
              <span className="text-sm text-white/90">{treatment.sessions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid md:grid-cols-5 gap-10 mb-14">
          {/* 이미지 */}
          <div className="md:col-span-2">
            <div className="rounded-2xl overflow-hidden bg-gray-50 shadow-md">
              <OptimizedImage
                src={treatment.image}
                alt={`${treatment.name} 시술 이미지`}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>

          {/* 상세 설명 */}
          <div className="md:col-span-3 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-3" style={{ color: "#1F2937" }}>
                시술 소개
              </h2>
              <p className="text-gray-600 leading-relaxed">{treatment.detail}</p>
            </div>

            {/* 기대 효과 */}
            <div>
              <h2 className="text-xl font-bold mb-3" style={{ color: "#1F2937" }}>
                기대 효과
              </h2>
              <ul className="space-y-2">
                {effectItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: "#4A6FA5" }} />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* YouTube 영상 */}
        {treatment.youtubeUrl && (
          <div className="mb-14">
            <h2 className="text-xl font-bold mb-4" style={{ color: "#1F2937" }}>
              시술 영상
            </h2>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-md">
              <iframe
                width="100%"
                height="100%"
                src={treatment.youtubeUrl}
                title={`${treatment.name} 시술 영상`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* 주의사항 */}
        <div className="mb-14 rounded-2xl p-6 border border-amber-200 bg-amber-50">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: "#92400E" }}>
            <AlertCircle size={20} />
            시술 전후 주의사항
          </h2>
          <ul className="space-y-2">
            {cautionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                <ChevronRight size={14} className="mt-0.5 flex-shrink-0 text-amber-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="https://pf.kakao.com/_HNyGC"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 shadow-md"
            style={{ background: "#FEE500", color: "#1F2937" }}
          >
            <MessageCircle size={20} />
            카카오톡 상담
          </a>
          <a
            href={lang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300"}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 shadow-md text-white"
            style={{ background: "linear-gradient(135deg, #2D4A7A 0%, #4A6FA5 100%)" }}
          >
            <span>📞</span>
            {lang === "ko" ? "051-818-2300" : "+82-51-818-2300"}
          </a>
          <button
            onClick={() => {
              const el = document.getElementById("booking") || document.getElementById("reservation");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              } else {
                setLocation("/#booking");
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 shadow-md text-white"
            style={{ background: "linear-gradient(135deg, #C8860A 0%, #e6a832 100%)" }}
          >
            <CalendarDays size={20} />
            예약 신청
          </button>
        </div>

        {/* 다른 시술 보기 */}
        <div className="mt-14 pt-10 border-t">
          <h2 className="text-lg font-bold mb-6" style={{ color: "#1F2937" }}>
            다른 시술 보기
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.values(TREATMENT_DATA)
              .filter((t) => t.slug !== slug)
              .map((t) => (
                <button
                  key={t.slug}
                  onClick={() => setLocation(`/treatments/${t.slug}`)}
                  className="text-left p-4 rounded-xl border border-gray-200 hover:border-[#4A6FA5] hover:shadow-md transition-all group"
                >
                  <p className="text-xs text-gray-500 mb-1">{t.category}</p>
                  <p className="font-bold text-gray-800 group-hover:text-[#4A6FA5] transition-colors">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{t.desc}</p>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * EquipmentSection - 스타피부과 장비 소개
 *
 * Design Philosophy: Sophisticated Medical Clinic
 * - 사이트 전체 팔레트(#F8FAFC, #81C7C9, #4A6FA5, #1F2937)에 맞게 통일
 * - 섹션 배경: #EEF7F7 (민트 페일) — 다른 섹션과 자연스럽게 연결
 * - 카드 배경: 3가지 톤(네이비 다크 / 블루그레이 미드 / 민트 딥)으로 카테고리 구분
 * - 장비 사진 오른쪽 배치, 영문명+한글명+치료분류 텍스트 왼쪽
 * - 호버 시 하단 설명 오버레이 + 카카오 상담 링크
 */
import { useState } from "react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import OptimizedImage from "@/components/OptimizedImage";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e";

// 사이트 팔레트 기반 카드 배경 톤 (3종)
// A: 딥 네이비  #1F3A5F → #2D4A7A
// B: 블루그레이 #2C3E55 → #3D5A73
// C: 딥 민트    #1A4040 → #1F5252
const TONES = {
  A: { bg: "linear-gradient(135deg, #1F3A5F 0%, #2D4A7A 100%)", text: "#ffffff", tag: "rgba(167,218,220,0.35)", tagText: "#A7DADC" },
  B: { bg: "linear-gradient(135deg, #2C3E55 0%, #3D5A73 100%)", text: "#ffffff", tag: "rgba(167,218,220,0.3)",  tagText: "#A7DADC" },
  C: { bg: "linear-gradient(135deg, #1A4040 0%, #1F5252 100%)", text: "#ffffff", tag: "rgba(167,218,220,0.3)",  tagText: "#A7DADC" },
};

interface Equipment {
  brand: string;
  name: string;
  category: string;
  tone: keyof typeof TONES;
  image: string;
  desc: string;
}

const equipmentList: Equipment[] = [
  // ─── 리프팅 ───
  {
    brand: "CUTERA XEOMIN",
    name: "큐어맥스",
    category: "리프팅",
    tone: "A",
    image: `${CDN}/큐어맥스_baf2c9ec.png`,
    desc: "최신 고강도 집속 초음파 리프팅",
  },
  {
    brand: "MERZ AESTHETICS",
    name: "울쎄라피 프라임",
    category: "리프팅",
    tone: "A",
    image: `${CDN}/울쎄라피프라임_1_798484e7.png`,
    desc: "리프팅 만족도 1위 울쎄라피 최신 버전",
  },
  {
    brand: "THERMAGE FLX",
    name: "써마지 FLX",
    category: "리프팅",
    tone: "B",
    image: `${CDN}/써마지FLX_f1163ff8.png`,
    desc: "조시형 원장 공식 자문의 장비. 고주파 탄력 개선",
  },
  {
    brand: "REVINAS",
    name: "세르프 리프팅",
    category: "리프팅",
    tone: "C",
    image: `${CDN}/세르프_4ade36ff.png`,
    desc: "최신 고강도 RF 리프팅 장비",
  },
  {
    brand: "OLIGIO X",
    name: "올리지오X",
    category: "RF고주파 리프팅",
    tone: "B",
    image: `${CDN}/올리지오X_e1e54986.png`,
    desc: "RF 고주파 리프팅의 새로운 기준",
  },
  {
    brand: "SHURINK UNIVERSE",
    name: "슈링크 유니버스",
    category: "리프팅",
    tone: "A",
    image: `${CDN}/슈링크_77cc74d6.png`,
    desc: "집속 초음파 리프팅의 진화",
  },
  {
    brand: "PROFOUND RF",
    name: "프로파운드",
    category: "리프팅",
    tone: "C",
    image: `${CDN}/프로파운드_481e0c83.png`,
    desc: "진피층 직접 자극 RF 리프팅",
  },
  {
    brand: "TRINITY LIFTONING",
    name: "트리니티 리프토닝",
    category: "리프팅 토닝",
    tone: "B",
    image: `${CDN}/트리니티리프토닝_4ef97ebc.png`,
    desc: "리프팅과 토닝을 동시에",
  },
  {
    brand: "VIRTUE RF",
    name: "버츄RF",
    category: "RF고주파 리프팅",
    tone: "A",
    image: `${CDN}/버츄RF_47204eff.png`,
    desc: "마이크로니들 RF 리프팅",
  },
  {
    brand: "10THERMA",
    name: "텐써마",
    category: "피부탄력 주름개선",
    tone: "C",
    image: `${CDN}/온다_f7d84892.png`,
    desc: "피부 탄력과 주름 개선",
  },
  {
    brand: "ONDA",
    name: "온다 리프팅",
    category: "주름 탄력",
    tone: "B",
    image: `${CDN}/온다_f7d84892.png`,
    desc: "쿨웨이브 기술로 주름 탄력 개선",
  },
  {
    brand: "V-RO",
    name: "브이로 리프팅",
    category: "주름 탄력",
    tone: "A",
    image: `${CDN}/브이로_fb2f8b4c.png`,
    desc: "주름과 탄력을 동시에 개선",
  },
  {
    brand: "ULTHERAPY",
    name: "울쎄라",
    category: "리프팅",
    tone: "A",
    image: `${CDN}/울쎄라_d4b3cefc.jpg`,
    desc: "집속 초음파 리프팅의 원조",
  },
  {
    brand: "EXILIS ULTRA",
    name: "엑실리스 울트라",
    category: "리프팅 타이트닝",
    tone: "B",
    image: `${CDN}/엑실리스 울트라_5449a8ed.png`,
    desc: "RF+초음파 복합 리프팅 타이트닝",
  },
  {
    brand: "LAFERRA",
    name: "라페라 리프팅",
    category: "얼굴탄력 리프팅",
    tone: "C",
    image: `${CDN}/라페라_0cff5f1a.png`,
    desc: "고주파 얼굴 탄력 리프팅",
  },
  {
    brand: "LSSA",
    name: "엘싸",
    category: "초음파 지방흡입",
    tone: "B",
    image: `${CDN}/엘싸_e9085db0.png`,
    desc: "초음파 지방흡입 장비",
  },
  // ─── 여드름·흉터·홍조 ───
  {
    brand: "AVICLEAR",
    name: "아비클리어",
    category: "여드름 치료",
    tone: "C",
    image: `${CDN}/아비클리어_2d9cab50.png`,
    desc: "FDA 승인 여드름 전용 레이저",
  },
  {
    brand: "PLADUO",
    name: "플라듀오 레이저",
    category: "여드름 치료",
    tone: "A",
    image: `${CDN}/플라듀오_6eccf485.png`,
    desc: "여드름 치료 전용 레이저",
  },
  {
    brand: "TIXEL LASER",
    name: "틱셀 레이저",
    category: "여드름 흉터 모공",
    tone: "B",
    image: `${CDN}/틱셀_98a5cbdf.png`,
    desc: "여드름·흉터·모공 개선 레이저",
  },
  {
    brand: "MIRAJET",
    name: "미라젯",
    category: "흉터 안티에이징",
    tone: "C",
    image: `${CDN}/미라젯_9e79e7c4.png`,
    desc: "흉터 안티에이징 레이저",
  },
  {
    brand: "TRIFILL PRO",
    name: "트리필 프로",
    category: "흉터 주름 튼살",
    tone: "A",
    image: `${CDN}/트리필프로_642c1b7b.jpg`,
    desc: "흉터·주름·튼살 복합 치료",
  },
  {
    brand: "ADVATX",
    name: "아드바티엑스",
    category: "흉터 탄력",
    tone: "B",
    image: `${CDN}/아드바Tx_e865914d.png`,
    desc: "흉터 탄력 개선 레이저",
  },
  {
    brand: "EXCEL V+",
    name: "엑셀 V플러스",
    category: "색소·혈관",
    tone: "C",
    image: `${CDN}/엑셀V_5364dd04.png`,
    desc: "혈관·색소 치료의 표준",
  },
  // ─── 색소·문신 제거 ───
  {
    brand: "DISCOVERY PICO",
    name: "디스커버리 피코",
    category: "색소 문신제거",
    tone: "A",
    image: `${CDN}/디스커버리피코_41237d61.png`,
    desc: "피코초 레이저 색소·문신 제거",
  },
  {
    brand: "ENLIGHTEN 3RD",
    name: "인라이튼 루비피코",
    category: "색소치료 문신제거",
    tone: "B",
    image: `${CDN}/인라이튼루비피코_43c3fbfb.png`,
    desc: "3세대 피코초 레이저",
  },
  {
    brand: "STAR WALKER MAQX",
    name: "스타워커 MAQX",
    category: "색소치료",
    tone: "C",
    image: `${CDN}/스타워커_7ba78892.png`,
    desc: "색소 치료 전문 레이저",
  },
  {
    brand: "PICOSURE",
    name: "피코슈어",
    category: "색소 문신제거",
    tone: "A",
    image: `${CDN}/피코슈어_71bad6af.png`,
    desc: "755nm 피코초 레이저",
  },
  {
    brand: "PENTO 9900",
    name: "펜토 9900",
    category: "색소 탄력",
    tone: "B",
    image: `${CDN}/펜토9900_3af14ef2.png`,
    desc: "색소 탄력 복합 치료",
  },
  {
    brand: "JOULE LASER",
    name: "줄 레이저",
    category: "색소 흉터 박피",
    tone: "C",
    image: `${CDN}/힐러_6ec6c8e4.png`,
    desc: "색소·흉터·박피 다목적 레이저",
  },
  {
    brand: "LASMD ULTRA",
    name: "라셈드 울트라",
    category: "피부탄력 재생",
    tone: "A",
    image: `${CDN}/라셈드울트라_9c6e3e6e.png`,
    desc: "피부 탄력 재생 레이저",
  },
  {
    brand: "NEOGEN PLASMA",
    name: "네오젠 플라즈마",
    category: "피부재생",
    tone: "B",
    image: `${CDN}/네오젠플라즈마_9b2b6c29.png`,
    desc: "플라즈마 에너지 피부 재생",
  },
  // ─── 무좀·다한증·액취증 ───
  {
    brand: "EXCEL TOE",
    name: "엑셀 토우",
    category: "손·발톱무좀",
    tone: "C",
    image: `${CDN}/엑셀토우_ee49101f.png`,
    desc: "손·발톱 무좀 전용 레이저",
  },
  {
    brand: "ONYCHOL LASER",
    name: "오니코 레이저",
    category: "발톱무좀",
    tone: "A",
    image: `${CDN}/오니코_c1743b24.png`,
    desc: "발톱 무좀 전용 레이저",
  },
  {
    brand: "MIRADRY FRESH",
    name: "미라드라이 프레쉬",
    category: "다한증 액취증",
    tone: "B",
    image: `${CDN}/미라드라이_9f46ebac.png`,
    desc: "땀샘 영구 제거. 다한증·액취증 동시 해결",
  },
  {
    brand: "DERMASHINE PRO",
    name: "더마샤인 프로",
    category: "보습 탄력",
    tone: "C",
    image: `${CDN}/더마샤인프로_d7a8f2c1.png`,
    desc: "피부 보습 탄력 개선",
  },
];

const categories = ["전체", "리프팅", "RF고주파 리프팅", "여드름·흉터", "색소·문신", "무좀·다한증", "피부재생"];

const categoryMap: Record<string, string[]> = {
  "전체": [],
  "리프팅": ["리프팅", "RF고주파 리프팅", "리프팅 토닝", "주름 탄력", "피부탄력 주름개선", "얼굴탄력 리프팅", "리프팅 타이트닝", "초음파 지방흡입"],
  "RF고주파 리프팅": ["RF고주파 리프팅"],
  "여드름·흉터": ["여드름 치료", "흉터 안티에이징", "흉터 주름 튼살", "흉터 탄력", "여드름 흉터 모공", "색소·혈관"],
  "색소·문신": ["색소 문신제거", "색소치료 문신제거", "색소치료", "색소 탄력", "색소 흉터 박피", "피부탄력 재생"],
  "무좀·다한증": ["손·발톱무좀", "발톱무좀", "다한증 액취증"],
  "피부재생": ["피부재생", "보습 탄력"],
};

export default function EquipmentSection() {
  const [activeCategory, setActiveCategory] = useState("전체");
  const sectionRef = useSectionReveal(0); // 헤더만 reveal, 카드는 탭 전환 애니메이션 별도

  const filtered = activeCategory === "전체"
    ? equipmentList
    : equipmentList.filter((eq) => {
        const allowed = categoryMap[activeCategory] ?? [];
        return allowed.some((c) => eq.category.includes(c) || c.includes(eq.category));
      });

  return (
    <section ref={sectionRef} id="equipment" className="py-12 sm:py-16 md:py-24" style={{ background: "var(--brand-bg-alt, #F5F0EB)" }}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-14 reveal-heading">
          <p
            className="text-sm font-semibold tracking-widest mb-3 font-montserrat"
            style={{ color: "var(--brand-gold, #C4A882)" }}
          >
            PREMIUM LASER EQUIPMENT
          </p>
          <h2
            className="mb-4"
            style={{
              color: "var(--brand-text, #2C2C2C)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 700,
              fontFamily: "'Black Han Sans', 'Noto Sans KR', sans-serif",
            }}
          >
            스타의 장비소개
          </h2>
          <div
            className="mx-auto mb-6"
            style={{
              width: "48px",
              height: "3px",
              background: "linear-gradient(90deg, transparent, #C4A882, transparent)",
              borderRadius: "0",
            }}
          />
          <p className="text-sm max-w-xl mx-auto" style={{ color: "#6B7280" }}>
            2006년 개원 이래 50여 종의 프리미엄 레이저 장비를 도입하여 최상의 치료 결과를 제공합니다.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 md:mb-12">
          {categories.map((cat) => (
            <button type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={
                activeCategory === cat
                  ? {
                      background: "var(--brand-gold, #C4A882)",
                      color: "#ffffff",
                      border: "1px solid var(--brand-gold, #C4A882)",
                    }
                  : {
                      background: "var(--brand-bg, #FAF8F5)",
                      color: "var(--brand-text-mid, #666666)",
                      border: "1px solid rgba(196,168,130,0.25)",
                    }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Equipment Grid */}
        <div key={activeCategory} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {filtered.map((eq, i) => (
            <EquipmentCard
              key={`${activeCategory}-${eq.name}-${i}`}
              eq={eq}
              style={{ animationDelay: `${i * 0.04}s` }}
            />
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-14">
          <p className="text-xs" style={{ color: "#9CA3AF" }}>
            * 장비 구성은 업데이트될 수 있습니다. 자세한 내용은 내원 상담을 통해 확인하세요.
          </p>
        </div>
      </div>
    </section>
  );
}

function EquipmentCard({ eq, style }: { eq: Equipment; style?: React.CSSProperties }) {
  const [imgError, setImgError] = useState(false);
  const tone = TONES[eq.tone];

  return (
    <div
      className="relative overflow-hidden rounded-2xl group cursor-pointer card-fade-in ds-card-lift"
      style={{
        background: tone.bg,
        ...style,
      }}
    >
      {/* 데스크톱: 좌우 레이아웃 / 모바일: 상하 레이아웃 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:min-h-[160px]">
        {/* 텍스트 영역 */}
        <div
          className="flex flex-col justify-center pl-4 pr-3 pt-4 pb-2 sm:pl-6 sm:pr-4 sm:pt-5 sm:pb-3 sm:py-5 z-10 sm:w-[56%]"
        >
          {/* 브랜드명 */}
          <p
            className="text-xs font-semibold tracking-widest mb-2 uppercase font-montserrat"
            style={{ color: tone.tagText, opacity: 0.9 }}
          >
            {eq.brand}
          </p>
          {/* 한글 장비명 */}
          <h3
            className="font-black leading-tight mb-3"
            style={{
              color: "#ffffff",
              fontSize: "clamp(1.1rem, 2.2vw, 1.4rem)",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {eq.name}
          </h3>
          {/* 치료 분류 태그 */}
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold w-fit"
            style={{
              background: tone.tag,
              color: tone.tagText,
              border: `1px solid ${tone.tagText}40`,
              backdropFilter: "blur(4px)",
            }}
          >
            {eq.category}
          </span>
        </div>

        {/* 이미지 영역 */}
        <div
          className="flex items-center justify-center sm:justify-end pb-3 sm:pb-0 sm:pr-3 sm:w-[44%] sm:h-[160px]"
        >
          {!imgError ? (
            <OptimizedImage
              src={eq.image}
              alt={eq.name}
              className="object-contain transition-transform duration-500 group-hover:scale-105"
              style={{
                maxHeight: "90px",
                maxWidth: "110px",
                filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.35))",
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-xl flex items-center justify-center text-xs text-center"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}
            >
              {eq.name}
            </div>
          )}
        </div>
      </div>

      {/* 호버 오버레이: 설명 + 상담 버튼 */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
        style={{
          background: "linear-gradient(to top, rgba(15,30,60,0.88) 0%, rgba(15,30,60,0.4) 60%, transparent 100%)",
        }}
      >
        <p className="text-xs leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.9)" }}>
          {eq.desc}
        </p>
        <a
          href="https://pf.kakao.com/_HNyGC"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold"
          style={{ color: "rgba(255,255,255,0.85)" }}
          onClick={(e) => e.stopPropagation()}
        >
          카카오 상담 →
        </a>
      </div>
    </div>
  );
}

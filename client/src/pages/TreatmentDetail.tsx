/**
 * TreatmentDetail - 시술 상세 페이지
 * 시술의 효과, 시간, 회복 기간, 가격 정보 및 FAQ를 표시합니다.
 */
import { useRoute } from "wouter";
import { ArrowLeft, Clock, RefreshCw, DollarSign, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LangContext";
import OptimizedImage from "@/components/OptimizedImage";
import SeoHead from "@/components/SeoHead";

// FAQ 아코디언 컴포넌트
function FAQAccordion({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-200 overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <p className="text-left font-semibold" style={{ color: "#1F2937" }}>
              {faq.question}
            </p>
            <div style={{ color: "#4A6FA5" }}>
              {openIndex === index ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>
          </button>
          {openIndex === index && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p style={{ color: "#6B7280" }} className="leading-relaxed">
                {faq.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// 모든 시술 데이터를 한 곳에서 관리
const getAllTreatments = () => {
  const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e";

  // 리프팅 시술
  const liftingTreatments = [
    {
      name: "울쎄라피 프라임",
      nameEn: "Ultherapy Prime",
      category: "리프팅·탄력",
      desc: "리프팅 만족도 1위 울쎄라피의 최신 업그레이드 버전. 더 넓은 면적을 빠르게 커버하며 탁월한 리프팅 효과.",
      time: "60~90분",
      recovery: "당일 일상",
      price: "상담 후 결정",
      badge: "인기",
      image: `${CDN}/울쎄라피프라임_1_0daba485.png`,
      effect: "피부 탄력 개선, 주름 완화, 얼굴 윤곽 개선, 콜라겐 생성 유도, 자연스러운 리프팅 효과",
      detailedDesc: "울쎄라피 프라임은 초음파 에너지를 이용하여 피부 깊은 층의 SMAS층까지 자극합니다. 절개 없이 자연스러운 리프팅 효과를 얻을 수 있으며, 시술 후 즉시 일상생활이 가능합니다.",
      faqs: [
        {
          question: "시술 중 통증이 있나요?",
          answer: "울쎄라피 프라임은 초음파를 사용하기 때문에 시술 중 따뜻한 감각과 약간의 따끔거림이 있을 수 있습니다. 개인차가 있지만 대부분 참을 수 있는 수준의 통증입니다. 필요시 마취크림을 사용할 수 있습니다.",
        },
        {
          question: "효과는 얼마나 지속되나요?",
          answer: "울쎄라피 프라임의 효과는 개인차가 있지만 보통 6개월~1년 정도 지속됩니다. 시술 후 3개월부터 효과가 점진적으로 나타나며, 최대 효과는 3~6개월 후에 나타납니다.",
        },
        {
          question: "부작용이 있을까요?",
          answer: "일반적으로 안전한 시술이지만 시술 후 일시적인 부종, 발적, 따끔거림이 있을 수 있습니다. 이러한 증상은 보통 24~48시간 내에 사라집니다. 드물게 신경 손상이 발생할 수 있으므로 경험 많은 의료진에게 시술받는 것이 중요합니다.",
        },
        {
          question: "시술 후 관리는 어떻게 하나요?",
          answer: "시술 직후 냉찜질을 해주면 부종을 줄일 수 있습니다. 24시간 동안 뜨거운 물로 세안하거나 사우나는 피하시고, 자극적인 스킨케어 제품 사용을 피하세요. 자외선 차단은 필수입니다.",
        },
      ],
    },
    {
      name: "울쎄라",
      nameEn: "Ulthera",
      category: "리프팅·탄력",
      desc: "초음파 에너지로 SMAS층까지 자극하는 정통 리프팅. 자연스러운 피부 탄력 회복.",
      time: "60~90분",
      recovery: "당일 일상",
      price: "상담 후 결정",
      badge: null,
      image: `${CDN}/울쎄라_fbd556da.jpg`,
      effect: "피부 탄력 개선, 주름 완화, 얼굴 리프팅, 콜라겐 재생, 피부 톤 개선",
      detailedDesc: "정통 울쎄라는 초음파 에너지를 이용한 비침습적 리프팅 시술입니다. 자연스러운 결과와 빠른 회복이 특징입니다.",
      faqs: [
        {
          question: "시술 중 통증이 있나요?",
          answer: "울쎄라는 초음파 기술을 사용하므로 시술 중 약간의 따뜻함과 따끔거림을 느낄 수 있습니다. 통증은 개인차가 있으며, 필요시 마취크림 사용이 가능합니다.",
        },
        {
          question: "효과는 얼마나 지속되나요?",
          answer: "울쎄라의 효과는 6개월~1년 정도 지속됩니다. 시술 후 2~3주부터 변화를 느낄 수 있으며, 3개월 후 최대 효과를 경험합니다.",
        },
        {
          question: "부작용이 있을까요?",
          answer: "매우 안전한 시술이지만 시술 후 일시적인 부종, 발적이 있을 수 있습니다. 이는 보통 수시간~하루 내에 사라집니다. 드물게 신경 손상이 발생할 수 있습니다.",
        },
        {
          question: "언제부터 일상생활이 가능한가요?",
          answer: "울쎄라는 회복 기간이 거의 없어 시술 직후 바로 일상생활이 가능합니다. 특별한 제한사항은 없지만 24시간 동안 뜨거운 물 사용과 과도한 자외선 노출은 피하세요.",
        },
      ],
    },
    {
      name: "써마지 FLX",
      nameEn: "Thermage FLX",
      category: "리프팅·탄력",
      desc: "4세대 고주파 리프팅의 정점. 피부 깊은 층 콜라겐을 자극해 탄력 개선과 주름 완화에 탁월. 조시형 원장 공식 자문의.",
      time: "45~90분",
      recovery: "당일 일상",
      price: "상담 후 결정",
      badge: "자문의",
      image: `${CDN}/써마지FLX_20a90462.png`,
      effect: "피부 탄력 개선, 주름 완화, 모공 축소, 콜라겐 생성 유도, 즉각적인 리프팅 효과",
      detailedDesc: "써마지 FLX는 4세대 고주파 기술로 피부 깊은 층의 콜라겐을 자극합니다. 시술 직후부터 효과를 느낄 수 있으며, 지속적인 개선이 일어납니다.",
      faqs: [
        {
          question: "시술 중 통증이 있나요?",
          answer: "써마지 FLX는 고주파를 사용하므로 시술 중 따뜻한 열감을 느낍니다. 통증은 최소화되도록 설계되었으며, 개인차에 따라 약간의 따끔거림이 있을 수 있습니다.",
        },
        {
          question: "효과는 얼마나 지속되나요?",
          answer: "써마지 FLX의 효과는 6개월~2년 정도 지속됩니다. 시술 직후부터 효과를 느낄 수 있으며, 3~6개월에 최대 효과에 도달합니다.",
        },
        {
          question: "부작용이 있을까요?",
          answer: "일반적으로 매우 안전한 시술입니다. 시술 후 일시적인 발적, 부종이 있을 수 있지만 보통 수시간 내에 사라집니다. 드물게 화상이나 신경 손상이 발생할 수 있습니다.",
        },
        {
          question: "다른 시술과 함께 받을 수 있나요?",
          answer: "써마지 FLX는 다른 시술과 병행이 가능합니다. 다만 같은 날에 여러 시술을 받으면 피부 자극이 커질 수 있으므로 의료진과 상담 후 결정하세요.",
        },
      ],
    },
  ];

  // 눈밑·성형 시술
  const eyeTreatments = [
    {
      name: "눈밑지방재배치",
      nameEn: "Under-eye Fat Repositioning",
      category: "눈밑·성형",
      desc: "4,000례 이상의 풍부한 경험. 다크서클과 눈밑 볼록함을 동시에 개선하는 스타피부과 대표 시술. 절개 없이 자연스러운 결과.",
      time: "30~60분",
      recovery: "3~7일",
      price: "상담 후 결정",
      badge: "BEST",
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=300&fit=crop",
      effect: "다크서클 개선, 눈밑 볼록함 완화, 피로한 인상 개선, 눈가 윤곽 정리, 자연스러운 결과",
      detailedDesc: "눈밑지방재배치는 절개 없이 눈밑 지방을 재배치하여 다크서클과 볼록함을 동시에 개선합니다. 스타피부과의 대표 시술로 4,000례 이상의 경험을 보유하고 있습니다.",
      faqs: [
        {
          question: "시술 중 통증이 있나요?",
          answer: "국소 마취를 사용하므로 시술 중 통증은 거의 없습니다. 시술 후 약간의 불편함이 있을 수 있지만 진통제로 관리 가능합니다.",
        },
        {
          question: "효과는 얼마나 지속되나요?",
          answer: "눈밑지방재배치의 효과는 반영구적입니다. 한 번의 시술로 장기간 효과를 유지할 수 있으며, 자연스러운 노화 과정에 따라 수년 후 재시술이 필요할 수 있습니다.",
        },
        {
          question: "부작용이 있을까요?",
          answer: "시술 후 부종, 멍, 이물감이 있을 수 있습니다. 이는 1~2주 내에 대부분 사라집니다. 드물게 감염이나 비대칭이 발생할 수 있으므로 경험 많은 의료진에게 받는 것이 중요합니다.",
        },
        {
          question: "회복 기간은 어떻게 되나요?",
          answer: "회복 기간은 3~7일입니다. 시술 후 1주일 동안 눈 부위에 자극을 주지 않도록 주의하세요. 부종을 줄이기 위해 냉찜질과 고개를 높이고 자는 것이 도움됩니다.",
        },
      ],
    },
  ];

  // 색소·문신제거 시술
  const pigmentTreatments = [
    {
      name: "피코레이저",
      nameEn: "Pico Laser",
      category: "색소·문신제거",
      desc: "기미·잡티·문신 제거에 탁월. 피코초 단위의 초단파 레이저로 색소 분해. 주변 조직 손상 최소화.",
      time: "20~40분",
      recovery: "3~5일",
      price: "상담 후 결정",
      badge: "인기",
      image: `${CDN}/피코슈어_20d65c44.png`,
      effect: "기미 제거, 잡티 개선, 문신 제거, 피부 톤 균일화, 색소 침착 완화",
      detailedDesc: "피코레이저는 피코초 단위의 초단파를 이용하여 색소를 분해합니다. 주변 조직 손상을 최소화하면서 효과적인 색소 제거가 가능합니다.",
      faqs: [
        {
          question: "시술 중 통증이 있나요?",
          answer: "피코레이저는 고통스러운 시술입니다. 고무줄로 튕기는 듯한 통증을 느낄 수 있습니다. 마취크림이나 국소 마취를 사용하여 통증을 줄일 수 있습니다.",
        },
        {
          question: "효과는 얼마나 지속되나요?",
          answer: "피코레이저는 색소를 제거하는 시술이므로 효과는 반영구적입니다. 다만 자외선 노출로 인한 새로운 색소 침착은 예방이 필요합니다.",
        },
        {
          question: "부작용이 있을까요?",
          answer: "시술 후 일시적인 발적, 부종, 딱지가 생길 수 있습니다. 이는 1~2주 내에 사라집니다. 드물게 흉터나 색소 침착이 발생할 수 있으므로 시술 후 자외선 차단이 중요합니다.",
        },
        {
          question: "회복 기간은 어떻게 되나요?",
          answer: "회복 기간은 3~5일입니다. 시술 후 딱지가 생기는데 억지로 떼지 않도록 주의하세요. 자연스럽게 떨어질 때까지 기다리고, 그 동안 충분한 보습과 자외선 차단이 필요합니다.",
        },
      ],
    },
    {
      name: "루비피코레이저",
      nameEn: "Ruby Pico Laser",
      category: "색소·문신제거",
      desc: "3세대 피코초 레이저. 기미·잡티·색소 제거에 탁월하며 피부 톤 개선 및 콜라겐 생성 유도.",
      time: "20~40분",
      recovery: "3~5일",
      price: "상담 후 결정",
      badge: "추천",
      image: `${CDN}/인라이튼루비피코_43c3fbfb.png`,
      effect: "기미 제거, 잡티 개선, 피부 톤 균일화, 콜라겐 생성 유도, 피부 탄력 개선",
      detailedDesc: "루비피코레이저는 3세대 피코초 기술로 기미, 잡티, 색소를 효과적으로 제거합니다. 동시에 콜라겐 생성을 유도하여 피부 탄력도 개선됩니다.",
      faqs: [
        {
          question: "시술 중 통증이 있나요?",
          answer: "루비피코레이저는 피코레이저보다 통증이 적은 편입니다. 따뜻한 감각과 약간의 따끔거림을 느낄 수 있으며, 마취크림으로 통증을 줄일 수 있습니다.",
        },
        {
          question: "효과는 얼마나 지속되나요?",
          answer: "루비피코레이저의 효과는 반영구적입니다. 색소 제거 효과는 장기간 유지되며, 동시에 콜라겐 생성으로 인한 피부 탄력 개선도 지속됩니다.",
        },
        {
          question: "부작용이 있을까요?",
          answer: "시술 후 일시적인 발적, 부종이 있을 수 있습니다. 이는 보통 24~48시간 내에 사라집니다. 드물게 색소 침착이나 흉터가 발생할 수 있으므로 시술 후 자외선 차단이 중요합니다.",
        },
        {
          question: "몇 번의 시술이 필요한가요?",
          answer: "색소의 깊이와 정도에 따라 다릅니다. 보통 기미는 3~5회, 잡티는 1~3회 정도의 시술이 필요합니다. 의료진과 상담하여 개인맞춤 치료 계획을 수립하세요.",
        },
      ],
    },
  ];

  // 여드름·흉터·홍조 시술
  const acneTreatments = [
    {
      name: "안면홍조 치료",
      nameEn: "Rosacea Treatment",
      category: "여드름·흉터·홍조",
      desc: "Excel V+ 혈관 레이저로 안면홍조, 모세혈관 확장, 붉은 피부를 효과적으로 개선.",
      time: "20~40분",
      recovery: "1~3일",
      price: "상담 후 결정",
      badge: "특화",
      image: `${CDN}/엑셀V_70001aa7.png`,
      effect: "안면홍조 개선, 모세혈관 확장 감소, 주사비 치료, 피부 탄력 개선, 콜라겐 생성 유도",
      detailedDesc: "Excel V+ 혈관 레이저는 안면홍조와 모세혈관 확장을 효과적으로 개선합니다. 혈관에 선택적으로 작용하여 주변 조직 손상을 최소화합니다.",
      faqs: [
        {
          question: "시술 중 통증이 있나요?",
          answer: "Excel V+ 레이저는 고통스러운 시술입니다. 고무줄로 튕기는 듯한 통증을 느낄 수 있습니다. 마취크림을 사용하여 통증을 줄일 수 있습니다.",
        },
        {
          question: "효과는 얼마나 지속되나요?",
          answer: "안면홍조 치료의 효과는 개인차가 있지만 보통 6개월~1년 정도 지속됩니다. 재발을 방지하기 위해 정기적인 관리가 필요할 수 있습니다.",
        },
        {
          question: "부작용이 있을까요?",
          answer: "시술 후 일시적인 발적, 부종, 멍이 생길 수 있습니다. 이는 보통 1~3일 내에 사라집니다. 드물게 색소 침착이나 흉터가 발생할 수 있습니다.",
        },
        {
          question: "회복 기간은 어떻게 되나요?",
          answer: "회복 기간은 1~3일입니다. 시술 후 냉찜질을 하고 자극적인 제품 사용을 피하세요. 자외선 차단은 필수입니다.",
        },
      ],
    },
  ];

  return [...liftingTreatments, ...eyeTreatments, ...pigmentTreatments, ...acneTreatments];
};

export default function TreatmentDetail() {
  const [match, params] = useRoute("/treatment/:name");
  const [treatment, setTreatment] = useState<{
    name: string;
    nameEn: string;
    category: string;
    desc: string;
    time: string;
    recovery: string;
    price: string;
    badge: string | null;
    image: string;
    effect: string;
    detailedDesc: string;
    faqs: Array<{ question: string; answer: string }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();
  const td = t.treatmentDetail;

  useEffect(() => {
    if (match && params?.name) {
      const decodedName = decodeURIComponent(params.name);
      const allTreatments = getAllTreatments();
      const found = allTreatments.find((tr) => tr.name === decodedName);
      setTreatment(found ?? null);

    }
    setLoading(false);
  }, [match, params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{td.notFound}</h1>
          <a href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft size={16} />
            {td.backToHome}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SeoHead
        title={`${treatment.name} | 부산 스타피부과 - ${treatment.category}`}
        description={`${treatment.name}에 대해 알아보세요. ${treatment.desc} 부산 스타피부과에서 전문의가 직접 시술합니다.`}
        keywords={`${treatment.name}, ${treatment.category}, 부산피부과, 피부시술, 부산리프팅`}
        ogImage={treatment.image}
        canonical={`https://www.star-pibu.com/treatment/${encodeURIComponent(treatment.name)}`}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            "name": treatment.name,
            "description": treatment.detailedDesc || treatment.desc,
            "procedureType": "https://schema.org/CosmeticProcedure",
            "bodyLocation": treatment.category,
            "followup": treatment.recovery,
            "howPerformed": treatment.effect,
            "preparation": `시술 시간: ${treatment.time}`,
            "provider": {
              "@type": "MedicalClinic",
              "name": "스타피부과",
              "url": "https://www.star-pibu.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "부산광역시 부산진구 서면",
                "addressCountry": "KR"
              }
            }
          },
          ...(treatment.faqs && treatment.faqs.length > 0
            ? [{
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": treatment.faqs.map((faq) => ({
                  "@type": "Question",
                  "name": faq.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                  }
                }))
              }]
            : [])
        ]}
      />
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-[#4A6FA5] to-[#2D4A7A] text-white py-8">
        <div className="container">
          <a href="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition">
            <ArrowLeft size={20} />
            {td.backBtn}
          </a>
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <p className="text-sm font-semibold tracking-wider mb-2 opacity-90">{treatment.nameEn}</p>
              <h1 className="text-4xl font-bold mb-2">{treatment.name}</h1>
              <p className="text-sm opacity-90">{treatment.category}</p>
            </div>
            {treatment.badge && (
              <span className="px-4 py-2 rounded-full text-sm font-bold bg-white text-[#4A6FA5]">
                {treatment.badge}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* 이미지 */}
          <div className="md:col-span-1">
            <div className="rounded-2xl overflow-hidden bg-gray-100 h-80 flex items-center justify-center">
              <OptimizedImage
                src={treatment.image}
                alt={treatment.name}
                className="w-full h-full object-cover"
                height={320}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>

          {/* 정보 */}
          <div className="md:col-span-2">
            {/* 설명 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#1F2937" }}>
                {treatment.name}
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "#6B7280" }}>
                {treatment.detailedDesc}
              </p>
            </div>

            {/* 주요 정보 카드 */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* 시술 시간 */}
              <div
                className="rounded-2xl p-6 flex items-start gap-4"
                style={{
                  background: "linear-gradient(135deg, #EEF3FA 0%, #D6E1F5 100%)",
                  border: "1px solid #C7D2FE",
                }}
              >
                <div
                  className="p-3 rounded-lg flex-shrink-0"
                  style={{ background: "#4A6FA5", color: "white" }}
                >
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider mb-1" style={{ color: "#4A6FA5" }}>
                    {td.duration}
                  </p>
                  <p className="text-lg font-bold" style={{ color: "#1F2937" }}>
                    {treatment.time}
                  </p>
                </div>
              </div>

              {/* 회복 기간 */}
              <div
                className="rounded-2xl p-6 flex items-start gap-4"
                style={{
                  background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
                  border: "1px solid #BBF7D0",
                }}
              >
                <div
                  className="p-3 rounded-lg flex-shrink-0"
                  style={{ background: "#10B981", color: "white" }}
                >
                  <RefreshCw size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider mb-1" style={{ color: "#059669" }}>
                    {td.recovery}
                  </p>
                  <p className="text-lg font-bold" style={{ color: "#1F2937" }}>
                    {treatment.recovery}
                  </p>
                </div>
              </div>

              {/* 가격 */}
              <div
                className="rounded-2xl p-6 flex items-start gap-4"
                style={{
                  background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
                  border: "1px solid #FCD34D",
                }}
              >
                <div
                  className="p-3 rounded-lg flex-shrink-0"
                  style={{ background: "#F59E0B", color: "white" }}
                >
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider mb-1" style={{ color: "#D97706" }}>
                    {td.price}
                  </p>
                  <p className="text-lg font-bold" style={{ color: "#1F2937" }}>
                    {treatment.price}
                  </p>
                </div>
              </div>

              {/* 기대효과 */}
              <div
                className="rounded-2xl p-6 flex items-start gap-4"
                style={{
                  background: "linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)",
                  border: "1px solid #F472B6",
                }}
              >
                <div
                  className="p-3 rounded-lg flex-shrink-0"
                  style={{ background: "#EC4899", color: "white" }}
                >
                  <Sparkles size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider mb-1" style={{ color: "#BE185D" }}>
                    {td.effect}
                  </p>
                  <p className="text-sm font-bold" style={{ color: "#1F2937" }}>
                    {treatment.effect}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA 버튼 */}
            <div className="flex gap-4">
              <a
                href="https://pf.kakao.com/_HNyGC"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button
                  className="w-full py-6 text-base font-bold"
                  style={{ background: "#4A6FA5", color: "white" }}
                >
                  {td.ctaConsult}
                </Button>
              </a>
              <a href="https://booking.naver.com/booking/13/bizes/1122956" target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full py-6 text-base font-bold"
                >
                  {td.ctaReserve}
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* FAQ 섹션 */}
        <div className="border-t pt-16">
          <h2 className="text-3xl font-bold mb-2" style={{ color: "#1F2937" }}>
            {td.faqTitle}
          </h2>
          <p className="text-base mb-8" style={{ color: "#6B7280" }}>
            {treatment.name}
          </p>
          <FAQAccordion faqs={treatment.faqs || []} />
        </div>
      </div>
    </div>
  );
}

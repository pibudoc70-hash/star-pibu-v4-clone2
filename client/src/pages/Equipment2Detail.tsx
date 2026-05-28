/**
 * Equipment2Detail - 시술 상세 페이지
 * URL: /equipment2/:slug
 * 각 시술별 독립적인 페이지로 SEO 최적화
 */
import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader } from "lucide-react";
import { Streamdown } from "streamdown";

export default function Equipment2Detail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const slug = params.slug as string;
  const [treatment, setTreatment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 시술 목록 조회
  const { data: allTreatments } = trpc.treatments.all.useQuery({ section: "v2" });

  useEffect(() => {
    if (allTreatments && slug) {
      // slug로 시술 찾기
      const found = allTreatments.find((t: any) => t.slug === slug);
      if (found) {
        setTreatment(found);
        // 페이지 제목 설정
        document.title = `${found.name} | 부산 스타피부과 - 피부과 전문의 시술`;
        // 메타 설명 설정
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute("content",
            `부산 서면 스타피부과의 ${found.name} 시술 안내. ${found.desc || ''} 피부과 전문의가 직접 시술합니다. 온라인 예약 가능.`
          );
        }
        // 메타 키워드 설정
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content',
          `${found.name}, ${found.nameEn || ''}, 부산피부과, 스타피부과, 서면피부과, 피부과전문의, ${found.categoryId || '피부시술'}, 부산리프팅`
        );
        // OG 태그 설정
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', `${found.name} | 부산 스타피부과`);
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', `부산 서면 스타피부과의 ${found.name} 시술 안내. ${found.desc || ''} 피부과 전문의가 직접 시술합니다.`);
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', `https://www.star-pibu.com/equipment2/${slug}`);
        // JSON-LD 구조화 데이터 추가
        const existingLd = document.getElementById('treatment-jsonld');
        if (existingLd) existingLd.remove();
        const ldScript = document.createElement('script');
        ldScript.id = 'treatment-jsonld';
        ldScript.type = 'application/ld+json';
        ldScript.text = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalProcedure",
          "name": found.name,
          "alternateName": found.nameEn || '',
          "description": found.desc || '',
          "procedureType": "https://schema.org/CosmeticProcedure",
          "image": found.image || '',
          "url": `https://www.star-pibu.com/equipment2/${slug}`,
          "provider": {
            "@type": "Physician",
            "name": "스타피부과",
            "url": "https://www.star-pibu.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "서면로 74 아이온시티빌딩 4층",
              "addressLocality": "부산진구",
              "addressRegion": "부산광역시",
              "postalCode": "47252",
              "addressCountry": "KR"
            },
            "telephone": "051-818-2300"
          },
          "bodyLocation": "피부",
          "preparation": found.caution || '',
          "followup": found.recovery || ''
        });
        document.head.appendChild(ldScript);
      } else {
        // 시술을 찾지 못한 경우
        setLocation("/equipment2");
      }
      setIsLoading(false);
    }
    // 컴포넌트 언마운트 시 JSON-LD 제거
    return () => {
      const ldScript = document.getElementById('treatment-jsonld');
      if (ldScript) ldScript.remove();
    };
  }, [allTreatments, slug, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">시술 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  // 이미지 배열 파싱
  let images: string[] = [];
  if (treatment.images) {
    try {
      images = JSON.parse(treatment.images);
    } catch {
      images = [];
    }
  }

  // 연관 시술 파싱
  let relatedTreatments: any[] = [];
  if (treatment.related) {
    try {
      relatedTreatments = JSON.parse(treatment.related);
    } catch {
      relatedTreatments = [];
    }
  }

  // 치료 단계 파싱
  let steps: any[] = [];
  if (treatment.steps) {
    try {
      steps = JSON.parse(treatment.steps);
    } catch {
      steps = [];
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{treatment.name}</h1>
          <p className="text-blue-100">{treatment.nameEn}</p>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* 이미지 */}
          <div>
            {treatment.image && (
              <img
                src={treatment.image}
                alt={treatment.name}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            )}
          </div>

          {/* 기본 정보 */}
          <div className="space-y-6">
            {treatment.badge && (
              <div
                className="inline-block px-4 py-2 rounded-full text-white font-semibold"
                style={{ backgroundColor: treatment.badgeColor || "#4A6FA5" }}
              >
                {treatment.badge}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">시술 시간</h3>
                <p className="text-lg text-gray-900">{treatment.time}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">회복 기간</h3>
                <p className="text-lg text-gray-900">{treatment.recovery}</p>
              </div>

              {treatment.sessions && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">권장 횟수</h3>
                  <p className="text-lg text-gray-900">{treatment.sessions}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setLocation("/reservation")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              예약하기
            </button>
          </div>
        </div>

        {/* 상세 설명 */}
        {treatment.detail && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">시술 소개</h2>
            <div className="prose max-w-none">
              <Streamdown>{treatment.detail}</Streamdown>
            </div>
          </div>
        )}

        {/* 기대 효과 */}
        {treatment.effect && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">기대 효과</h2>
            <div className="prose max-w-none">
              <Streamdown>{treatment.effect}</Streamdown>
            </div>
          </div>
        )}

        {/* 치료 단계 */}
        {steps.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">치료 단계</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step: any, idx: number) => (
                <div key={idx} className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{idx + 1}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 주의사항 */}
        {treatment.caution && (
          <div className="mb-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-900 mb-4">주의사항</h2>
            <div className="prose max-w-none text-yellow-900">
              <Streamdown>{treatment.caution}</Streamdown>
            </div>
          </div>
        )}

        {/* 추가 이미지 갤러리 */}
        {images.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">시술 사례</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {images.map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${treatment.name} 사례 ${idx + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* YouTube 영상 */}
        {treatment.youtubeUrl && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">시술 영상</h2>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={treatment.youtubeUrl}
                title={treatment.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
          </div>
        )}

        {/* 연관 시술 */}
        {relatedTreatments.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">연관 시술</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTreatments.map((related: any) => (
                <div
                  key={related.id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
                  onClick={() => setLocation(`/equipment2/${related.slug}`)}
                >
                  {related.image && (
                    <img
                      src={related.image}
                      alt={related.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{related.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{related.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

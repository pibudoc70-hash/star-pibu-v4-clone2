import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useLang } from "@/contexts/useLang";

const reviews = [
  {
    id: 1,
    name: "김*영",
    treatment: "써마지 FLX",
    rating: 5,
    text: "써마지 시술 후 피부 탄력이 눈에 띄게 좋아졌어요. 원장님이 직접 꼼꼼하게 시술해 주셔서 믿음이 갔습니다. 다음에도 꼭 방문할 예정입니다.",
    date: "2026.03",
  },
  {
    id: 2,
    name: "이*수",
    treatment: "눈밑지방재배치",
    rating: 5,
    text: "수술 없이 레이저로 눈밑 지방을 개선할 수 있다는 게 놀라웠어요. 회복도 빠르고 결과도 만족스럽습니다. 친절한 상담 덕분에 결정이 쉬웠어요.",
    date: "2026.02",
  },
  {
    id: 3,
    name: "박*진",
    treatment: "울쎄라피 프라임",
    rating: 5,
    text: "울쎄라피 프라임 시술 받았는데 리프팅 효과가 정말 좋네요. 전문의 선생님이 직접 시술해 주시고 시술 전 충분한 설명도 해주셔서 안심이 됐습니다.",
    date: "2026.01",
  },
  {
    id: 4,
    name: "최*희",
    treatment: "기미 치료 프로그램",
    rating: 5,
    text: "오랫동안 고민하던 기미가 많이 옅어졌어요. 복합 레이저 치료 덕분에 피부 톤도 밝아진 것 같습니다. 상담부터 시술까지 전반적으로 만족합니다.",
    date: "2025.12",
  },
  {
    id: 5,
    name: "정*민",
    treatment: "프로파운드 RF",
    rating: 5,
    text: "1회 시술로 이렇게 효과가 좋을 줄 몰랐어요. 피부 탄력이 확실히 개선되었고 주변에서도 좋아졌다고 하더라고요. 적극 추천합니다.",
    date: "2025.11",
  },
];

export default function ReviewsSection() {
  const { t } = useLang();
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(reviews.length / perPage);
  const visible = reviews.slice(page * perPage, page * perPage + perPage);

  return (
    <section id="reviews" className="py-20 bg-[var(--star-bg-section)]">
      <div className="container">
        <div className="text-center mb-14">
          <p className="section-label mb-3">{t.reviews.label}</p>
          <h2 className="text-3xl md:text-4xl font-black text-[#1a2744] gold-underline inline-block">
            {t.reviews.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {visible.map(review => (
            <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm card-hover">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-[#c9a96e] text-[#c9a96e]" />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-4">
                "{review.text}"
              </p>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <div>
                  <p className="font-bold text-[#1a2744] text-sm">{review.name}</p>
                  <p className="text-xs text-[#c9a96e]">{review.treatment}</p>
                </div>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-2 rounded-full border border-gray-200 hover:border-[#c9a96e] disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-8 h-8 rounded-full text-sm font-bold transition-colors ${
                page === i ? "bg-[#1a2744] text-white" : "text-gray-400 hover:text-[#1a2744]"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="p-2 rounded-full border border-gray-200 hover:border-[#c9a96e] disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="text-center mt-6">
          <a
            href="https://map.naver.com/v5/search/%EC%8A%A4%ED%83%80%ED%94%BC%EB%B6%80%EA%B3%BC"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#c9a96e] hover:underline font-semibold"
          >
            {t.reviews.more} →
          </a>
        </div>
      </div>
    </section>
  );
}

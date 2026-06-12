/**
 * FAQSection - 자주 묻는 질문 섹션
 * 장비별 Q&A 아코디언 형태로 표시
 * AEO 최적화: FAQ 스키마 JSON-LD 자동 생성
 */
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLang } from "@/contexts/LangContext";
import { useChatConfig } from "@/hooks/useChatConfig";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQQuestion { q: string; a: string; }
interface FAQItem { equipment: string; questions: FAQQuestion[]; }

export default function FAQSection() {
  const { t } = useLang();
  const faq = t.faq;
  const { chatUrl, chatBg, chatColor } = useChatConfig();
  const [openEquipment, setOpenEquipment] = useState<number>(0);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const faqCtaLabel = faq.ctaLabel;
  const faqCtaDesc = faq.ctaDesc;

  /**
   * FAQ 스키마 생성 함수
   * 현재 선택된 장비의 Q&A를 JSON-LD 형식으로 변환
   * (모든 탭의 FAQ를 포함하여 SEO 최적화)
   */
  const generateFAQSchema = () => {
    const allFAQItems = (faq.items as FAQItem[]);
    if (!allFAQItems || allFAQItems.length === 0) {
      return null;
    }

    // 모든 Q&A 수집
    const allQuestions = allFAQItems
      .filter(item => item.questions && item.questions.length > 0)
      .flatMap((item: FAQItem) =>
        item.questions.map((qa: FAQQuestion) => ({
          "@type": "Question",
          "name": qa.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": qa.a
          }
        }))
      );

    if (allQuestions.length === 0) {
      return null;
    }

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": allQuestions
    };
  };

  const faqSchema = generateFAQSchema();

  return (
    <>
      {/* FAQ 스키마 JSON-LD 삽입 */}
      {faqSchema && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        </Helmet>
      )}

      {/* [PROD-P4-1] py-20 md:py-28 → py-16 md:py-24: 사이트 표준 셉션 간격(py-16/py-24)으로 통일 */}
      <section id="faq" className="py-16 md:py-24" style={{ background: "#F0F7FF" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* 섹션 헤더 */}
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-bold tracking-widest uppercase mb-3 px-4 py-1.5 rounded-full"
              style={{ background: "#E0EDFF", color: "#1A4FA0" }}
            >
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: "#0D2B5E" }}>
              {faq.sectionTitle}
            </h2>
            <p className="text-base md:text-lg" style={{ color: "#4A6FA5" }}>
              {faq.sectionSubtitle}
            </p>
          </div>

          {/* 장비 탭 */}
          <div className="flex flex-wrap gap-2.5 justify-center mb-10">
            {(faq.items as FAQItem[]).map((item: FAQItem, idx: number) => (
              <button type="button"
                key={idx}
                onClick={() => {
                  setOpenEquipment(idx);
                  setOpenQuestion(null);
                }}
                className="rounded-full font-bold transition-all duration-200"
                style={
                  openEquipment === idx
                    ? { background: "#1A4FA0", color: "#fff", fontSize: "0.95rem", padding: "10px 22px", boxShadow: "0 4px 14px rgba(26,79,160,0.3)", transform: "translateY(-1px)" }
                    : { background: "#fff", color: "#4A6FA5", fontSize: "0.85rem", padding: "8px 18px", border: "1.5px solid #B8D0F0", fontWeight: 500 }
                }
              >
                {item.equipment}
              </button>
            ))}
          </div>

          {/* Q&A 아코디언 */}
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: "1.5px solid #D0E4FF" }}>
            {(faq.items[openEquipment]?.questions as FAQQuestion[])?.map((qa: FAQQuestion, qIdx: number) => (
              <div
                key={qIdx}
                className="border-b last:border-b-0"
                style={{ borderColor: "#D0E4FF" }}
              >
                {/* 질문 */}
                <button type="button"
                  className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-blue-50"
                  style={{ background: openQuestion === qIdx ? "#EBF3FF" : "#fff" }}
                  onClick={() => setOpenQuestion(openQuestion === qIdx ? null : qIdx)}
                  aria-expanded={openQuestion === qIdx}
                  aria-controls={`faq-answer-${openEquipment}-${qIdx}`}
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle
                      className="mt-0.5 shrink-0"
                      size={16}
                      style={{ color: "#6A90C8" }}
                    />
                    <span className="font-medium text-sm" style={{ color: "#2A4A7E", lineHeight: 1.55 }}>
                      {qa.q}
                    </span>
                  </div>
                  <span className="ml-4 shrink-0" style={{ color: "#6A90C8" }}>
                    {openQuestion === qIdx ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </span>
                </button>

                {/* 답변 */}
                {openQuestion === qIdx && (
                  <div
                    id={`faq-answer-${openEquipment}-${qIdx}`}
                    className="px-6 pb-5 pt-1 text-sm md:text-base leading-relaxed"
                    style={{ color: "#3A5A8A", background: "#F5F9FF" }}
                  >
                    <div className="flex gap-3">
                      <span
                        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                        style={{ background: "#1A4FA0", color: "#fff" }}
                      >
                        A
                      </span>
                      <p>{qa.a}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 하단 CTA */}
          <div className="mt-10 text-center">
            <p className="text-sm mb-4" style={{ color: "#4A6FA5" }}>{faqCtaDesc}</p>
            <a
              href={chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 hover:shadow-lg"
              style={{ background: chatBg, color: chatColor }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 11c0 2.897 1.565 5.453 3.953 7.001L4.5 21l3.75-1.875C9.37 19.687 10.664 20 12 20c5.523 0 10-3.477 10-9S17.523 3 12 3z" />
              </svg>
              {faqCtaLabel}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

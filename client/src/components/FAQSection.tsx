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
      <section id="faq" className="py-16 md:py-24 faq-section-bg">
        <div className="container max-w-4xl">
          {/* 섹션 헤더 */}
          <div className="text-center mb-14">
            <span className="section-eyebrow">FAQ</span>
            <h2 className="section-title mb-4">{faq.sectionTitle}</h2>
            <p className="section-subtitle">{faq.sectionSubtitle}</p>
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
                className={`faq-tab-btn ${openEquipment === idx ? "faq-tab-btn--active" : ""}`}
              >
                {item.equipment}
              </button>
            ))}
          </div>

          {/* Q&A 아코디언 */}
          <div className="rounded-2xl overflow-hidden shadow-sm faq-accordion-wrap">
            {(faq.items[openEquipment]?.questions as FAQQuestion[])?.map((qa: FAQQuestion, qIdx: number) => (
              <div
                key={qIdx}
                className="faq-accordion-item border-b last:border-b-0"
              >
                {/* 질문 */}
                <button type="button"
                  className={`faq-question-btn ${openQuestion === qIdx ? "faq-question-btn--open" : ""}`}
                  onClick={() => setOpenQuestion(openQuestion === qIdx ? null : qIdx)}
                  aria-expanded={openQuestion === qIdx}
                  aria-controls={`faq-answer-${openEquipment}-${qIdx}`}
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle
                      className="mt-0.5 shrink-0 text-brand-gold"
                      size={16}
                    />
                    <span className="font-medium text-sm faq-question-text">
                      {qa.q}
                    </span>
                  </div>
                  <span className="ml-4 shrink-0 text-brand-gold">
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
                    className="px-6 pb-5 pt-1 text-sm md:text-base leading-relaxed faq-answer-panel"
                  >
                    <div className="flex gap-3">
                      <span
                        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-normal mt-0.5 faq-answer-badge"
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
            <p className="text-sm mb-4 text-brand-mid">{faqCtaDesc}</p>
            <a
              href={chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-normal text-sm transition-all hover:scale-105 hover:shadow-lg"
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

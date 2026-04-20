/**
 * FAQSection - 자주 묻는 질문 섹션
 * 장비별 Q&A 아코디언 형태로 표시
 */
import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQQuestion { q: string; a: string; }
interface FAQItem { equipment: string; questions: FAQQuestion[]; }

export default function FAQSection() {
  const { t, lang } = useLang();
  const faq = t.faq;
  const [openEquipment, setOpenEquipment] = useState<number>(0);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-28" style={{ background: "#F0F7FF" }}>
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
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {(faq.items as FAQItem[]).map((item: FAQItem, idx: number) => (
            <button
              key={idx}
              onClick={() => {
                setOpenEquipment(idx);
                setOpenQuestion(null);
              }}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={
                openEquipment === idx
                  ? { background: "#1A4FA0", color: "#fff", boxShadow: "0 2px 8px rgba(26,79,160,0.25)" }
                  : { background: "#fff", color: "#1A4FA0", border: "1.5px solid #B8D0F0" }
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
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors duration-200 hover:bg-blue-50"
                style={{ background: openQuestion === qIdx ? "#EBF3FF" : "#fff" }}
                onClick={() => setOpenQuestion(openQuestion === qIdx ? null : qIdx)}
              >
                <div className="flex items-start gap-3">
                  <HelpCircle
                    className="mt-0.5 shrink-0"
                    size={18}
                    style={{ color: "#1A4FA0" }}
                  />
                  <span className="font-semibold text-sm md:text-base" style={{ color: "#0D2B5E" }}>
                    {qa.q}
                  </span>
                </div>
                <span className="ml-4 shrink-0" style={{ color: "#1A4FA0" }}>
                  {openQuestion === qIdx ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </span>
              </button>

              {/* 답변 */}
              {openQuestion === qIdx && (
                <div
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
          <p className="text-sm mb-4" style={{ color: "#4A6FA5" }}>
            {lang === "ko"
              ? "더 궁금한 점이 있으신가요? 카카오톡으로 편하게 문의하세요."
              : lang === "en"
              ? "Have more questions? Feel free to contact us via KakaoTalk."
              : lang === "ja"
              ? "他にご質問はありますか？KakaoTalkでお気軽にお問い合わせください。"
              : "还有其他问题吗？请通过KakaoTalk随时咨询我们。"}
          </p>
          <a
            href="https://pf.kakao.com/_xnxbxdxj"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: "#FEE500", color: "#3A1D1D" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.477 2 11c0 2.897 1.565 5.453 3.953 7.001L4.5 21l3.75-1.875C9.37 19.687 10.664 20 12 20c5.523 0 10-3.477 10-9S17.523 3 12 3z" />
            </svg>
            {t.treatmentDetail.ctaConsult}
          </a>
        </div>
      </div>
    </section>
  );
}

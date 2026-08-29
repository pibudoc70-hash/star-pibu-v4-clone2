import { useLang } from "@/contexts/LangContext";
import { LIFTING_FAQS, LIFTING_HOME_SUMMARY, type LiftingPositioningLang } from "@shared/liftingPositioning";

function toPositioningLang(lang: string): LiftingPositioningLang {
  return lang === "zh-TW" ? "zh-TW" : lang === "en" || lang === "ja" || lang === "zh" ? lang : "ko";
}

export function LiftingPositioningSummary() {
  const { lang } = useLang();
  const localizedLang = toPositioningLang(lang);
  return (
    <section className="bg-[#fbf8f2] border-y border-[#eadfcd] py-6 md:py-8" aria-labelledby="lifting-positioning-title">
      <div className="container max-w-5xl px-5 md:px-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-[#9c762f] uppercase">Lifting Care</p>
        <h2 id="lifting-positioning-title" className="mt-2 text-xl md:text-2xl font-semibold text-[#2d241c]">{localizedLang === "ko" ? "피부과 전문의 직접 리프팅 진료" : "Dermatologist-led lifting care"}</h2>
        <p className="mt-3 text-sm md:text-base leading-7 text-[#51463a]">{LIFTING_HOME_SUMMARY[localizedLang]}</p>
      </div>
    </section>
  );
}

export function LiftingFaqSection({ lang }: { lang?: string }) {
  const context = useLang();
  const localizedLang = toPositioningLang(lang ?? context.lang);
  const title = localizedLang === "ko" ? "리프팅 시술과 통증 관리 FAQ" : "Lifting & pain-management FAQ";
  return (
    <section className="equipment-detail__positioning-faq mb-12 rounded-2xl border border-[#e8dcc8] bg-[#fffcf7] p-6 md:p-8" aria-labelledby="lifting-faq-title">
      <h2 id="lifting-faq-title" className="text-xl font-bold text-[#3a2d1e] mb-5">{title}</h2>
      <dl className="space-y-5">
        {LIFTING_FAQS[localizedLang].map((item) => (
          <div key={item.question}>
            <dt className="font-semibold text-[#3a2d1e]">Q. {item.question}</dt>
            <dd className="mt-2 text-sm leading-6 text-[#655746]">A. {item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

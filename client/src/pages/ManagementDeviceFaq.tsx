import MainLayout from "@/components/MainLayout";
import OptimizedImage from "@/components/OptimizedImage";
import SeoHead, { buildHreflangs, LANG_TO_OG_LOCALE } from "@/components/SeoHead";
import { useLang } from "@/contexts/LangContext";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import { MANAGEMENT_DEVICES, MANAGEMENT_DEVICE_IMAGES } from "@/lib/clinic-data";
import { getLocalizedUrl } from "@/lib/localizedPath";

const SONOPEEL = MANAGEMENT_DEVICES.find((device) => device.imgId === "sonopeel");

const pageCopy = {
  ko: { eyebrow: "MANAGEMENT DEVICE FAQ", deviceLabel: "소노필" },
  en: { eyebrow: "MANAGEMENT DEVICE FAQ", deviceLabel: "SONOPEEL" },
  ja: { eyebrow: "MANAGEMENT DEVICE FAQ", deviceLabel: "ソノピール" },
  zh: { eyebrow: "MANAGEMENT DEVICE FAQ", deviceLabel: "超声波去角质" },
  "zh-TW": { eyebrow: "MANAGEMENT DEVICE FAQ", deviceLabel: "超音波去角質" },
} as const;

function getSonopeelFaqs(lang: keyof typeof pageCopy, deviceName: string, description: string) {
  const copy = {
    ko: {
      method: `${deviceName} 관리는 어떤 방식으로 진행되나요?`,
      planning: "관리 전 무엇을 확인하나요?",
      planningAnswer: "피부 상태와 관리 목표, 현재 시술 계획을 함께 확인한 뒤 의료진 상담을 통해 개별 안내를 드립니다.",
    },
    en: {
      method: `How is ${deviceName} care performed?`,
      planning: "What is reviewed before care?",
      planningAnswer: "Skin condition, care goals, and the current treatment plan are reviewed together before individualized guidance is provided through clinical consultation.",
    },
    ja: {
      method: `${deviceName}のケアはどのように行われますか？`,
      planning: "ケア前に何を確認しますか？",
      planningAnswer: "肌の状態、ケアの目的、現在の施術計画を確認し、医療スタッフとの相談を通じて個別にご案内します。",
    },
    zh: {
      method: `${deviceName}护理如何进行？`,
      planning: "护理前会确认哪些内容？",
      planningAnswer: "会结合皮肤状态、护理目标和当前治疗计划进行确认，并通过医疗人员咨询提供个别说明。",
    },
    "zh-TW": {
      method: `${deviceName}護理如何進行？`,
      planning: "護理前會確認哪些內容？",
      planningAnswer: "會結合皮膚狀態、護理目標和目前療程計畫進行確認，並透過醫療人員諮詢提供個別說明。",
    },
  }[lang];

  return [
    { question: copy.method, answer: description },
    { question: copy.planning, answer: copy.planningAnswer },
  ];
}

export default function ManagementDeviceFaq() {
  const { lang, t } = useLang();
  const { getText } = useLocalizedText();

  if (!SONOPEEL) return null;

  const copy = pageCopy[lang];
  const displayName = getText(SONOPEEL.name, SONOPEEL.nameEn, SONOPEEL.nameJa, SONOPEEL.nameZh, SONOPEEL.nameZhTw);
  const description = getText(
    SONOPEEL.shortDesc,
    SONOPEEL.shortDescEn,
    SONOPEEL.shortDescJa,
    SONOPEEL.shortDescZh,
    SONOPEEL.shortDescZhTw,
  );
  const faqs = getSonopeelFaqs(lang, displayName, description);
  const canonicalPath = getLocalizedUrl(lang, "/management-device-faq");
  const hreflangs = buildHreflangs(
    "/management-device-faq",
    "/en/management-device-faq",
    "/ja/management-device-faq",
    "/zh/management-device-faq",
  );

  return (
    <MainLayout>
      <SeoHead
        title={`${t.nav.managementDeviceFaq} | 스타피부과`}
        description={description}
        canonical={canonicalPath}
        ogUrl={canonicalPath}
        ogLocale={LANG_TO_OG_LOCALE[lang]}
        hreflangs={hreflangs}
      />

      <section className="bg-[var(--color-star-navy)] px-4 py-16 text-center md:py-24">
        <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-[var(--color-gold-primary)]">{copy.eyebrow}</p>
        <h1 className="text-3xl font-bold text-white md:text-5xl">{t.nav.managementDeviceFaq}</h1>
      </section>

      <section className="bg-[#f7f5f0] px-4 py-12 md:py-20">
        <div className="mx-auto max-w-3xl">
          <article className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_34px_rgba(39,30,20,0.10)]">
            <div className="flex flex-col gap-6 border-b border-black/5 p-6 sm:flex-row sm:items-center md:p-8">
              <div className="size-24 shrink-0 overflow-hidden rounded-full bg-[#eee7dc] sm:size-28">
                <OptimizedImage
                  src={MANAGEMENT_DEVICE_IMAGES[SONOPEEL.imgId]}
                  alt={displayName}
                  className="h-full w-full object-cover"
                  width={112}
                  height={112}
                />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-[var(--color-gold-primary)]">{copy.deviceLabel}</p>
                <h2 className="mt-1 text-2xl font-bold text-[#2c1f0e]">{displayName}</h2>
              </div>
            </div>

            <dl className="divide-y divide-black/5 px-6 py-2 md:px-8">
              {faqs.map((faq) => (
                <div key={faq.question} className="py-6">
                  <dt className="text-base font-bold leading-relaxed text-[#2c1f0e]">{faq.question}</dt>
                  <dd className="mt-3 text-sm leading-7 text-[#62584e]">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </article>
        </div>
      </section>
    </MainLayout>
  );
}

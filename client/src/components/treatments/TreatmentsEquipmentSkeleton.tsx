import type { Lang } from "@/lib/i18n";

type TreatmentsEquipmentSkeletonProps = {
  id?: string;
  lang?: Lang;
  variant?: "section" | "content";
};

const LOADING_LABELS: Record<Lang, string> = {
  ko: "시술·장비 정보를 불러오는 중입니다.",
  en: "Loading treatments and equipment.",
  ja: "施術・機器情報を読み込んでいます。",
  zh: "正在加载项目和设备信息。",
  "zh-TW": "正在載入療程和設備資訊。",
};

function ShimmerBlock({ className }: { className: string }) {
  return <div aria-hidden="true" className={`rounded bg-[#E6DED4] animate-pulse motion-reduce:animate-none ${className}`} />;
}

function ContentSkeleton({ lang }: { lang: Lang }) {
  return (
    <div aria-busy="true" aria-live="polite" className="rounded-2xl px-4 py-4 mb-4" style={{ background: "#F3EEE8" }}>
      <p role="status" className="sr-only">{LOADING_LABELS[lang]}</p>
      <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#F8F6F3] px-3 py-2.5">
        <ShimmerBlock className="h-4 w-4 shrink-0" />
        <ShimmerBlock className="h-3.5 w-2/5" />
      </div>
      <div className="flex gap-2 overflow-hidden pb-1">
        {[0, 1, 2, 3].map((item) => (
          <ShimmerBlock key={item} className="h-9 w-24 shrink-0 rounded-full" />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm">
            <ShimmerBlock className="aspect-[4/3] w-full" />
            <div className="mt-4 space-y-2">
              <ShimmerBlock className="h-3 w-16" />
              <ShimmerBlock className="h-5 w-4/5" />
              <ShimmerBlock className="h-3 w-3/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TreatmentsEquipmentSkeleton({
  id,
  lang = "ko",
  variant = "section",
}: TreatmentsEquipmentSkeletonProps) {
  if (variant === "content") {
    return <ContentSkeleton lang={lang} />;
  }

  return (
    <section id={id} aria-busy="true" className="section-bg-cream-soft py-16 sm:py-24 scroll-mt-24 md:scroll-mt-28">
      <div className="container">
        <div className="mb-8 flex flex-col items-center gap-3 text-center sm:mb-12">
          <ShimmerBlock className="h-3 w-24" />
          <ShimmerBlock className="h-8 w-48" />
          <ShimmerBlock className="h-4 w-72 max-w-[80%]" />
        </div>
        <ContentSkeleton lang={lang} />
      </div>
    </section>
  );
}

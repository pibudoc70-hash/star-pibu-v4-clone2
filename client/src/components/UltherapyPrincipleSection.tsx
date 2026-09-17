import { Crosshair, Layers3, RefreshCcw, ScanLine, Sparkles, ThermometerSun } from "lucide-react";
import { ULTHERAPY_PRIME_PRINCIPLE } from "@shared/ultherapyPrinciple";

const STEP_ICONS = [ScanLine, Crosshair, ThermometerSun, RefreshCcw] as const;
const ULTHERAPY_SKIN_DEPTH_ILLUSTRATION = "/manus-storage/ultherapy-skin-depth-illustration_fc153b6b.png";

export default function UltherapyPrincipleSection() {
  return (
    <section className="equipment-detail__ultherapy-principle mb-12 overflow-hidden rounded-3xl border border-[#e7ddd0] bg-[#fffdf8] shadow-[0_18px_48px_rgba(42,52,74,0.08)]" aria-labelledby="ultherapy-principle-heading">
      <div className="relative overflow-hidden bg-[#17243b] px-6 py-10 text-white sm:px-10 md:px-12 md:py-14">
        <div className="relative max-w-3xl">
          <p className="mb-3 text-xs font-bold tracking-[0.22em] text-[#e5c988]">ULTHERAPY PRIME PRINCIPLE</p>
          <h2 id="ultherapy-principle-heading" className="text-3xl font-bold leading-tight sm:text-4xl">{ULTHERAPY_PRIME_PRINCIPLE.heading}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">{ULTHERAPY_PRIME_PRINCIPLE.subtitle}</p>
        </div>
      </div>

      <div className="space-y-12 px-5 py-8 sm:px-8 sm:py-10 md:px-12 md:py-14">
        <section aria-labelledby="ultherapy-layer-heading">
          <div className="mb-6 flex items-center gap-3 text-[#24324e]">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#e8d9c2]" aria-hidden="true"><Layers3 size={20} /></span>
            <h3 id="ultherapy-layer-heading" className="text-xl font-bold">{ULTHERAPY_PRIME_PRINCIPLE.layerHeading}</h3>
          </div>
          <figure className="overflow-hidden rounded-2xl border border-[#e6d9c8] bg-[#f7f1e7]">
            <img
              src={ULTHERAPY_SKIN_DEPTH_ILLUSTRATION}
              alt="초음파 기기와 피부 단면의 세 깊이 타깃 도식"
              className="block h-auto w-full"
              loading="lazy"
            />
          </figure>
          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            {ULTHERAPY_PRIME_PRINCIPLE.layers.map((layer) => (
              <div key={layer.depth} className="rounded-2xl border border-[#e7ded2] bg-white p-5">
                <dt className="text-sm font-bold text-[#8f6f46]">{layer.depth} · {layer.name}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-600">{layer.description}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="ultherapy-steps-heading">
          <div className="mb-6 flex items-center gap-3 text-[#24324e]">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#efe2cc]" aria-hidden="true"><Sparkles size={20} /></span>
            <h3 id="ultherapy-steps-heading" className="text-2xl font-bold">{ULTHERAPY_PRIME_PRINCIPLE.principleHeading}</h3>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {ULTHERAPY_PRIME_PRINCIPLE.steps.map((step, index) => {
              const Icon = STEP_ICONS[index];
              return (
                <li key={step.title} className="rounded-2xl border border-[#e7ded2] bg-white p-5 shadow-[0_8px_22px_rgba(42,52,74,0.05)]">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#24324e] text-sm font-bold text-[#f5d899]">0{index + 1}</span>
                    <Icon size={22} className="text-[#b48a55]" aria-hidden="true" />
                  </div>
                  <h4 className="mt-5 font-bold text-[#24324e]">{step.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="rounded-2xl border border-[#dfe4ea] bg-[#f4f6f8] p-5 sm:p-7" aria-labelledby="ultherapy-timeline-heading">
          <h3 id="ultherapy-timeline-heading" className="text-2xl font-bold text-[#24324e]">{ULTHERAPY_PRIME_PRINCIPLE.timelineHeading}</h3>
          <ol className="mt-7 grid gap-5 md:grid-cols-3">
            {ULTHERAPY_PRIME_PRINCIPLE.timeline.map((phase, index) => (
              <li key={phase.label} className="relative rounded-xl bg-white p-5 shadow-sm md:after:absolute md:after:left-full md:after:top-1/2 md:after:h-px md:after:w-5 md:after:bg-[#c4a882] md:last:after:hidden">
                <span className="text-xs font-bold tracking-[0.16em] text-[#9a764b]">STEP {index + 1}</span>
                <h4 className="mt-2 font-bold text-[#24324e]">{phase.label}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{phase.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <aside className="rounded-2xl border border-[#eadcc4] bg-[#fff7e8] px-5 py-4 text-sm leading-relaxed text-[#5c4935]" aria-label="시술 전 안내">
          {ULTHERAPY_PRIME_PRINCIPLE.notice}
        </aside>
      </div>
    </section>
  );
}

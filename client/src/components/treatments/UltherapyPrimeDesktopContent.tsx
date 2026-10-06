import {
  BadgeCheck,
  Check,
  Crown,
  ExternalLink,
  Play,
  Stethoscope,
  Target,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import type { Lang } from "@/lib/i18n";
import { ULTHERAPY_PRIME_COPY } from "./ultherapyPrimeContent";

const ASSET = {
  device: "/api/storage/ultherapy-prime-device_374d4239.png",
  fda: "/api/storage/ultherapy-prime-fda_34036496.png",
  authenticity: "/api/storage/ultherapy-prime-authenticity_060bcbbe.png",
  specialist: "/api/storage/ultherapy-prime-specialist_15575405.png",
  handpiece: "/api/storage/ultherapy-prime-handpiece-dsc-605_dd7aa28b.webp",
  depthReference: "/api/storage/1_530b8674.png",
  depths: "/api/storage/ultherapy-prime-depths_5f0a9424.png",
  procedureDepths: "/api/storage/ultherapy-prime-procedure-depths-2026-10-06_eaa6eeae.png",
  collagenOne: "/api/storage/ultherapy-prime-collagen-stage-1_14727d05.webp",
  collagenTwo: "/api/storage/ultherapy-prime-collagen-stage-2_f334472d.webp",
  collagenThree: "/api/storage/ultherapy-prime-collagen-stage-3_9b65a9cd.webp",
  see: "/api/storage/ultherapy-prime-see_c3d3df83.webp",
  plan: "/api/storage/ultherapy-prime-plan_b5a31bbc.webp",
  treat: "/api/storage/ultherapy-prime-treat_c4a67ca4.webp",
  processSee: "/api/storage/ultherapy-prime-process-step-1_68a4c1b5.webp",
  processPlan: "/api/storage/ultherapy-prime-process-step-2_e11de918.webp",
  processTreat: "/api/storage/ultherapy-prime-process-step-3_6fc8187f.webp",
  qa: "/api/storage/ultherapy-prime-qa-thumbnail_5bd4e1e1.webp",
  thermage: "/api/storage/ultherapy-prime-thermage_75ab3431.png",
  oligiox: "/api/storage/ultherapy-prime-oligiox_6c01bdc5.webp",
  onda: "/api/storage/ultherapy-prime-onda_954449ad.png",
  lumenis: "/api/storage/ultherapy-prime-lumenis-one_ccd3f96b.png",
  rejuran: "/api/storage/ultherapy-prime-rejuran_9f2cbadd.png",
  skinBotox: "/api/storage/ultherapy-prime-skin-botox_70192da7.png",
  areas: "/api/storage/ultherapy-prime-treatment-areas_ea4ea3ca.png",
} as const;

type UltherapyPrimeProps = {
  lang: Lang;
  youtubeUrl?: string | null;
};

const TRUST_BADGES = [
  { key: "authentic", image: ASSET.authenticity },
  { key: "fda", image: ASSET.fda },
  { key: "specialist", image: ASSET.specialist },
] as const;

const COLLAGEN_IMAGES = [ASSET.collagenOne, ASSET.collagenTwo, ASSET.collagenThree] as const;

const PROCESS_MEDIA = [
  { compositeImage: ASSET.see, image: ASSET.processSee, step: "STEP. 01", title: <><strong>S</strong>EE</> },
  { compositeImage: ASSET.plan, image: ASSET.processPlan, step: "STEP. 02", title: <><strong>P</strong>LAN</> },
  { compositeImage: ASSET.treat, image: ASSET.processTreat, step: "STEP. 03", title: <><strong>T</strong>REAT</> },
] as const;

const COMBINATION_MEDIA = [
  { image: ASSET.thermage },
  { image: ASSET.oligiox },
  { image: ASSET.onda },
  { image: ASSET.lumenis, secondaryImage: ASSET.rejuran },
  { image: ASSET.skinBotox },
] as const;

const ULTHERAPY_SHORTS = [
  { id: "uOaql94ArBQ", title: "울쎄라 리프팅 어떤 원리일까? #부산피부과 #부산울쎄라 #부산울쎄라피 #부산울쎄라피프라임" },
  { id: "SCYXRjhB9rU", title: "울쎄라, 써마지 함께하면 리프팅 효과 좋은가요? #부산울쎄라 #부산써마지 #부산울써마지 #부산피부과 #부산피부과전문의" },
  { id: "ZBeG2Ntn-kg", title: "울쎄라 통증 때문에 샷 수 줄여야되나요? #부산울쎄라 #부산리프팅 #울쎄라600샷 #피부과전문의" },
  { id: "I4oaLkc9eos", title: "울쎄라 300샷 vs 600샷, 도대체 몇 샷을 해야 할까요? #부산울쎄라 #부산피부과 #피부과전문의" },
] as const;

const STRENGTH_ICONS = [BadgeCheck, Stethoscope, Target, Crown] as const;

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: ReactNode; description?: string }) {
  return (
    <div className="ultherapy-prime-desktop__heading">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      {description && <span>{description}</span>}
    </div>
  );
}

function imageEmbedUrl(sourceUrl: string | null | undefined): string | null {
  if (!sourceUrl) return null;
  const videoId = sourceUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=))([^?&#/]+)/)?.[1];
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
}

function shortThumbnailUrl(videoId: string, resolution: "maxresdefault" | "hqdefault" = "maxresdefault") {
  return `https://i.ytimg.com/vi/${videoId}/${resolution}.jpg`;
}

function shortEmbedUrl(videoId: string) {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`;
}

function UltherapyPrimeShorts({
  activeShortId,
  onSelect,
  shortsAriaLabel,
  playVideoLabel,
}: {
  activeShortId: string | null;
  onSelect: (videoId: string) => void;
  shortsAriaLabel: string;
  playVideoLabel: string;
}) {
  return (
    <div className="ultherapy-prime-desktop__shorts" role="group" aria-label={shortsAriaLabel}>
      {ULTHERAPY_SHORTS.map((short) => (
        <div className="ultherapy-prime-desktop__short" key={short.id}>
          {activeShortId === short.id ? (
            <iframe
              src={shortEmbedUrl(short.id)}
              title={short.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <button type="button" aria-label={`${playVideoLabel}: ${short.title}`} onClick={() => onSelect(short.id)}>
              <img
                src={shortThumbnailUrl(short.id)}
                alt=""
                loading="lazy"
                decoding="async"
                onError={(event) => {
                  const image = event.currentTarget;
                  image.onerror = null;
                  image.src = shortThumbnailUrl(short.id, "hqdefault");
                }}
              />
              <span className="ultherapy-prime-desktop__short-play"><Play fill="currentColor" aria-hidden="true" /></span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function KoreanLineBreakTitle({ lang, text, firstLine }: { lang: Lang; text: string; firstLine: string }) {
  if (lang !== "ko") return <>{text}</>;
  const rest = text.replace(`${firstLine} `, "");
  return <><span className="ultherapy-prime-desktop__title-line">{firstLine}</span><br /><span className="ultherapy-prime-desktop__title-line">{rest}</span></>;
}

export function UltherapyPrimeDesktopHero({ lang }: Pick<UltherapyPrimeProps, "lang">) {
  const copy = ULTHERAPY_PRIME_COPY[lang];

  return (
    <section className="ultherapy-prime-desktop ultherapy-prime-desktop__hero" aria-labelledby="ultherapy-prime-title">
      <div className="ultherapy-prime-desktop__hero-inner">
        <div className="ultherapy-prime-desktop__hero-copy">
          <div className="ultherapy-prime-desktop__wordmark" aria-label="Ultherapy Prime">
            <span>Ultherapy<sup>®</sup></span>
            <em>PRIME</em>
          </div>
          <p className="ultherapy-prime-desktop__eyebrow">PREMIUM ULTRASOUND LIFTING</p>
          <h1 id="ultherapy-prime-title">{copy.heroTitle}</h1>
          <p className="ultherapy-prime-desktop__hero-description">{copy.heroDescription}</p>
          <ul className="ultherapy-prime-desktop__trust-badges" aria-label={copy.trustTitles.join(", ")}>
            {TRUST_BADGES.map((badge, index) => (
              <li key={badge.key} className={badge.key === "authentic" ? "ultherapy-prime-desktop__trust-badge--authentic" : undefined}>
                <span className="ultherapy-prime-desktop__trust-icon"><img src={badge.image} alt="" /></span>
                <strong>{copy.trustTitles[index]}</strong>
                <span>{copy.trustSubtitles[index]}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="ultherapy-prime-desktop__hero-visual" aria-label="Ultherapy Prime">
          <img className="ultherapy-prime-desktop__hero-device" src={ASSET.device} alt="Ultherapy Prime" />
        </div>
      </div>
    </section>
  );
}

export default function UltherapyPrimeDesktopContent({ lang, youtubeUrl }: UltherapyPrimeProps) {
  const copy = ULTHERAPY_PRIME_COPY[lang];
  const embedUrl = imageEmbedUrl(youtubeUrl);
  const fallbackVideoUrl = youtubeUrl || "https://www.youtube.com/@starpibu";
  const [activeShortId, setActiveShortId] = useState<string | null>(null);

  return (
    <div className="ultherapy-prime-desktop ultherapy-prime-desktop__content" data-lang={lang}>
      <section className="ultherapy-prime-desktop__what" aria-labelledby="ultherapy-what-heading">
        <div className="ultherapy-prime-desktop__principle-grid">
          <div className="ultherapy-prime-desktop__principle-copy">
            <SectionHeading eyebrow="HOW ULTHERAPY WORKS" title={<KoreanLineBreakTitle lang={lang} text={copy.whatTitle} firstLine="울쎄라피 프라임은" />} />
            <p>{copy.whatParagraphs[0]}</p>
            <p>{copy.whatParagraphs[1]}</p>
            <div className="ultherapy-prime-desktop__principle-depth-copy">
              <h3>{copy.depthTitle}</h3>
              <p>{copy.depthText}</p>
            </div>
          </div>
          <figure className="ultherapy-prime-desktop__principle-diagram">
            <img className="ultherapy-prime-desktop__principle-diagram--tablet" src={ASSET.depths} alt={copy.depthTitle} loading="lazy" />
            <img className="ultherapy-prime-desktop__principle-diagram--pc" src={ASSET.procedureDepths} alt={copy.depthTitle} loading="lazy" />
          </figure>
        </div>
      </section>

      <section className="ultherapy-prime-desktop__split-section ultherapy-prime-desktop__authentic" aria-labelledby="ultherapy-authentic-heading">
        <div className="ultherapy-prime-desktop__split-copy">
          <SectionHeading eyebrow="AUTHENTICITY FIRST" title={<KoreanLineBreakTitle lang={lang} text={copy.authTitle} firstLine="정품 울쎄라피 프라임" />} />
          <p>{copy.authParagraphs[0]}</p>
          <p className="ultherapy-prime-desktop__authentic-emphasis">{copy.authParagraphs[1]}</p>
          <div className="ultherapy-prime-desktop__auth-seal"><BadgeCheck aria-hidden="true" /><span>{copy.certificationTitle}</span></div>
        </div>
        <div className="ultherapy-prime-desktop__authentic-media">
          <figure className="ultherapy-prime-desktop__authentic-equipment ultherapy-prime-desktop__authentic-equipment--pc-hidden">
            <img src={ASSET.handpiece} alt="Ultherapy Prime DeepSEE handpiece" loading="lazy" />
          </figure>
          <figure className="ultherapy-prime-desktop__authentic-depth">
            <img src={ASSET.depthReference} alt={copy.depthTitle} loading="lazy" />
            <figcaption>{copy.authCaption}</figcaption>
          </figure>
        </div>
      </section>

      <section className="ultherapy-prime-desktop__collagen" aria-labelledby="ultherapy-collagen-heading">
        <SectionHeading eyebrow="COLLAGEN REMODELING" title={copy.collagenTitle} />
        <ol className="ultherapy-prime-desktop__collagen-grid">
          {copy.collagenStages.map((label, index) => (
            <li key={label}>
              <figure><img src={COLLAGEN_IMAGES[index]} alt={label} loading="lazy" /></figure>
              <span>STEP {index + 1}</span>
              <h3>{label}</h3>
            </li>
          ))}
        </ol>
        <p className="ultherapy-prime-desktop__section-closing">{copy.collagenNote}</p>
      </section>

      <section className="ultherapy-prime-desktop__process" aria-labelledby="ultherapy-process-heading">
        <SectionHeading eyebrow="SEE · PLAN · TREAT" title={copy.processTitle} />
        <ol className="ultherapy-prime-desktop__process-grid ultherapy-prime-desktop__process-grid--pc" aria-label={copy.processTitle}>
          {PROCESS_MEDIA.map((step, index) => (
            <li className="ultherapy-prime-desktop__process-card" key={step.step}>
              <div className="ultherapy-prime-desktop__process-card-copy">
                <span>{step.step}</span>
                <h3>{step.title}</h3>
                <p>{copy.processDescriptions[index]}{index === 0 && <sup>41, 42</sup>}</p>
              </div>
              <img src={step.image} alt={copy.processDescriptions[index]} width={508} height={578} loading="lazy" decoding="async" />
            </li>
          ))}
        </ol>
        <p className="ultherapy-prime-desktop__process-note">{copy.processNote}</p>
      </section>

      <section className="ultherapy-prime-desktop__pain" aria-labelledby="ultherapy-pain-heading">
        <div className="ultherapy-prime-desktop__pain-main">
          <div className="ultherapy-prime-desktop__pain-copy">
            <SectionHeading eyebrow="COMFORT CARE" title={<KoreanLineBreakTitle lang={lang} text={copy.painTitle} firstLine="울쎄라피 프라임," />} />
            <ul className="ultherapy-prime-desktop__pain-options" aria-label={copy.painTitle}>
              {copy.painOptions.map((option) => <li key={option}>{option}</li>)}
            </ul>
            <p>{copy.painParagraphs[0]}</p>
            <p>{copy.painParagraphs[1]}</p>
          </div>
          <div className="ultherapy-prime-desktop__video-shell">
            {embedUrl ? (
              <iframe src={embedUrl} title={copy.qaTitle} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            ) : (
              <a href={fallbackVideoUrl} target="_blank" rel="noopener noreferrer" className="ultherapy-prime-desktop__video-fallback">
                <img src={ASSET.qa} alt={copy.qaTitle} loading="lazy" />
                <span><Play fill="currentColor" aria-hidden="true" /> {copy.watchYoutubeLabel} <ExternalLink aria-hidden="true" /></span>
              </a>
            )}
          </div>
        </div>
        <div className="ultherapy-prime-desktop__pain-shorts">
          <div className="ultherapy-prime-desktop__pain-shorts-divider" aria-hidden="true" />
          <h3>{copy.shortsTitle}</h3>
          <UltherapyPrimeShorts activeShortId={activeShortId} onSelect={setActiveShortId} shortsAriaLabel={copy.shortsAriaLabel} playVideoLabel={copy.playVideoLabel} />
        </div>
      </section>

      <section className="ultherapy-prime-desktop__combination" aria-labelledby="ultherapy-combination-heading">
        <SectionHeading eyebrow="BETTER TOGETHER" title={copy.combinationTitle} />
        <div className="ultherapy-prime-desktop__combination-grid">
          {copy.combinationTitles.map((title, index) => {
            const media = COMBINATION_MEDIA[index];
            return (
              <article key={title}>
                <div className="ultherapy-prime-desktop__combination-image">
                  <img src={media.image} alt={title} loading="lazy" />
                  {"secondaryImage" in media && media.secondaryImage && <img src={media.secondaryImage} alt="" aria-hidden="true" loading="lazy" />}
                </div>
                {copy.combinationBadges[index] && <span className="ultherapy-prime-desktop__combination-badge">{copy.combinationBadges[index]}</span>}
                <h3>{title}</h3>
                <p>{copy.combinationDescriptions[index]}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="ultherapy-prime-desktop__recommend" aria-labelledby="ultherapy-recommend-heading">
        <div className="ultherapy-prime-desktop__recommend-copy">
          <SectionHeading eyebrow="RECOMMENDED FOR" title={<KoreanLineBreakTitle lang={lang} text={copy.recommendTitle} firstLine="울쎄라피 프라임," />} />
          <ul>
            {copy.recommendations.map((recommendation) => <li key={recommendation}><Check aria-hidden="true" />{recommendation}</li>)}
          </ul>
        </div>
        <figure className="ultherapy-prime-desktop__areas-figure">
          <img src={ASSET.areas} alt={copy.areasCaption} loading="lazy" />
          <figcaption>{copy.areasCaption}</figcaption>
        </figure>
      </section>

      <section className="ultherapy-prime-desktop__star" aria-labelledby="ultherapy-star-heading">
        <SectionHeading eyebrow="WHY STAR DERMATOLOGY" title={<KoreanLineBreakTitle lang={lang} text={copy.starTitle} firstLine="당신의 소중한 젊음," />} />
        <p className="ultherapy-prime-desktop__star-intro">{copy.starIntro}</p>
        <div className="ultherapy-prime-desktop__strength-grid">
          {copy.strengths.map((text, index) => {
            const Icon = STRENGTH_ICONS[index];
            return <div key={text}><Icon aria-hidden="true" /><p>{text}</p></div>;
          })}
        </div>
        <div className="ultherapy-prime-desktop__star-certification" aria-label={copy.certificationTitle}>
          <img src={ASSET.authenticity} alt="" loading="lazy" />
          <p><strong>{copy.certificationTitle}</strong> — {copy.certificationText}</p>
        </div>
      </section>
    </div>
  );
}

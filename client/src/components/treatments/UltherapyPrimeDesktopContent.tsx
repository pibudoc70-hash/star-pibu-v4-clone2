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
import { THERMAGE_FLX_COPY, THERMAGE_FLX_INFO_ROWS } from "./thermageFlxContent";

const ASSET = {
  device: "/api/storage/ultherapy-prime-device_374d4239.png",
  mobileControlUnit: "/api/storage/ultherapy-prime-mobile-control-unit_bc826791.png",
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
  xerf: "/api/storage/ultherapy-prime-xerf-body-arm-l45_12cffff1.webp",
  onda: "/api/storage/ultherapy-prime-onda_954449ad.png",
  vro: "/api/storage/ultherapy-prime-v-ro_37ba6e49.png",
  lumenis: "/api/storage/ultherapy-prime-lumenis-one_ccd3f96b.png",
  rejuran: "/api/storage/ultherapy-prime-rejuran_9f2cbadd.png",
  skinBotox: "/api/storage/ultherapy-prime-skin-botox_70192da7.png",
  areas: "/api/storage/ultherapy-prime-treatment-areas_ea4ea3ca.png",
} as const;

type UltherapyPrimeProps = {
  lang: Lang;
  youtubeUrl?: string | null;
  treatment?: "ultherapy" | "thermage";
};

const THERMAGE_ASSET = {
  device: "/api/storage/thermage-flx-device_c5ab9400.webp",
  principle: "/api/storage/thermage-flx-treatment_f0e99de0.webp",
  principleHandpiece: "/api/storage/thermage-flx-principle-handpiece_6384cb3e.webp",
  closeup: "/api/storage/thermage-flx-closeup_645a65ea.webp",
  handpiece: "/api/storage/thermage-flx-handpiece_f5856bce.webp",
  totalTip: "/api/storage/thermage-flx-total-tip_a73293b6.webp",
  eyeTip: "/api/storage/thermage-flx-eye-tip_7de0d6c4.webp",
  authenticTip: "/api/storage/thermage-flx-authentic-tip_8fc1f4da.webp",
  certificate: "/api/storage/thermage-flx-certificate_de288662.webp",
  director: "/api/storage/thermage-flx-director_b8f4f84c.webp",
  areas: "/api/storage/thermage-flx-treatment-areas_6e0ffa61.webp",
  shurink: "/api/storage/thermage-flx-shurink_12c239a0.webp",
  onda: "/api/storage/thermage-flx-onda_52330caa.webp",
  vro: "/api/storage/thermage-flx-vro_096cef05.webp",
} as const;

const TRUST_BADGES = [
  { key: "authentic", image: ASSET.authenticity },
  { key: "fda", image: ASSET.fda },
  { key: "specialist", image: ASSET.specialist },
] as const;

const THERMAGE_TRUST_BADGES = [
  { key: "authentic", Icon: BadgeCheck, image: "/api/storage/thermage-flx-authentic-badge_795bb920.webp" },
  { key: "fda", Icon: Target, image: "/api/storage/thermage-flx-fda-badge_a38cee68.webp" },
  { key: "specialist", Icon: Stethoscope, image: "/api/storage/thermage-flx-specialist-badge_89c547aa.webp" },
] as const;

const COLLAGEN_IMAGES = [ASSET.collagenOne, ASSET.collagenTwo, ASSET.collagenThree] as const;

const THERMAGE_KOREAN_COLLAGEN_IMAGES = [
  "/api/storage/thermage-flx-collagen-1-updated_d49975b8.webp",
  "/api/storage/thermage-flx-collagen-2-updated_958a2d71.webp",
  "/api/storage/thermage-flx-collagen-3-updated_f290ac4c.webp",
] as const;

const THERMAGE_KOREAN_COLLAGEN_LABELS = ["늘어진 콜라겐", "고주파 에너지 전달", "콜라겐 재생 촉진"] as const;

const THERMAGE_KOREAN_TIP_MANUSCRIPT = [
  "기존 써마지 팁 3.0㎠ 크기보다 큰 4.0㎠ 크기로 업그레이드되어 25% 더 빠른 시술 속도를 제공합니다.",
  "눈가 미세 부위까지 정밀하고 섬세하게 적용하여 눈가 피부처짐, 다크서클을 개선합니다.",
] as const;

const PROCESS_MEDIA = [
  { compositeImage: ASSET.see, image: ASSET.processSee, step: "STEP. 01", title: <><strong>S</strong>EE</> },
  { compositeImage: ASSET.plan, image: ASSET.processPlan, step: "STEP. 02", title: <><strong>P</strong>LAN</> },
  { compositeImage: ASSET.treat, image: ASSET.processTreat, step: "STEP. 03", title: <><strong>T</strong>REAT</> },
] as const;

const COMBINATION_MEDIA = [
  { image: ASSET.thermage },
  { image: ASSET.xerf },
  { image: ASSET.onda, secondaryImage: ASSET.vro },
  { image: ASSET.lumenis, secondaryImage: ASSET.rejuran },
  { image: ASSET.skinBotox },
] as const;

const THERMAGE_COMBINATION_MEDIA = [
  { image: THERMAGE_ASSET.device, secondaryImage: ASSET.device },
  { image: THERMAGE_ASSET.shurink },
  { image: THERMAGE_ASSET.onda, secondaryImage: THERMAGE_ASSET.vro },
  { image: ASSET.lumenis, secondaryImage: ASSET.rejuran },
  { image: ASSET.skinBotox },
] as const;

const THERMAGE_KOREAN_COMBINATION_ULTHERAPY_IMAGE = "/api/storage/ultherapy-prime-control-unit-side_59598896.webp";

const THERMAGE_KOREAN_PC_STRENGTHS = [
  "대한민국 의사의\n단 2% 피부과전문의",
  "대학병원 교수출신,\n20년 이상의 시술 경험",
  "1:1 체계적인\n맞춤 플랜 리프팅",
  "써마지 FLX 외\n리프팅 장비 다수 보유",
] as const;

const THERMAGE_PROCESS_MEDIA = [
  { image: THERMAGE_ASSET.closeup, step: "FEATURE 01", title: "FASTER" },
  { image: THERMAGE_ASSET.handpiece, step: "FEATURE 02", title: "ALGORITHM" },
  { image: THERMAGE_ASSET.principle, step: "FEATURE 03", title: "EXPERIENCE" },
] as const;

const THERMAGE_TRANSFER_FEATURES = [
  { title: "FASTER", image: "/api/storage/thermage-flx-feature-1_ed603d67.webp", description: "더 커진 토탈팁으로 시술은 더 빠르게! 효과부위는 더 넓게!" },
  { title: "ALGORITHM", image: "/api/storage/thermage-flx-feature-2_418804bb.webp", description: "최적화된 에너지를 전달하는 알고리즘 기술로 효과적" },
  { title: "EXPERIENCE", image: "/api/storage/thermage-flx-feature-3_a68392fa.webp", description: "쿨링 펄스 기술로 적은 통증으로 편안한 시술 경험" },
] as const;

const ULTHERAPY_SHORTS = [
  { id: "uOaql94ArBQ", title: "울쎄라 리프팅 어떤 원리일까? #부산피부과 #부산울쎄라 #부산울쎄라피 #부산울쎄라피프라임" },
  { id: "SCYXRjhB9rU", title: "울쎄라, 써마지 함께하면 리프팅 효과 좋은가요? #부산울쎄라 #부산써마지 #부산울써마지 #부산피부과 #부산피부과전문의" },
  { id: "ZBeG2Ntn-kg", title: "울쎄라 통증 때문에 샷 수 줄여야되나요? #부산울쎄라 #부산리프팅 #울쎄라600샷 #피부과전문의" },
  { id: "I4oaLkc9eos", title: "울쎄라 300샷 vs 600샷, 도대체 몇 샷을 해야 할까요? #부산울쎄라 #부산피부과 #피부과전문의" },
] as const;

const THERMAGE_SHORTS = [
  { id: "dCmbvAcYVB8", title: "연예인 리프팅으로 인기있는 울쎄라와 써마지의 차이점은?" },
  { id: "4JuXH9cvpIk", title: "아이써마지와 써마지의 차이점은? #리프팅시술" },
  { id: "l_rl1VB2vaQ", title: "써마지 통증때문에 수면마취 해도 되나요?" },
  { id: "8kLAcP5C9O0", title: "울쎄라, 써마지 리프팅 잘 받는법은? #리프팅효과 #리프팅레이저" },
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
  shorts,
  activeShortId,
  onSelect,
  shortsAriaLabel,
  playVideoLabel,
}: {
  shorts: readonly { id: string; title: string }[];
  activeShortId: string | null;
  onSelect: (videoId: string) => void;
  shortsAriaLabel: string;
  playVideoLabel: string;
}) {
  return (
    <div className="ultherapy-prime-desktop__shorts" role="group" aria-label={shortsAriaLabel}>
      {shorts.map((short) => (
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

function KoreanMobileLineBreak({ lang, text, firstLine }: { lang: Lang; text: string; firstLine: string }) {
  if (lang !== "ko") return <>{text}</>;
  const rest = text.replace(`${firstLine} `, "");
  return <><span>{firstLine}</span>{" "}<br className="ultherapy-prime-desktop__mobile-break" /><span>{rest}</span></>;
}

function KoreanMobileOnlyLineBreak({ lang, text, firstLine }: { lang: Lang; text: string; firstLine: string }) {
  if (lang !== "ko") return <>{text}</>;
  const rest = text.startsWith(firstLine) ? text.slice(firstLine.length).trimStart() : text;
  return <><span>{firstLine}</span>{" "}<br className="ultherapy-prime-desktop__mobile-korean-break" /><span>{rest}</span></>;
}

type ForeignMobileHeading = "what" | "auth" | "pain" | "combination" | "recommend" | "star";

const FOREIGN_MOBILE_HEADING_FIRST_LINES: Partial<Record<Lang, Record<ForeignMobileHeading, string>>> = {
  ja: {
    what: "Ultherapy Primeとは",
    auth: "正規品のUltherapy Primeが",
    pain: "Ultherapy Primeの",
    combination: "Ultherapy Primeと",
    recommend: "Ultherapy Primeは",
    star: "あなたの大切な若々しさを、",
  },
  zh: {
    what: "Ultherapy Prime",
    auth: "为何正品 Ultherapy Prime",
    pain: "担心 Ultherapy Prime",
    combination: "适合与 Ultherapy Prime",
    recommend: "Ultherapy Prime",
    star: "您的珍贵青春，",
  },
  "zh-TW": {
    what: "Ultherapy Prime",
    auth: "為何原廠 Ultherapy Prime",
    pain: "擔心 Ultherapy Prime 的",
    combination: "適合搭配 Ultherapy Prime 的",
    recommend: "Ultherapy Prime",
    star: "您珍貴的青春，",
  },
};

function ForeignMobileHeadingLineBreak({ lang, text, heading }: { lang: Lang; text: string; heading: ForeignMobileHeading }) {
  const firstLine = FOREIGN_MOBILE_HEADING_FIRST_LINES[lang]?.[heading];
  const normalizedText = text.replace(/\n/g, "");
  if (!firstLine || !normalizedText.startsWith(firstLine)) return <>{text}</>;
  const rest = normalizedText.slice(firstLine.length).trimStart();
  return <><span className="ultherapy-prime-desktop__foreign-mobile-heading-desktop">{text}</span><span className="ultherapy-prime-desktop__foreign-mobile-heading-mobile"><span>{firstLine}</span><br className="ultherapy-prime-desktop__foreign-mobile-break" /><span>{rest}</span></span></>;
}

function AuthoredTreatmentTitle({
  treatment,
  lang,
  text,
  koreanFirstLine,
  foreignHeading,
}: {
  treatment: "ultherapy" | "thermage";
  lang: Lang;
  text: string;
  koreanFirstLine?: string;
  foreignHeading?: ForeignMobileHeading;
}) {
  if (treatment === "thermage") return <>{text}</>;
  if (lang === "ko" && koreanFirstLine) return <KoreanLineBreakTitle lang={lang} text={text} firstLine={koreanFirstLine} />;
  return foreignHeading ? <ForeignMobileHeadingLineBreak lang={lang} text={text} heading={foreignHeading} /> : <>{text}</>;
}

export function UltherapyPrimeDesktopHero({ lang, treatment = "ultherapy" }: Pick<UltherapyPrimeProps, "lang" | "treatment">) {
  const isThermage = treatment === "thermage";
  const copy = isThermage ? THERMAGE_FLX_COPY[lang] : ULTHERAPY_PRIME_COPY[lang];

  return (
    <section className="ultherapy-prime-desktop ultherapy-prime-desktop__hero" data-treatment={treatment} aria-labelledby="ultherapy-prime-title">
      <div className="ultherapy-prime-desktop__hero-inner">
        <div className="ultherapy-prime-desktop__hero-copy">
          <div className="ultherapy-prime-desktop__wordmark" aria-label={isThermage ? "Thermage FLX" : "Ultherapy Prime"}>
            {isThermage && lang === "ko" && <img className="ultherapy-prime-desktop__thermage-logo-ko" src="/api/storage/thermage-flx-purple-logo-ko-transparent_ee2a08e6.webp" alt="Thermage FLX" />}
            <span className={isThermage && lang === "ko" ? "ultherapy-prime-desktop__thermage-logo-fallback" : undefined}>{isThermage ? <>Thermage<sup>®</sup></> : <>Ultherapy<sup>®</sup></>}</span><em className={isThermage && lang === "ko" ? "ultherapy-prime-desktop__thermage-logo-fallback" : undefined}>{isThermage ? "FLX" : "PRIME"}</em>
          </div>
          <p className="ultherapy-prime-desktop__eyebrow">{isThermage ? "PREMIUM RADIOFREQUENCY CARE" : "PREMIUM ULTRASOUND LIFTING"}</p>
          <h1 id="ultherapy-prime-title">{isThermage && lang === "ko" ? <>4세대에 걸친 진화된 써마지 FLX로 <br className="ultherapy-prime-desktop__thermage-hero-title-break" />리프팅을 넘어 강력한 타이트닝 효과까지</> : isThermage ? copy.heroTitle : <KoreanLineBreakTitle lang={lang} text={copy.heroTitle} firstLine="한 번의 시술로 최대 1년," />}</h1>
          <p className="ultherapy-prime-desktop__hero-description">{isThermage && lang === "ko" ? <>부산 서면 스타피부과에서 <br className="ultherapy-prime-desktop__thermage-hero-description-break" /><span className="ultherapy-prime-desktop__thermage-hero-description-accent">정품 써마지 FLX</span>를 경험하세요!</> : isThermage ? copy.heroDescription : <KoreanLineBreakTitle lang={lang} text={copy.heroDescription} firstLine="부산 서면 스타피부과에서," />}</p>
          <ul className="ultherapy-prime-desktop__trust-badges" aria-label={copy.trustTitles.join(", ")}>
            {isThermage ? THERMAGE_TRUST_BADGES.map((badge, index) => {
              const Icon = badge.Icon;
              return <li key={badge.key}><span className="ultherapy-prime-desktop__trust-icon ultherapy-prime-desktop__trust-icon--symbol"><Icon className="ultherapy-prime-desktop__thermage-trust-fallback" aria-hidden="true" /><img className="ultherapy-prime-desktop__thermage-trust-image" src={badge.image} alt="" /></span><strong>{copy.trustTitles[index]}</strong><span>{copy.trustSubtitles[index]}</span></li>;
            }) : TRUST_BADGES.map((badge, index) => (
              <li key={badge.key} className={badge.key === "authentic" ? "ultherapy-prime-desktop__trust-badge--authentic" : undefined}>
                <span className="ultherapy-prime-desktop__trust-icon"><img src={badge.image} alt="" /></span>
                <strong>{copy.trustTitles[index]}</strong>
                <span>{copy.trustSubtitles[index]}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="ultherapy-prime-desktop__hero-visual" aria-label={isThermage ? "Thermage FLX" : "Ultherapy Prime"}>
          <img className="ultherapy-prime-desktop__hero-device" src={isThermage ? THERMAGE_ASSET.device : ASSET.device} alt={isThermage ? "Thermage FLX radiofrequency skin-firmness device" : "Ultherapy Prime"} />
          {!isThermage && <img className="ultherapy-prime-desktop__hero-mobile-control-unit" src={ASSET.mobileControlUnit} alt={copy.mobileControlUnitAlt} />}
        </div>
      </div>
    </section>
  );
}

export default function UltherapyPrimeDesktopContent({ lang, youtubeUrl, treatment = "ultherapy" }: UltherapyPrimeProps) {
  const isThermage = treatment === "thermage";
  const thermageCopy = isThermage ? THERMAGE_FLX_COPY[lang] : null;
  const copy = thermageCopy ?? ULTHERAPY_PRIME_COPY[lang];
  const embedUrl = isThermage ? null : imageEmbedUrl(youtubeUrl);
  const fallbackVideoUrl = youtubeUrl || "https://www.youtube.com/@starpibu";
  const treatmentInfoRows = isThermage ? THERMAGE_FLX_INFO_ROWS[lang] : [];
  const combinationMedia = isThermage ? THERMAGE_COMBINATION_MEDIA : COMBINATION_MEDIA;
  const showThermageKoreanVideo = isThermage && lang === "ko";
  const [activeShortId, setActiveShortId] = useState<string | null>(null);

  return (
    <div className="ultherapy-prime-desktop ultherapy-prime-desktop__content" data-lang={lang} data-treatment={treatment}>
      <section className="ultherapy-prime-desktop__what" aria-labelledby="ultherapy-what-heading">
        <div className="ultherapy-prime-desktop__principle-grid">
          <div className="ultherapy-prime-desktop__principle-copy">
            <SectionHeading eyebrow={isThermage ? "HOW THERMAGE FLX WORKS" : "HOW ULTHERAPY WORKS"} title={isThermage && lang === "ko" ? <>써마지 FLX는<br className="ultherapy-prime-desktop__thermage-what-title-break" />어떤 시술인가요?</> : <AuthoredTreatmentTitle treatment={treatment} lang={lang} text={copy.whatTitle} koreanFirstLine="울쎄라피 프라임은" foreignHeading="what" />} />
            <p>{copy.whatParagraphs[0]}</p>
            <p>{copy.whatParagraphs[1]}</p>
            {!isThermage && <figure className="ultherapy-prime-desktop__principle-diagram ultherapy-prime-desktop__principle-diagram--mobile-inline">
              <img src={ASSET.procedureDepths} alt={copy.depthTitle} loading="lazy" />
            </figure>}
            {isThermage && lang === "ko" && <div className="ultherapy-prime-desktop__thermage-transfer-features" aria-label="써마지 FLX 특징">
              {THERMAGE_TRANSFER_FEATURES.map((feature) => <article key={feature.title}><figure><img src={feature.image} alt="" /></figure><h3>{feature.title}</h3><p>{feature.description}</p></article>)}
            </div>}
            <div className="ultherapy-prime-desktop__principle-depth-copy">
              <h3>{copy.depthTitle}</h3>
              <p>{copy.depthText}</p>
            </div>
          </div>
          <figure className="ultherapy-prime-desktop__principle-diagram">
            {isThermage ? <><img className="ultherapy-prime-desktop__thermage-principle-image ultherapy-prime-desktop__thermage-principle-image--default" src={THERMAGE_ASSET.principle} alt="Thermage FLX radiofrequency treatment" loading="lazy" /><img className="ultherapy-prime-desktop__thermage-principle-image ultherapy-prime-desktop__thermage-principle-image--ko-pc" src={THERMAGE_ASSET.principleHandpiece} alt="Thermage FLX handpiece" loading="lazy" /></> : <><img className="ultherapy-prime-desktop__principle-diagram--tablet" src={ASSET.depths} alt={copy.depthTitle} loading="lazy" /><img className="ultherapy-prime-desktop__principle-diagram--pc" src={ASSET.procedureDepths} alt={copy.depthTitle} loading="lazy" /></>}
          </figure>
        </div>
      </section>

      {isThermage && <section className="ultherapy-prime-desktop__treatment-info" aria-label="Thermage FLX treatment information">
        {lang === "ko" && <article className="ultherapy-prime-desktop__thermage-korean-adviser">
          <img className="ultherapy-prime-desktop__thermage-korean-adviser-device" src="/api/storage/thermage-flx-korean-device-background_eda63836.webp" alt="Thermage FLX device" loading="lazy" />
          <img className="ultherapy-prime-desktop__thermage-korean-adviser-doctor" src="/api/storage/thermage-flx-korean-doctor-011_4e2957fa.webp" alt="스타피부과 조시형 원장" loading="lazy" />
          <div className="ultherapy-prime-desktop__thermage-korean-adviser-copy">
            <small>THERMAGE FLX CLINICAL ADVISOR</small>
            <p>스타피부과 <strong>조시형 원장님은</strong><br />써마지 FLX 본사에서 공식인증한<br /><em>써마지 FLX 임상자문의</em>입니다.</p>
            <span>풍부한 임상 경험과 실력 차이를 바탕으로<br />써마지 FLX 시술을 통해 만족스러운 시술 경험을 제공하고 있습니다.</span>
          </div>
        </article>}
        <dl className="ultherapy-prime-desktop__treatment-info-table">{treatmentInfoRows.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
      </section>}

      {!isThermage && <section className="ultherapy-prime-desktop__split-section ultherapy-prime-desktop__authentic" aria-labelledby="ultherapy-authentic-heading">
        <div className="ultherapy-prime-desktop__split-copy">
          <SectionHeading eyebrow="AUTHENTICITY FIRST" title={<AuthoredTreatmentTitle treatment={treatment} lang={lang} text={copy.authTitle} koreanFirstLine="정품 울쎄라피 프라임" foreignHeading="auth" />} />
          <p>{copy.authParagraphs[0]}</p>
          <p className="ultherapy-prime-desktop__authentic-emphasis">{copy.authParagraphs[1]}</p>
          <div className="ultherapy-prime-desktop__auth-seal"><BadgeCheck aria-hidden="true" /><span>{copy.certificationTitle}</span></div>
        </div>
        <div className="ultherapy-prime-desktop__authentic-media">
          <figure className="ultherapy-prime-desktop__authentic-equipment ultherapy-prime-desktop__authentic-equipment--pc-hidden"><img src={ASSET.handpiece} alt="Ultherapy Prime DeepSEE handpiece" loading="lazy" /></figure>
          <figure className="ultherapy-prime-desktop__authentic-depth"><img src={ASSET.depthReference} alt={copy.depthTitle} loading="lazy" /><figcaption><KoreanMobileLineBreak lang={lang} text={copy.authCaption} firstLine="정품 팁에서 초음파 에너지를 사용해" /></figcaption></figure>
        </div>
      </section>}

      <section className="ultherapy-prime-desktop__collagen" aria-labelledby="ultherapy-collagen-heading">
        <SectionHeading eyebrow="COLLAGEN REMODELING" title={copy.collagenTitle} />
        {isThermage && lang === "ko" && <p className="ultherapy-prime-desktop__thermage-korean-collagen-intro">표피를 냉각시키고 진피 조직에 열을 발생시키는 원리를 사용해 고주파 에너지를 전달함으로써<br />콜라겐 섬유의 변성 및 수축을 일으켜 콜라겐 재생이 이루어지면서 피부 탄력 개선에 도움을 줍니다.</p>}
        <ol className="ultherapy-prime-desktop__collagen-grid">
          {copy.collagenStages.map((label, index) => (
            <li key={label}>
              <figure>{isThermage && lang === "ko" ? <><img className="ultherapy-prime-desktop__thermage-korean-collagen-image-default" src={[THERMAGE_ASSET.closeup, THERMAGE_ASSET.handpiece, THERMAGE_ASSET.principle][index]} alt={label} loading="lazy" /><img className="ultherapy-prime-desktop__thermage-korean-collagen-image-alt" src={THERMAGE_KOREAN_COLLAGEN_IMAGES[index]} alt={THERMAGE_KOREAN_COLLAGEN_LABELS[index]} loading="lazy" /></> : <img src={isThermage ? [THERMAGE_ASSET.closeup, THERMAGE_ASSET.handpiece, THERMAGE_ASSET.principle][index] : COLLAGEN_IMAGES[index]} alt={label} loading="lazy" />}</figure>
              <span>STEP {index + 1}</span>
              <h3>{isThermage && lang === "ko" ? <><span className="ultherapy-prime-desktop__thermage-korean-collagen-title-default">{label}</span><span className="ultherapy-prime-desktop__thermage-korean-collagen-title-alt">{THERMAGE_KOREAN_COLLAGEN_LABELS[index]}</span></> : label}</h3>
            </li>
          ))}
        </ol>
        {!(isThermage && lang === "ko") && <p className="ultherapy-prime-desktop__section-closing">{copy.collagenNote}</p>}
      </section>

      <section className="ultherapy-prime-desktop__process" aria-labelledby="ultherapy-process-heading">
        <SectionHeading eyebrow={isThermage ? "THERMAGE FLX FEATURES" : "SEE · PLAN · TREAT"} title={copy.processTitle} />
        <ol className="ultherapy-prime-desktop__process-grid ultherapy-prime-desktop__process-grid--pc" aria-label={copy.processTitle}>
          {isThermage ? THERMAGE_PROCESS_MEDIA.map((step, index) => <li className="ultherapy-prime-desktop__process-card" key={step.step}><div className="ultherapy-prime-desktop__process-card-copy"><span>{step.step}</span><h3>{step.title}</h3><p>{copy.processDescriptions[index]}</p></div><img src={step.image} alt={copy.processDescriptions[index]} width={508} height={578} loading="lazy" decoding="async" /></li>) : PROCESS_MEDIA.map((step, index) => <li className="ultherapy-prime-desktop__process-card" key={step.step}><div className="ultherapy-prime-desktop__process-card-copy"><span>{step.step}</span><h3>{step.title}</h3><p>{copy.processDescriptions[index]}{index === 0 && <sup>41, 42</sup>}</p></div><img src={step.image} alt={copy.processDescriptions[index]} width={508} height={578} loading="lazy" decoding="async" /></li>)}
        </ol>
        <p className="ultherapy-prime-desktop__process-note">{copy.processNote}</p>
      </section>

      {thermageCopy && <section className="ultherapy-prime-desktop__tips" aria-labelledby="thermage-tip-heading">
        <SectionHeading eyebrow="THERMAGE FLX TIPS" title={thermageCopy.tipTitle} />
        {lang === "ko" && <p className="ultherapy-prime-desktop__thermage-korean-tips-intro">보통 눈가 주변은 피부가 얇고 예민하여서 시술하기가 힘든데,<br />써마지 FLX는 아이 전용팁이 있어 눈가주름도 필 수 있으며, 토탈팁은 얼굴에 빠르게 시술 가능합니다.</p>}
        <div className="ultherapy-prime-desktop__tip-grid">
          {thermageCopy.tips.map((tip, index) => <article key={tip.name}><figure><img src={index === 0 ? THERMAGE_ASSET.totalTip : THERMAGE_ASSET.eyeTip} alt={tip.name} loading="lazy" /></figure><div><span>{tip.area}</span><h3>{tip.name}</h3><p>{isThermage && lang === "ko" ? <><span className="ultherapy-prime-desktop__thermage-korean-tip-description-default">{tip.description}</span><span className="ultherapy-prime-desktop__thermage-korean-tip-description-alt">{index === 1 ? <>눈가 미세 부위까지 정밀하고 섬세하게 적용하여<br />눈가 피부처짐, 다크서클을 개선합니다.</> : THERMAGE_KOREAN_TIP_MANUSCRIPT[index]}</span></> : tip.description}</p></div></article>)}
        </div>
      </section>}

      <section className={`ultherapy-prime-desktop__pain${isThermage && !showThermageKoreanVideo ? " ultherapy-prime-desktop__pain--no-media" : ""}`} aria-labelledby="ultherapy-pain-heading">
        <div className="ultherapy-prime-desktop__pain-main">
          <div className="ultherapy-prime-desktop__pain-copy">
            <SectionHeading eyebrow="COMFORT CARE" title={isThermage && lang === "ko" ? <><span className="ultherapy-prime-desktop__thermage-korean-pain-title-default">{copy.painTitle}</span><span className="ultherapy-prime-desktop__thermage-korean-pain-title-pc">써마지 FLX,<br />통증때문에 고민이라면?</span></> : <AuthoredTreatmentTitle treatment={treatment} lang={lang} text={copy.painTitle} koreanFirstLine="울쎄라피 프라임," foreignHeading="pain" />} />
            <ul className="ultherapy-prime-desktop__pain-options" aria-label={copy.painTitle}>
              {copy.painOptions.map((option) => <li key={option}>{option}</li>)}
            </ul>
            <p>{copy.painParagraphs[0]}</p>
            <p>{copy.painParagraphs[1]}</p>
          </div>
          {(!isThermage || showThermageKoreanVideo) && <div className={`ultherapy-prime-desktop__video-shell${showThermageKoreanVideo ? " ultherapy-prime-desktop__thermage-korean-video-shell" : ""}`}>
            {showThermageKoreanVideo ? (
              <iframe src="https://www.youtube.com/embed/aAk9py_Hfww?start=3&rel=0" title="써마지 FLX 시술 Q&A 영상" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
            ) : embedUrl ? (
              <iframe src={embedUrl} title={copy.qaTitle} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            ) : (
              <a href={fallbackVideoUrl} target="_blank" rel="noopener noreferrer" className="ultherapy-prime-desktop__video-fallback">
                <img src={ASSET.qa} alt={copy.qaTitle} loading="lazy" />
                <span><Play fill="currentColor" aria-hidden="true" /> {copy.watchYoutubeLabel} <ExternalLink aria-hidden="true" /></span>
              </a>
            )}
          </div>}
        </div>
        {(!isThermage || showThermageKoreanVideo) && <div className="ultherapy-prime-desktop__pain-shorts">
          <div className="ultherapy-prime-desktop__pain-shorts-divider" aria-hidden="true" />
          <h3>{showThermageKoreanVideo ? "써마지 FLX 영상으로 만나보세요" : copy.shortsTitle}</h3>
          <UltherapyPrimeShorts shorts={showThermageKoreanVideo ? THERMAGE_SHORTS : ULTHERAPY_SHORTS} activeShortId={activeShortId} onSelect={setActiveShortId} shortsAriaLabel={showThermageKoreanVideo ? "써마지 FLX 관련 숏폼 영상" : copy.shortsAriaLabel} playVideoLabel={showThermageKoreanVideo ? "영상 재생" : copy.playVideoLabel} />
        </div>}
      </section>

      <section className="ultherapy-prime-desktop__combination" aria-labelledby="ultherapy-combination-heading">
        <SectionHeading eyebrow="BETTER TOGETHER" title={isThermage && lang === "ko" ? <><span className="ultherapy-prime-desktop__thermage-korean-combination-title-default">{copy.combinationTitle}</span><span className="ultherapy-prime-desktop__thermage-korean-combination-title-pc">써마지 FLX와 함께하면 좋은 시술</span></> : isThermage ? copy.combinationTitle : (lang === "ko" ? <KoreanMobileOnlyLineBreak lang={lang} text={copy.combinationTitle} firstLine="울쎄라피 프라임과" /> : <ForeignMobileHeadingLineBreak lang={lang} text={copy.combinationTitle} heading="combination" />)} />
        {isThermage && lang === "ko" && <p className="ultherapy-prime-desktop__thermage-korean-combination-intro">피부타입, 연령, 성별에 맞춰 써마지 FLX의 만족도를 높이는 파워 부스팅 시술로 확실한 리프팅 효과를 경험해보세요.</p>}
        <div className="ultherapy-prime-desktop__combination-grid">
          {copy.combinationTitles.map((title, index) => {
            const media = combinationMedia[index];
            const isKoreanThermageFirstCard = isThermage && lang === "ko" && index === 0;
            const isKoreanThermageCombination = isThermage && lang === "ko" && title.startsWith("써마지 FLX +");
            const koreanThermageCombinationRest = title.replace("써마지 FLX +", "").trimStart();
            const koreanThermageCombinationBadge = isThermage && lang === "ko" ? ["BEST", "인기"][index] : undefined;
            return (
              <article key={title}>
                <div className="ultherapy-prime-desktop__combination-image">
                  {isKoreanThermageFirstCard ? <><span className="ultherapy-prime-desktop__thermage-korean-combination-media-default"><img src={media.image} alt={title} loading="lazy" />{"secondaryImage" in media && media.secondaryImage && <img src={media.secondaryImage} alt="" aria-hidden="true" loading="lazy" />}</span><img className="ultherapy-prime-desktop__thermage-korean-combination-ultherapy-image" src={THERMAGE_KOREAN_COMBINATION_ULTHERAPY_IMAGE} alt="울쎄라피 프라임 장비" loading="lazy" /></> : <><img src={media.image} alt={title} loading="lazy" />{"secondaryImage" in media && media.secondaryImage && <img src={media.secondaryImage} alt="" aria-hidden="true" loading="lazy" />}</>}
                </div>
                {(copy.combinationBadges[index] || koreanThermageCombinationBadge) && <span className={`ultherapy-prime-desktop__combination-badge${koreanThermageCombinationBadge ? " ultherapy-prime-desktop__thermage-korean-combination-badge" : ""}`}>{copy.combinationBadges[index] || koreanThermageCombinationBadge}</span>}
                <h3>{isKoreanThermageCombination ? <><span className="ultherapy-prime-desktop__thermage-korean-combination-card-title-default">{title}</span><span className="ultherapy-prime-desktop__thermage-korean-combination-card-title-pc">써마지 FLX +<br />{koreanThermageCombinationRest}</span></> : !isThermage && lang === "ko" ? <KoreanMobileOnlyLineBreak lang={lang} text={title} firstLine="울쎄라피 프라임" /> : title.split("\n").map((line, lineIndex) => <span key={`${title}-${line}`}>{lineIndex > 0 && <br />}{line}</span>)}</h3>
                <p>{copy.combinationDescriptions[index]}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="ultherapy-prime-desktop__recommend" aria-labelledby="ultherapy-recommend-heading">
        <div className="ultherapy-prime-desktop__recommend-copy">
          <SectionHeading eyebrow="RECOMMENDED FOR" title={isThermage && lang === "ko" ? <><span className="ultherapy-prime-desktop__thermage-korean-recommend-title-default">{copy.recommendTitle}</span><span className="ultherapy-prime-desktop__thermage-korean-recommend-title-pc">써마지 FLX,<br />이런 분께 추천합니다</span></> : <AuthoredTreatmentTitle treatment={treatment} lang={lang} text={copy.recommendTitle} koreanFirstLine="울쎄라피 프라임," foreignHeading="recommend" />} />
          <ul>
            {copy.recommendations.map((recommendation) => <li key={recommendation}><Check aria-hidden="true" />{recommendation}</li>)}
          </ul>
        </div>
        <figure className="ultherapy-prime-desktop__areas-figure">
          <img src={isThermage ? THERMAGE_ASSET.areas : ASSET.areas} alt={copy.areasCaption} loading="lazy" />
          <figcaption>{copy.areasCaption}</figcaption>
        </figure>
      </section>

      <section className="ultherapy-prime-desktop__star" aria-labelledby="ultherapy-star-heading">
        <SectionHeading eyebrow="WHY STAR DERMATOLOGY" title={isThermage && lang === "ko" ? <><span className="ultherapy-prime-desktop__thermage-korean-star-title-default">{copy.starTitle}</span><span className="ultherapy-prime-desktop__thermage-korean-star-title-pc">당신의 소중한 젊음,<br />스타피부과가 돌려드립니다.</span></> : <AuthoredTreatmentTitle treatment={treatment} lang={lang} text={copy.starTitle} koreanFirstLine="당신의 소중한 젊음," foreignHeading="star" />} />
        <p className="ultherapy-prime-desktop__star-intro">{isThermage && lang === "ko" ? <><span className="ultherapy-prime-desktop__thermage-korean-star-intro-default">{copy.starIntro}</span><span className="ultherapy-prime-desktop__thermage-korean-star-intro-pc">스타피부과는 개인별 피부 타입과 얼굴형에 맞춰 시술 층의 깊이, 샷수, 부위 등 한 샷 한 샷 신중하게 시술하여 가장 아름다운 얼굴선을 이끌어 냅니다.</span></> : copy.starIntro}</p>
        {thermageCopy && <figure className="ultherapy-prime-desktop__thermage-director"><img src={THERMAGE_ASSET.director} alt={thermageCopy.directorCaption} loading="lazy" /><figcaption>{thermageCopy.directorCaption}</figcaption></figure>}
        <div className="ultherapy-prime-desktop__strength-grid">
          {copy.strengths.map((text, index) => {
            const Icon = STRENGTH_ICONS[index];
            const koreanThermagePcStrength = isThermage && lang === "ko" ? THERMAGE_KOREAN_PC_STRENGTHS[index] : null;
            return <div key={text}><Icon aria-hidden="true" /><p>{koreanThermagePcStrength ? <><span className="ultherapy-prime-desktop__thermage-korean-strength-default">{text.split("\n").map((line, lineIndex) => <span key={`${text}-${line}`}>{lineIndex > 0 && <br />}{line}</span>)}</span><span className="ultherapy-prime-desktop__thermage-korean-strength-pc">{koreanThermagePcStrength.split("\n").map((line, lineIndex) => <span key={`${koreanThermagePcStrength}-${line}`}>{lineIndex > 0 && <br />}{line}</span>)}</span></> : text.split("\n").map((line, lineIndex) => <span key={`${text}-${line}`}>{lineIndex > 0 && <br />}{line}</span>)}</p></div>;
          })}
        </div>
        <div className="ultherapy-prime-desktop__star-certification" aria-label={copy.certificationTitle}>
          <img src={isThermage ? THERMAGE_ASSET.certificate : ASSET.authenticity} alt="" loading="lazy" />
          {isThermage && lang === "ko" ? <><p className="ultherapy-prime-desktop__thermage-korean-certification-default"><strong>{copy.certificationTitle}</strong> — {copy.certificationText}</p><div className="ultherapy-prime-desktop__thermage-korean-certification-pc"><p className="ultherapy-prime-desktop__thermage-korean-certification-heading">스타피부과는 써마지 FLX 정품팁을 사용합니다.</p><p className="ultherapy-prime-desktop__thermage-korean-certification-description">스타피부과는 미국 식품의약국(FDA)와 한국 식약처(MFDS)의 승인을 받은 써마지 FLX 장비와 정품팁을 사용하고 있습니다. 써마지 FLX 시술 팁은 한 분에게만 제공되는 1회용 소모품으로써 식품의약품안전처 허가받은 정품팁을 사용하는지 반드시 확인하셔야 합니다.</p></div></> : <p><strong>{copy.certificationTitle}</strong> — {copy.certificationText}</p>}
        </div>
      </section>
    </div>
  );
}

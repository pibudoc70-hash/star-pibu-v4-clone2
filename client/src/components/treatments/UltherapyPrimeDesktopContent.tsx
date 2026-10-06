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

type UltherapyPrimeDesktopContentProps = {
  youtubeUrl?: string | null;
};

const TRUST_BADGES = [
  { key: "authentic", title: "정품 인증 병원", subtitle: "정품 울쎄라피 사용", image: ASSET.authenticity, alt: "울쎄라피 프라임 정품 병원 인증" },
  { key: "fda", title: "FDA 승인", subtitle: "특허받은 단독기술", image: ASSET.fda, alt: "FDA Cleared" },
  { key: "specialist", title: "피부과전문의 시술", subtitle: "믿고 안전하게!", image: ASSET.specialist, alt: "피부과전문의" },
] as const;

const COLLAGEN_STAGES = [
  { image: ASSET.collagenOne, label: "약화된 콜라겐으로 처진 피부" },
  { image: ASSET.collagenTwo, label: "울쎄라피 시술 중" },
  { image: ASSET.collagenThree, label: "촉진된 콜라겐으로 팽팽한 피부" },
] as const;

const PROCESS_STEPS: ReadonlyArray<{
  compositeImage: string;
  image: string;
  imageAlt: string;
  step: string;
  title: ReactNode;
  description: ReactNode;
}> = [
  {
    compositeImage: ASSET.see,
    image: ASSET.processSee,
    imageAlt: "울쎄라피 프라임 트랜스듀서와 초음파 영상으로 확인하는 1.5mm·3.0mm·4.5mm 피부 조직층",
    step: "STEP. 01",
    title: <><strong>S</strong>EE</>,
    description: <>피부 속 조직층을<br />실시간으로<br />정확히 확인<sup>41, 42</sup></>,
  },
  {
    compositeImage: ASSET.plan,
    image: ASSET.processPlan,
    imageAlt: "얼굴에 리프팅 라인을 표시한 개인별 맞춤 시술 계획 이미지",
    step: "STEP. 02",
    title: <><strong>P</strong>LAN</>,
    description: <>개개인의 피부<br />상태에 따라<br />맞춤 시술 계획 수립</>,
  },
  {
    compositeImage: ASSET.treat,
    image: ASSET.processTreat,
    imageAlt: "울쎄라피 프라임 팁과 피부 단면에서 열 응고점이 형성되는 시술 이미지",
    step: "STEP. 03",
    title: <><strong>T</strong>REAT</>,
    description: <>섬세하고<br />정확하게 시술</>,
  },
];

const COMBINATIONS = [
  {
    title: "울쎄라피 + 써마지 FLX",
    badge: "BEST",
    image: ASSET.thermage,
    alt: "써마지 FLX 장비",
    description: "초음파로 피부 속 콜라겐을, 고주파로 피부 겉 탄력섬유를 동시에 재생시키는 최고의 리프팅 레이저 조합",
  },
  {
    title: "울쎄라피 + 올리지오X",
    badge: "인기",
    image: ASSET.oligiox,
    alt: "올리지오X 장비",
    description: "고주파 써마지 비용이 부담스럽다면 가성비 좋은 올리지오X로 울써마지 효과 그대로, 피부 탄력과 윤곽을 동시에 UP",
  },
  {
    title: "울쎄라피 + 온다 + 브이로",
    image: ASSET.onda,
    alt: "온다 장비",
    description: "초음파, 고주파, 마이크로웨이브파의 시너지를 담은 이중턱·심부볼·볼처짐에 탁월한 복합 리프팅",
  },
  {
    title: "울쎄라피 + 루메니스원 + 리쥬란",
    image: ASSET.lumenis,
    secondaryImage: ASSET.rejuran,
    alt: "루메니스원과 리쥬란",
    description: "초음파 콜라겐 재생으로 피부 속 탄력을 올려주고 피부톤 개선과 물광 효과를 한 번에 느낄 수 있는 꿀조합",
  },
  {
    title: "울쎄라피 + 스킨보톡스",
    image: ASSET.skinBotox,
    alt: "스킨보톡스 시술 이미지",
    description: "피부 속 탄력과 진피층의 미세근섬유 주름을 동시에 개선하고 피부 광택까지",
  },
] as const;

const RECOMMENDATIONS = [
  "수술 없이 자연스러운 리프팅 효과를 원하시는 분",
  "나이가 들면서 처지는 턱선이 고민이신 분",
  "주름, 피부 탄력의 전반적인 개선을 원하시는 분",
  "울퉁불퉁한 얼굴라인을 매끈하게 정리하고 싶으신 분",
  "회복시간이 따로 필요 없는 리프팅을 원하시는 분",
] as const;

const ULTHERAPY_SHORTS = [
  { id: "uOaql94ArBQ", title: "울쎄라 리프팅 어떤 원리일까? #부산피부과 #부산울쎄라 #부산울쎄라피 #부산울쎄라피프라임" },
  { id: "SCYXRjhB9rU", title: "울쎄라, 써마지 함께하면 리프팅 효과 좋은가요? #부산울쎄라 #부산써마지 #부산울써마지 #부산피부과 #부산피부과전문의" },
  { id: "ZBeG2Ntn-kg", title: "울쎄라 통증 때문에 샷 수 줄여야되나요? #부산울쎄라 #부산리프팅 #울쎄라600샷 #피부과전문의" },
  { id: "I4oaLkc9eos", title: "울쎄라 300샷 vs 600샷, 도대체 몇 샷을 해야 할까요? #부산울쎄라 #부산피부과 #피부과전문의" },
] as const;

const STAR_STRENGTHS = [
  { key: "dermatologist", icon: BadgeCheck, text: <>대한민국 의사의<br />단 2% 피부과전문의</> },
  { key: "experience", icon: Stethoscope, text: <>대학병원 교수출신 의료진,<br />20년 이상의 수많은 시술 경험</> },
  { key: "plan", icon: Target, text: <>1:1 체계적인<br />맞춤 플랜 리프팅</> },
  { key: "devices", icon: Crown, text: <>울쎄라피 프라임 외<br />리프팅 장비 다수 보유</> },
] as const;

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

function UltherapyPrimeShorts({ activeShortId, onSelect }: { activeShortId: string | null; onSelect: (videoId: string) => void }) {
  return (
    <div className="ultherapy-prime-desktop__shorts" role="group" aria-label="울쎄라피 관련 숏폼 영상">
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
            <button type="button" aria-label={`영상 재생: ${short.title}`} onClick={() => onSelect(short.id)}>
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

export function UltherapyPrimeDesktopHero() {
  return (
    <section className="ultherapy-prime-desktop ultherapy-prime-desktop__hero" aria-labelledby="ultherapy-prime-title">
      <div className="ultherapy-prime-desktop__hero-inner">
        <div className="ultherapy-prime-desktop__hero-copy">
          <div className="ultherapy-prime-desktop__wordmark" aria-label="Ultherapy Prime">
            <span>Ultherapy<sup>®</sup></span>
            <em>PRIME</em>
          </div>
          <p className="ultherapy-prime-desktop__eyebrow">PREMIUM ULTRASOUND LIFTING</p>
          <h1 id="ultherapy-prime-title">한 번의 시술로 최대 1년,<br />안전하고 확실하게 끌어올리는 리프팅</h1>
          <p className="ultherapy-prime-desktop__hero-description">부산 서면 스타피부과에서,<br />정품 울쎄라피 프라임을 경험하세요</p>
          <ul className="ultherapy-prime-desktop__trust-badges" aria-label="울쎄라피 프라임 신뢰 기준">
            {TRUST_BADGES.map((badge) => (
              <li key={badge.key} className={badge.key === "authentic" ? "ultherapy-prime-desktop__trust-badge--authentic" : undefined}>
                <span className="ultherapy-prime-desktop__trust-icon"><img src={badge.image} alt={badge.alt} /></span>
                <strong>{badge.title}</strong>
                <span>{badge.subtitle}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="ultherapy-prime-desktop__hero-visual" aria-label="울쎄라피 프라임 장비와 정품 인증">
          <img className="ultherapy-prime-desktop__hero-device" src={ASSET.device} alt="울쎄라피 프라임 장비" />
        </div>
      </div>
    </section>
  );
}

/**
 * The authored PC cards live inside the desktop landing shell. This parallel,
 * visually-clipped semantic list keeps the same process copy available to
 * mobile-first crawlers without changing the established phone presentation.
 */
export function UltherapyPrimeProcessSeoFallback() {
  return (
    <ol className="ultherapy-prime-desktop__process-seo-fallback" aria-label="울쎄라피 프라임 3단계 시술 프로세스">
      {PROCESS_STEPS.map((step) => (
        <li key={step.step}>
          <span>{step.step}</span>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </li>
      ))}
    </ol>
  );
}

export default function UltherapyPrimeDesktopContent({ youtubeUrl }: UltherapyPrimeDesktopContentProps) {
  const embedUrl = imageEmbedUrl(youtubeUrl);
  const fallbackVideoUrl = youtubeUrl || "https://www.youtube.com/@starpibu";
  const [activeShortId, setActiveShortId] = useState<string | null>(null);

  return (
    <div className="ultherapy-prime-desktop ultherapy-prime-desktop__content">
      <section className="ultherapy-prime-desktop__what" aria-labelledby="ultherapy-what-heading">
        <div className="ultherapy-prime-desktop__what-heading--tablet">
          <SectionHeading eyebrow="HOW ULTHERAPY WORKS" title={<>울쎄라피 프라임은<br />어떤 시술인가요?</>} />
        </div>
        <div className="ultherapy-prime-desktop__principle-grid">
          <div className="ultherapy-prime-desktop__principle-copy">
            <div className="ultherapy-prime-desktop__what-heading--pc">
              <SectionHeading eyebrow="HOW ULTHERAPY WORKS" title={<>울쎄라피 프라임은<br />어떤 시술인가요?</>} />
            </div>
            <p>울쎄라피 프라임은 피부 표면의 손상 없이 피부 속 조직에 고강도 초음파 에너지를 전달하여 피부 속 콜라겐을 변성·수축시키고, 새로운 콜라겐을 생성시키는 리프팅 시술입니다.</p>
            <p>고강도 집속 초음파 에너지를 콜라겐 재생에 최적인 온도(60~70℃)로 피부 속에 조사하여, 피부 속 약 1mm 이하의 열 응고점(TCP)을 생성합니다.</p>
            <div className="ultherapy-prime-desktop__principle-depth-copy">
              <h3>피부층별 깊이를 정밀하게</h3>
              <p>울쎄라피 프라임은 서로 다른 종류의 트랜스듀서로 피부층별 깊이(1.5mm·3.0mm·4.5mm)에 초음파 에너지를 균일하게 전달합니다.</p>
            </div>
          </div>
          <figure className="ultherapy-prime-desktop__principle-diagram">
            <img className="ultherapy-prime-desktop__principle-diagram--tablet" src={ASSET.depths} alt="시술 적용 깊이 1.5mm, 3.0mm, 4.5mm와 피부층별 라벨이 표시된 울쎄라피 프라임 깊이 다이어그램" loading="lazy" />
            <img className="ultherapy-prime-desktop__principle-diagram--pc" src={ASSET.procedureDepths} alt="시술 적용 깊이 1.5mm, 3.0mm, 4.5mm와 피부층별 라벨이 표시된 울쎄라피 프라임 깊이 단면도" loading="lazy" />
          </figure>
        </div>
      </section>

      <section className="ultherapy-prime-desktop__split-section ultherapy-prime-desktop__authentic" aria-labelledby="ultherapy-authentic-heading">
        <div className="ultherapy-prime-desktop__split-copy">
          <div className="ultherapy-prime-desktop__auth-heading--tablet">
            <SectionHeading eyebrow="AUTHENTICITY FIRST" title={<>왜 꼭 ‘정품 <span className="ultherapy-prime-desktop__auth-title-brand">울쎄라피&nbsp;프라임</span>’이어야 할까요?</>} />
          </div>
          <div className="ultherapy-prime-desktop__auth-heading--pc">
            <SectionHeading eyebrow="AUTHENTICITY FIRST" title={<><span className="ultherapy-prime-desktop__auth-title-line">정품 <span className="ultherapy-prime-desktop__auth-title-brand">울쎄라피&nbsp;프라임</span></span><br /><span className="ultherapy-prime-desktop__auth-title-line">중요한 이유</span></>} />
          </div>
          <p>초음파 리프팅 시술의 효과를 제대로 경험하기 위해서는 꼭 정품 울쎄라피 프라임으로 시술받아야 합니다. 정품 팁이 아닌 경우 피부층에 적정 에너지가 전달되지 않거나 피부와 밀착이 잘 되지 않아 리프팅 효과 저하는 물론 화상의 위험이 있을 수 있습니다.</p>
          <p>정품 팁은 60~70℃의 열을 정밀하게 전달하도록 설계된 특허받은 단독 기술입니다.</p>
          <div className="ultherapy-prime-desktop__auth-seal"><BadgeCheck aria-hidden="true" /><span>정품 인증 병원</span></div>
          </div>
          <div className="ultherapy-prime-desktop__authentic-media">
            <figure className="ultherapy-prime-desktop__authentic-equipment ultherapy-prime-desktop__authentic-equipment--pc-hidden">
              <img src={ASSET.handpiece} alt="울쎄라피 프라임 DeepSEE 핸드피스" loading="lazy" />
          </figure>
          <figure className="ultherapy-prime-desktop__authentic-depth">
            <img src={ASSET.depthReference} alt="1.0mm, 1.5mm, 3.0mm, 4.5mm 깊이와 DS 4-4.5 핸드피스가 표시된 피부 단면 다이어그램" loading="lazy" />
            <figcaption>정품 팁에서 초음파 에너지를 사용해 60~70℃의 열을 정밀하게 전달</figcaption>
          </figure>
        </div>
      </section>

      <section className="ultherapy-prime-desktop__collagen" aria-labelledby="ultherapy-collagen-heading">
        <SectionHeading eyebrow="COLLAGEN REMODELING" title="콜라겐이 재생되는 과정" />
        <ol className="ultherapy-prime-desktop__collagen-grid">
          {COLLAGEN_STAGES.map((stage, index) => (
            <li key={stage.label}>
              <figure><img src={stage.image} alt={stage.label} loading="lazy" /></figure>
              <span>STEP {index + 1}</span>
              <h3>{stage.label}</h3>
            </li>
          ))}
        </ol>
        <p className="ultherapy-prime-desktop__section-closing">내 피부 속의 노화된 콜라겐은 점차적으로 재생되고, 건강한 콜라겐이 더 생겨나면서 리프팅 효과가 지속되고 유지될 수 있습니다.</p>
      </section>

      <section className="ultherapy-prime-desktop__process" aria-labelledby="ultherapy-process-heading">
        <SectionHeading eyebrow="SEE · PLAN · TREAT" title="3단계 시술 프로세스" />
        <div className="ultherapy-prime-desktop__process-grid ultherapy-prime-desktop__process-grid--composite">
          {PROCESS_STEPS.map((step) => <img key={step.compositeImage} src={step.compositeImage} alt="" aria-hidden="true" loading="lazy" />)}
        </div>
        <ol className="ultherapy-prime-desktop__process-grid ultherapy-prime-desktop__process-grid--pc" aria-label="울쎄라피 프라임 3단계 시술 프로세스">
          {PROCESS_STEPS.map((step) => (
            <li className="ultherapy-prime-desktop__process-card" key={step.step}>
              <div className="ultherapy-prime-desktop__process-card-copy">
                <span>{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              <img src={step.image} alt={step.imageAlt} width={508} height={578} loading="lazy" decoding="async" />
            </li>
          ))}
        </ol>
        <p className="ultherapy-prime-desktop__process-note">같은 시술이라도 피부 상태에 따라 달라야 하기에, 피부 깊이와 상태를 확인해 개인별 맞춤 시술을 진행합니다.</p>
      </section>

      <section className="ultherapy-prime-desktop__pain" aria-labelledby="ultherapy-pain-heading">
        <div className="ultherapy-prime-desktop__pain-copy">
          <SectionHeading eyebrow="COMFORT CARE" title={<><span className="ultherapy-prime-desktop__pain-title-line">울쎄라피 프라임,</span><br /><span className="ultherapy-prime-desktop__pain-title-line">통증 때문에 고민이라면?</span></>} />
          <ul className="ultherapy-prime-desktop__pain-options" aria-label="스타피부과 통증 케어 옵션">
            <li>마취크림</li>
            <li>국소마취주사</li>
            <li>수면마취</li>
          </ul>
          <p>스타피부과는 통증케어 시스템(마취크림, 국소마취주사)을 통해 통증을 줄이고, 보다 통증에 민감하신 경우 선택적인 수면마취 시스템까지 제공하고 있어 높은 효율의 편안한 시술이 가능합니다.</p>
          <p>특히 수면마취는 시술 통증을 줄이고, 환자의 긴장감과 불안함을 해소하여 편안한 상태에서 시술받을 수 있다는 장점이 있습니다.</p>
          <UltherapyPrimeShorts activeShortId={activeShortId} onSelect={setActiveShortId} />
        </div>
        <div className="ultherapy-prime-desktop__video-shell">
          {embedUrl ? (
            <iframe src={embedUrl} title="피부과전문의가 알려주는 울쎄라피 프라임 Q&A" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          ) : (
            <a href={fallbackVideoUrl} target="_blank" rel="noopener noreferrer" className="ultherapy-prime-desktop__video-fallback">
              <img src={ASSET.qa} alt="피부과전문의가 알려주는 울쎄라피 프라임 Q&A" loading="lazy" />
              <span><Play fill="currentColor" aria-hidden="true" /> YouTube에서 영상 보기 <ExternalLink aria-hidden="true" /></span>
            </a>
          )}
        </div>
      </section>

      <section className="ultherapy-prime-desktop__combination" aria-labelledby="ultherapy-combination-heading">
        <SectionHeading eyebrow="BETTER TOGETHER" title="울쎄라피 프라임과 함께하면 좋은 시술" />
        <div className="ultherapy-prime-desktop__combination-grid">
          {COMBINATIONS.map((combination) => (
            <article key={combination.title}>
              <div className="ultherapy-prime-desktop__combination-image">
                <img src={combination.image} alt={combination.alt} loading="lazy" />
                {"secondaryImage" in combination && combination.secondaryImage && <img src={combination.secondaryImage} alt="" aria-hidden="true" loading="lazy" />}
              </div>
              {"badge" in combination && combination.badge && <span className="ultherapy-prime-desktop__combination-badge">{combination.badge}</span>}
              <h3>{combination.title}</h3>
              <p>{combination.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ultherapy-prime-desktop__recommend" aria-labelledby="ultherapy-recommend-heading">
        <div className="ultherapy-prime-desktop__recommend-copy">
          <SectionHeading eyebrow="RECOMMENDED FOR" title={<>울쎄라피 프라임,<br />이런 분께 추천합니다</>} />
          <ul>
            {RECOMMENDATIONS.map((recommendation) => <li key={recommendation}><Check aria-hidden="true" />{recommendation}</li>)}
          </ul>
        </div>
        <figure className="ultherapy-prime-desktop__areas-figure">
          <img src={ASSET.areas} alt="울쎄라피 프라임 시술 가능 부위별 조사 패턴" loading="lazy" />
          <figcaption>울쎄라피 프라임 시술 가능 부위</figcaption>
        </figure>
      </section>

      <section className="ultherapy-prime-desktop__star" aria-labelledby="ultherapy-star-heading">
        <SectionHeading eyebrow="WHY STAR DERMATOLOGY" title={<>당신의 소중한 젊음,<br />스타피부과가 돌려드립니다</>} />
        <p className="ultherapy-prime-desktop__star-intro">스타피부과는 개인별 피부 타입과 얼굴형에 맞춰 시술 층의 깊이, 샷수, 부위 등 한 샷 한 샷 신중하게 시술하여 가장 아름다운 얼굴선을 이끌어 냅니다.</p>
        <div className="ultherapy-prime-desktop__strength-grid">
          {STAR_STRENGTHS.map(({ key, icon: Icon, text }) => <div key={key}><Icon aria-hidden="true" /><p>{text}</p></div>)}
        </div>
        <div className="ultherapy-prime-desktop__star-certification" aria-label="울쎄라피 프라임 정품 인증 병원 안내">
          <img src={ASSET.authenticity} alt="울쎄라피 프라임 정품 병원 인증" loading="lazy" />
          <p><strong>울쎄라피 프라임 정품 인증 병원</strong> — 스타피부과는 멀츠 본사에서 인증한 울쎄라피 프라임 공식 정품 인증 병원으로, 최신 소프트웨어인 Amplify II로 업그레이드된 정품 장비와 정품 팁을 사용하고 있습니다.</p>
        </div>
      </section>
    </div>
  );
}

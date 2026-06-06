/**
 * TreatmentsEquipmentSection - 시술 안내 + 장비 소개 통합 섹션
 *
 * Design Philosophy: Modern Clinical Edge — 민트/네이비 듀오톤
 * - 카테고리 탭 선택 시 해당 시술 카드(좌) + 관련 장비(우) 동시 표시
 * - 데스크톱: 시술 2/3 + 장비 1/3 비율 2열 레이아웃
 * - 모바일: 시술 카드 → 장비 목록 순서로 세로 스택
 * - 카테고리: Best 시술 / 리프팅·탄력 / 눈밑지방 / 홍조·혈관확장 /
 *             색소·문신제거 / 흉터·모공치료 / 볼륨회복·스킨부스터 / 보톡스·필러 /
 *             여드름·액취증·다한증·발톱무좀
 */
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Clock, RefreshCw, ChevronDown, ChevronUp, AlertCircle, Repeat, Sparkles, ChevronRight, Star, Zap, Eye, Heart, Sun, Microscope, Droplets, Pill, Leaf, Wind, Circle, Layers, Footprints, ExternalLink } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import OptimizedImage from "@/components/OptimizedImage";
import { useLang } from "@/contexts/LangContext";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e";

// ─────────────────────────────────────────────────────────────────────────────
// 카테고리 정의 (9개)
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  best:        Star,
  lifting:     Zap,
  eye:         Eye,
  rosacea:     Heart,
  pigment:     Sun,
  scar:        Microscope,
  volume:      Droplets,
  botox:       Pill,
  acne_laser:  Leaf,
  acne:        Wind,
  fungus:      Footprints,
  vitiligo:    Circle,
  psoriasis:   Layers,
};

const CATEGORIES = [
  { id: "best",       label: "Best 시술",          labelEn: "BEST", labelJa: "ベスト施術", labelZh: "精选项目",          desc: "스타피부과에서 가장 많이 선택되는 대표 시술 프로그램입니다. 전문의가 직접 상담 후 피부 상태에 맞는 최적의 조합을 제안해 드립니다.",
    descEn: "The most popular treatment programs at Star Dermatology. Our specialists will recommend the optimal combination for your skin condition after a thorough consultation.",
    descJa: "スター皮膚科で最も多く選ばれる代表的な施術プログラムです。専門医が直接カウンセリングを行い、お肌の状態に合った最適な組み合わせをご提案します。",
    descZh: "星皮肤科最受欢迎的代表性治疗项目。专科医生亲自咨询后，为您推荐最适合您肤质的最佳组合方案。" },
  { id: "lifting",    label: "리프팅·탄력",         labelEn: "LIFTING", labelJa: "リフティング・弾力", labelZh: "提升·弹力",       desc: "처진 피부와 탄력 저하에 효과적인 리프팅 시술입니다. 울쏄라피·써마지 등 비절개 방식으로 자연스러운 리프팅 효과를 경험하세요.",
    descEn: "Effective lifting treatments for sagging skin and loss of elasticity. Experience natural lifting effects with non-surgical methods like Ultherapy and Thermage.",
    descJa: "たるんだ肌や弾力低下に効果的なリフティング施術です。ウルセラピー・サーマジなど非切開方式で自然なリフティング効果を体験してください。",
    descZh: "针对皮肤松弛和弹力下降的有效提升治疗。通过超声刀、热玛吉等非手术方式，体验自然的提升效果。" },
  { id: "eye",        label: "눈밑지방",            labelEn: "EYE", labelJa: "目の下の脂肪", labelZh: "眼袋脂肪",           desc: "눈밑 지방 재배치 및 다크서클 개선 전문 시술입니다. 스타피부과 원장이 직접 집도하며, 자연스럽고 생기 있는 눈매를 만들어 드립니다.",
    descEn: "Specialized treatments for under-eye fat repositioning and dark circle improvement. Our doctors perform the procedure directly for natural, vibrant eyes.",
    descJa: "目の下の脂肪再配置とクマ改善の専門施術です。スター皮膚科の院長が直接執刀し、自然で生き生きとした目元を作ります。",
    descZh: "眼袋脂肪重置及黑眼圈改善专项治疗。由星皮肤科院长亲自操作，打造自然有神的眼部轮廓。" },
  { id: "vitiligo",   label: "백반증",              labelEn: "VITILIGO", labelJa: "白斑症", labelZh: "白癜风",      desc: "피부 색소 소실로 인한 백반증을 전문적으로 치료합니다. 엑시머 레이저와 광선 치료를 병행하여 색소 재생을 유도합니다.",
    descEn: "Specialized treatment for vitiligo caused by loss of skin pigmentation. Combining excimer laser and phototherapy to stimulate pigment regeneration.",
    descJa: "皮膚の色素消失による白斑を専門的に治療します。エキシマレーザーと光線治療を併用して色素再生を促進します。",
    descZh: "专业治疗因皮肤色素脱失引起的白癜风。结合准分子激光和光线治疗，促进色素再生。" },
  { id: "pigment",    label: "색소·문신",           labelEn: "PIGMENT", labelJa: "色素・タトゥー", labelZh: "色素·纹身",       desc: "기미, 잡티, 문신 등 색소 병변을 효과적으로 제거합니다. 피부 타입에 맞는 레이저를 선택하여 부작용 없이 깨끗한 피부를 되찾아 드립니다.",
    descEn: "Effectively removes pigmented lesions such as melasma, freckles, and tattoos. Restore clear skin without side effects by selecting the right laser for your skin type.",
    descJa: "シミ、そばかす、タトゥーなどの色素病変を効果的に除去します。肌タイプに合ったレーザーを選択して、副作用なくきれいな肌を取り戻します。",
    descZh: "有效去除黄褐斑、雀斑、纹身等色素病变。根据肤质选择合适的激光，无副作用地恢复净白肌肤。" },
  { id: "scar",       label: "흉터·모공",           labelEn: "SCAR", labelJa: "傷跡・毛穴", labelZh: "疤痕·毛孔",          desc: "여드름 흉터, 수술 흉터, 넓어진 모공을 개선하는 시술입니다. 프락셀·CO2 레이저로 피부 재생을 촉진하여 매끄러운 피부결을 만들어 드립니다.",
    descEn: "Treatments to improve acne scars, surgical scars, and enlarged pores. Fraxel and CO2 lasers stimulate skin regeneration for smoother skin texture.",
    descJa: "ニキビ跡、手術跡、毛穴の開きを改善する施術です。フラクセル・CO2レーザーで皮膚再生を促進し、なめらかな肌質を作ります。",
    descZh: "改善痘疤、手术疤痕和毛孔粗大的治疗方案。通过飞梭激光、CO2激光促进皮肤再生，打造细腻肌肤。" },
  { id: "acne_laser", label: "여드름",              labelEn: "ACNE", labelJa: "ニキビ", labelZh: "痘痘",          desc: "여드름 원인을 근본적으로 치료하는 복합 시술 프로그램입니다. 피지 분비 조절부터 염증 완화, 흉터 예방까지 단계별로 관리해 드립니다.",
    descEn: "A comprehensive treatment program that addresses the root causes of acne. Step-by-step management from sebum regulation to inflammation relief and scar prevention.",
    descJa: "ニキビの原因を根本的に治療する複合施術プログラムです。皮脂分泌調整から炎症緩和、瘢痕予防まで段階的に管理します。",
    descZh: "从根本上治疗痘痘原因的综合治疗方案。从皮脂分泌调节到消炎、预防疤痕，进行阶段性管理。" },
  { id: "rosacea",    label: "홍조·혈관",           labelEn: "ROSACEA", labelJa: "紅潮・血管", labelZh: "红肌·血管",       desc: "얼굴 홍조, 실핏줄, 혈관 확장 등 혈관성 피부 고민을 해결합니다. 레이저 치료로 피부 톤을 균일하게 정돈해 드립니다.",
    descEn: "Resolves vascular skin concerns such as facial redness, broken capillaries, and dilated blood vessels. Laser treatment evens out skin tone.",
    descJa: "顔の紅潮、毛細血管拡張などの血管性肌悩みを解決します。レーザー治療で肌のトーンを均一に整えます。",
    descZh: "解决面部潮红、毛细血管扩张等血管性皮肤问题。通过激光治疗使肤色均匀。" },
  { id: "acne",       label: "액취증·다한증",       labelEn: "HYPERHIDROSIS", labelJa: "腋臭・多汗症", labelZh: "腋臭·多汗症", desc: "겨드랑이 냄새(액취증)와 과도한 땀 분비(다한증)를 효과적으로 치료합니다. 보톡스 주사, 레이저 치료로 일상의 불편함을 해소해 드립니다.",
    descEn: "Effective treatment for axillary odor (bromhidrosis) and excessive sweating (hyperhidrosis). Botox injections and laser treatments relieve daily discomfort.",
    descJa: "わきが（アポクリン汗腺臭）と多汗症を効果的に治療します。ボトックス注射、レーザー治療で日常の不快感を解消します。",
    descZh: "有效治疗腋臭和多汗症。通过肉毒素注射和激光治疗，消除日常生活中的不适。" },
  { id: "fungus",     label: "손·발톱무좀",         labelEn: "NAIL FUNGUS", labelJa: "爪水虫", labelZh: "甲癣",  desc: "주변 조직 손상 없이 곰팡이균만을 파괴하는 무좀 전용 레이저로 빠르고 간편하게 손·발톱무좀을 치료합니다.",
    descEn: "Fungal nail infection treated with a dedicated laser that destroys only the fungus without damaging surrounding tissue — fast and simple.",
    descJa: "周囲の組織を傷つけることなく真菌だけを破壊する爪水虫専用レーザーで、素早く簡単に爪水虫を治療します。",
    descZh: "使用专用激光在不损伤周围组织的情况下仅破坏真菌，快速简便地治疗甲癣（灰指甲）。" },
  { id: "psoriasis",  label: "건선·아토피",         labelEn: "PSORIASIS", labelJa: "乾癬・アトピー", labelZh: "银屑病·特应性",     desc: "만성 염증성 피부 질환인 건선과 아토피를 체계적으로 관리합니다. 증상 완화와 재발 방지를 위한 맞춤형 치료 계획을 제공합니다.",
    descEn: "Systematic management of psoriasis and atopic dermatitis, chronic inflammatory skin diseases. Customized treatment plans for symptom relief and relapse prevention.",
    descJa: "慢性炎症性皮膚疾患である乾癬とアトピーを体系的に管理します。症状緩和と再発防止のための個別化された治療計画を提供します。",
    descZh: "系统管理银屑病和特应性皮炎等慢性炎症性皮肤病。提供个性化治疗方案，缓解症状并预防复发。" },
  { id: "volume",     label: "볼륨·부스터",         labelEn: "VOLUME", labelJa: "ボリューム・ブースター", labelZh: "丰盈·提亮",        desc: "피부 속 수분과 볼륨을 채워 생기 있는 피부를 만드는 시술입니다. 리쥴란·엑소좀 등 피부 재생 성분으로 탄력과 광채를 동시에 개선합니다.",
    descEn: "Treatments to fill skin with moisture and volume for a radiant complexion. Rejuran, exosomes, and other skin regeneration ingredients improve elasticity and glow simultaneously.",
    descJa: "肌の中に水分とボリュームを補充して生き生きとした肌を作る施術です。リジュランやエクソソームなどの皮膚再生成分で弾力と輝きを同時に改善します。",
    descZh: "为肌肤补充水分和丰盈度，打造充满活力的肌肤。通过婴儿针、外泌体等皮肤再生成分，同时改善弹力和光泽。" },
  { id: "botox",      label: "보톡스·필러",         labelEn: "BOTOX", labelJa: "ボトックス・フィラー", labelZh: "肉毒素·填充",         desc: "주름 개선과 얼굴 윤곽 교정에 효과적인 시술입니다. 자연스러운 결과를 위해 소량씩 정밀하게 시술하며, 당일 일상 복귀가 가능합니다.",
    descEn: "Effective treatments for wrinkle improvement and facial contouring. Precise micro-dosing for natural results with same-day return to daily activities.",
    descJa: "しわ改善と顔のライン矯正に効果的な施術です。自然な結果のために少量ずつ精密に施術し、当日日常復帰が可能です。",
    descZh: "有效改善皱纹和面部轮廓的治疗。精准微量注射，效果自然，当天即可恢复日常生活。" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 시술 데이터
// ─────────────────────────────────────────────────────────────────────────────
interface Treatment {
  name: string;
  nameEn: string;
  nameJa?: string;
  nameZh?: string;
  desc: string;
  descEn?: string;
  descJa?: string;
  descZh?: string;
  time: string;
  timeEn?: string;
  timeJa?: string;
  timeZh?: string;
  recovery: string;
  recoveryEn?: string;
  recoveryJa?: string;
  recoveryZh?: string;
  badge?: string | null;
  badgeColor?: string;
  image: string;
  images?: string[];  // 복수 이미지 (나란히 표시)
  imgBg?: string;     // 이미지 배경 색상
  cardBannerImage?: string; // 카드 이미지 영역 전체를 덮는 배너 이미지
  best?: boolean;
  // 상세 모달용 추가 필드
  detail?: string;       // 더 긴 상세 설명
  caution?: string;      // 주의사항
  sessions?: string;     // 권장 횟수/주기
  effect?: string;       // 기대 효과
  related?: string[];    // 연관 시술 추천
  steps?: { step: number; title: string; desc: string }[]; // 치료 단계
  youtubeUrl?: string;  // 상세 모달 내 YouTube 영상 URL
  modalImage?: string;  // 유튜브 대신 모달에 표시할 이미지 URL
}

const TREATMENTS: Record<string, Treatment[]> = {
  // ── Best 시술 (4개 대표 프로그램) ────────────────────────────────────────────
  best: [
    {
      name: "울써마지 리프팅 + 리쥬란",
      nameEn: "ULTHERAPY + THERMAGE LIFT + REJURAN",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/울써마지리프팅_17bc44ff.png",
      desc: "리프팅의 끝판왕이라 불리는 울쎄라피+써마지 복합 리프팅에 피부 재생 리쥬란을 더한 프리미엄 프로그램.", descEn: "Premium program combining Ultherapy + Thermage lifting with Rejuran skin regeneration. Experience powerful lifting and skin renewal in a single session.", descJa: "ウルセラピー+サーマジ複合リフティングに皮膚再生リジュランを加えたプレミアムプログラム。1回の施術で強力なリフティングと肌再生を同時に体験できます。", descZh: "将超声刀+热玛吉复合提升与皮肤再生婴儿针相结合的高端项目。一次治疗同时体验强效提升和皮肤再生。",
      time: "90~120분", recovery: "당일 일상",
      badge: "진정하 시술", badgeColor: "#4A6FA5",
      image: `${CDN}/울쎄라피프라임_1_0daba485.png`,
      images: [
        `${CDN}/울쎄라피프라임_1_0daba485.png`,
        `${CDN}/써마지FLX_20a90462.png`,
      ],
      best: true,
      detail: "울쎄라피 프라임의 집속 초음파(HIFU) 에너지가 SMAS층(근막층)까지 도달하여 피부 깊은 곳에서부터 리프팅 효과를 유도하고, 써마지 FLX의 고주파 에너지가 진피 콜라겐을 자극하여 피부 탄력을 개선합니다. 여기에 리쥬란 힐러(연어 DNA 성분)를 추가하여 피부 재생과 수분 보충을 동시에 제공하는 복합 프리미엄 프로그램입니다. 진정하 시술로 진행되므로 통증 없이 편안하게 받을 수 있으며, 시술 당일 일상 복귀가 가능합니다.",
      caution: "시술 후 당일 세안은 부드럽게 하고, 강한 마사지나 사우나는 1주일간 피하세요. 초음파 에너지 특성상 시술 직후 약간의 붓기나 열감이 있을 수 있으나 1~2일 내 가라앉습니다.",
      sessions: "1~2회 (6~12개월 간격)",
      effect: "얼굴 리프팅, 피부 탄력 개선, 주름 완화, 피부 재생, 수분 보충",
      youtubeUrl: "https://www.youtube.com/embed/VeADRwws0e8",
    },
    {
      name: "프로파운드 RF 리프팅",
      nameEn: "PROFOUND RF LIFTING",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/프로파운드_22222541.png",
      desc: "마이크로니들 RF로 진피층에 직접 에너지를 전달하는 고효과 리프팅 시술.\n1회 시술로 강력한 탄력 개선을 원하는 분께 권장드립니다.", descEn: "High-efficacy lifting treatment that delivers RF energy directly to the dermis via microneedles. Recommended for those seeking powerful elasticity improvement in a single session.", descJa: "マイクロニードルRFで真皮層に直接エネルギーを届ける高効果リフティング施術。1回の施術で強力な弾力改善を望む方にお勧めです。", descZh: "通过微针将RF能量直接传递至真皮层的高效提升治疗。适合希望一次治疗获得强效弹力改善的人群。",
      time: "60~90분", recovery: "10일~2주",
      badge: "고효과 리프팅", badgeColor: "#4A6FA5",
      image: `${CDN}/프로파운드_93be7410.png`, best: true,
      detail: "프로파운드 RF는 마이크로니들을 통해 RF(고주파) 에너지를 진피층 정확한 깊이에 직접 전달하는 장비입니다. 피부 표면을 통과하지 않고 진피층에 직접 에너지를 전달하기 때문에, 표면 손상 없이 진피 내 콜라겐·엘라스틴·히알루론산 생성을 강력하게 자극합니다. 임상 연구에서 1회 시술로 콜라겐 생성이 유의미하게 증가하는 것으로 보고되어 있습니다. 시술 후 10일~2주의 회복 기간이 필요하지만, 그만큼 강력한 리프팅·탄력 개선 효과를 기대할 수 있습니다.",
      caution: "시술 후 10일~2주간 붓기와 멍이 나타날 수 있습니다. 이 기간 동안 중요한 일정이 없도록 미리 계획하세요. 시술 후 1주일간 격렬한 운동, 사우나, 음주는 피하세요. 자외선 차단제를 매일 사용하세요.",
      sessions: "1~2회 (12개월 간격)",
      effect: "피부 탄력 개선, 얼굴 리프팅, 콜라겐·엘라스틴 생성, 주름 완화, 피부 조직 강화",
      youtubeUrl: "https://www.youtube.com/embed/vZ0rL_XAXUU",
    },
    {
      name: "볼륨업 프로그램",
      nameEn: "VOLUME UP PROGRAM · SCULPTRA",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/볼륨업프로그램_3442a94f.png",
      desc: "FDA 승인 스컬트라로 피부 스스로 콜라겐을 생성해 자연스러운 볼륨을 회복.\n주름 개선·탄력·볼륨 회복 효과가 평균 2년 이상 지속됩니다.", descEn: "FDA-approved Sculptra stimulates your skin to naturally produce collagen for restored volume. Wrinkle improvement, elasticity, and volume restoration effects last an average of 2+ years.", descJa: "FDA承認スカルプトラで皮膚自らがコラーゲンを生成し、自然なボリュームを回復。しわ改善・弾力・ボリューム回復効果が平均2年以上持続します。", descZh: "FDA认证的塑然雅刺激皮肤自然产生胶原蛋白，恢复自然丰盈感。改善皱纹、弹力和丰盈度的效果平均持续2年以上。",
      time: "30~60분", recovery: "당일 일상",
      badge: "2년 지속", badgeColor: "#9C5FA5",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/treat-sculptra_c3f4b5f6.png", best: true,
      detail: "스컬트라(Sculptra)는 PLLA(폴리-L-락틱산) 성분의 생체 자극형 콜라겐 자극제입니다. 일반 히알루론산 필러처럼 즉각적인 볼륨 효과를 내는 것이 아니라, 주입 후 수개월에 걸쳐 피부 스스로 콜라겐을 생성하도록 유도합니다. 이 때문에 결과가 매우 자연스럽고, 효과가 평균 2년 이상 지속됩니다. FDA 승인 성분으로 안전성이 공인되어 있으며, 볼 꺼짐·팔자주름·관자놀이 볼륨 감소 등 다양한 부위에 활용할 수 있습니다.",
      caution: "시술 후 5-5-5 마사지(하루 5회, 5분씩, 5일간)를 반드시 시행하세요. 시술 직후 멍·붓기가 나타날 수 있으며 1~2주 내 가라앉습니다. 효과는 시술 후 2~3개월부터 서서히 나타납니다.",
      sessions: "2~3회 (4~6주 간격)",
      effect: "볼 볼륨 회복, 팔자주름 개선, 피부 탄력 향상, 콜라겐 생성 유도, 2년 이상 효과 지속",
      youtubeUrl: "https://www.youtube.com/embed/J6EcnHsUYew",
    },
    {
      name: "줄기세포 치료",
      nameEn: "STEM CELL THERAPY",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/줄기세포-치료_ff39fa9f.png",
      desc: "자신의 혈액·지방에서 추출한 줄기세포를 피부에 직접 주사하는 자가세포 치료.\n이상반응 위험이 낮고 피부 재생·탄력 개선 효과를 기대할 수 있습니다.", descEn: "Autologous cell therapy that directly injects stem cells extracted from your own blood or fat. Low risk of adverse reactions with expected skin regeneration and elasticity improvement.", descJa: "自分の血液・脂肪から抽出した幹細胞を皮膚に直接注射する自家細胞治療。異常反応リスクが低く、皮膚再生・弾力改善効果が期待できます。", descZh: "将从自身血液或脂肪中提取的干细胞直接注射到皮肤的自体细胞疗法。不良反应风险低，可期待皮肤再生和弹力改善效果。",
      time: "60~120분", recovery: "3~7일",
      badge: "자가세포", badgeColor: "#2E7D32",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/stemcell_treatment_card-oGb7XJiuyUVsc7VGWNioEw.webp", best: true,
      detail: "혈액 유래 줄기세포 치료는 소량의 혈액을 채취하여 원심분리 후 줄기세포 성분을 농축·분리하고 피부에 주사합니다. 지방 유래 줄기세포 치료는 복부·허벅지 등에서 소량의 지방을 채취하여 줄기세포를 분리한 뒤 피부에 주사합니다. 두 방법 모두 자신의 세포를 사용하므로 이상반응 위험이 낮으며, 피부 재생 인자를 직접 공급하여 피부 탄력·수분·결 개선을 유도합니다. 담당 의료진과의 충분한 상담을 통해 개인별 적합한 방법을 결정합니다.",
      caution: "시술 전 혈액 채취 또는 지방 채취 과정이 포함됩니다. 시술 후 3~7일간 주사 부위에 붓기·멍이 나타날 수 있습니다. 시술 후 1주일간 격렬한 운동과 음주는 피하세요. 효과는 개인차가 있으며 담당 의료진과 충분히 상담 후 결정하세요.",
      sessions: "1~3회 (담당 의료진 상담 후 결정)",
      effect: "피부 재생, 탄력 개선, 수분 보충, 피부결 정돈, 노화 개선",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/줄기세포-치료_ff39fa9f.png",
    },
    {
      name: "흉터 치료 프로그램",
      nameEn: "ULTRAPULSE + DRT + MIRAJET + TRIFILL PRO",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/흉터치료_d89a476f.png",
      desc: "울트라펄스 레이저·DRT·미라젯·트리필프로를 결합한 흉터 집중 프로그램.\n진정하 시술로 통증 걱정 없이 여드름·패인 흉터를 효과적으로 개선합니다.", descEn: "Intensive scar program combining UltraPulse laser, DRT, MiraJet, and TriFill Pro. Effectively improves acne and pitted scars without pain under sedation.", descJa: "ウルトラパルスレーザー・DRT・ミラジェット・トリフィルプロを組み合わせた瘢痕集中プログラム。鎮静下施術で痛みの心配なくニキビ・陥没瘢痕を効果的に改善します。", descZh: "结合超脉冲激光、DRT、美拉射和三合一填充的疤痕集中治疗方案。在镇静麻醉下无痛有效改善痘疤和凹陷性疤痕。",
      time: "60~90분", recovery: "5~7일",
      badge: "진정하 시술", badgeColor: "#81C7C9",
      image: `https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/equip-mcl31-ultrapulse_84704967.png`,
      images: [
        `https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/equip-mcl31-ultrapulse_84704967.png`,
        `https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/equip-ultrapulse-encore_0c14efd1.png`,
      ],
      best: true,
      detail: "울트라펄스 레이저로 흉터 표면을 정밀하게 제거하고, DRT(진피 리모델링 치료)로 진피층 콜라겐 재생을 유도합니다. 스킨젯으로 흉터 치료 약물을 무침 방식으로 진피에 직접 전달하고, 트리필프로로 패인 흉터 부위에 볼륨을 채워 음영을 개선합니다. 네 가지 치료를 한 번에 진행하는 집중 프로그램으로, 진정하 시술로 진행되어 통증 없이 치료받을 수 있습니다.",
      caution: "시술 후 5~7일간 피부 재생 기간이 필요합니다. 이 기간 동안 자외선 차단제를 철저히 바르고, 세안 시 자극을 최소화하세요. 재생 기간 중 딱지가 생길 수 있으며 자연스럽게 탈락되도록 두세요.",
      sessions: "3~5회 (4~6주 간격)",
      effect: "여드름 흉터 개선, 패인 흉터 볼륨 회복, 피부 재생, 콜라겐 생성 유도",
      youtubeUrl: "https://www.youtube.com/embed/DFB4SZU5U-g",
    },
    {
      name: "홍조 치료 프로그램",
      nameEn: "ROSACEA PROGRAM · EXCEL V+ + ADVATX",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/홍조치료_32fd1648.png",
      desc: "Excel V+·ADVATX 듀얼 레이저로 안면홍조·모세혈관 확장을 전문 치료.\n피부 표면에 상처 없이 붉은 피부를 눈에 띄게 개선하는 무상처 프로그램.", descEn: "Excel V+ and ADVATX dual laser for professional treatment of facial redness and capillary dilation. No-wound program that visibly improves red skin without surface damage.", descJa: "Excel V+・ADVATXデュアルレーザーで顔面紅潮・毛細血管拡張を専門治療。皮膚表面に傷をつけずに赤い肌を目に見えて改善する無傷プログラム。", descZh: "Excel V+和ADVATX双激光专业治疗面部潮红和毛细血管扩张。无创治疗方案，显著改善红肌而不损伤皮肤表面。",
      time: "20~40분", recovery: "1~2일",
      badge: "무상처 치료", badgeColor: "#E57373",
      image: `${CDN}/엑셀V_70001aa7.png`,
      images: [
        `${CDN}/엑셀V_70001aa7.png`,
        "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/아드바Tx_nobg_4efd6f20.png",
      ],
      imgBg: "#E0F2FE",
      best: true,
      detail: "Excel V+의 532nm KTP 레이저는 혈관 내 헤모글로빈에 선택적으로 흡수되어 확장된 혈관을 피부 표면에 상처 없이 응고·폐쇄합니다. ADVATX의 1,319nm 레이저는 진피 내 콜라겐 재생을 자극하여 혈관 주변 조직을 강화하고 홍조 재발을 억제합니다. 두 장비의 복합 치료로 안면홍조·모세혈관 확장·주사비(로사세아) 등 다양한 혈관성 피부 트러블을 체계적으로 개선할 수 있습니다. 시술 후 1~2일 내 경미한 붉기가 나타날 수 있으나 빠르게 가라앉습니다.",
      caution: "시술 후 1~2일간 세안 시 자극을 최소화하고, 뜨거운 음식·음주·사우나는 피하세요. 자외선 차단제(SPF 50+)를 매일 사용하시면 치료 효과 유지에 도움이 됩니다. 시술 직후 일시적인 붉기나 열감이 나타날 수 있으나 정상 반응입니다.",
      sessions: "4~6회 (2~4주 간격)",
      effect: "안면홍조 개선, 모세혈관 확장 감소, 피부 붉기 완화, 주사비(로사세아) 치료",
      youtubeUrl: "https://www.youtube.com/embed/Mt-JsBhZXmA",
    },
    {
      name: "기미 치료 프로그램",
      nameEn: "MELASMA PROGRAM · EXCEL V+ + ENLIGHTEN III",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/기미치료_b14edb2c.png",
      desc: "엑셀V+의 혈관 선택성 레이저와 엔라이튼3의 피코초 레이저를 복합한 기미 전문 프로그램. 기미 병변 아래 미세 혈관을 제거하고 표피·진피 색소를 동시에 분해하여 재발을 억제합니다. 시술 후 즉시 일상 복귀 가능.", descEn: "Melasma specialist program combining Excel V+ vascular-selective laser with Enlighten III picosecond laser. Simultaneously removes micro-vessels and breaks down epidermal/dermal pigment to prevent recurrence.", descJa: "エクセルV+の血管選択性レーザーとエンライトン3のピコ秒レーザーを複合したシミ専門プログラム。シミ病変下の微細血管を除去し、表皮・真皮色素を同時に分解して再発を抑制します。", descZh: "结合Excel V+血管选择性激光和Enlighten III皮秒激光的黄褐斑专项治疗。同时去除微血管并分解表皮/真皮色素，有效抑制复发。",
      time: "30~50분", recovery: "당일 일상",
      badge: "기미 특화", badgeColor: "#7C3AED",
      image: `${CDN}/엑셀V_70001aa7.png`,
      images: [
        `${CDN}/엑셀V_70001aa7.png`,
        "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/엔라이턴3_nobg_83723c8a.png",
      ],
      best: true,
      detail: "엑셀V+의 532nm 파장은 기미 병변 아래 미세 혈관을 선택적으로 파괴하여 색소에 영양을 공급하는 혈관을 차단하고, 엔라이튼3의 피코초 레이저(532nm·1,064nm·670nm 트리플 파장)는 표피와 진피의 색소를 동시에 분해합니다. 두 장비의 시너지 효과로 기미·잡티·검버섯·일광 흑자 등 다양한 색소 병변을 한 번에 복합적으로 개선할 수 있습니다. 시술 후 즉시 일상 복귀가 가능한 것이 특징입니다.",
      caution: "시술 후 일주일간 자외선 차단제(SPF 50+)를 철저히 바르세요. 기미는 자외선에 의해 재발할 수 있으므로 지속적인 자외선 차단 관리가 중요합니다. 시술 당일 실외 활동과 살균 사우나 이용은 자제하세요.",
      sessions: "4~6회 (2주 간격)",
       effect: "기미·잡티 개선, 피부 톤 밝기, 색소 침착 방지, 혈관 트러블 동시 개선",
      youtubeUrl: "https://www.youtube.com/embed/YJE_IS5fFC0",
    },
  ],
  // ── 리프팅·탄력 ────────────────────────────────────────────────────────────
  lifting: [
    {
      name: "울쎄라피 프라임",
      nameEn: "ULTHERAPY PRIME",
      desc: "리프팅 만족도 1위 울쎄라피의 최신 업그레이드 버전. 더 넓은 면적을 빠르게 커버하며 탁월한 리프팅 효과.", descEn: "The latest upgraded version of Ultherapy with the highest lifting satisfaction rating. Covers wider areas faster for outstanding lifting results.", descJa: "リフティング満足度1位ウルセラピーの最新アップグレード版。より広い面積を素早くカバーし、卓越したリフティング効果を発揮します。", descZh: "提升满意度第一的超声刀最新升级版。更快覆盖更大面积，带来卓越的提升效果。",
      time: "60~90분", recovery: "당일 일상",
      badge: "인기", badgeColor: "#C8860A",
      image: `${CDN}/울쎄라피프라임_1_0daba485.png`, best: true,
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub_03_01_52_3b05391b.jpg",
      detail: "울쎄라피 프라임은 기존 울쎄라피 대비 더 넓은 면적을 빠르게 커버하는 최신 업그레이드 버전입니다. 집속 초음파(HIFU) 에너지를 피부 깊은 층인 SMAS(근막층)까지 정확하게 전달하여 피부 속에서부터 리프팅 효과를 유도합니다. FDA 승인을 받은 비수술 리프팅 시술로, 시술 후 즉시 일상 복귀가 가능합니다. 시술 효과는 시술 후 2~3개월부터 서서히 나타나며 6개월까지 지속적으로 개선됩니다.",
      caution: "시술 중 일시적인 열감이나 따끔거림이 있을 수 있습니다. 시술 후 1~2일간 약간의 붓기나 붉기가 나타날 수 있으나 정상 반응입니다. 시술 후 자외선 차단제를 매일 사용하세요.",
      sessions: "1~2회 (6~12개월 간격)",
      effect: "얼굴 리프팅, 턱선 개선, 피부 탄력 향상, 주름 완화, SMAS층 자극",
      youtubeUrl: "https://www.youtube.com/embed/VeADRwws0e8",
    },
    {
      name: "써마지 FLX",
      nameEn: "THERMAGE FLX",
      desc: "4세대 고주파 리프팅의 정점. 피부 깊은 층 콜라겐을 자극해 탄력 개선과 주름 완화에 탁월.\n조시형 원장 공식 자문의로 최적의 파라미터 노하우를 보유합니다.", descEn: "The pinnacle of 4th-generation RF lifting. Stimulates deep collagen for excellent elasticity improvement and wrinkle reduction. Dr. Jo Si-hyeong is an official Thermage advisor with optimal parameter expertise.", descJa: "第4世代高周波リフティングの頂点。皮膚深層のコラーゲンを刺激して弾力改善としわ緩和に卓越。趙時亨院長はサーマジ公式アドバイザーとして最適なパラメータのノウハウを保有しています。", descZh: "第四代射频提升的巅峰之作。刺激皮肤深层胶原蛋白，卓越改善弹力和减少皱纹。赵时亨院长是热玛吉官方顾问，掌握最优参数技术。",
      time: "45~90분", recovery: "당일 일상",
      badge: "자문의", badgeColor: "#9C5FA5",
      image: `${CDN}/써마지FLX_20a90462.png`, best: true,
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub_03_01_24_9648a599.jpg",
      detail: "써마지 FLX는 4세대 고주파(RF) 리프팅 장비로, 피부 깊은 층의 콜라겐을 가열하여 즉각적인 수축 효과와 함께 장기적인 콜라겐 재생을 유도합니다. 스타피부과 조시형 원장은 써마지 공식 자문의로, 최적의 파라미터 설정과 시술 노하우를 보유하고 있습니다. 진동 기능(AccuREP)이 탑재되어 시술 중 불편감을 최소화하며, 시술 후 즉시 일상 복귀가 가능합니다. 눈가·볼·목·바디 등 다양한 부위에 적용 가능합니다.",
      caution: "시술 중 열감이 느껴지는 것은 정상 반응입니다. 시술 후 일시적인 붉기나 붓기가 나타날 수 있으나 수 시간 내 가라앉습니다. 임산부, 금속 임플란트 보유자는 시술 전 반드시 상담이 필요합니다.",
      sessions: "1~2회 (6~12개월 간격)",
      effect: "피부 탄력 개선, 얼굴 리프팅, 주름 완화, 콜라겐 재생, 눈가·목 탄력 개선",
      youtubeUrl: "https://www.youtube.com/embed/epfNHt3wJ1k",
    },
    {
      name: "세르프",
      nameEn: "XERF",
      desc: "최신 고강도 RF 리프팅 장비. 절개 없이 자연스러운 리프팅 효과와 피부 탄력 개선.\n스타피부과 확장 이전 기념 특가 이벤트로 진행 중입니다.", descEn: "Latest high-intensity RF lifting device. Natural lifting effect and skin elasticity improvement without incisions. Currently available at special event pricing for Star Dermatology.", descJa: "最新高強度RFリフティング機器。切開なしで自然なリフティング効果と皮膚弾力改善。スター皮膚科拡張移転記念特価イベントで実施中です。", descZh: "最新高强度射频提升设备。无需切开，实现自然提升效果和皮肤弹力改善。目前正值星皮肤科扩张搬迁纪念特价活动期间。",
      time: "60~90분", recovery: "당일 일상",
      badge: "이벤트", badgeColor: "#E57373",
      image: `https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/equip-xerf-cropped_d21e359e.png`, best: true,
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/세르프_c50de6da.jpg",
      detail: "세르프는 최신 고강도 RF 리프팅 장비로, 고주파 에너지를 피부 진피층과 SMAS층에 정밀하게 전달하여 강력한 리프팅 효과를 유도합니다. 절개 없이 자연스러운 리프팅 효과를 기대할 수 있으며, 시술 후 즉시 일상 복귀가 가능합니다. 스타피부과 확장 이전 기념 특가 이벤트로 진행 중이니 상담 시 문의해 주세요.",
      caution: "시술 중 열감이 느껴지는 것은 정상 반응입니다. 시술 후 일시적인 붉기나 붓기가 나타날 수 있으나 수 시간 내 가라앉습니다. 자외선 차단제를 매일 사용하세요.",
      sessions: "1~2회 (6~12개월 간격)",
      effect: "얼굴 리프팅, 피부 탄력 개선, 주름 완화, 턱선 개선",
      youtubeUrl: "https://www.youtube.com/embed/9d2fXkdNvCk",
    },
    {
      name: "울쎄라",
      nameEn: "ULTHERA",
      desc: "초음파 에너지로 SMAS층까지 자극하는 정통 리프팅.\nFDA 승인 비수술 시술로 자연스러운 피부 탄력을 회복합니다.", descEn: "Traditional lifting using ultrasound energy to stimulate down to the SMAS layer. FDA-approved non-surgical treatment for naturally restored skin elasticity.", descJa: "超音波エネルギーでSMAS層まで刺激する正統リフティング。FDA承認の非手術施術で自然な皮膚弾力を回復します。", descZh: "使用超声波能量刺激至SMAS层的正统提升治疗。FDA认证非手术治疗，自然恢复皮肤弹力。",
      time: "60~90분", recovery: "당일 일상",
      image: `${CDN}/ultherapy_nobg_f4d10aca.png`,
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/울쎄라_7f6c3083.jpg",
      detail: "울쎄라(Ulthera)는 집속 초음파(HIFU) 에너지를 피부 깊은 층인 SMAS(근막층)까지 정확하게 전달하는 정통 리프팅 장비입니다. FDA 승인을 받은 비수술 리프팅 시술로, 피부 표면에 손상 없이 깊은 층에서부터 리프팅 효과를 유도합니다. 시술 효과는 시술 후 2~3개월부터 서서히 나타나며 6~12개월까지 지속됩니다.",
      caution: "시술 중 일시적인 열감이나 따끔거림이 있을 수 있습니다. 시술 후 1~2일간 약간의 붓기나 붉기가 나타날 수 있으나 정상 반응입니다. 자외선 차단제를 매일 사용하세요.",
      sessions: "1~2회 (6~12개월 간격)",
      effect: "얼굴 리프팅, 턱선 개선, 피부 탄력 향상, SMAS층 자극, 주름 완화",
      youtubeUrl: "https://www.youtube.com/embed/2M8szSI8-38",
    },
    {
      name: "프로파운드",
      nameEn: "PROFOUND RF",
      desc: "마이크로니들 RF 에너지로 피부 깊은 층까지 자극. 탄력 개선과 리프팅 효과가 탁월한 프리미엄 시술.", descEn: "Microneedle RF energy stimulates deep skin layers. Premium treatment with outstanding elasticity improvement and lifting effects.", descJa: "マイクロニードルRFエネルギーで皮膚の深層まで刺激。弾力改善とリフティング効果が卓越したプレミアム施術。", descZh: "微针射频能量刺激皮肤深层。弹力改善和提升效果卓越的高端治疗。",
      time: "60~90분", recovery: "5~7일",
      image: `${CDN}/프로파운드_93be7410.png`,
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/프로파운드_65bb8cdd.jpg",
      detail: "프로파운드 RF는 마이크로니들을 통해 RF 에너지를 진피층 정확한 깊이에 직접 전달합니다. 임상 연구에서 1회 시술로 콜라겐·엘라스틴·히알루론산 생성이 유의미하게 증가하는 것으로 보고되어 있습니다. 비수술 리프팅 시술 중 높은 수준의 피부 탄력 개선 효과를 기대할 수 있으며, 회복 기간이 필요하지만 그만큼 강력한 효과를 제공합니다.",
      caution: "시술 후 5~7일간 붓기와 멍이 나타날 수 있습니다. 중요한 일정 전에는 충분한 회복 기간을 확보하세요. 시술 후 1주일간 격렬한 운동, 사우나, 음주는 피하세요.",
      sessions: "1~2회 (12개월 간격)",
      effect: "피부 탄력 개선, 얼굴 리프팅, 콜라겐·엘라스틴 생성, 주름 완화",
      youtubeUrl: "https://www.youtube.com/embed/vZ0rL_XAXUU",
    },
    {
      name: "텐쎄라",
      nameEn: "10THERA",
      desc: "고주파와 초음파를 동시에 활용한 복합 리프팅.\n피부 탄력과 얼굴 윤곽 개선에 효과적인 프리미엄 시술.", descEn: "High-frequency RF lifting treatment for skin elasticity improvement. Effective for facial contouring and wrinkle reduction.", descJa: "皮膚弾力改善のための高周波RFリフティング施術。顔のラインとしわ改善に効果的です。", descZh: "改善皮肤弹力的高频射频提升治疗。有效改善面部轮廓和皱纹。",
      time: "40~60분", recovery: "당일 일상",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/11-Photoroom_2cf898c6.png",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub_03_01_36_d097c102.jpg",
      detail: "텐쎄라(Tensera)는 고주파(RF)와 초음파(HIFU)를 동시에 활용한 복합 리프팅 장비입니다. 두 에너지를 동시에 조사하여 진피층과 SMAS층을 함께 자극함으로써 단독 시술 대비 더 효과적인 리프팅과 탄력 개선을 기대할 수 있습니다. 시술 후 즉시 일상 복귀가 가능하며, 얼굴 윤곽 개선과 피부 탄력 향상에 효과적입니다.",
      caution: "시술 중 열감이 느껴지는 것은 정상 반응입니다. 시술 후 일시적인 붉기가 나타날 수 있으나 수 시간 내 가라앉습니다. 자외선 차단제를 매일 사용하세요.",
      sessions: "2~4회 (4~8주 간격)",
      effect: "얼굴 리프팅, 피부 탄력 개선, 얼굴 윤곽 개선, 주름 완화",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/tensera-modal_9b5a5348.png",
    },
    {
      name: "버츄RF",
      nameEn: "VIRTUE RF",
      desc: "마이크로니들 RF 시술로 피부 깊은 층에 에너지를 직접 전달.\n탄력 개선과 모공 축소 효과를 동시에 기대할 수 있습니다.", descEn: "Microneedle RF lifting that delivers RF energy precisely to the dermis. Effective for skin tightening, pore improvement, and scar treatment.", descJa: "RFエネルギーを真皮に精密に届けるマイクロニードルRFリフティング。皮膚引き締め、毛穴改善、瘢痕治療に効果的です。", descZh: "将射频能量精准传递至真皮的微针射频提升。有效紧致皮肤、改善毛孔和治疗疤痕。",
      time: "40~60분", recovery: "3~5일",
      image: `${CDN}/버츄RF_d5248119.png`,
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub_03_01_43_f3a4cc84.jpg",
      detail: "버츄RF(Virtue RF)는 마이크로니들을 통해 RF(고주파) 에너지를 피부 진피층에 직접 전달하는 장비입니다. 피부 표면을 통과하지 않고 진피층에 직접 에너지를 전달하기 때문에 표면 손상을 최소화하면서 진피 내 콜라겐 생성을 강력하게 자극합니다. 탄력 개선과 함께 모공 축소 효과도 기대할 수 있으며, 여드름 흉터 개선에도 활용됩니다.",
      caution: "시술 후 3~5일간 붉기와 약간의 붓기가 나타날 수 있습니다. 이 기간 동안 자외선 차단제(SPF 50+)를 철저히 바르고, 세안 시 자극을 최소화하세요.",
      sessions: "3~5회 (4~6주 간격)",
      effect: "피부 탄력 개선, 모공 축소, 콜라겐 생성 유도, 여드름 흉터 개선",
      youtubeUrl: "https://www.youtube.com/embed/JErIx45DS5I",
    },
    {
      name: "슈링크 유니버스",
      nameEn: "SHURINK UNIVERSE",
      desc: "집속 초음파 리프팅의 업그레이드 버전. 다양한 깊이의 에너지 전달로 효과적인 리프팅.\n기존 슈링크 대비 넓은 면적을 빠르게 커버하며 시술 시간이 단축됩니다.", descEn: "Evolution of focused ultrasound lifting. Delivers precise HIFU energy to multiple skin layers for powerful lifting.", descJa: "集束超音波リフティングの進化形。複数の皮膚層に精密なHIFUエネルギーを届け、強力なリフティング効果を発揮します。", descZh: "聚焦超声提升的进化版本。向多个皮肤层精准传递HIFU能量，实现强效提升。",
      time: "40~60분", recovery: "당일 일상",
      image: `${CDN}/슈링크_6ee40d79.png`,
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub_03_01_37_964152a8.jpg",
      detail: "슈링크 유니버스(Shrink Universe)는 집속 초음파(HIFU) 리프팅의 업그레이드 버전으로, 다양한 깊이(1.5mm, 3.0mm, 4.5mm)에 에너지를 전달하여 피부 전층에 걸친 리프팅 효과를 유도합니다. 기존 슈링크 대비 더 넓은 면적을 빠르게 커버하며, 시술 시간이 단축되었습니다. 시술 후 즉시 일상 복귀가 가능합니다.",
      caution: "시술 중 일시적인 열감이나 따끔거림이 있을 수 있습니다. 시술 후 1~2일간 약간의 붓기가 나타날 수 있으나 정상 반응입니다. 자외선 차단제를 매일 사용하세요.",
      sessions: "2~4회 (4~6개월 간격)",
      effect: "얼굴 리프팅, 피부 탄력 개선, 턱선 개선, 주름 완화",
      youtubeUrl: "https://www.youtube.com/embed/r5kwS4zQDTQ",
    },
    {
      name: "온다",
      nameEn: "ONDA",
      desc: "특허받은 극초단파(Microwave) 기술로 리프팅 및 타이트닝 효과를 부여.\n콜라겐을 지속적으로 장기화하여 즉각적인 리프팅과 탄력 개선을 경험하세요.", descEn: "Microwave energy lifting and body contouring treatment. Targets fat cells and tightens skin simultaneously.", descJa: "マイクロ波エネルギーリフティングとボディコンタリング施術。脂肪細胞をターゲットにしながら皮膚を引き締めます。", descZh: "微波能量提升和身体塑形治疗。同时靶向脂肪细胞并紧致皮肤。",
      time: "30~60분", recovery: "당일 일상",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/onda-thumbnail_c9eb3dc4.png",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/onda-thumbnail_c9eb3dc4.png",
      detail: "온다(ONDA)는 기존의 고주파·초음파 리프팅을 넘어 특허받은 극초단파(Microwave) 기술을 이용한 차세대 리프팅 장비입니다. 극초단파 에너지를 조직에 균일하게 전달하여 콜라겐 리모델링을 지속적으로 유도하며, 즉각적인 리프팅과 스킨 타이트닝 효과를 기대할 수 있습니다. 얼굴근육 타이트닝, 처진 볼살 및 이중턱 개선, 잔주름 탄력 증대, 눈가 주름 개선에 효과적입니다. DEKA사 제조.",
      caution: "시술 중 열감이 느껴지는 것은 정상 반응입니다. 시술 후 일시적인 붉기가 나타날 수 있으나 수 시간 내 가라앉습니다. 자외선 차단제를 매일 사용하세요.",
      sessions: "3~5회 (4~6주 간격)",
      effect: "얼굴 리프팅, 스킨 타이트닝, 이중턱 개선, 잔주름 탄력 증대, 콜라겐 리모델링",
      youtubeUrl: "https://www.youtube.com/embed/r3h7vj8OC88",
    },
    {
      name: "텐써마",
      nameEn: "10THERMA",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub_03_01_40_e5717309.jpg",
      desc: "주사바늘 없이 약물을 진피층에 직접 주입하는 무침 시술.\n리프팅·피부 재생 효과를 기대할 수 있으며 시술 후 즉시 일상 복귀 가능.", descEn: "Advanced RF lifting treatment combining temperature control for precise skin rejuvenation.", descJa: "精密な皮膚若返りのための温度制御を組み合わせた高度なRFリフティング施術。", descZh: "结合温度控制的高级射频提升治疗，实现精准皮肤年轻化。",
      time: "20~40분", recovery: "당일 일상",
      image: `${CDN}/에너젯_afcf856d.png`,
      detail: "에너젯(Enerjet)은 고압 공기를 이용해 주사바늘 없이 약물을 피부 진피층에 직접 주입하는 무침 시술 장비입니다. 바늘 공포증이 있는 분들도 편안하게 받을 수 있으며, 시술 부위의 멍이나 출혈이 최소화됩니다. 히알루론산·성장인자·리쥬란 등 다양한 약물을 주입할 수 있으며, 피부 재생과 탄력 개선 효과를 기대할 수 있습니다.",
      caution: "시술 후 당일 세안은 부드럽게 하세요. 시술 부위에 일시적인 붉기나 약간의 부기가 나타날 수 있으나 수 시간 내 가라앉습니다. 자외선 차단제를 매일 사용하세요.",
      sessions: "3~5회 (2~4주 간격)",
      effect: "피부 재생, 탄력 개선, 수분 보충, 피부결 정돈, 무침 시술로 멍·출혈 최소화",
      youtubeUrl: "https://www.youtube.com/embed/12ZFfivya54",
    },
    {
      name: "BBL 스킨타이트",
      nameEn: "BBL SKINTYTE",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/스킨타이트_9db77bf0.png",
      desc: "미국 SCITON사의 고성능 '쥴 레이저' 장비로 진행되는 시술로,\n적외선 빛을 이용하여 피부 속 콜라겐을 자극해 자연스럽게 탄력을 높여줍니다.", descEn: "Phototherapy for combined redness and pigment improvement. Broadband light technology treats both vascular and pigmented lesions simultaneously.", descJa: "光治療による紅潮・色素複合改善。広帯域光技術で血管性と色素性の病変を同時に治療します。", descZh: "光疗复合改善红肌和色素。宽带光技术同时治疗血管性和色素性病变。",
      time: "30~60분", recovery: "당일 일상",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/스킨타이트_9db77bf0.png",
      detail: "쥴 BBL 스킨타이트는 미국 SCITON사의 고성능 '쥴 레이저' 장비로 진행되는 시술로, 적외선 빛을 이용하여 피부 속 콜라겐을 자극해서 자연스럽게 탄력을 높여주는 레이저입니다. 통증이나 마취 걱정 없이 편안하게 받을 수 있고, 시술 후 피부가 탱탱하고 매끈해지는 느낌을 확실히 느낄 수 있습니다. 피부 냉각 장치인 특수 사파이어 팁을 사용하여 시술 중 피부 표면을 열 손상으로부터 보호합니다. 리프팅 효과로 피부 탄력 개선과 잔주름 개선에 탁월하며, 콜라겐 생성을 촉진하여 피부 속부터 콜라겐 재생에 도움을 줍니다. 또한 기미, 주근깨 등 색소 치료에도 효과가 있는 화이트닝 효과까지 기대할 수 있습니다.",
      caution: "시술 후 일시적인 붉기가 나타날 수 있으나 빠르게 소실됩니다. 마취 없이도 통증이 거의 없어 편안하게 시술받을 수 있습니다. 자외선 차단제를 매일 사용하세요.",
      sessions: "3~5회 (4주 간격)",
      effect: "피부 탄력 개선, 잔주름 개선(리프팅), 콜라겐 생성 촉진(콜라겐 재생), 기미·주근깨 등 색소 치료(화이트닝)",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/스킨타이트_9db77bf0.png",
    },
    {
      name: "트리니티 리프토닝",
      nameEn: "TRINITY LIFTONING",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/trinity-thumbnail_b5123a89.jpg",
      desc: "1064nm·808nm·755nm 3가지 파장이 동시 조사되는 국내 최초 복합 레이저.\n리프팅과 토닝을 한번에, 기미·잡티·홍조까지 맑고 깨끗한 피부로.", descEn: "Simultaneous lifting and toning treatment. Combines lifting and skin tone improvement for comprehensive skin care.", descJa: "リフティングとトーニングを同時に行う施術。リフティングと肌のトーン改善を組み合わせた総合的なスキンケアです。", descZh: "同时进行提升和调肤的治疗。结合提升和肤色改善，实现全面护肤。",
      time: "10분 이내", recovery: "당일 일상",
      badge: "NEW", badgeColor: "#7C3AED",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/trinity-thumbnail_b5123a89.jpg",
      detail: "트리니티 리프토닝은 1064nm, 808nm, 755nm 3가지 파장대의 레이저가 동시에 조사되어 리프팅 뿐만 아니라 기미, 잡티, 홍조 등 맑고 깨끗해진 피부와 전체적인 리프팅 효과를 보실 수 있습니다. 국내 최초 리프팅과 토닝의 복합 레이저로, 타이트닝·리프팅·화이트닝을 한번에 해결합니다. 강력한 쿨링 시스템으로 통증을 완화하고, 넓은 팁(12×20mm)으로 빠른 시술이 가능합니다. 10분 이내의 빠른 시술로 바로 일상생활이 가능합니다.",
      caution: "시술 후 일시적인 붉기가 나타날 수 있으나 당일 내 소실됩니다. 멍, 붓기와 같은 다운타임이 거의 없습니다. 시술 후 자외선 차단제를 꼼꼼히 사용해 주세요.",
      sessions: "3~5회 (2~4주 간격)",
      effect: "피부 탄력 개선, 리프팅, 기미·잡티 개선, 홍조 완화, 화이트닝, 모공 축소",
      youtubeUrl: "https://www.youtube.com/embed/HxmKlcJ2Ogo",
    },
  ],

  // ── 눈밑지방 ───────────────────────────────────────────────────────────────
  eye: [
    {
      name: "눈밑지방재배치",
      nameEn: "UNDER-EYE FAT REPOSITIONING",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/눈밑지방_4c0b8a51.png",
      desc: "4,000례 이상의 경험으로 다크서클과 눈밑 볼록함을 동시에 개선.\n지방을 재배치하여 자연스러운 눈밑 라인을 만드는 스타피부과 대표 시술.", descEn: "Specialized treatment for under-eye fat repositioning and dark circle improvement. Our doctors perform the procedure directly for natural, vibrant eyes.", descJa: "目の下の脂肪再配置とクマ改善の専門施術。スター皮膚科の院長が直接執刀し、自然で生き生きとした目元を作ります。", descZh: "眼袋脂肪重置及黑眼圈改善专项治疗。由院长亲自操作，打造自然有神的眼部轮廓。",
      time: "30~60분", recovery: "3~7일",
      badge: "BEST", badgeColor: "#4A6FA5",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/treat-eyelid-new-6Qge5k6ndWTS5nFXDZSXRF.webp", best: true,
      detail: "눈밑지방재배치술은 눈 아래 과잉 축적된 지방을 제거하지 않고 꺼진 눈물고랑(tear trough) 부위로 재배치하여 다크서클과 눈밑 볼록함을 동시에 개선하는 시술입니다. 스타피부과는 4,000례 이상의 풍부한 시술 경험을 보유하고 있으며, 절개를 최소화하여 흉터 위험을 낮춥니다. 지방을 제거하지 않고 재배치하는 방식이므로 시술 후 지방 공동이나 외관 변형이 거의 없고, 자연스러운 눈밑 라인을 기대할 수 있습니다.",
      caution: "시술 후 3~7일간 붓기와 멍이 나타날 수 있으며, 완전한 결과 확인까지 4~8주가 소요됩니다. 시술 후 1주일간 격렬한 운동과 음주를 피하고, 엎드려 자는 자세를 삼가세요. 눈을 비비거나 강하게 누르는 행동을 피하고, 선글라스 착용으로 자외선을 차단하세요.",
      sessions: "1회 (반영구적 효과)",      effect: "다크서클 개선, 눈밑 볼록함 해소, 눈물고랑 음영 완화, 자연스러운 눈밑 라인, 피로해 보이는 인상 개선",
      youtubeUrl: "https://www.youtube.com/embed/Y2ia8A-nBjw",
    },
    {
      name: "런치타임 눈밑레이저",
      nameEn: "LUNCHTIME UNDER-EYE LASER",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/런치타임눈밑레이저_cf471de8.jpg",
      desc: "특수 패치와 레이저 충격파로 조직 손상 없이 눈밑 지방을 감소시키는 비수술 시술.\n점심 시간에도 받을 수 있을 만큼 간편하며 피부 탄력 개선 효과를 기대할 수 있습니다.", descEn: "Quick under-eye laser treatment with minimal downtime. Improves dark circles and fine lines around the eyes.", descJa: "ダウンタイムが最小限のクイックアイレーザー施術。目の周りのクマと小じわを改善します。", descZh: "停工期最短的快速眼部激光治疗。改善黑眼圈和眼周细纹。",
      time: "20~30분", recovery: "1~2일",
      badge: "간편", badgeColor: "#81C7C9",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/treat-lunchtime-laser-patch_afc9f430.jpg",
      detail: "런치타임 눈밑레이저는 블랙 다이아몬드 입자 함유, 레이저 에너지를 흡수하는 특수 패치와 레이저 유도 충격파(Laser-induced shock wave) 기술을 활용하여 직접적인 조직 손상 없이 눈밑 지방 감소 및 피부 탄력 증진을 동시에 개선하는 시술입니다. 수술 없이 비절개 방식으로 진행되며 짧은 시술 시간으로 바쁜 일정에도 부담 없이 받으실 수 있습니다.",
      caution: "시술 후 1~2일간 경미한 붓기나 발적이 나타날 수 있으며, 대부분 빠르게 회복됩니다. 시술 직후 강한 자외선 노출을 피하고 자외선 차단제를 꼼꼼히 바르세요. 눈 주변을 강하게 문지르거나 누르는 행동을 삼가세요.",
      sessions: "4~6회 권장 (1~2주 간격)",
      effect: "눈밑 지방 타겟팅 충격파 에너지 전달, 지방층 부피 & 부종 감소, 림프 순환 및 탄력·잔주름 개선, 절개·멍·흉터 걱정 없이 일상생활 복귀 가능",
      youtubeUrl: "https://www.youtube.com/embed/8fqAXWL71Fo",
    },
  ],

   // ── 홍조·혈관확장 ──────────────────────────────────────────────────────
  rosacea: [
    // 홍조·혈관확장 카테고리 배경색: 흰색 (#FFFFFF)
    // 모든 이미지 배경을 통일성 있게 정리: [

    {
      name: "아드바 TX",
      nameEn: "ADVATX",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/아드바_d0a73891.png",
      youtubeUrl: "https://www.youtube.com/embed/Mt-JsBhZXmA",
      desc: "혈관·색소 병변 치료에 활용되는 레이저 장비.\n안면홍조·혈관 확장을 피부 자극 최소화 방식으로 개선합니다.", descEn: "Laser for scar elasticity improvement. Dual-wavelength technology targets both vascular components and collagen for comprehensive scar treatment.", descJa: "瘢痕弾力改善レーザー。デュアル波長技術で血管成分とコラーゲンの両方をターゲットにし、総合的な瘢痕治療を実現します。", descZh: "疤痕弹力改善激光。双波长技术同时靶向血管成分和胶原蛋白，实现全面疤痕治疗。",
      time: "20~40분", recovery: "1~2일",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/adva_card_53fcdcea.png",
      imgBg: "#FFFFFF",
      detail: "ADVATX는 1,319nm 파장의 Nd:YAG 레이저로, 혈관 치료와 함께 진피 내 콜라겐 재생을 동시에 자극하는 장비입니다. 혈관 내 산화헤모글로빈에 선택적으로 흡수되어 확장된 혈관을 응고·폐쇄하고, 동시에 진피 가열을 통해 콜라겐 생성을 유도합니다. 피부 표면에 상처를 내지 않는 비절제 방식으로 시술 후 즉시 일상 복귀가 가능한 것이 특징입니다. 안면홍조·모세혈관 확장·주사비 치료와 함께 피부 탄력 개선 효과도 기대할 수 있습니다.",
      caution: "시술 후 1~2일간 붉기나 열감이 나타날 수 있으나 정상 반응입니다. 뜨거운 음식·음주·사우나는 당일 피하세요. 자외선 차단제를 매일 사용하세요.",
      sessions: "4~6회 (2~4주 간격)",
      effect: "안면홍조 개선, 모세혈관 확장 감소, 주사비 치료, 피부 탄력 개선, 콜라겐 생성 유도",
    },

    {
      name: "BBL 레이저",
      nameEn: "BBL",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/BBL_533a94c4.png",
      youtubeUrl: "https://www.youtube.com/embed/PbCt12_WYFo",
      desc: "광치료로 홍조 완화와 피부 탄력 개선을 동시에 케어.\n지속 시술 시 피부 노화 개선 효과가 보고되어 있습니다.", descEn: "Broadband light phototherapy for skin tone improvement and rejuvenation.", descJa: "肌トーン改善と若返りのための広帯域光線治療。", descZh: "改善肤色和年轻化的宽带光光疗。",
      time: "20~40분", recovery: "1~2일",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/bbl_card_86144b4c.png",
      imgBg: "#FFFFFF",
      detail: "BBL(BroadBand Light)은 Sciton사의 IPL 기반 광치료 장비로, 다양한 파장 필터를 활용하여 홍조·색소·피부 노화를 복합적으로 개선합니다. 특히 BBL HERO 모드는 기존 IPL 대비 더 빠르고 강력한 에너지를 전달하여 치료 효율을 높입니다. 스탠퍼드 대학 연구에서 정기적인 BBL 시술이 피부 유전자 발현을 젊은 상태로 되돌리는 효과가 있다고 보고되었습니다. 홍조·잡티·모공·피부결 개선을 한 번에 기대할 수 있습니다.",
      caution: "시술 후 1~2일간 붉기와 약간의 부기가 나타날 수 있습니다. 잡티 부위는 일시적으로 더 진해졌다가 1~2주 내 자연 탈락됩니다. 자외선 차단제를 매일 사용하세요.",
      sessions: "3~5회 (4주 간격)",
      effect: "안면홍조 개선, 잡티·색소 개선, 모공 축소, 피부 탄력 향상, 피부 노화 개선",
    },

    {
      name: "엑셀 V+",
      nameEn: "EXCEL V+",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/엑셀V_119259b6.jpg",
      desc: "혁관 선택성 듀얼 파장 레이저로 안면홍조·모세혈관 확장을 집중 치료.\n주변 조직 손상을 최소화하며 붉은 피부를 효과적으로 개선합니다.", descEn: "Standard for vascular and redness treatment. Selectively targets hemoglobin to treat facial redness, capillaries, and vascular lesions.", descJa: "血管・色素治療の標準。ヘモグロビンを選択的にターゲットにして顔面紅潮、毛細血管、血管病変を治療します。", descZh: "血管和红肌治疗的标准。选择性靶向血红蛋白，治疗面部潮红、毛细血管和血管病变。",
      time: "20~40분", recovery: "1~3일",
      badge: "특화", badgeColor: "#E57373",
      image: `${CDN}/엑셀V_70001aa7.png`,
      imgBg: "#E0F2FE",
      best: true,
      detail: "Excel V+는 532nm KTP 레이저와 1,064nm Nd:YAG 레이저 두 가지 파장을 탑재한 혈관 치료 전문 레이저입니다. 532nm 파장은 표재성 혈관과 색소에 선택적으로 흡수되고, 1,064nm 파장은 더 깊은 층의 혈관 병변에 도달합니다. 혈관 내 헤모글로빈에 선택적으로 흡수되어 주변 조직 손상 없이 혈관만 응고·폐쇄하는 것이 특징입니다. 안면홍조·모세혈관 확장·주사비·혈관종·체리 혈관종 등 다양한 혈관 병변에 활용됩니다.",
      caution: "시술 후 1~3일간 붉기와 약간의 붓기가 나타날 수 있습니다. 뜨거운 음식·음주·사우나는 시술 후 1~2일간 피하세요. 자외선 차단제를 매일 사용하세요.",
      sessions: "3~5회 (2~4주 간격)",
      effect: "안면홍조 개선, 모세혈관 확장 감소, 주사비 치료, 혈관종 제거, 피부 붉기 완화",
      youtubeUrl: "https://www.youtube.com/embed/ddelUmpPlu8",
    },

    {
      name: "펜토 9900",
      nameEn: "PENTO 9900",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub_03_01_25_36cb2ad0.jpg",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub_03_01_25_36cb2ad0.jpg",
      desc: "755nm 알렉산드라이트와 1064nm 앤디야그 듀얼 파장 레이저.\n기미·잡티·모공·탄력 개선까지 가능한 복합 피부 레이저입니다.", descEn: "Combined pigment and elasticity treatment. Addresses both pigmentation and skin firmness in a single comprehensive treatment.", descJa: "色素弾力複合治療。色素沈着と皮膚の引き締めの両方を1回の総合治療で対処します。", descZh: "色素和弹力复合治疗。一次综合治疗同时解决色素沉着和皮肤紧致问题。",
      time: "20~40분", recovery: "1~3일",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/pento1064_card_6653a66e.png",
      imgBg: "#FFFFFF",
      detail: "펜토 9900은 755nm 알렉산드라이트 레이저와 1064nm 앤디야그 레이저로 구성된 듀얼 파장 레이저입니다. 기미, 주근깨, 잡티 등의 색소치료는 물론 치료하기 힘든 편평사마귀 제거와 더불어 탄력, 리프팅, 피부톤 개선까지 가능합니다. 냉각 시스템을 통해 피부를 보호하고 시술 시간을 절약하며, 다양한 펄스 폭으로 시술 시 안전하고 향상된 결과를 제공합니다. 난치성 기미와 재발성 기미에 효과적이며, 색소와 탄력에 효과적인 파장을 동시에 활용하여 색소/탄력 동시 개선이 가능합니다.",
      caution: "시술 후 1~3일간 붉기와 약간의 붓기가 나타날 수 있습니다. 뜨거운 음식·음주·사우나는 시술 후 1~2일간 피하세요. 자외선 차단제를 매일 사용하세요.",
      sessions: "3~5회 (2~4주 간격)",
      effect: "기미·잡티 개선, 모공 축소, 피부 탄력 향상, 피부톤 개선, 편평사마귀 제거",
    },

    {
      name: "루메니스 원",
      nameEn: "LUMENIS ONE",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/루메니스원_558f8b74.png",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/루메니스원_558f8b74.png",
      youtubeUrl: "https://www.youtube.com/embed/rA_n4hbY5Dc",
      desc: "Lumenis사의 혈관 전문 레이저로 안면홍조·혈관종 치료에 특화.\n두 파장 조합으로 표재성부터 깊은 혈관 병변까지 폭넓게 대응합니다.", descEn: "Multi-platform laser system for comprehensive skin treatment. Addresses pigmentation, vascular lesions, and skin rejuvenation.", descJa: "総合的な皮膚治療のためのマルチプラットフォームレーザーシステム。色素沈着、血管病変、皮膚若返りに対応します。", descZh: "综合皮肤治疗的多平台激光系统。解决色素沉着、血管病变和皮肤年轻化问题。",
      time: "20~40분", recovery: "1~3일",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/lumenis_v_card_03c774b0.png",
      imgBg: "#FFFFFF",
      detail: "Lumenis-V는 Lumenis사의 혈관 전문 레이저로, 532nm KTP 레이저와 1,064nm Nd:YAG 레이저를 탑재하고 있습니다. 두 파장의 조합으로 표재성 혈관부터 깊은 층의 혈관 병변까지 폭넓게 대응할 수 있습니다. 혈관 내 헤모글로빈에 선택적으로 흡수되어 주변 조직 손상 없이 혈관을 응고·폐쇄하며, 안면홍조·모세혈관 확장·혈관종·체리 혈관종·거미 혈관종 등 다양한 혈관 병변 치료에 활용됩니다.",
      caution: "시술 후 1~3일간 붉기와 약간의 붓기가 나타날 수 있습니다. 뜨거운 음식·음주·사우나는 시술 후 1~2일간 피하세요. 자외선 차단제를 매일 사용하세요.",
      sessions: "3~5회 (2~4주 간격)",
      effect: "안면홍조 개선, 모세혈관 확장 감소, 혈관종 치료, 체리 혈관종 제거, 피부 붉기 완화",
    },

    {
      name: "시너지",
      nameEn: "SYNERGY",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/씨너지_e96088b2.png",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/씨너지_e96088b2.png",
      desc: "두 가지 파장을 동시에 조사하는 복합 혈관 레이저.\n다양한 깊이의 혈관 병변과 홍조를 맞춤형 파라미터로 치료합니다.", descEn: "Dual-wavelength laser system for synergistic skin treatment. Combines multiple wavelengths for enhanced treatment efficacy.", descJa: "相乗的な皮膚治療のためのデュアル波長レーザーシステム。複数の波長を組み合わせて治療効果を高めます。", descZh: "协同皮肤治疗的双波长激光系统。结合多种波长提高治疗效果。",
      time: "20~40분", recovery: "1~3일",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/cynergy_card_1cb99049.png",
      imgBg: "#FFFFFF",
      detail: "시너지(Cynergy)는 595nm PDL(Pulsed Dye Laser)과 1,064nm Nd:YAG 레이저를 동시에 조사할 수 있는 복합 혈관 레이저입니다. 595nm 파장은 표재성 혈관과 홍조에 효과적이고, 1,064nm 파장은 더 깊은 층의 혈관 병변에 도달합니다. 두 파장을 동시에 조사하는 Multiplex 기술로 단독 치료 대비 더 넓은 범위의 혈관 병변에 대응할 수 있습니다. 안면홍조·모세혈관 확장·혈관종·포도주색 반점 등에 활용됩니다.",
      caution: "시술 후 1~3일간 붉기와 약간의 멍이 나타날 수 있습니다. 뜨거운 음식·음주·사우나는 시술 후 1~2일간 피하세요. 시술 부위에 자외선 차단제를 매일 사용하세요.",
      sessions: "3~5회 (2~4주 간격)",
      effect: "안면홍조 개선, 모세혈관 확장 감소, 혈관종 치료, 포도주색 반점 개선",
    },
],

  // ── 색소·문신제거 ──────────────────────────────────────────────────────────
  pigment: [
    {
      name: "큐어맥스",
      nameEn: "CUREMAX",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub_03_01_53_222a4ae8.jpg",
      desc: "다파장 복합 레이저로 기미·잡티·검버섯 등 색소 병변을 치료.\n피부 재생 효과를 함께 기대할 수 있습니다.", descEn: "CO2 laser device for acne scar and milia removal", descJa: "CO2レーザーニキビ瘢痕および稗粒腫除去機器", descZh: "CO2激光痘疤和粟粒疹去除设备",
      time: "20~40분", recovery: "3~5일",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/equip-curemax-nobg-7fJkMnOpQr3sT6uVwXyZdE.webp",
      youtubeUrl: "https://www.youtube.com/embed/YJE_IS5fFC0",
      detail: "큐어맥스는 다파장 복합 레이저 플랫폼으로, 기미·잡티·검버섯·일광 흑자 등 다양한 색소 병변 치료에 활용됩니다. 복수의 파장을 조합하여 표피와 진피의 색소를 동시에 표적하며, 피부 재생 효과도 함께 기대할 수 있습니다. 색소 병변의 깊이와 종류에 따라 파장과 에너지를 조절하여 맞춤형 치료가 가능합니다.",
      caution: "시술 후 3~5일간 시술 부위에 붉기나 딱지가 생길 수 있습니다. 자외선 차단제(SPF 50+)를 철저히 바르고, 딱지는 자연스럽게 탈락되도록 두세요.",
      sessions: "3~6회 (3~4주 간격)",
      effect: "기미·잡티·검버섯 개선, 피부 톤 밝기, 피부 재생 효과, 색소 침착 방지",
    },
    {
      name: "스타워커 MAQX",
      nameEn: "STAR WALKER MAQX",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/스타워커MAQX_5dd4eb14.jpg",
      desc: "Q-스위치 Nd:YAG와 피코초 레이저를 결합한 복합 색소 치료 장비.\n532nm·1064nm·585nm·650nm 다중 파장으로 다양한 색소 병변에 대응합니다.", descEn: "Specialized laser for pigment treatment. Combines Q-switched Nd:YAG and picosecond technology for versatile pigment removal.", descJa: "色素治療専門レーザー。QスイッチNd:YAGとピコ秒技術を組み合わせた多目的色素除去を実現します。", descZh: "色素治疗专用激光。结合Q开关Nd:YAG和皮秒技术，实现多功能色素去除。",
      time: "20~30분", recovery: "당일 일상",
      image: `${CDN}/스타워커_b95a35a4.png`,
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/스타워커MAQX_5dd4eb14.jpg",
      detail: "스타워커 MAQX는 Q-스위치 Nd:YAG 레이저와 피코초 레이저를 결합한 복합 색소 치료 장비입니다. 532nm·1064nm·585nm·650nm 다중 파장을 지원하여 기미·잡티·문신·검버섯·오타모반 등 다양한 색소 병변에 대응합니다. 피코초 펌스로 색소 입자를 미세하게 분쇄하여 체내 흡수·배출을 촉진하며, 주변 정상 조직 손상을 최소화합니다. 시술 후 즉시 일상 복귀가 가능하여 바쁜 일상 속에서도 꾸준히 관리할 수 있습니다.",
      caution: "시술 후 자외선 차단제(SPF 50+)를 매일 사용하세요. 시술 직후 일시적인 붉기가 나타날 수 있으나 수 시간 내 완화됩니다. 기미 치료 중에는 미백 화장품 사용을 병행하면 효과가 향상됩니다.",
      sessions: "6~10회 (1~2주 간격)",
      effect: "기미·잡티 개선, 문신 제거, 검버섯·오타모반 개선, 피부 톤 밝기",
    },
    {
      name: "인라이튼 3세대 루비피코",
      nameEn: "ENLIGHTEN III RUBY PICO",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/인라이튼_d0c7a409.jpg",
      desc: "트리플 파장 피코초 레이저로 기미·잡티·문신을 효과적으로 분해.\n주변 조직 손상을 최소화하며 다양한 색소 병변에 대응합니다.", descEn: "3rd-generation picosecond laser for comprehensive pigment treatment. Multiple wavelengths target different pigment depths for thorough removal.", descJa: "第3世代ピコ秒レーザーによる総合色素治療。複数の波長で異なる色素の深さをターゲットにし、徹底的に除去します。", descZh: "第三代皮秒激光综合色素治疗。多种波长针对不同深度的色素，实现彻底去除。",
      time: "20~40분", recovery: "3~5일",
      badge: "인기", badgeColor: "#4A6FA5",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/엔라이턴3_nobg_83723c8a.png", best: true,
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/인라이튼_d0c7a409.jpg",
      detail: "Enlighten III는 Cutera사의 트리플 파장(532nm·1064nm·670nm) 피코초·나노초 듀얼 펌스 레이저입니다. 피코초(초단파) 펌스로 색소 입자를 나노 단위로 분쇄하고, 나노초 펌스로 깊은 층의 색소까지 도달합니다. 기미·잡티·문신·검버섯·일광 흑자 등 다양한 색소 병변에 대응하며, 주변 정상 조직 손상을 최소화하면서 색소를 효과적으로 분해합니다.",
      caution: "시술 후 3~5일간 시술 부위에 붉기나 약간의 딱지가 생길 수 있습니다. 자외선 차단제(SPF 50+)를 철저히 바르고, 딱지는 자연스럽게 탈락되도록 두세요. 시술 후 2주간 직사광선 노출을 피해주세요.",
      sessions: "4~6회 (2~4주 간격)",
      effect: "기미·잡티 개선, 문신 제거, 검버섯·일광 흑자 개선, 피부 톤 밝기, 색소 침착 방지",
    },
    {
      name: "엑셀 v+",
      nameEn: "EXCEL V+",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/pc_sub_03_03_26_caee4454.jpg",
      desc: "국내 최초 도입! 민낯 종결 프리미엄 레이저.\n색소, 홍조, 혈관, 탄력을 빠르고 쉽게 치료합니다.", descEn: "Premium dual-wavelength laser for pigment, redness, and vascular treatment. First introduced in Korea, delivers comprehensive skin improvement.", descJa: "色素・紅潮・血管治療に対応するプレミアムデュアル波長レーザー。国内初導入、総合的な肌改善を実現します。", descZh: "适用于色素、红肌和血管治疗的高端双波长激光。国内首次引进，实现全面皮肤改善。",
      time: "20~40분", recovery: "당일 일상",
      image: `${CDN}/엑셀V_5364dd04.png`,
      youtubeUrl: "https://www.youtube.com/embed/ddelUmpPlu8",
      detail: "엑셀V 플러스 레이저는 눈에 띄는 혈관, 색소와 주름을 빠르고 간단하게 치료하는 레이저로 20가지 이상의 피부 문제를 해결할 수 있습니다. 정밀하고 강력한 두 개의 레이저를 결합하여 빨간색 및 자주색 또는 파랑색 혈관과 갈색 색소를 표적하여 제거하는 가장 트렌디한 레이저 기술입니다. 1~2회 시술만으로도 충분히 만족할만한 결과를 기대할 수 있으며, 16mm spot 사이즈로 광범위한 면적을 빠르게 커버합니다. 3X 강화된 냉각팁이 피부를 보호하여 통증을 감소시키고, 다운타임이 현저히 줄어 편안한 시술이 가능합니다.",
      caution: "시술 후 즉시 메이크업 및 일상생활이 가능합니다. 자외선 차단제(SPF 50+)를 철저히 바르세요.",
      sessions: "3~5회 (3~4주 간격)",
      effect: "홍조 개선, 기미·검버섯 개선, 혈관종·모세혈관 확장증 치료, 잔주름 개선, 여드름·여드름 흡터 개선, 피부탄력 향상",
    },
    {
      name: "BBL 레이저",
      nameEn: "BBL",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/BBL_533a94c4.png",
      desc: "Sciton BBL 광치료로 기미·잡티·일광 흑자 등 색소 병변을 복합 개선.\n홍조 완화와 피부 재생 효과를 동시에 기대할 수 있습니다.", descEn: "BroadBand Light therapy for simultaneous treatment of pigmentation, redness, and skin aging. Clinically proven to improve skin quality with continued use.", descJa: "色素・紅潮・肌老化を同時にケアするBBL光治療。継続施術で肌質改善効果が臨床的に証明されています。", descZh: "同时治疗色素、红肌和皮肤老化的BBL光子治疗。持续治疗已被临床证明可改善肤质。",
      time: "20~40분", recovery: "당일~3일",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/equip-bbljoule-nobg-4dHiKlMnOp5qRsT8uVwXyZ.webp",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/BBL_533a94c4.png",
      youtubeUrl: "https://www.youtube.com/embed/PbCt12_WYFo",
      detail: "BBL(BroadBand Light)은 Sciton사의 차세대 광치료 플랫폼으로, 515nm~1,200nm의 광범위한 파장 스펙트럼을 활용합니다. 기미·잡티·일광 흑자·검버섯 등 색소 병변과 홍조·모세혈관 확장 등 혈관 병변을 동시에 개선할 수 있습니다. 스탠퍼드 대학 연구에 따르면 정기적인 BBL 시술이 피부 노화 유전자 발현을 역전시키는 효과가 있는 것으로 알려져 있습니다.",
      caution: "시술 후 당일~3일간 시술 부위에 붉기나 약간의 색소 진해짐이 나타날 수 있습니다. 자외선 차단제(SPF 50+)를 철저히 바르고, 시술 후 1주일간 직사광선 노출을 피해주세요.",
      sessions: "3~5회 (4주 간격)",
      effect: "기미·잡티·일광 흑자 개선, 홍조 개선, 피부 재생, 피부 노화 예방",
    },
    {
      name: "루메니스 원",
      nameEn: "LUMENIS ONE",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/색소문신-루메니스원_fa549937.png",
      desc: "IPL 기반 복합 광치료로 색소·홍조·피부결을 한 번에 개선.\n다양한 파장 필터로 피부 타입별 맞춤 치료가 가능합니다.", descEn: "Multi-platform laser system combining IPL and laser for comprehensive treatment of pigmentation, redness, and skin rejuvenation.", descJa: "IPLとレーザーを組み合わせたマルチプラットフォームシステムで色素・紅潮・肌再生を総合治療します。", descZh: "结合IPL和激光的多平台系统，综合治疗色素、红肌和皮肤再生。",
      time: "20~40분", recovery: "당일~3일",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/equip-lumenis-one-nobg-8eIjKlMnOp6rStU9vWxYzA.webp",
      youtubeUrl: "https://www.youtube.com/embed/rA_n4hbY5Dc",
      detail: "Lumenis One은 IPL(Intense Pulsed Light) 기반의 복합 광치료 플랫폼입니다. 515nm~1,200nm의 광범위한 파장 스펙트럼과 다양한 컷오프 필터를 이용해 색소 병변·홍조·피부결 개선을 맞춤형으로 치료합니다. 피부 타입과 병변 종류에 따라 파장 필터를 교체하여 최적의 치료 효과를 기대할 수 있으며, 기미·잡티·모세혈관 확장·피부 재생 등 다양한 적응증에 활용됩니다.",
      caution: "시술 후 당일~3일간 시술 부위에 붉기나 약간의 색소 진해짐이 나타날 수 있습니다. 자외선 차단제(SPF 50+)를 철저히 바르고, 시술 후 1주일간 직사광선 노출을 피해주세요.",
      sessions: "3~5회 (3~4주 간격)",
      effect: "기미·잡티 개선, 홍조·모세혈관 확장 개선, 피부결 정돈, 피부 재생",
    },
    {      name: "펜토 9900",
      nameEn: "PENTO 9900",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/색소문신-펜토_704d9859.png",
      desc: "1064nm 레이저로 기미·잡티·문신 색소를 깊은 층까지 분해.\n혈관 병변 치료에도 활용되는 복합 레이저 장비입니다.", descEn: "Dual-wavelength laser combining Alexandrite and Nd:YAG for effective treatment of melasma, freckles, and skin elasticity improvement.", descJa: "アレキサンドライトとNd:YAGのデュアル波長でシミ・そばかす・弾力改善に効果的なレーザーです。", descZh: "结合翠绿宝石和Nd:YAG双波长，有效治疗黄褐斑、雀斑并改善皮肤弹力。",
      time: "20~40분", recovery: "3~5일",
      image: `${CDN}/펜토 9900_3af14ef2.png`,
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/색소문신-펜토_704d9859.png",
      detail: "펜토 9900은 1064nm Nd:YAG 레이저로 색소 병변과 혈관 병변을 복합적으로 치료하는 장비입니다. 진피 깊은 층까지 침투하는 1064nm 파장으로 기미·잡티·문신 색소를 효과적으로 분해하며, 혈관 병변 치료에도 활용됩니다. 다양한 피부 타입에 적용 가능하며, 색소와 혈관 병변이 복합된 경우 특히 효과적입니다.",
      caution: "시술 후 3~5일간 시술 부위에 붉기나 딱지가 생길 수 있습니다. 자외선 차단제(SPF 50+)를 철저히 바르고, 딱지는 자연스럽게 탈락되도록 두세요. 문신 제거의 경우 색소 종류와 깊이에 따라 더 많은 횟수가 필요할 수 있습니다.",
      sessions: "4~8회 (3~4주 간격)",
      effect: "기미·잡티·문신 제거, 혈관 병변 개선, 피부 톤 밝기, 색소 침착 방지",
    },
    {
      name: "라셈드 울트라",
      nameEn: "LASEMD ULTRA",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/라셈드울트라_a5fd8612.png",
      desc: "차원이 다른 피부 솔루션! 레이저와 스킨부스터 시술 효과가 동시에!\n수분 공급, 피부 재생, 탄력 증가, 피부톤·기미 개선, 광채 효과.", descEn: "Thulium fiber laser for skin resurfacing and rejuvenation. Effective for fine lines, pores, and overall skin texture improvement.", descJa: "皮膚再生と若返りのためのツリウムファイバーレーザー。小じわ、毛穴、全体的な肌質改善に効果的です。", descZh: "用于皮肤再生和年轻化的铥纤维激光。有效改善细纹、毛孔和整体肌肤质感。",
      time: "20~40분", recovery: "1~3일",
      badge: "저자극 회복", badgeColor: "#7C3AED",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/equip-lasemd-ultra-nobg-9fJkMnOpQr4sT7uVwXyZdE.webp",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/라셈드울트라_a5fd8612.png",
      youtubeUrl: "https://www.youtube.com/embed/E1HNU5xkdwM",
      detail: "라셈드 울트라는 1927nm 파장대를 가진 툴리움 레이저로, 피부 표면에 조사했을 때 각질층에 존재하는 수분이 증발하여 수많은 미세구멍을 형성시켜 유효 성분의 흡수를 돕는 장비입니다. 레이저와 스킨부스터 시술 효과를 동시에 얻을 수 있으며, 수분 공급, 피부 재생, 탄력 증가, 피부톤·기미 개선, 광채 효과 등 다양한 효과를 기대할 수 있습니다. FDA 승인받은 안전성, 짧은 시술시간, 주사자국·멍·통증이 거의 없는 것이 특장점입니다. 다양한 모드가 가능한 4종류 팁을 지원합니다.",
      caution: "시술 후 일주일간 자외선 차단제(SPF 50+)를 철저히 바르셔야 합니다. 시술 당일 세안시 자극이 느낄 수 있으며, 1~3일 내 미세한 각질이 일어날 수 있습니다.",
      sessions: "4~6회 (2~4주 간격)",
      effect: "수분 공급, 피부 재생, 탄력 증가, 피부톤·기미 개선, 광채 효과",
    },
  ],

  // ── 흉터·모공치료 ─────────────────────────────────────────────────────────
  scar: [
    {
      name: "뉴 울트라 펄스 앙코르 스카 FX",
      nameEn: "NEW ULTRA PULSE ENCORE SCAAR FX",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/울트라펄스_6857e3b1.png",
      desc: "미국 루메니스사의 탄산가스 프락셔널 레이저로 각종 흉터, 색소침착, 피부톤 개선을 한번에!\n일반 프락셀 대비 5배 뛰어난 효과와 빠른 회복이 특징입니다.", descEn: "Advanced CO2 fractional laser for deep scar treatment. Targets scar tissue with precision for significant improvement.", descJa: "深い瘢痕治療のための高度なCO2フラクショナルレーザー。精密に瘢痕組織をターゲットにして大幅な改善を実現します。", descZh: "用于深度疤痕治疗的高级CO2点阵激光。精准靶向疤痕组织，实现显著改善。",
      time: "30~60분", recovery: "5~7일",
      badge: "특화", badgeColor: "#4A6FA5",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/울트라펄스_6857e3b1.png", best: true,
      youtubeUrl: "https://www.youtube.com/embed/y_9qn78LuaQ",
      detail: "뉴울트라펄스 앙코르 스카 FX는 미국 루메니스사의 탄산가스레이저에 프락셔널 기술의 스캐너가 장착된 레이저입니다. 프락셔널 기술로 한 점에 레이저가 작용하면 다른 점에는 작용하지 않는 방식으로, 과거 레이저 박피와 같은 강력한 치료 효과를 나타내면서 부작용은 적고 회복이 빠른 치료가 가능합니다. 일반 프락셀에 비해 5배 정도 뛰어난 효과를 보이며, 통증이 작고 한번에 치료하는 면적이 넓어 치료기간이 단축됩니다.",
      caution: "시술 후 5~7일간 피부 재생 기간이 필요합니다. 자외선 차단제(SPF 50+)를 철저히 바르고, 세안 시 자극을 최소화하세요. 재생 기간 중 딱지가 생길 수 있으며 자연스럽게 탈락되도록 두세요.",
      sessions: "3~5회 (4~6주 간격)",
      effect: "화상·수술·여드름 흉터 치료, 검버섯·잡티·기미 등 색소 질환 치료, 주름완화 및 피부톤·피부결 개선",
      related: ["미라젯", "DRT 진피재생술", "쥴 프로프락셔널"],
    },
    {
      name: "미라젯",
      nameEn: "MIRAJET",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/미라젯_8290d437.png",
      desc: "바늘 없이! 화상 없이! 빠르고 효과적인 안티에이징.\n마이크로-젯 분사로 진피층에 약물을 효과적으로 전달합니다.", descEn: "Needle-free drug delivery system for painless treatment. Delivers medications precisely into the skin without needles.", descJa: "痛みのない施術のための無針薬物送達システム。針なしで薬剤を皮膚に精密に届けます。", descZh: "无痛治疗的无针药物输送系统。无需针头将药物精准输送到皮肤。",
      time: "20~40분", recovery: "1~3일",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/미라젯_8290d437.png",
      youtubeUrl: "https://www.youtube.com/embed/J_6BHWGyC5g",
      detail: "미라젯은 피부노화방지와 피부건강 개선 등 안티에이징을 위하여 주사바늘을 사용하지 않고 미량의 약물을 마이크로-젯(Micro-Jet)분사하여 진피층에 소량의 약물을 보다 효과적으로 전달하는 완전히 새로운 개념의 TDDS(Trans-Dermal Drug Delivery System)입니다. 초고속 마이크로젯으로 조직손상이 적어 다운타임이 최소화되며, 마취크림 적용 없이 시술이 가능합니다.",
      caution: "시술 후 1~3일간 시술 부위에 약간의 붉기나 붓기가 나타날 수 있습니다. 시술 부위를 청결하게 유지하고 자외선 차단제를 매일 사용하세요.",
      sessions: "3~6회 (2~4주 간격)",
      effect: "여드름흉터·수술흉터·함몰된 흉터 개선, 모공수축, 튼살·피부결 개선",
    },
    {
      name: "DRT 진피재생술",
      nameEn: "DERMIS RESURFACING THERAPY",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/DRT_0cfd047a.png",
      desc: "어븀야그 핀홀 방식의 최첨단 프락셔널 치료로 진피층까지 직접적인 미세 구멍을 형성.\n새로운 피부 조직 생성을 유도하여 흉터·모공·피부결을 개선합니다.", descEn: "Comprehensive dermis resurfacing treatment for skin texture improvement. Stimulates collagen production for smoother, younger-looking skin.", descJa: "肌質改善のための総合的な真皮再生施術。コラーゲン生成を促進し、なめらかで若々しい肌を実現します。", descZh: "改善肌肤质感的综合真皮再生治疗。促进胶原蛋白生成，实现更细腻年轻的肌肤。",
      time: "30~60분", recovery: "2~5일",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/DRT_0cfd047a.png",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/DRT_0cfd047a.png",
      detail: "DRT(Dermis Resurfacing Therapy)는 기존 프락셔널 레이저가 진피층에 Thermal Effect를 이용한 피부재생을 유도하는 것과는 달리 어븀야그 핀홀(<100m) 방식의 프락셔널을 구현하여 진피층까지 직접적인 미세 구멍을 형성함으로써 새로운 피부 조직 생성을 유도하는 최첨단 프락셔널 치료방식입니다. 두 개의 파장으로 표피층과 진피층을 각각 또는 동시에 치료할 수 있으며, 모공 축소 및 피부 탄력 강화, 미백 효과가 있습니다. CO2보다 빠른 재생과 적은 부작용이 특징입니다.",
      caution: "자외선 차단제와 보습제를 꼼꼼히 바라주세요. 시술 후 약 2~3일 정도는 사우나 및 격한 운동을 피해주세요. 외출 시 SPF 50 이상의 선크림을 바라주세요. 일주일간 비타민C, 스크럽제, 레티놀이 포함된 제품은 사용하지 마세요.",
      sessions: "3~5회 (4~6주 간격)",
      effect: "여드름·수두·수술·화상 흉터 개선, 모공 축소, 피부 탄력 강화, 미백 효과, 기미·잡티 완화",
    },

    {
      name: "트리필 프로",
      nameEn: "TRIFILL PRO",
      youtubeUrl: "https://www.youtube.com/embed/DFB4SZU5U-g",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub_03_01_47_81166797.jpg",
      desc: "패인 흉터에 필러 성분을 정밀 주입해 즉각적으로 볼륨을 채워주는 시술.\n레이저 치료와 병행 시 흉터 개선 시너지 효과를 기대할 수 있습니다.", descEn: "Advanced filler treatment for comprehensive volume restoration. Precisely fills depressed scars and volume-deficient areas.", descJa: "総合的なボリューム回復のための高度なフィラー施術。陥没瘢痕とボリューム不足部位を精密に補填します。", descZh: "全面丰盈恢复的高级填充治疗。精准填充凹陷疤痕和体积不足区域。",
      time: "20~40분", recovery: "1~3일",
      image: `${CDN}/더마샤인프로_d7a8f2c1.png`,
      detail: "트리필프로(Trifill Pro)는 패인 흉터 부위에 히알루론산 필러 성분을 정밀하게 주입하여 즉각적인 볼륨 개선 효과를 제공합니다. 여드름 흉터로 인한 음영과 패임을 채워주어 피부 표면을 고르게 만드는 데 활용됩니다. 레이저 치료와 병행하면 흉터 개선 효과를 극대화할 수 있으며, 시술 후 즉시 결과를 확인할 수 있습니다.",
      caution: "시술 후 1~3일간 시술 부위에 약간의 붓기나 멍이 나타날 수 있습니다. 시술 후 1주일간 시술 부위를 강하게 누르거나 마사지하지 마세요. 자외선 차단제를 매일 사용하세요.",
      sessions: "1~3회 (필요에 따라 추가 시술)",
      effect: "패인 흉터 볼륨 회복, 흉터 음영 개선, 즉각적인 피부 표면 개선",
    },
    {
      name: "모래알 피부이식",
      nameEn: "SST PRO",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/모래알피부이식_b1e8163f.png",
      youtubeUrl: "https://www.youtube.com/embed/218RqWMl7Kg",
      desc: "수술·외상·켈로이드 등 다양한 흉터 유형에 직접 작용하는 복합 치료.\n흉터의 색소 침착과 조직 경화를 점진적으로 개선합니다.", descEn: "Treatment that harvests skin tissue in sand grain size and transplants it to vitiligo areas. Systematically treats even difficult-to-treat vitiligo areas.", descJa: "皮膚組織を砂粒大に採取して白斑部位に移植する施術。治療が難しかった難治性白斑部位まで丁寧かつ体系的に治療します。", descZh: "将皮肤组织采集成沙粒大小并移植到白癜风部位的治疗。系统性地治疗难以治疗的顽固性白癜风部位。",
      time: "20~40분", recovery: "3~5일",
      image: `${CDN}/프로파운드_93be7410.png`,
      detail: "SST Pro는 흉터 조직에 직접 작용하는 복합 치료 장비로, 수술 흉터·외상 흉터·켈로이드·비후성 흉터 등 다양한 흉터 유형에 활용됩니다. 흉터의 색소 침착을 개선하고 경화된 흉터 조직을 연화시켜 흉터의 외관과 질감을 점진적으로 개선합니다. 다른 흉터 치료 장비와 병행 시 더 효과적인 결과를 기대할 수 있습니다.",
      caution: "시술 후 3~5일간 시술 부위에 붉기나 약간의 붓기가 나타날 수 있습니다. 자외선 차단제(SPF 50+)를 철저히 바르고, 시술 부위를 청결하게 유지하세요.",
      sessions: "4~6회 (2~4주 간격)",
      effect: "수술 흉터 개선, 켈로이드 치료, 비후성 흉터 개선, 흉터 색소 침착 완화, 흉터 조직 연화",
    },
    {
      name: "쥴 프로프락셔널",
      nameEn: "JOULE PROFRACTIONAL",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/쥴-프로프락셔널_f08a640a.png",
      youtubeUrl: "https://www.youtube.com/embed/_n50vuux5hg",
      desc: "Sciton 쥴 플랫폼 기반 프랙셔널 레이저로 여드름 흉터·모공·피부결 특화 치료.\n표피와 진피를 동시 자극해 콜라겐 재생과 피부결 정돈 효과를 기대할 수 있습니다.", descEn: "Fractional laser for scar and pore improvement. Precise micro-channels stimulate collagen for smoother skin.", descJa: "瘢痕・毛穴改善フラクショナルレーザー。精密なマイクロチャンネルでコラーゲンを刺激し、なめらかな肌を実現します。", descZh: "改善疤痕和毛孔的点阵激光。精准微通道刺激胶原蛋白，实现更细腻的肌肤。",
      time: "30~60분", recovery: "5~7일",
      badge: "모공·흉터 특화", badgeColor: "#065F46",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/joule-fractional-laser_5152ce2e.jpg",
      detail: "Sciton Joule 플랫폼의 프랙셔널 레이저는 여드름 흉터와 넓은 모공 개선에 특화되어 있습니다. 표피와 진피를 동시에 자극하는 어블레이티브 프랙셔널 방식으로, 피부 재생과 함께 피부결이 고르게 정돈되는 효과를 기대할 수 있습니다. 여드름 흉터의 진피 리모델링에도 효과적이며, 다른 흉터 치료 장비와 병행 시 시너지 효과를 기대할 수 있습니다.",
      caution: "시술 후 5~7일간 세안 시 자극을 피하고, 자외선 차단제(SPF 50+)를 철저히 바르셔야 합니다. 회복 기간 중 사우나·수영 등 강한 열 자극은 피해주세요.",
      sessions: "3~5회 (4~6주 간격)",
      effect: "여드름 흉터 개선, 모공 축소, 피부결 정돈, 콜라겐 재생 유도",
    },
    {
      name: "쥴 헤일로",
      nameEn: "JOULE HALO",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/헤일로_쥴_new_d88c347b.png",
      youtubeUrl: "https://www.youtube.com/embed/RmVQsewJBYE",
      desc: "두 가지 파장을 동시에 조사해 모공·피부결·흉터·색소를 한 번에 복합 개선.\n시술 후 피부가 유리처럼 광나는 'Halo Glow' 효과로 유명합니다.", descEn: "Dual-wavelength hybrid fractional laser for comprehensive skin rejuvenation. Simultaneously treats surface and deep skin layers.", descJa: "総合的な皮膚若返りのためのデュアル波長ハイブリッドフラクショナルレーザー。表皮と真皮を同時に治療します。", descZh: "双波长混合点阵激光实现全面皮肤年轻化。同时治疗表皮和真皮层。",
      time: "30~60분", recovery: "5~7일",
      badge: "Halo Glow", badgeColor: "#047857",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/halo-hybrid-laser_bf04f00b.jpeg",
      detail: "Sciton Halo는 세계 최초의 하이브리드 프랙셔널 레이저로, 비절제성 1470nm과 절제성 2940nm 두 가지 파장을 동시에 조사하여 표피와 진피를 함께 자극합니다. 모공·피부결·여드름 흉터·색소 병변을 한 번에 복합적으로 개선할 수 있어 효율적입니다. 시술 후 피부가 유리처럼 광나는 ‘Halo Glow’ 효과로 유명하며, 다양한 연령대에서 만족도가 높은 시술입니다.",
      caution: "시술 후 5~7일간 피부가 붉고 각질이 일어날 수 있습니다. 자외선 차단제(SPF 50+)를 철저히 바르시고, 회복 기간 중 사우나·수영 등 강한 열 자극은 피해주세요.",
      sessions: "1~3회 (3~6개월 간격)",
      effect: "모공 축소, 피부결 정돈, 여드름 흉터 개선, 색소 병변 개선, Halo Glow 효과",
    },
  ],

  // ── 볼륨회복·스킨부스터 ───────────────────────────────────────────────────
  volume: [
    {
      name: "스킨부스터",
      nameEn: "SKIN BOOSTER",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/스킨부스터_4529f8dc.png",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/스킨부스터_4529f8dc.png",
      desc: "히알루론산 등 수분 성분을 피부 진피층에 직접 주입.\n피부 탄력·광채·수분을 동시에 개선하는 인기 시술.", descEn: "Hydrating skin booster injection for deep moisturization. Restores skin's natural moisture balance and improves elasticity.", descJa: "深い保湿のための水分補給スキンブースター注射。皮膚の自然な水分バランスを回復し、弾力を改善します。", descZh: "深层保湿的水润皮肤补充注射。恢复皮肤自然水分平衡，改善弹力。",
      time: "20~40분", recovery: "당일 일상",
      badge: "인기", badgeColor: "#81C7C9",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/7IUeNj7YG383_91ad3b5b.jpg", best: true,
      detail: "스킨부스터는 히알루론산(HA) 등 수분 성분을 피부 진피층에 직접 미세 주입하는 시술입니다. 더마샤인 프로 장비를 이용해 균일한 깊이와 간격으로 주입하여 피부 전체의 수분 보유력을 높이고, 탄력·광채·결을 동시에 개선합니다. 시술 직후부터 피부 촉촉함이 느껴지며 다운타임이 거의 없습니다.",
      caution: "시술 후 주사 부위에 일시적인 붉기·멍이 생길 수 있으며 1~2일 내 자연 소실됩니다. 시술 당일 세안 시 자극을 최소화해 주세요.",
      sessions: "3~4회 (2~4주 간격)",
      effect: "피부 수분 보충, 탄력·광채 개선, 피부결 정돈, 즉각적인 피부 촉촉함",
    },
    {
      name: "줄기세포 치료",
      nameEn: "STEM CELL TREATMENT",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/줄기세포_9034d023.png",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/줄기세포_9034d023.png",
      desc: "자가 줄기세포를 활용한 피부 재생 치료.\n피부 노화 개선과 탄력 회복에 효과적인 프리미엄 프로그램.", descEn: "Stem cell-based skin regeneration treatment. Harnesses the regenerative power of stem cells for comprehensive skin renewal.", descJa: "幹細胞ベースの皮膚再生施術。幹細胞の再生力を活用して総合的な皮膚再生を実現します。", descZh: "基于干细胞的皮肤再生治疗。利用干细胞的再生能力实现全面皮肤更新。",
      time: "60~120분", recovery: "3~7일",
      badge: "프리미엄", badgeColor: "#9C5FA5",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/Qv3RHE1FXMfm_stemcell.jpg",
      detail: "자가 혈액 또는 지방에서 추출한 줄기세포를 피부에 주입하여 노화된 세포를 재생하고 콜라겐 생성을 촉진합니다. 피부 탄력 회복, 주름 개선, 피부 톤 균일화 효과를 기대할 수 있으며, 자가 세포를 사용하므로 부작용 위험이 낮습니다.",
      caution: "시술 전 혈액 또는 지방 채취가 필요합니다. 시술 후 3~7일간 격렬한 운동·음주·사우나를 피해주세요. 면역 억제제 복용 중인 경우 시술 전 상담이 필요합니다.",
      sessions: "1~2회 (3~6개월 간격)",
      effect: "피부 세포 재생, 콜라겐 생성 촉진, 탄력 회복, 주름 개선, 피부 톤 균일화",
    },
    {
      name: "콜라겐 주사",
      nameEn: "COLLAGEN INJECTION",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/콜라겐_2fb56379.png",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/콜라겐_2fb56379.png",
      desc: "콜라겐 자극 주사로 피부 탄력과 볼륨을 자연스럽게 회복.\n지속 효과 6~12개월로 정기 관리에 적합한 시술.", descEn: "Direct collagen injection for skin elasticity and volume improvement. Replenishes lost collagen for firmer, more youthful skin.", descJa: "皮膚弾力とボリューム改善のためのコラーゲン直接注射。失われたコラーゲンを補充して、引き締まった若々しい肌を実現します。", descZh: "直接注射胶原蛋白改善皮肤弹力和丰盈度。补充流失的胶原蛋白，实现更紧致年轻的肌肤。",
      time: "20~30분", recovery: "1~3일",
      image: `${CDN}/에너젯_afcf856d.png`,
      detail: "콜라겐 자극 주사는 피부 진피층에 직접 주입하여 콜라겐 합성을 촉진하는 시술입니다. 노화로 인해 감소한 콜라겐을 보충하고 피부 탄력과 볼륨을 자연스럽게 회복시킵니다. 지속 효과는 6~12개월로, 정기적인 시술을 통해 피부 노화를 효과적으로 관리할 수 있습니다.",
      caution: "시술 후 주사 부위에 일시적인 붓기·멍이 생길 수 있습니다. 시술 당일 사우나·음주는 피해주세요.",
      sessions: "2~4회 (4~6주 간격)",
      effect: "콜라겐 합성 촉진, 피부 탄력 회복, 자연스러운 볼륨 개선, 지속 효과 6~12개월",
    },
    {
      name: "엑소좀",
      nameEn: "ASCE+",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/엑소좀_6eeb4268.png",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/엑소좀_6eeb4268.png",
      desc: "줄기세포 배양액에서 추출한 엑소좀을 이용한 피부 재생 치료.\n피부 장벽 강화, 탄력 개선, 주름 완화 효과를 기대할 수 있습니다.", descEn: "Exosome-based skin regeneration therapy. Advanced cell-derived exosomes for comprehensive skin renewal and rejuvenation.", descJa: "エクソソームベースの皮膚再生療法。高度な細胞由来エクソソームで総合的な皮膚再生と若返りを実現します。", descZh: "基于外泌体的皮肤再生疗法。先进的细胞来源外泌体实现全面皮肤更新和年轻化。",
      time: "30~60분", recovery: "당일 일상",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/exosome_treatment_card-FL5KNDXVdmJCtUV4DFoGSD.webp",
      detail: "엑소좀(ASCE+)은 줄기세포 배양액에서 추출한 세포 외 소포체로, 성장 인자, 사이토카인, 마이크로RNA 등 피부 재생에 필요한 생리활성 물질을 풍부하게 함유하고 있습니다. 손상된 피부 세포의 재생을 촉진하고, 콜라겐 및 엘라스틴 합성을 자극하여 피부 탄력과 광채를 회복시킵니다. 염증 완화, 피부 장벽 강화, 주름 개선 등 종합적인 피부 재생 효과를 제공합니다. 다운타임이 거의 없어 바쁜 일상 중에도 시술이 가능합니다.",
      caution: "시술 후 자외선 차단제 사용을 철저히 해주세요. 시술 당일 강한 세안제 사용은 피해주세요.",
      sessions: "3~6회 (2~4주 간격)",
      effect: "피부 장벽 강화, 콜라겐 합성 촉진, 탄력 개선, 피부 재생, 광채 효과",
    },
    {
      name: "스컬트라",
      nameEn: "VOLUME UP PROGRAM · SCULPTRA",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/볼륨업프로그램_3442a94f.png",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/볼륨업프로그램_3442a94f.png",
      desc: "FDA 승인 스컬트라로 피부 스스로 콜라겐을 생성해 자연스러운 볼륨을 회복.\n주름 개선·탄력·볼륨 회복 효과가 평균 2년 이상 지속됩니다.", descEn: "FDA-approved collagen stimulator", descJa: "FDA承認コラーゲン刺激剤", descZh: "FDA认证胶原蛋白刺激剂",
      time: "30~60분", recovery: "당일 일상",
      badge: "2년 지속", badgeColor: "#9C5FA5",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/treat-sculptra_c3f4b5f6.png",
      detail: "스컬트라(Sculptra)는 PLLA(폴리-L-락틱산) 성분의 생체 자극형 콜라겐 자극제입니다. 일반 히알루론산 필러처럼 즉각적인 볼륨 효과를 내는 것이 아니라, 주입 후 수개월에 걸쳐 피부 스스로 콜라겐을 생성하도록 유도합니다. 이 때문에 결과가 매우 자연스럽고, 효과가 평균 2년 이상 지속됩니다. FDA 승인 성분으로 안전성이 공인되어 있으며, 볼 꺼짐·팔자주름·관자놀이 볼륨 감소 등 다양한 부위에 활용할 수 있습니다.",
      caution: "시술 후 5-5-5 마사지(하루 5회, 5분씩, 5일간)를 반드시 시행하세요. 시술 직후 멍·붓기가 나타날 수 있으며 1~2주 내 가라앉습니다. 효과는 시술 후 2~3개월부터 서서히 나타납니다.",
      sessions: "2~3회 (4~6주 간격)",
      effect: "볼 볼륨 회복, 팔자주름 개선, 피부 탄력 향상, 콜라겐 생성 유도, 2년 이상 효과 지속",
      youtubeUrl: "https://www.youtube.com/embed/J6EcnHsUYew",
    },
    {
      name: "쥬베룩 볼륨",
      nameEn: "JUVELOOK VOLUME",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/쥬베룩볼륨_d9ad38c6.png",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/쥬베룩볼륨_d9ad38c6.png",
      desc: "PDLLA·히알루론산 복합 콜라겐 자극 스킨부스터로 수분·탄력 동시 개선.\n노화로 인한 볼륨 감소와 피부 스러짐 개선, 지속 효과 12~18개월.", descEn: "PDLLA volume filler for facial volume restoration and collagen stimulation. Long-lasting natural volume enhancement.", descJa: "顔のボリューム回復とコラーゲン刺激のためのPDLLAボリュームフィラー。長期持続する自然なボリュームアップを実現します。", descZh: "用于面部丰盈恢复和胶原蛋白刺激的PDLLA丰盈填充剂。持久自然的丰盈效果。",
      time: "20~40분", recovery: "1~3일",
      badge: "복합 효과", badgeColor: "#B45309",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/7IUeNj7YG383_91ad3b5b.jpg",
      detail: "쥬베룩 볼륨(Juvelook Volume)은 PDLLA와 히알루론산을 복합한 차세대 콜라겐 바이오스티뮬레이터입니다. PDLLA가 콜라겐 생성을 자극하고, 히알루론산이 즉각적인 수분 보충과 탄력 개선을 동시에 제공합니다. 노화로 인한 볼륨 감소와 피부 스러짐 개선에 특화되어 있으며, 지속 효과 12~18개월을 기대할 수 있습니다.",
      caution: "시술 후 일주일간 주사 부위에 강한 압력을 피하고, 사우나·수영 등 고온 환경은 피해주세요. 시술 직후 일시적인 부종이 있을 수 있습니다.",
      sessions: "2~4회 (4주 간격)",
      effect: "콜라겐 재생, 피부 수분 보충, 볼륨 회복, 피부 탄력 개선",
      youtubeUrl: "https://www.youtube.com/embed/MmzTjakLbok",
    },
    {
      name: "리투오",
      nameEn: "RE20",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/리투오_17dec4a1.png",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/리투오_17dec4a1.png",
      desc: "RE20 피부 재생 성분이 손상된 피부를 빠르게 회복시키고 수분을 공급.\n피부 자극 최소화로 민감한 피부도 안심하고 받을 수 있습니다.", descEn: "Regenerative skin treatment for comprehensive anti-aging. Stimulates natural skin renewal processes for youthful, radiant skin.", descJa: "総合的なアンチエイジングのための再生皮膚施術。自然な皮膚再生プロセスを刺激して若々しく輝く肌を実現します。", descZh: "全面抗衰老的再生皮肤治疗。刺激自然皮肤更新过程，实现年轻有光泽的肌肤。",
      time: "20~30분", recovery: "1~2일",
      badge: "수분·재생", badgeColor: "#A16207",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/리투오_17dec4a1.png",
      detail: "리투오(RE20)는 피부 재생 성분이 함유된 고급 스킨부스터로, 손상된 피부를 빠르게 회복시키고 수분을 공급하는 데 특화되어 있습니다. 세포 재생을 촉진하고 피부 장벽을 강화하여 건강한 피부로의 회복을 돕습니다. 피부 자극을 최소화하여 민감한 피부도 안심하고 받을 수 있으며, 시술 직후에도 일상 복귀가 가능합니다. 지속적인 시술을 통해 피부의 근본적인 개선을 기대할 수 있습니다.",
      caution: "시술 후 1~2일간 주사 부위에 강한 압력을 피하고, 사우나·수영 등 고온 환경은 피해주세요. 시술 직후 일시적인 부종이나 발적이 있을 수 있습니다.",
      sessions: "3~4회 (2~4주 간격)",
      effect: "피부 재생 촉진, 수분 공급, 피부 장벽 강화, 탄력 개선, 민감한 피부 진정",
    },
  ],

  // ── 보톡스·필러 ────────────────────────────────────────────────────────────
  botox: [
    {
      name: "보톡스",
      nameEn: "BOTOX",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/botox_552ff42a.png",
      desc: "보툴리눔 톡신을 정밀 주입해 표정 주름과 과도한 근육 움직임을 완화하는 시술.\n이마·미간·눈가 등 잔주름을 자연스럽게 정돈하고 슬림한 인상을 돕습니다.", descEn: "Botulinum toxin injection for wrinkle improvement and facial contouring. Natural results with precise micro-dosing technique.", descJa: "しわ改善と顔のライン矯正のためのボツリヌス毒素注射。精密な少量施術で自然な結果を実現します。", descZh: "肉毒素注射改善皱纹和面部轮廓。精准微量注射，效果自然。",
      time: "10~20분", recovery: "당일 일상 복귀",
      badge: "주름 개선", badgeColor: "#D97706",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/BZDyHWjrUcLj_3f4c9c8d.jpg",
      detail: "보톡스는 보툴리눔 톡신을 소량씩 주입하여 과도하게 수축하는 표정 근육의 움직임을 완화하는 시술입니다. 이마·미간·눈가 주름처럼 반복적인 근육 사용으로 생기는 동적 주름 개선에 적합하며, 사각턱·승모근처럼 근육 발달이 두드러진 부위에도 적용할 수 있습니다. 시술 시간이 짧고 절개가 없어 바쁜 일정 중에도 비교적 부담 없이 받을 수 있습니다.",
      caution: "시술 후 1~2주 정도는 시술 부위를 강하게 문지르거나 과도한 사우나·음주를 피하는 것이 좋습니다. 주사 부위에 일시적인 붓기·멍·뻐근함이 생길 수 있으나 대부분 수일 내 완화됩니다. 효과와 유지 기간은 시술 부위와 개인의 근육 사용 습관에 따라 달라질 수 있습니다.",
      sessions: "3~4개월 간격",
      effect: "이마·미간·눈가 주름 완화, 사각턱 라인 개선, 표정 주름 예방",
      youtubeUrl: "https://www.youtube.com/embed/DFB4SZU5U-g",
    },
    {
      name: "필러",
      nameEn: "FILLER",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/filler_79748c4a.png",
      desc: "히알루론산 필러로 꺼진 부위를 채워 볼륨과 윤곽을 자연스럽게 보완하는 시술.\n팔자·앞볼·입술·턱 라인 등 필요한 부위에 입체감을 더해 균형 잡힌 인상을 만듭니다.", descEn: "Hyaluronic acid filler for volume restoration and facial contouring. Natural-looking results with immediate effect.", descJa: "ボリューム回復と顔のライン矯正のためのヒアルロン酸フィラー。即効性のある自然な仕上がりを実現します。", descZh: "透明质酸填充剂用于丰盈恢复和面部轮廓塑造。即时效果，外观自然。",
      time: "20~30분", recovery: "당일 일상 복귀",
      badge: "볼륨 개선", badgeColor: "#EC4899",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/zJEqJLqGqI2d_3f4c9c8d.jpg",
      detail: "필러는 주로 히알루론산 성분을 활용해 볼륨이 꺼지거나 라인이 아쉬운 부위에 입체감을 더하는 시술입니다. 팔자주름, 앞볼, 턱끝, 입술, 코 라인 등 다양한 부위에 적용할 수 있으며, 얼굴 비율과 피부 상태를 고려해 디자인하는 것이 중요합니다. 적절한 용량과 층을 선택해 주입하면 과하지 않으면서도 또렷한 윤곽 변화를 기대할 수 있습니다.",
      caution: "시술 직후에는 붓기·멍·압통이 일시적으로 나타날 수 있으며 대부분 수일 내 호전됩니다. 시술 후 1주일 정도는 강한 마사지, 과도한 열 자극, 음주를 피하는 것이 좋습니다. 부위별 적정 용량과 제품 선택이 중요하므로 충분한 상담 후 진행해야 합니다.",
      sessions: "6~12개월 유지",
      effect: "꺼진 부위 볼륨 보완, 팔자·입술·턱 라인 개선, 얼굴 윤곽 균형 보정",
      youtubeUrl: "https://www.youtube.com/embed/Mt-JsBhZXmA",
    },
    {
      name: "윤곽 주사",
      nameEn: "CONTOURING INJECTION",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub_03_01_49_354098fb.jpg",
      desc: "지방 분해 주사로 이중턱·볼 지방 등을 비수술적으로 개선하며 수술 없이 얼굴 윤곽을 자연스럽게 개선하는 시술입니다.", descEn: "Specialized injection for facial contouring and slimming. Precisely sculpts facial features for a more defined appearance.", descJa: "顔のラインと小顔のための専門注射。顔の輪郭を精密に彫刻して、より引き締まった外見を実現します。", descZh: "面部轮廓塑造和瘦脸专项注射。精准雕塑面部特征，呈现更立体的外观。",
      time: "20~30분", recovery: "1~3일",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/0dVRx3DuVpWY_30a10709.jpg",
      detail: "지방 분해 성분을 이중턱, 볼 지방 등 원하는 부위에 직접 주입하여 지방 세포를 분해·제거하는 비수술적 시술입니다. 수술 없이 얼굴 윤곽을 개선할 수 있으며, 시술 후 점진적으로 지방이 감소하여 자연스러운 윤곽 변화를 기대할 수 있습니다.",
      caution: "시술 후 1~3일간 시술 부위에 붓기·멍이 생길 수 있습니다. 시술 당일 음주·사우나는 피해주세요. 임신·수유 중인 경우 시술이 불가합니다.",
      sessions: "2~4회 (4~6주 간격)",
      effect: "이중턱 개선, 볼 지방 감소, 얼굴 윤곽 개선, 비수술적 지방 제거",
    },
    {
      name: "리쥬란 힐러",
      nameEn: "REJURAN HEALER",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/리쥬란힐러_98677b53.png",
      desc: "연어 DNA 성분(PDRN)을 이용한 피부 재생 치료로 피부 탄력·수분·결을 종합적으로 개선하는 시술입니다.", descEn: "Salmon DNA skin regeneration injection. PNPN component stimulates skin regeneration, improves elasticity, and restores youthful skin.", descJa: "サーモン由来DNA皮膚再生注射。PNPN成分が皮膚再生を促進し、弾力を改善して若々しい肌を回復します。", descZh: "三文鱼DNA皮肤再生注射。PNPN成分促进皮肤再生，改善弹力，恢复年轻肌肤。",
      time: "20~40분", recovery: "1~3일",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/리쥬란힐러_98677b53.png",
      detail: "리쥬란 힐러는 연어 DNA에서 추출한 PDRN(폴리데옥시리보뉴클레오타이드) 성분을 피부 진피층에 주입하는 시술입니다. PDRN이 손상된 피부 세포의 DNA 복구를 촉진하고 콜라겐 합성을 자극하여 피부 탄력·수분·결을 종합적으로 개선합니다. 자연 유래 성분으로 부작용 위험이 낮습니다.",
      caution: "시술 후 주사 부위에 일시적인 붓기·멍이 생길 수 있으며 1~2일 내 자연 소실됩니다. 연어 알레르기가 있는 경우 시술 전 반드시 상담해 주세요.",
      sessions: "4~6회 (2~4주 간격)",
      effect: "피부 재생, 탄력 회복, 수분 보충, 피부결 개선, 모공 축소",
    },
    {
      name: "리쥬란 힐러 플러스",
      nameEn: "REJURAN HEALER PLUS",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/healer_plus_9a47b1bf.png",
      desc: "PDRN 피부 재생과 HA 즉각 수분 공급을 동시에 누리는 리쥬란 업그레이드로 기존 리쥬란보다 수분감과 광채 효과가 더욱 뚜렷하게 나타납니다.", descEn: "Enhanced version of Rejuran Healer with higher concentration. More intensive skin regeneration and elasticity improvement for advanced anti-aging.", descJa: "より高濃度のリジュランヒーラーの強化版。より集中的な皮膚再生と弾力改善で高度なアンチエイジングを実現します。", descZh: "更高浓度的婴儿针加强版。更密集的皮肤再生和弹力改善，实现高级抗衰老效果。",
      time: "20~40분", recovery: "1~2일",
      badge: "재생·수분", badgeColor: "#4A6FA5",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/healer_plus_9a47b1bf.png",
      detail: "리쥬란 힐러 플러스는 연어 DNA 성분(PDRN)과 히알루론산(HA)을 결합한 복합 제형입니다. PDRN이 손상된 피부 세포를 재생하고 탄력을 회복시키는 동시에, HA가 즉각적인 수분을 공급합니다. 기존 리쥬란 힐러보다 수분감과 광채 효과가 더욱 뚜렷하게 나타납니다.",
      caution: "시술 후 주사 부위에 일시적인 붓기·멍이 생길 수 있으며, 1~2일 내 자연 소실됩니다. 시술 당일 세안 시 자극을 최소화해 주세요.",
      sessions: "4~6회 (2~4주 간격)",
      effect: "피부 재생, 탄력 회복, 즉각적인 수분 공급, 피부결 개선, 광채 효과",
    },
    {
      name: "쥬베룩",
      nameEn: "JUVELOOK SKIN BOOSTER",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/juvelook_f03b1652.png",
      desc:"HA·PDLLA 복합 차세대 스킨부스터로 즉각 수분 공급과 콜라겐 생성 동시 유도하며 피부 탄력·광채·결을 한 번에 개선하는 복합 효과 스킨부스터입니다.", descEn: "PDLLA skin booster for hydration and collagen stimulation. Improves skin texture and elasticity from within.", descJa: "保湿とコラーゲン刺激のためのPDLLAスキンブースター。内側から肌のテクスチャーと弾力を改善します。", descZh: "用于保湿和胶原蛋白刺激的PDLLA皮肤补充剂。从内部改善肌肤质感和弹力。",
      time: "20~30분", recovery: "당일 일상",
      badge: "수분·탄력", badgeColor: "#0C4A6E",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/IkzStH3azHFL_d72284cb.webp",
      detail: "쥬베룩 스킨부스터는 히알루론산(HA)과 생분해성 PDLLA 마이크로스피어를 결합한 복합 제형입니다. HA가 즉각적인 수분을 공급하는 동시에 PDLLA가 서서히 분해되며 콜라겐 생성을 자극합니다. 기존 스킨부스터 대비 효과 지속 기간이 길고, 피부 탄력·광채·결 개선 효과가 복합적으로 나타납니다.",
      caution: "시술 후 주사 부위에 일시적인 붓기·멍이 생길 수 있으며, 1~2일 내 자연 소실됩니다. 시술 당일 사우나·음주는 피해주세요.",
      sessions: "3~4회 (4주 간격)",
      effect: "즉각적인 수분 공급, 콜라겐 생성 유도, 피부 탄력·광채 개선, 효과 장기 지속",
      youtubeUrl: "https://www.youtube.com/embed/MmzTjakLbok",
    },
  ],

  // ── 여드름 치료 (레이저) ────────────────────────────────────
  acne_laser: [
    {
      name: "아비클리어",
      nameEn: "AVICLEAR",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub_03_01_51_8ba2c238.jpg",
      desc: "FDA 승인 여드름 전용 1,726nm 레이저로 피지선을 선택적 억제.\n약물 없이 염증성·노듸성 여드름을 근본적으로 개선합니다.", descEn: "FDA-approved 1,726nm laser exclusively for acne treatment. Targets sebaceous glands directly to reduce acne at the source.", descJa: "FDA承認のニキビ専用1,726nmレーザー。皮脂腺を直接ターゲットにしてニキビを根本から減少させます。", descZh: "FDA认证的1,726nm痘痘专用激光。直接靶向皮脂腺，从根源减少痘痘。",
      time: "30분", recovery: "1~3일",
      badge: "FDA 승인", badgeColor: "#E57373",
      image: `${CDN}/아비클리어_3d94823e.png`, best: true,
      youtubeUrl: "https://www.youtube.com/embed/No4MdF4XqGg",
      detail: "아비클리어는 1,726nm 파장의 레이저로 피지선(sebaceous gland)를 선택적으로 표적하여 피지 분비를 억제합니다. 약물 없이 여드름을 지속적으로 개선할 수 있는 유일한 FDA 승인 여드름 레이저입니다. 시술 후 피부가 점점 더 맑아지는 효과가 나타납니다.",
      caution: "시술 직후 일시적인 피부 붉기·건조함이 있을 수 있습니다. 자외선 차단제 사용을 철저히 해주세요.",
      sessions: "3회 (1개월 간격)",
      effect: "염증성 여드름 개선, 피지 분비 억제, 장기적 여드름 예방, 피부 광채 개선",
      related: ["네오젠플라즈마", "카프리", "앙코르 레이저"],
    },
    {
      name: "카프리",
      nameEn: "CAPRI",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub_03_01_17_6d79640f.jpg",
      desc: "이중 파장 레이저로 염증성 여드름과 피지 분비를 직접 억제.\n염증 반응을 진정하며 여드름 재발을 효과적으로 방지합니다.", descEn: "Dual-wavelength laser for inflammatory acne", descJa: "炎症性ニキビのデュアル波長レーザー", descZh: "炎症性痘痘双波长激光",
      time: "20~30분", recovery: "1~2일",
      badge: "염증 억제", badgeColor: "#C2410C",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/gKokBoh3bDWm_b8ea202e.jpg",
      youtubeUrl: "https://www.youtube.com/embed/e3vB44VsoW4",
      detail: "카프리는 여드름 치료에 특화된 이중 파장 레이저로, 532nm이 피지선 염증을 직접 표적하고 1,064nm이 진피층까지 침투하여 여드름 발생의 근본 원인을 차단합니다.",
      caution: "시술 후 피부 붉기가 있을 수 있으며, 신선한 세안과 자외선 차단제 사용을 권장합니다.",
      sessions: "4~6회 (2주 간격)",
      effect: "염증성 여드름 개선, 피지 분비 억제, 피부 광채 개선",
    },
    {
      name: "플라듀오",
      nameEn: "PLADUO",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub_03_01_23_5c9552c8.png",
      desc: "플라즈마와 레이저를 결합한 여드름 복합 치료 시스템.\n염증 진정과 피부 재생을 동시에 진행합니다.", descEn: "Combined plasma + laser acne treatment. Dual-action approach addresses both active acne and post-acne scarring.", descJa: "プラズマ+レーザー複合ニキビ治療。デュアルアクションアプローチで活動性ニキビとニキビ後の瘢痕の両方に対処します。", descZh: "等离子体+激光复合痘痘治疗。双重作用方式同时解决活动性痘痘和痘后疤痕。",
      time: "20~30분", recovery: "1~2일",
      badge: "복합 치료", badgeColor: "#9A3412",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/RypUEm7gjHfk_0760fc35.png",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/pasted_file_fiK1Rp_image_4a6a6715.png",
      youtubeUrl: "https://www.youtube.com/embed/e3vB44VsoW4",
      detail: "플라듀오는 플라즈마 에너지와 레이저를 함께 사용하는 복합 여드름 치료 시스템입니다. 플라즈마가 피부 표면의 염증을 진정시키고 레이저가 피지선을 직접 억제하여 여드름을 종합적으로 치료합니다.",
      caution: "시술 후 피부가 일시적으로 붉고 민감해질 수 있습니다. 시술 당일 자외선 차단제 사용을 권장합니다.",
      sessions: "4~8회 (1~2주 간격)",
      effect: "염증성 여드름 지료, 피부 재생, 피지 분비 억제, 피부 광채 개선",
    },
    {
      name: "플래티넘 PTT",      nameEn: "PLATINUM PTT",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/플래티넘_eecfc2a9.jpg",
      desc: "플래티넘 나노입자 광열 치료로 여드름 박테리아를 선택적 파괴.\n항생제 부작용 없이 염증성 여드름을 효과적으로 개선합니다.", descEn: "Platinum nanoparticle photothermal acne treatment. Innovative technology using platinum nanoparticles for targeted acne elimination.", descJa: "プラチナナノ粒子光熱ニキビ治療。プラチナナノ粒子を使用した革新的な技術でニキビを標的に除去します。", descZh: "铂纳米粒子光热痘痘治疗。利用铂纳米粒子的创新技术靶向消除痘痘。",
      time: "30~40분", recovery: "1~2일",
      badge: "박테리아 파괴", badgeColor: "#7C3AED",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/플래티넘_eecfc2a9.jpg",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/플래티넘_eecfc2a9.jpg",
      detail: "플래티넘PTT는 플래티넘 나노입자를 여드름 바이오필름에 침투시킨 후 특정 파장의 빛으로 플래티넘 나노입자를 활성화하여 여드름 박테리아를 선택적으로 파괴합니다. 항생제 부작용 없이 여드름을 치료할 수 있는 진보된 치료법입니다.",
      caution: "시술 전 여드름 바이오필름 제거를 위한 세안이 필요합니다. 시술 후 자외선 차단제 사용을 철저히 해주세요.",
      sessions: "4~6회 (2주 간격)",
      effect: "염증성 여드름 개선, 항생제 부작용 없는 치료, 재발 방지, 피부 광채 개선",
    },
    {      name: "네오젠 플라즈마",
      nameEn: "NEOGEN PLASMA",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/네오젠_3d1a87bc.jpg",
      desc: "네오젠 플라즈마로 피부 표면을 재생하는 비절제 치료.\n여드름 흉터·모공·피부결 개선에 효과적입니다.", descEn: "Plasma energy skin regeneration treatment. Nitrogen plasma technology for skin resurfacing and rejuvenation.", descJa: "プラズマエネルギー皮膚再生施術。窒素プラズマ技術による皮膚再生と若返りを実現します。", descZh: "等离子体能量皮肤再生治疗。氮等离子体技术实现皮肤再生和年轻化。",
      time: "30~50분", recovery: "3~7일",
      badge: "피부 재생", badgeColor: "#0F766E",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/YgF34hnTbXog_e46e8323.png",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/네오젠_3d1a87bc.jpg",
      detail: "FDA에서 승인한 차세대 피부 재생 플라즈마 장비로, 가스 탱크로부터 99.999% 순도의 질소가 UHF의 높은 에너지를 전달받아 질소 플라즈마를 생성하며, 피부 표면에 상처를 남기지 않고 열 효과를 전달합니다. 주름개선, 여드름흉터, 리프팅, 튼살, 모공수축, 피부탄력, 아토피, 색소침착 등에 개선효과가 뛰어나며 적용부위가 다양하여 피부 고민이 되는 부위에 시술이 가능합니다.",
      caution: "시술 후 3~7일간 피부 재생 기간이 필요합니다. 실외 활동 시 자외선 차단제를 철저히 바르세요.",
      sessions: "2~4회 (4주 간격)",
      effect: "여드름 흉터 개선, 모공 축소, 피부 재생, 콜라겐 생성 자극",
    },
    {
      name: "고바야시 절연침",
      nameEn: "AGNES",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/고바야시_600a1edd.png",
      desc: "절연침 기술로 피지선을 선택적 억제하는 고주파 여드름 치료.\n피부 표면 손상을 최소화하며 회복 기간이 짧아 일상 복귀가 빠릅니다.", descEn: "Insulated needle RF energy acne treatment", descJa: "絶縁針技術高周波エネルギーニキビ治療", descZh: "绝缘针技术高频能量痘痘治疗",
      time: "30~40분", recovery: "1~2일",
      badge: "절연침 기술", badgeColor: "#2563EB",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/고바야시_600a1edd.png",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/고바야시_600a1edd.png",
      youtubeUrl: "https://www.youtube.com/embed/EJi7PXWsdaA",
      detail: "고바야시 절연침은 고주파 전류가 흐르는 미세한 침을 모공 속에 꽂아 그 속에 있는 피지선을 태워주는 치료법입니다. 피부 표면에는 전류가 흐르지 않고 모공 속의 피지선에만 전류를 흘려주기 때문에 피부 표면의 손상이 전혀 없으며, 재발율이 거의 없이 영구적인 효과를 자랑합니다. 또한 고주파 전류의 자극 효과로 여드름 흉터와 붉은 자국, 넓어진 모공을 동시에 해결합니다.",
      caution: "시술 후 1~2일간 피부 붉기와 약간의 붓기가 나타날 수 있습니다. 시술 부위를 청결하게 유지하고 자외선 차단제를 매일 사용하세요.",
      sessions: "4~6회 (2주 간격)",
      effect: "염증성 여드름 개선, 피지 분비 억제, 여드름 재발 방지, 피부 광채 개선",
    },
  ],

  // ── 액취증·다한증·발톱무좀 ────────────────────────────────────
  acne: [
    {
      name: "미라드라이",
      nameEn: "MIRADRY FRESH",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub_03_01_29_56ec9c83.jpg",
      desc: "마이크로파 에너지로 겨드랑이 땅샘을 영구 제거하는 FDA 승인 시술.\n액취증과 다한증을 한 번에 동시에 해결합니다.", descEn: "Permanent elimination of underarm sweat glands using microwave energy. FDA-approved device for long-lasting hyperhidrosis and bromhidrosis treatment.", descJa: "マイクロ波エネルギーで脇の汗腺を永久除去。FDA承認機器による長期持続する多汗症・わきが治療です。", descZh: "使用微波能量永久消除腋下汗腺。FDA认证设备，长效治疗多汗症和腋臭。",
      time: "60~90분", recovery: "3~5일",
      badge: "영구 제거", badgeColor: "#0F766E",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/HEkn0mzQWyoC_4d1c0020.jpeg",
      youtubeUrl: "https://www.youtube.com/embed/IqI-nb-cEnE",
      detail: "miraDry Fresh는 마이크로파(microwave) 에너지를 이용해 겨드랑이 피부 아래 2~5mm 깊이에 위치한 에크린·아포크린 땀샘을 비절개 방식으로 영구 파괴합니다. FDA 510(k) 승인을 받은 유일한 비수술적 액취증·다한증 치료 장비로, 1~2회 시술로 땀 분비량을 평균 82% 감소시키며 냄새 원인균의 서식 환경도 함께 제거합니다. 시술 중 냉각 시스템이 표피를 보호하므로 흉터가 남지 않습니다.",
      caution: "시술 후 3~5일간 겨드랑이 부종·멍·일시적 감각 저하가 나타날 수 있습니다. 시술 당일 과격한 운동은 삼가고, 48시간 내 압박 의류 착용을 피해 주세요. 임산부·수유 중·심장박동기 착용자는 시술이 제한됩니다.",
      sessions: "1~2회 (효과 영구 지속)",
      effect: "땀 분비량 평균 82% 감소, 액취증 냄새 현저히 개선, 털 성장 감소 부가 효과",
      related: ["다한증 보톡스", "라이포샛"],
      steps: [
        { step: 1, title: "정밀 맵핑", desc: "겨드랑이 땀샘 분포를 격자 패턴으로 표시하여 치료 범위를 정확히 설정합니다." },
        { step: 2, title: "국소마취", desc: "텀블링 기법으로 국소마취 후 통증 없이 시술을 진행합니다." },
        { step: 3, title: "마이크로파 조사", desc: "핸드피스를 각 격자점에 밀착하여 마이크로파 에너지를 조사, 땀샘을 영구 파괴합니다." },
        { step: 4, title: "냉각 회복", desc: "시술 직후 냉각 처치 후 귀가 가능하며 3~5일 내 일상 복귀합니다." },
      ],
    },
    {
      name: "리포셋",
      nameEn: "LIPOSAT",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/리포셋_f24523db.png",
      desc: "부분 마취 후 3㎜ 정도로 결드랑이 두 군데를 절개한 후 금속관(캐뉼라)을 삽입해 땀샘을 긁어내는 다한증 치료법.\n영구적으로 땀샘를 제거하면서 보상성다한증이 없습니다.", descEn: "RF energy simultaneously removes underarm sweat glands and fat without incisions. Treats both bromhidrosis and improves underarm contour.", descJa: "RFエネルギーで脇の汗腺と脂肪を非切開で同時除去。わきがの治療と脇のラインの改善を同時に実現します。", descZh: "射频能量无切口同时去除腋下汗腺和脂肪。同时治疗腋臭并改善腋下轮廓。",
      time: "40~60분", recovery: "2~3일",
      badge: "지방+땀샘 동시", badgeColor: "#7C3AED",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/리포셋_f24523db.png",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/리포셋_f24523db.png",
      detail: "리포셋흡입술은 부분 마취 후 3㎜ 정도로 겨드랑이 두 군데를 절개한 후 금속관(캐뉼라)을 삽입해 땀샘을 긁어내는 다한증 치료법입니다. 사용되는 금속관이 진피쪽과 맞닿는 부위에 흡입구멍이 나 있어 피하지방층과 진피층의 경계부위에 밀집해 있는 땀샘을 세밀하게 제거합니다. 피하지방층과 진피층 경계부위의 경우 기존 치료법으로는 땀샘을 제대로 제거할 수 없어 좋은 결과를 내지 못했으나, 리포셋흡입술을 받은 환자를 조사한 결과 수술 후 다른 부위에 땀이 나는 보상성다한증이 없었습니다. 시술 다음날부터 일상생활이 가능하며, 탄력성이 높은 섬유로 만들어진 속옷을 2주일 정도 착용하면 겨드랑이 살이 늘어지지 않아 더욱 만족할만한 치료효과를 기대할 수 있습니다.",
      caution: "시술 후 2~3일간 멍·부종이 나타날 수 있습니다. 압박 밴드를 1주일 착용하고 과격한 팔 동작은 2주간 자제해 주세요. 피부 감염·켈로이드 체질은 시술 전 반드시 상담이 필요합니다.",
      sessions: "1~2회 (효과 반영구 지속)",
      effect: "액취증 냄새 80% 이상 개선, 다한증 70% 이상 감소, 겨드랑이 라인 개선",
      related: ["미라드라이", "다한증 보톡스"],
      steps: [
        { step: 1, title: "초음파 검사", desc: "겨드랑이 지방층 두께와 땀샘 분포를 초음파로 확인합니다." },
        { step: 2, title: "국소마취", desc: "국소마취 후 미세 절개(2~3mm)를 통해 캐뉼라를 삽입합니다." },
        { step: 3, title: "RF 에너지 조사", desc: "캐뉼라를 통해 RF 에너지를 조사하여 땀샘과 지방 세포를 파괴합니다." },
        { step: 4, title: "압박 처치", desc: "시술 후 압박 밴드를 적용하고 1주일 착용합니다." },
      ],
    },
    {
      name: "다한증 보톡스",
      nameEn: "HYPERHIDROSIS BOTOX",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/다한증_bd731d90.png",
      desc: "보툴리누스 독소를 주사하여 땅샘 신경 신호를 차단하는 다한증 치료.\n시술 후 1~2주 내 효과가 나타나며 6~12개월 지속됩니다.", descEn: "Hyperhidrosis treatment by injecting botulinum toxin to block sweat gland nerve signals. Effects appear within 1-2 weeks and last 6-12 months.", descJa: "ボツリヌス毒素を注射して汗腺の神経信号を遮断する多汗症治療。施術後1〜2週間以内に効果が現れ、6〜12ヶ月持続します。", descZh: "注射肉毒素阻断汗腺神经信号的多汗症治疗。治疗后1-2周内出现效果，持续6-12个月。",
      time: "20~30분", recovery: "당일 일상 복귀",
      badge: "당일 복귀", badgeColor: "#0369A1",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/다한증_bd731d90.png",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/다한증_bd731d90.png",
      detail: "보툴리눔 독소(보톡스)를 다한증 부위에 미세 주사하여 아세틸콜린 분비를 억제, 땀샘 자극 신호를 차단합니다. 겨드랑이·손바닥·발바닥·이마 등 다양한 부위에 적용 가능하며, 시술 시간이 짧고 회복 기간이 없어 직장인에게 특히 적합합니다. 효과는 6~12개월 지속되며 반복 시술로 효과 지속 기간이 점차 길어지는 경향이 있습니다.",
      caution: "주사 부위에 일시적 멍·통증이 생길 수 있습니다. 손바닥 시술 시 일시적 근력 약화가 나타날 수 있으므로 정밀 작업 전날 시술은 피해 주세요. 임산부·수유 중·신경근육 질환자는 시술이 제한됩니다.",
      sessions: "연 1~2회 (효과 6~12개월 지속)",
      effect: "땀 분비량 80~90% 감소, 냄새 개선, 손발 다한증 즉각 효과",
      related: ["미라드라이", "라이포샛"],
    },
  ],
  // ── 손·발톱무좀 ────────────────────────────────────────────────────
  fungus: [    {      name: "핀포인트",
      nameEn: "PINPOINTE",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/핀포인트_d7892fbb.png",
      youtubeUrl: "https://www.youtube.com/embed/ywUvlVZ2s6s",
      desc: "주변 조직 손상 없이 곰팡이균만을 파괴하는 손·발톱 무좀 전용 치료 레이저.\nFDA 승인 장비로 안전하고 빠른 시술이 가능합니다.", descEn: "Dedicated nail fungus treatment laser that destroys only the fungus without damaging surrounding tissue. FDA-approved device for safe and fast treatment.", descJa: "周囲の組織を傷つけることなく真菌だけを破壊する爪水虫専用治療レーザー。FDA承認機器で安全かつ迅速な施術が可能です。", descZh: "不损伤周围组织只破坏真菌的甲癣专用治疗激光。FDA认证设备，安全快速治疗。",
      time: "15~20분", recovery: "당일 일상",
      badge: "FDA 승인", badgeColor: "#0F766E",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/핀포인트_d7892fbb.png",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/핀포인트_d7892fbb.png",
      detail: "핀포인트 레이저(PinPointe FootLaser)는 1064nm Nd:YAG 파장을 이용하여 손·발톱 아래 서식하는 진균만을 선택적으로 파괴하는 FDA 승인 무좀 전용 레이저입니다. 주변 건강한 조직에는 영향을 주지 않으며, 경구 항진균제의 간 독성 부작용 없이 안전하게 치료할 수 있습니다. 시술 시간이 짧고 통증이 거의 없어 편안하게 받을 수 있습니다.",
      caution: "시술 중 일시적인 온열감이 있을 수 있으나 수 분 내 소실됩니다. 새 손·발톱이 자라면서 효과가 나타나므로 6~12개월 경과 관찰이 필요합니다.",
      sessions: "4~6회 (2~4주 간격)",
      effect: "손·발톱 진균 선택적 파괴, 변색·두꺼워진 손·발톱 개선, 항진균제 부작용 없음",
      related: ["힐러 1064", "오니코 레이저"],
      steps: [
        { step: 1, title: "진단 및 상담", desc: "손·발톱 상태를 확인하고 감염 범위를 평가하여 치료 계획을 수립합니다." },
        { step: 2, title: "레이저 조사", desc: "핀포인트 레이저를 감염된 손·발톱에 정밀 조사하여 진균을 파괴합니다." },
        { step: 3, title: "경과 관찰", desc: "새 손·발톱이 자라는 과정을 정기적으로 확인합니다." },
        { step: 4, title: "재발 방지 관리", desc: "청결 유지·통풍 신발 착용 등 생활 습관 교육으로 재발을 예방합니다." },
      ],
    },
    {
      name: "힐러 1064",
      nameEn: "HEALER 1064",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/힐러_fb0f59c9.jpg",
      youtubeUrl: "https://www.youtube.com/embed/vFudIEt6JDE",
      desc: "1064nm 파장의 열에너지를 손·발톱 무좀균에 전달하여 곰팡이균을 사멸하는 레이저.\n경구 항진균제 없이 안전하게 치료합니다.", descEn: "Laser that delivers thermal energy of 1064nm wavelength to nail fungus to kill the fungus. Safe treatment without oral antifungal medication.", descJa: "1064nm波長の熱エネルギーを爪水虫菌に伝達して真菌を死滅させるレーザー。経口抗真菌薬なしで安全に治療できます。", descZh: "将1064nm波长热能传递给甲癣菌以杀灭真菌的激光。无需口服抗真菌药物，安全治疗。",
      time: "20~30분", recovery: "당일 일상",
      badge: "레이저 치료", badgeColor: "#0F766E",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/힐러_fb0f59c9.jpg",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/힐러_fb0f59c9.jpg",
      detail: "힐러 1064 레이저(Nd:YAG 1064nm)는 진균이 서식하는 손·발톱 아래 조직에 선택적으로 침투하여 열에너지로 진균을 파괴합니다. 경구 항진균제의 간 독성 부작용 없이 안전하게 치료할 수 있으며, 시술 후 즉시 일상 복귀가 가능합니다. 두꺼워지고 변색된 손·발톱(조갑진균증)에 효과적이며, 새 손·발톱이 자라면서 점차 건강한 상태로 회복됩니다.",
      caution: "시술 후 일시적인 열감이 있을 수 있으나 수 분 내 소실됩니다. 치료 효과는 새 손·발톱이 완전히 자라는 6~12개월 후 최종 확인 가능합니다.",
      sessions: "4~6회 (2~4주 간격)",
      effect: "손·발톱 진균 파괴, 변색·두꺼워진 손·발톱 개선, 재발 억제, 항진균제 부작용 없음",
      related: ["핀포인트 레이저", "오니코 레이저"],
      steps: [
        { step: 1, title: "진단 및 상담", desc: "손·발톱 상태를 확인하고 감염 범위를 평가하여 치료 계획을 수립합니다." },
        { step: 2, title: "레이저 치료", desc: "힐러 1064 레이저를 손·발톱 전체에 조사하여 진균을 선택적으로 파괴합니다." },
        { step: 3, title: "경과 관찰", desc: "치료 후 새 손·발톱이 자라는 과정을 정기적으로 확인합니다." },
        { step: 4, title: "재발 방지 관리", desc: "청결 유지·통풍 신발 착용 등 생활 습관 교육으로 재발을 예방합니다." },
      ],
    },
    {
      name: "오니코",
      nameEn: "ONYCHO",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/오니코_e7c50add.jpg",
      youtubeUrl: "https://www.youtube.com/embed/gWlB90_W7ng",
      desc: "양발 동시에 치료 가능한 식품의약품안전처 허가 획득 최신형 발톱무좀 치료 레이저.\n빠르고 효율적인 양측 동시 치료가 가능합니다.", descEn: "Latest nail fungus treatment laser approved by MFDS that can treat both feet simultaneously. Fast and efficient bilateral simultaneous treatment.", descJa: "両足を同時に治療できる食品医薬品安全処許可取得の最新型爪水虫治療レーザー。迅速かつ効率的な両側同時治療が可能です。", descZh: "获得食品药品安全处批准的最新甲癣治疗激光，可同时治疗双足。快速高效的双侧同步治疗。",
      time: "15~25분", recovery: "당일 일상",
      badge: "식약처 허가", badgeColor: "#0369A1",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/오니코_e7c50add.jpg",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/오니코_e7c50add.jpg",
      detail: "오니코 레이저는 식품의약품안전처 허가를 획득한 최신형 발톱무좀 치료 레이저로, 양발을 동시에 치료할 수 있어 시술 시간을 크게 단축합니다. 레이저 에너지가 발톱 아래 진균에 정밀하게 도달하여 곰팡이균을 파괴하며, 주변 조직 손상이 최소화됩니다. 경구 항진균제 복용이 어려운 간질환자, 임산부에게도 안전하게 적용 가능합니다.",
      caution: "시술 중 경미한 온열감이 있을 수 있으나 통증은 거의 없습니다. 양발 동시 치료 시 시술 시간이 단축되나 감염 정도에 따라 횟수가 달라질 수 있습니다.",
      sessions: "4~8회 (2~4주 간격)",
      effect: "양발 동시 치료, 발톱 진균 파괴, 변색·비후 개선, 간 부담 없는 안전한 치료",
      related: ["핀포인트 레이저", "힐러 1064"],
      steps: [
        { step: 1, title: "진단", desc: "발톱 상태를 확인하고 감염 범위와 정도를 평가합니다." },
        { step: 2, title: "양발 동시 레이저 조사", desc: "오니코 레이저를 양발 감염 발톱에 동시 조사하여 진균을 파괴합니다." },
        { step: 3, title: "경과 관찰", desc: "새 발톱이 자라는 과정을 정기적으로 모니터링합니다." },
        { step: 4, title: "재발 방지", desc: "생활 습관 교정과 위생 관리로 재발을 예방합니다." },
      ],
    },
    {
      name: "엑셀 토우",
      nameEn: "EXCEL TOE",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/엑셀토우_ddf531cd.png",
      youtubeUrl: "https://www.youtube.com/embed/PhOEKQBdEL4",
      desc: "KFDA 식약처 허가받은 양손발 통증 완화를 동시 치료 가능한 비침습·비열성 최신형 통증완화 레이저.\n무좀 치료와 통증 완화를 동시에 제공합니다.", descEn: "KFDA-approved non-invasive, non-thermal latest pain relief laser that can simultaneously treat both hands and feet. Provides both fungal treatment and pain relief simultaneously.", descJa: "KFDA許可取得の両手足の痛み緩和を同時治療可能な非侵襲・非熱性最新型痛み緩和レーザー。水虫治療と痛み緩和を同時に提供します。", descZh: "获KFDA批准的非侵入性、非热性最新型疼痛缓解激光，可同时治疗双手双脚。同时提供甲癣治疗和疼痛缓解。",
      time: "20~30분", recovery: "당일 일상",
      badge: "KFDA 허가", badgeColor: "#7C3AED",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/엑셀토우_ddf531cd.png",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/엑셀토우_ddf531cd.png",
      detail: "엑셀 토우(Excel Tow)는 KFDA 식약처 허가를 받은 비침습·비열성 레이저로, 양손발의 무좀 치료와 통증 완화를 동시에 수행합니다. 열을 사용하지 않는 방식으로 주변 조직에 대한 부담이 최소화되며, 통증 없이 편안하게 시술받을 수 있습니다. 기존 열 방식 레이저에 비해 부작용 위험이 낮고 회복이 빠릅니다.",
      caution: "비열성 레이저이므로 시술 중 불편감이 거의 없습니다. 감염 정도에 따라 치료 횟수가 달라질 수 있으며, 정기적인 경과 관찰이 필요합니다.",
      sessions: "4~8회 (2~4주 간격)",
      effect: "비침습 무좀 치료, 통증 완화, 양손발 동시 치료, 부작용 최소화",
      related: ["오니코 레이저", "엑셀V+"],
      steps: [
        { step: 1, title: "진단", desc: "손·발톱 감염 상태와 통증 부위를 정밀 평가합니다." },
        { step: 2, title: "비열성 레이저 조사", desc: "엑셀 토우 레이저를 감염 부위에 조사하여 진균 파괴와 통증 완화를 동시에 진행합니다." },
        { step: 3, title: "경과 관찰", desc: "치료 후 손·발톱 회복 과정을 정기적으로 확인합니다." },
        { step: 4, title: "재발 방지", desc: "위생 관리와 생활 습관 교정으로 재발을 예방합니다." },
      ],
    },
  ],
  vitiligo: [
    {
      name: "모래알 피부이식",
      nameEn: "SST PRO",
      badge: "백반증 전문",
      badgeColor: "#4A6FA5",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/모래알피부이식_b1e8163f.png",
      youtubeUrl: "https://www.youtube.com/embed/218RqWMl7Kg",
      desc: "피부조직을 모래알 크기로 채취하여 백반증 부위에 이식하는 시술.\n난치성 백반증 부위까지 꼼꼼하고 체계적으로 치료합니다.", descEn: "Advanced scar treatment combining multiple modalities to target surgical, traumatic, and keloid scars. Progressively improves scar texture and pigmentation.", descJa: "手術・外傷・ケロイド瘢痕に複数モダリティを組み合わせた高度な瘢痕治療。瘢痕の質感と色素沈着を段階的に改善します。", descZh: "结合多种模式针对手术疤痕、外伤疤痕和瘢痕疙瘩的高级疤痕治疗。逐步改善疤痕质地和色素沉着。",
      time: "20~40분", recovery: "3~5일",
      image: `${CDN}/프로파운드_93be7410.png`,
      detail: "SST PRO(스킨 시딩 테크닉 PRO)는 모래알 피부이식술로 피부조직을 0.3Φ~0.1Φ 모래알 크기 또는 그보다 작게 채취하여, 백반증 부위에 피부를 이식합니다. 기존에 치료하기 어려웠던 난치성 백반증 부위인 손등, 헤어라인을 포함하는 안면부, 관절, 손발, 흐터·튜른살 부위, 굴곡진 부위를 보다 꼼꼼하고 체계적으로 시술할 수 있습니다. 건강보험, 실손보험 적용이 가능하며 출현이나 흐터가 거의 없고 피부 이식 후 높은 생착률을 자랑합니다.",
      caution: "시술 후 3~5일간 시술 부위에 붉기나 약간의 붓기가 나타날 수 있습니다. 자외선 차단제(SPF 50+)를 철저히 바르고, 시술 부위를 청결하게 유지하세요.",
      sessions: "1~3회 (필요에 따라 조정)",
      effect: "백반증 부위 색소 회복, 피부색 균일화, 높은 생착률, 보험 적용 가능",
    },
    {
      name: "벨로시티 엑시머 V7",
      nameEn: "VELOCITY EXCIMER V7",
      badge: "백반증 전문",
      badgeColor: "#4A6FA5",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/엑시머_3b91923d.png",
      youtubeUrl: "https://www.youtube.com/embed/iqogcu4A0OU",
      desc: "308nm 엑시머 레이저로 백반증 부위 색소 세포를 집중 자극.\n정상 피부 노출을 최소화하며 노출 부위 백반증에 특히 효과적입니다.", descEn: "308nm excimer laser intensively stimulates pigment cells in vitiligo areas. Minimizes normal skin exposure and is particularly effective for vitiligo in exposed areas.", descJa: "308nmエキシマレーザーで白斑部位の色素細胞を集中刺激。正常皮膚の露出を最小化し、露出部位の白斑に特に効果的です。", descZh: "308nm准分子激光集中刺激白癜风部位的色素细胞。最小化正常皮肤暴露，对暴露部位白癜风特别有效。",
      time: "20~40분", recovery: "당일 일상",
      image: `${CDN}/엑시머V7_5a8a4340.jpg`,
      detail: "엑시머 V7은 308nm 파장의 엑시머 레이저를 이용해 백반증 병변 부위의 멜라노사이트(색소 세포)를 선택적으로 자극하여 색소 재생을 유도하는 치료입니다. 전신 자외선 치료와 달리 병변 부위에만 집중 조사하여 정상 피부 노출을 최소화합니다. FDA 승인을 받은 안전한 치료법으로, 얼굴·목·손 등 노출 부위 백반증에 특히 효과적입니다.",
      caution: "치료 효과가 나타나기까지 수 개월이 소요될 수 있으며 부위와 개인에 따라 차이가 있습니다. 시술 후 일시적인 홍반이 발생할 수 있으며 자외선 차단제 사용이 필수입니다. 광과민성 약물 복용 중인 경우 사전 상담이 필요합니다.",
      sessions: "주 2~3회 (총 20~30회 권장)",
      effect: "백반증 부위 색소 재생, 피부색 균일화, 자연스러운 피부 회복, 재발 억제",
      related: ["색소·문신제거", "홍조·혈관확장"],
      steps: [
        { step: 1, title: "진단 및 병기 평가", desc: "피부과 전문의 진찰로 백반증 유형·범위·활성도를 평가합니다." },
        { step: 2, title: "엑시머 레이저 치료", desc: "308nm 레이저를 병변 부위에 집중 조사하여 멜라노사이트를 자극합니다." },
        { step: 3, title: "색소 재생 확인", desc: "치료 4~6주 후 색소 재생 여부를 확인하고 조사량을 조정합니다." },
        { step: 4, title: "유지 관리", desc: "색소 재생 후 자외선 차단 및 정기 추적 관찰로 재발을 예방합니다." },
      ],
    },
    {
      name: "전신 자외선 광선 치료기",
      nameEn: "UV 8000 N.B",
      badge: "전신 치료",
      badgeColor: "#4A6FA5",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/전신자외선_0b66082d.png",
      youtubeUrl: "https://www.youtube.com/embed/RuJSEpsvy_Q",
      desc: "NB-UVB 전신 조사로 백반증·건선·아토피를 치료하는 광선 치료.\n광범위한 피부 병변에 효과적이며 약물 치료와 병행 시 효과가 향상됩니다.", descEn: "Phototherapy that treats vitiligo, psoriasis, and atopic dermatitis with NB-UVB whole-body irradiation. Effective for widespread skin lesions and enhanced when combined with medication.", descJa: "NB-UVB全身照射で白斑・乾癬・アトピーを治療する光線治療。広範囲な皮膚病変に効果的で、薬物治療と併用すると効果が向上します。", descZh: "NB-UVB全身照射治疗白癜风、银屑病和特应性皮炎的光线治疗。对广泛皮肤病变有效，与药物治疗联合使用效果更佳。",
      time: "5~15분", recovery: "당일 일상",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/3PticSr0g4jr_e69d1049.jpg",
      detail: "전신자외선 치료기는 311nm 협대역 자외선B(NB-UVB)를 전신에 균일하게 조사하는 광선 치료 장비입니다. 전신에 광범위하게 분포한 백반증, 건선, 아토피 피부염, 다형 홍반 등 다양한 피부 질환에 효과적입니다. 면역 조절 효과를 통해 피부 염증을 억제하고 색소 재생을 촉진하며, 약물 치료와 병행 시 치료 효과가 향상됩니다.",
      caution: "치료 중 눈 보호대 착용이 필수입니다. 광과민성 약물 복용 중이거나 피부암 병력이 있는 경우 시술이 제한될 수 있습니다. 시술 후 일시적인 홍반·건조감이 나타날 수 있으며 보습 관리가 중요합니다.",
      sessions: "주 2~3회 (장기 치료, 총 30~50회)",
      effect: "전신 백반증 색소 재생, 건선·아토피 피부염 증상 완화, 피부 면역 조절",
      related: ["여드름 치료"],
      steps: [
        { step: 1, title: "치료 전 평가", desc: "피부 타입·광과민도를 평가하고 초기 조사량을 설정합니다." },
        { step: 2, title: "NB-UVB 전신 조사", desc: "311nm 협대역 자외선B를 전신에 균일하게 조사합니다." },
        { step: 3, title: "반응 평가 및 용량 조절", desc: "치료 반응에 따라 조사량을 단계적으로 증량합니다." },
        { step: 4, title: "유지 치료", desc: "증상 호전 후 조사 간격을 늘려 유지 치료를 진행합니다." },
      ],
    },
  ],
  psoriasis: [
    {
      name: "전신 자외선 광선 치료기",
      nameEn: "UV 8000 N.B",
      badge: "전신 치료",
      badgeColor: "#4A6FA5",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/전신자외선_0b66082d.png",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/전신자외선_0b66082d.png",
      desc: "NB-UVB 전신 조사로 백반증·건선·아토피를 치료하는 광선 치료.\n광범위한 피부 병변에 효과적이며 약물 치료와 병행 시 효과가 향상됩니다.", descEn: "Narrowband UVB phototherapy system for treating vitiligo, psoriasis, and atopic dermatitis. Effective for widespread lesions with medication combination therapy.", descJa: "白斑・乾癬・アトピーを治療するNB-UVB光線療法システム。広範な病変に効果的で薬物との併用療法に対応します。", descZh: "用于治疗白癜风、银屑病和特应性皮炎的NB-UVB光线治疗系统。对广泛病变有效，支持与药物联合治疗。",
      time: "5~15분", recovery: "당일 일상",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/3PticSr0g4jr_e69d1049.jpg",
      detail: "전신자외선 치료기는 311nm 협대역 자외선B(NB-UVB)를 전신에 균일하게 조사하는 광선 치료 장비입니다. 전신에 광범위하게 분포한 백반증, 건선, 아토피 피부염, 다형 홍반 등 다양한 피부 질환에 효과적입니다. 면역 조절 효과를 통해 피부 염증을 억제하고 색소 재생을 촉진하며, 약물 치료와 병행 시 치료 효과가 향상됩니다.",
      caution: "치료 중 눈 보호대 착용이 필수입니다. 광과민성 약물 복용 중이거나 피부암 병력이 있는 경우 시술이 제한될 수 있습니다. 시술 후 일시적인 홍반·건조감이 나타날 수 있으며 보습 관리가 중요합니다.",
      sessions: "주 2~3회 (장기 치료, 총 30~50회)",
      effect: "전신 백반증 색소 재생, 건선·아토피 피부염 증상 완화, 피부 면역 조절",
      related: ["여드름 치료"],
      steps: [
        { step: 1, title: "치료 전 평가", desc: "피부 타입·광과민도를 평가하고 초기 조사량을 설정합니다." },
        { step: 2, title: "NB-UVB 전신 조사", desc: "311nm 협대역 자외선B를 전신에 균일하게 조사합니다." },
        { step: 3, title: "반응 평가 및 용량 조절", desc: "치료 반응에 따라 조사량을 단계적으로 증량합니다." },
        { step: 4, title: "유지 치료", desc: "증상 호전 후 조사 간격을 늘려 유지 치료를 진행합니다." },
      ],
    },
    {
      name: "벨로시티 엑시머 V7",
      nameEn: "VELOCITY EXCIMER V7",
      badge: "국소 집중",
      badgeColor: "#4A6FA5",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/엑시머_3b91923d.png",
      youtubeUrl: "https://www.youtube.com/embed/iqogcu4A0OU",
      desc: "308nm 엑시머 레이저로 건선 병변 부위에 집중 조사하여 빠른 호전을 유도합니다.\n정상 피부 노출을 최소화하며 노출 부위 건선에 특히 효과적입니다.",
      descEn: "308nm excimer laser for focused psoriasis lesion treatment. Minimizes normal skin exposure and is particularly effective for psoriasis in exposed areas.",
      descJa: "308nmエキシマレーザーで乾癬病変部位に集中照射し、速やかな改善を誘導します。正常皮膚の露出を最小化し、露出部位の乾癬に特に効果的です。",
      descZh: "308nm准分子激光集中照射银屑病病变部位，快速诱导改善。最小化正常皮肤暴露，对暴露部位银屑病特别有效。",
      time: "20~40분", recovery: "당일 일상",
      image: `${CDN}/엑시머V7_5a8a4340.jpg`,
      detail: "벨로시티 엑시머 V7은 308nm 파장의 엑시머 레이저를 이용해 건선 병변 부위의 T세포를 선택적으로 억제하여 빠른 호전을 유도하는 치료입니다. 전신 광선 치료와 달리 병변 부위에만 집중 조사하여 정상 피부 노출을 최소화합니다. FDA 승인을 받은 안전한 치료법으로, 두피·팔꿈치·무릎·손 등 노출 부위 건선에 특히 효과적입니다.",
      caution: "치료 효과가 빠르게 나타나지만 부위와 개인에 따라 차이가 있습니다. 시술 후 일시적인 홍반이 발생할 수 있으며 자외선 차단제 사용이 필수입니다. 광과민성 약물 복용 중인 경우 사전 상담이 필요합니다.",
      sessions: "주 2~3회 (총 10~20회)",
      effect: "건선 병변 빠른 호전, 피부색 균일화, 자연스러운 피부 회복, 재발 억제",
      related: ["백반증", "홍조·혈관확장"],
      steps: [
        { step: 1, title: "진단 및 병기 평가", desc: "피부과 전문의 진찰로 건선 유형·범위·염증도를 평가합니다." },
        { step: 2, title: "엑시머 레이저 치료", desc: "308nm 레이저를 병변 부위에 집중 조사하여 T세포를 억제합니다." },
        { step: 3, title: "반응 확인", desc: "치료 2~4주 후 병변 호전 여부를 확인하고 조사량을 조정합니다." },
        { step: 4, title: "유지 관리", desc: "호전 후 자외선 차단 및 정기 추적 관찰로 재발을 예방합니다." },
      ],
    },
    {
      name: "아토피 피부염 복합 치료",
      nameEn: "ATOPIC DERMATITIS COMPLEX",
      cardBannerImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/아토피_303bd029.png",
      modalImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497278486/AiHUSMdBVV7XMDwayPAEuD/아토피_303bd029.png",
      badge: "복합 치료",
      desc: "NB-UVB 광선 치료와 보습·항염 치료를 병행하는 아토피 피부염 복합 관리 프로그램입니다.", descEn: "Comprehensive atopic dermatitis management program combining NB-UVB phototherapy with moisturizing and anti-inflammatory treatments.", descJa: "NB-UVB光線治療と保湿・抗炎症治療を併行するアトピー性皮膚炎複合管理プログラムです。", descZh: "结合NB-UVB光线治疗与保湿、抗炎治疗的特应性皮炎综合管理方案。",
      time: "30~60분", recovery: "당일 일상",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/3PticSr0g4jr_e69d1049.jpg",
      detail: "아토피 피부염 복합 치료는 NB-UVB 광선 치료와 집중 보습 치료, 항염 레이저를 결합한 종합 관리 프로그램입니다. 광선 치료로 피부 면역 반응을 조절하고, 레이저 치료로 피부 장벽 기능을 강화하며, 맞춤형 보습 치료로 피부 수분을 유지합니다. 중등도~중증 아토피 피부염 환자에게 적합하며, 스테로이드 사용을 줄이는 데 도움이 됩니다.",
      caution: "치료 중 피부 자극을 최소화해야 하며 향료·방부제가 없는 보습제 사용이 권장됩니다. 급성 악화기에는 광선 치료를 일시 중단할 수 있습니다. 개인 피부 상태에 따라 치료 계획이 조정됩니다.",
      sessions: "주 2~3회 (총 20~30회, 유지 치료 병행)",
      effect: "아토피 가려움·염증 완화, 피부 장벽 강화, 스테로이드 의존도 감소, 삶의 질 향상",
      related: ["백반증", "여드름 치료"],
      steps: [
        { step: 1, title: "피부 상태 평가", desc: "아토피 중증도(SCORAD)를 평가하고 맞춤 치료 계획을 수립합니다." },
        { step: 2, title: "광선 치료", desc: "NB-UVB로 피부 면역 반응을 조절하고 염증을 억제합니다." },
        { step: 3, title: "레이저·보습 치료", desc: "피부 장벽 강화 레이저와 집중 보습 치료를 병행합니다." },
        { step: 4, title: "유지 관리", desc: "정기 추적 관찰과 생활 습관 교육으로 재발을 예방합니다." },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 장비 데이터
// ─────────────────────────────────────────────────────────────────────────────
interface Equipment {
  brand: string;
  name: string;
  nameJa?: string;
  nameZh?: string;
  desc: string;
  descEn?: string;
  descJa?: string;
  descZh?: string;
  image: string;
  detail?: string;
}

const EQUIPMENT: Record<string, Equipment[]> = {
  best: [
    { brand: "MERZ AESTHETICS", name: "울쎄라피 프라임", desc: "리프팅 만족도 1위 최신 버전", descEn: "Latest version with the highest lifting satisfaction rating", descJa: "リフティング満足度No.1最新バージョン", descZh: "提升满意度第一的最新版本", image: `${CDN}/울쎄라피프라임_1_798484e7.png` },
    { brand: "THERMAGE FLX", name: "써마지 FLX", desc: "조시형 원장 공식 자문의 장비", descEn: "Official advisory device of Dr. Jo Si-hyeong", descJa: "趙時亨院長公式アドバイザー機器", descZh: "赵时亨院长官方顾问设备", image: `${CDN}/써마지FLX_f1163ff8.png` },
    { brand: "REJURAN", name: "리쥬란 힐러", desc: "피부 재생 연어 주사", descEn: "Salmon DNA skin regeneration injection", descJa: "皮膚再生サーモンDNA注射", descZh: "皮肤再生三文鱼DNA注射", image: `${CDN}/더마샤인프로_d7a8f2c1.png` },
    { brand: "ULTRAPULSE CO₂", name: "울트라펄스", desc: "흉터 치료 전문 CO₂ 레이저", descEn: "Specialized CO2 laser for scar treatment", descJa: "瘢痕治療専門CO2レーザー", descZh: "疤痕治疗专用CO2激光", image: `${CDN}/플라듀오_6eccf485.png` },
    { brand: "EXCEL V+", name: "엑셀 V플러스", desc: "홍조·혈관 치료의 표준", descEn: "Standard for redness and vascular treatment", descJa: "紅潮・血管治療の標準", descZh: "红肌和血管治疗的标准", image: `${CDN}/엑셀V_5364dd04.png` },
    { brand: "ADVATX", name: "아드바티엑스", desc: "홍조 탄력 개선 레이저", descEn: "Laser for redness and elasticity improvement", descJa: "紅潮弾力改善レーザー", descZh: "红肌弹力改善激光", image: `${CDN}/아드바Tx_e865914d.png` },
    { brand: "SCULPTRA", name: "스컬트라", desc: "FDA 승인 콜라겐 자극제", descEn: "FDA-approved collagen stimulator", descJa: "FDA承認コラーゲン刺激剤", descZh: "FDA批准的胶原蛋白刺激剂", image: `${CDN}/더마샤인프로_d7a8f2c1.png` },
    { brand: "PROFOUND RF", name: "프로파운드", desc: "진피층 직접 자극 RF 리프팅", descEn: "RF lifting that directly stimulates the dermis layer", descJa: "真皮層を直接刺激するRFリフティング", descZh: "直接刺激真皮层的RF提升", image: `${CDN}/프로파운드_481e0c83.png` },
  ],
  lifting: [
    { brand: "MERZ AESTHETICS", name: "울쎄라피 프라임", desc: "리프팅 만족도 1위 최신 버전", descEn: "Latest version with the highest lifting satisfaction rating", descJa: "リフティング満足度No.1最新バージョン", descZh: "提升满意度第一的最新版本", image: `${CDN}/울쎄라피프라임_1_798484e7.png` },
    { brand: "THERMAGE FLX", name: "써마지 FLX", desc: "조시형 원장 공식 자문의 장비", descEn: "Official advisory device of Dr. Jo Si-hyeong", descJa: "趙時亨院長公式アドバイザー機器", descZh: "赵时亨院长官方顾问设备", image: `${CDN}/써마지FLX_f1163ff8.png` },
    { brand: "REVINAS", name: "세르프 리프팅", desc: "최신 고강도 RF 리프팅", descEn: "Latest high-intensity RF lifting", descJa: "最新高強度RFリフティング", descZh: "最新高强度射频提升", image: `https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/equip-xerf-cropped_d21e359e.png` },
    { brand: "SHURINK UNIVERSE", name: "스른크 유니버스", desc: "집속 초음파 리프팅의 진화", descEn: "Evolution of focused ultrasound lifting", descJa: "集束超音波リフティングの進化", descZh: "聚焦超声提升的进化", image: `${CDN}/슈링크_77cc74d6.png` },
    { brand: "PROFOUND RF", name: "프로파운드", desc: "진피층 직접 자극 RF 리프팅", descEn: "RF lifting that directly stimulates the dermis layer", descJa: "真皮層を直接刺激するRFリフティング", descZh: "直接刺激真皮层的RF提升", image: `${CDN}/프로파운드_481e0c83.png` },
    { brand: "VIRTUE RF", name: "버츄RF", desc: "마이크로니들 RF 리프팅", descEn: "Microneedle RF lifting treatment", descJa: "マイクロニードルRFリフティング", descZh: "微针RF提升治疗", image: `${CDN}/버츄RF_47204eff.png` },
    { brand: "OLIGIO X", name: "올리지오X", desc: "RF 고주파 리프팅의 새로운 기준", descEn: "New standard in RF high-frequency lifting", descJa: "RF高周波リフティングの新基準", descZh: "射频高频提升的新标准", image: `${CDN}/올리지오X_e1e54986.png` },
    { brand: "TRINITY LIFTONING", name: "트리니티 리프토닝", desc: "리프팅과 토닝을 동시에", descEn: "Simultaneous lifting and skin toning", descJa: "リフティングとトーニングを同時に", descZh: "同时进行提升和调肤", image: `${CDN}/트리니티리프토닝_4ef97ebc.png` },
    { brand: "LAFERRA", name: "라페라 리프팅", desc: "고주파 얼굴 탄력 리프팅", descEn: "High-frequency facial elasticity lifting", descJa: "高周波顔面弾力リフティング", descZh: "高频面部弹力提升", image: `${CDN}/라페라_0cff5f1a.png` },
    { brand: "EXILIS ULTRA", name: "엑실리스 울트라", desc: "RF+초음파 복합 리프팅", descEn: "Combined RF + ultrasound lifting", descJa: "RF+超音波複合リフティング", descZh: "射频+超声波复合提升", image: `${CDN}/엑실리스 울트라_5449a8ed.png` },
    { brand: "TENSERA", name: "테늤라", desc: "고주파 초음파 복합 리프팅", descEn: "Combined high-frequency ultrasound lifting", descJa: "高周波超音波複合リフティング", descZh: "高频超声波复合提升", image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/테늤라_nobg_v2_7713a6c6.png" },
    { brand: "TENSEMA", name: "테늤마", desc: "고주파 초음파 복합 리프팅", descEn: "Combined high-frequency ultrasound lifting", descJa: "高周波超音波複合リフティング", descZh: "高频超声波复合提升", image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/테늤마_nobg_083af6bb.png" },
  ],
  eye: [
    { brand: "DERMASHINE PRO", name: "더마샤인 프로", desc: "수분 공급과 리프팅 동시", descEn: "Simultaneous moisture supply and lifting", descJa: "水分補給とリフティングを同時に", descZh: "同时补水和提升", image: `${CDN}/더마샤인프로_d7a8f2c1.png` },
    { brand: "ENERJET", name: "에너젯", desc: "무침 약물 주입 리프팅", descEn: "Needle-free drug delivery lifting", descJa: "無針薬物注入リフティング", descZh: "无针药物注入提升", image: `${CDN}/에너젯_afcf856d.png` },
  ],
  rosacea: [
    { brand: "EXCEL V+", name: "엑셀 V플러스", desc: "혈관·색소 치료의 표준", descEn: "Standard for vascular and pigment treatment", descJa: "血管・色素治療の標準", descZh: "血管和色素治疗的标准", image: `${CDN}/엑셀V_5364dd04.png` },
    { brand: "BBL HERO", name: "BBL 히어로", desc: "광치료 홍조·색소 복합 개선", descEn: "Phototherapy for combined redness and pigment improvement", descJa: "光治療による紅潮・色素複合改善", descZh: "光疗复合改善红肌和色素", image: `${CDN}/bbl-removebg-preview_f5544d44.png` },
  ],
  pigment: [
    { brand: "DISCOVERY PICO", name: "디스커버리 피코", desc: "피코초 레이저 색소·문신 제거", descEn: "Picosecond laser for pigment and tattoo removal", descJa: "ピコ秒レーザーによる色素・タトゥー除去", descZh: "皮秒激光去除色素和纹身", image: `${CDN}/디스커버리피코_41237d61.png` },
    { brand: "PICOSURE", name: "피코슈어", desc: "755nm 피코초 레이저", descEn: "755nm picosecond laser", descJa: "755nmピコ秒レーザー", descZh: "755nm皮秒激光", image: `${CDN}/피코슈어_71bad6af.png` },
    { brand: "ENLIGHTEN 3RD", name: "인라이튼 루비피코", desc: "3세대 피코초 레이저", descEn: "3rd-generation picosecond laser", descJa: "第3世代ピコ秒レーザー", descZh: "第三代皮秒激光", image: `${CDN}/인라이튼루비피코_43c3fbfb.png` },
    { brand: "STAR WALKER MAQX", name: "스타워커 MAQX", desc: "색소 치료 전문 레이저", descEn: "Specialized laser for pigment treatment", descJa: "色素治療専門レーザー", descZh: "色素治疗专用激光", image: `${CDN}/스타워커_7ba78892.png`, detail: "스타워커 MAQX는 Q-스위치 Nd:YAG 레이저와 피코초 레이저를 결합한 복합 색소 치료 장비입니다. 532nm·1064nm·585nm·650nm 다중 파장을 지원하여 기미·잡티·문신·검버섯·오타모반 등 다양한 색소 병변에 대응합니다. 피코초 펄스로 색소 입자를 미세하게 분쇄하여 체내 흡수·배출을 촉진하며, 주변 정상 조직 손상을 최소화합니다." },
    { brand: "PENTO 9900", name: "펜토 9900", desc: "색소 탄력 복합 치료", descEn: "Combined pigment and elasticity treatment", descJa: "色素弾力複合治療", descZh: "色素和弹力综合治疗", image: `${CDN}/펜토 9900_3af14ef2.png` },
    { brand: "JOULE LASER", name: "줄 레이저", desc: "색소·흉터·박피 다목적 레이저", descEn: "Multi-purpose laser for pigment, scars, and resurfacing", descJa: "色素・瘢痕・剥離の多目的レーザー", descZh: "色素、疤痕和磨皮多功能激光", image: `${CDN}/힐러_6ec6c8e4.png` },
  ],
  scar: [
    { brand: "PLADUO", name: "플라듀오 레이저", desc: "여드름 흉터 전용 레이저", descEn: "Dedicated laser for acne scar treatment", descJa: "ニキビ瘢痕専用レーザー", descZh: "痘疤专用激光", image: `${CDN}/플라듀오_6eccf485.png` },
    { brand: "TIXEL LASER", name: "틱셀 레이저", desc: "여드름·흉터·모공 개선", descEn: "Acne, scar, and pore improvement", descJa: "ニキビ・瘢痕・毛穴改善", descZh: "痘痘、疤痕和毛孔改善", image: `${CDN}/틱셀_98a5cbdf.png` },
    { brand: "ADVATX", name: "아드바티엑스", desc: "흉터 탄력 개선 레이저", descEn: "Laser for scar and elasticity improvement", descJa: "瘢痕弾力改善レーザー", descZh: "疤痕和弹力改善激光", image: `${CDN}/아드바Tx_e865914d.png` },
    { brand: "PROFOUND RF", name: "프로파운드", desc: "진피층 직접 자극 RF", descEn: "RF energy directly targeting the dermis layer", descJa: "真皮層を直接刺激するRFエネルギー", descZh: "直接作用于真皮层的RF能量", image: `${CDN}/프로파운드_481e0c83.png` },
  ],
  volume: [
    { brand: "DERMASHINE PRO", name: "더마샤인 프로", desc: "수분·탄력 스킨부스터", descEn: "Moisture and elasticity skin booster", descJa: "水分・弾力スキンブースター", descZh: "水分和弹力皮肤促进剂", image: `${CDN}/더마샤인프로_d7a8f2c1.png` },
    { brand: "ENERJET", name: "에너젯", desc: "무침 약물 주입 리프팅", descEn: "Needle-free drug delivery lifting treatment", descJa: "無針薬物注入リフティング", descZh: "无针药物注射提升治疗", image: `${CDN}/에너젯_afcf856d.png` },
  ],
  botox: [
    { brand: "DERMASHINE PRO", name: "더마샤인 프로", desc: "수분·탄력 스킨부스터", descEn: "Moisture and elasticity skin booster", descJa: "水分・弾力スキンブースター", descZh: "水分和弹力皮肤促进剂", image: `${CDN}/더마샤인프로_d7a8f2c1.png` },
    { brand: "ENERJET", name: "에너젯", desc: "무침 약물 주입 리프팅", descEn: "Needle-free drug delivery lifting treatment", descJa: "無針薬物注入リフティング", descZh: "无针药物注射提升治疗", image: `${CDN}/에너젯_afcf856d.png` },
  ],
  acne_laser: [
    { brand: "AVICLEAR", name: "아비클리어", desc: "FDA 승인 여드름 전용 1,726nm 레이저", descEn: "FDA-approved 1,726nm laser dedicated to acne treatment", descJa: "FDA承認ニキビ専用1,726nmレーザー", descZh: "FDA批准的1,726nm痘痘专用激光", image: `${CDN}/아비클리어_2d9cab50.png` },
    { brand: "CAPRI LASER", name: "카프리", desc: "염증성 여드름 이중 파장 레이저", descEn: "Dual-wavelength laser for inflammatory acne", descJa: "炎症性ニキビ二重波長レーザー", descZh: "炎症性痘痘双波长激光", image: `${CDN}/아비클리어_2d9cab50.png` },
    { brand: "PLADUO", name: "플라듀오", desc: "플라즈마+레이저 복합 여드름 치료", descEn: "Combined plasma and laser acne treatment", descJa: "プラズマ+レーザー複合ニキビ治療", descZh: "等离子体+激光复合痘痘治疗", image: `${CDN}/플라듀오_6eccf485.png` },
    { brand: "PLATINUM PTT", name: "플래티넘PTT", desc: "플래티넘 나노입자 광열 여드름 치료", descEn: "Platinum nanoparticle photothermal acne treatment", descJa: "プラチナナノ粒子光熱ニキビ治療", descZh: "铂纳米粒子光热痘痘治疗", image: `${CDN}/아비클리어_2d9cab50.png` },
    { brand: "NEOGEN PLASMA", name: "네오젠플라즈마", desc: "플라즈마 에너지 피부 재생", descEn: "Plasma energy skin regeneration", descJa: "プラズマエネルギー皮膚再生", descZh: "等离子体能量皮肤再生", image: `${CDN}/아비클리어_2d9cab50.png` },
    { brand: "KOBAYASHI", name: "고바야시 절연침", desc: "절연침 기술 고주파 에너지 여드름 치료", descEn: "Insulated needle RF energy acne treatment", descJa: "絶縁針技術高周波エネルギーニキビ治療", descZh: "绝缘针技术高频能量痘痘治疗", image: `${CDN}/아비클리어_2d9cab50.png` },
  ],
  psoriasis: [
    { brand: "NB-UVB SYSTEM", name: "전신자외선 치료기", desc: "협대역 자외선B 건선·아토피 치료", descEn: "Narrowband UVB phototherapy for psoriasis and atopic dermatitis", descJa: "協帯域UVB乾癬・アトピー治療", descZh: "窄带UVB银屑病和特应性皮炎治疗", image: `${CDN}/엑시머V7_5a8a4340.jpg`, detail: "311nm NB-UVB를 전신에 균일 조사하는 광선 치료 장비. 건선·아토피 피부염·백반증에 활용됩니다." },
    { brand: "EXCIMER V7", name: "엑시머 V7 (건선)", desc: "308nm 건선 병변 집중 레이저", descEn: "308nm excimer laser for focused psoriasis lesion treatment", descJa: "308nm乾癬病変集中レーザー", descZh: "308nm银屑病病变集中激光", image: `${CDN}/엑시머V7_5a8a4340.jpg`, detail: "308nm 엑시머 레이저로 건선 병변 부위에만 집중 조사. 전신 광선 치료 대비 치료 횟수를 단축합니다." },
  ],
  vitiligo: [
    { brand: "EXCIMER V7", name: "엑시머 V7", desc: "308nm 백반증 전문 엑시머 레이저", descEn: "308nm excimer laser specialized for vitiligo", descJa: "308nm白斑専門エキシマレーザー", descZh: "308nm白癜风专用准分子激光", image: `${CDN}/엑시머V7_5a8a4340.jpg`, detail: "엑시머 V7은 308nm 파장의 엑시머 레이저를 이용한 백반증·건선 전문 치료 장비입니다. 병변 부위에만 집중 조사하여 정상 피부 노출을 최소화하며, FDA 승인을 받은 안전한 장비입니다." },
    { brand: "NB-UVB SYSTEM", name: "전신자외선 치료기", desc: "협대역 자외선B 전신 광선 치료", descEn: "Narrowband UVB full-body phototherapy", descJa: "狭帯域UVB全身光線治療", descZh: "窄带UVB全身光线治疗", image: `${CDN}/엑시머V7_5a8a4340.jpg`, detail: "311nm 협대역 자외선B(NB-UVB)를 전신에 균일하게 조사하는 광선 치료 장비입니다. 전신 백반증·건선·아토피 피부염 등 다양한 피부 질환에 활용됩니다." },
    { brand: "EPIDERMAL GRAFT", name: "표피이식 시스템", desc: "흡입 수포법 표피이식 전용 장비", descEn: "Epidermal graft system using suction blister method", descJa: "吸引水疱法表皮移植専用機器", descZh: "使用吸引水疱法的表皮移植专用设备", image: `${CDN}/엑시머V7_5a8a4340.jpg`, detail: "흡입 수포법(Suction Blister)을 이용해 정상 피부 표피를 분리·채취하는 표피이식 전용 장비입니다. 안정기 백반증 수술적 치료에 활용됩니다." },
  ],
  acne: [
    {
      brand: "SOLTA MEDICAL", name: "miraDry Fresh",
      desc: "마이크로파 에너지로 겨드랑이 땀샘을 영구 제거하는 FDA 승인 장비", descEn: "FDA-approved device for permanent underarm sweat gland removal using microwave energy", descJa: "マイクロ波エネルギーで脇の汗腺を永久除去するFDA承認機器", descZh: "使用微波能量永久去除腋下汗腺的FDA认证设备",
      image: `${CDN}/미라드라이_69912512.png`,
      detail: "Solta Medical의 miraDry Fresh는 2.45GHz 마이크로파 에너지를 이용해 에크린·아포크린 땀샘을 비절개로 영구 파괴합니다. 냉각 시스템이 표피를 보호하며 FDA 510(k) 승인 장비입니다.",
    },
    {
      brand: "LIPOSAT", name: "라이포샛 (Liposat)",
      desc: "고주파 에너지로 겨드랑이 땀샘과 지방을 동시 제거하는 비절개 장비", descEn: "Non-incision device for simultaneous removal of underarm sweat glands and fat using RF energy", descJa: "RFエネルギーで脇の汗腺と脂肪を非切開で同時除去する機器", descZh: "使用射频能量无切口同时去除腋下汗腺和脂肪的设备",
      image: `${CDN}/에너젯_afcf856d.png`,
      detail: "라이포샛(Liposat)은 RF 에너지를 미세 캐뉼라를 통해 피부 아래 지방층에 전달하여 아포크린 땀샘과 지방 세포를 선택적으로 파괴합니다. 겨드랑이 라인 개선과 액취증 치료를 동시에 실현합니다.",
    },
    {
      brand: "ALLERGAN", name: "보톡스 주사 장비",
      desc: "보툴리눔 독소를 정밀 주사하는 다한증 비수술 치료 장비", descEn: "Non-surgical hyperhidrosis treatment device for precise botulinum toxin injection", descJa: "ボツリヌス毒素を精密注射する多汗症非手術治療機器", descZh: "精准注射肉毒素的多汗症非手术治疗设备",
      image: `${CDN}/에너젯_afcf856d.png`,
      detail: "미세 주사 기법으로 보툴리눔 독소를 겨드랑이·손바닥·발바닥 등 다한증 부위에 정밀 투여합니다. 아세틸콜린 분비를 억제하여 땀샘 신호를 차단하며, 시술 시간이 짧고 회복 기간이 없습니다.",
    },
    {
      brand: "CUREMAX", name: "큐어맥스",
      desc: "CO2 레이저 여드름 흉터 및 단초 제거 장비", descEn: "CO2 laser device for acne scar and lesion removal", descJa: "CO2レーザーニキビ瘢痕・病変除去機器", descZh: "CO2激光痘疤和病变去除设备",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/큐어맥스_nobg_e5919a31.png",
      detail: "큐어맥스(CureMax)는 초단위 CO2 레이저 기술을 적용한 여드름 흉터 제거 및 단초 제거 전문 장비입니다. 비침습적 CO2 레이저로 여드름 흉터와 단초를 정밀하게 제거하며, 빠른 치료 시간과 효과적인 결과를 제공합니다.",
    },
  ],
};

// 카테고리별 이미지 배경 색상
const CAT_IMG_BG: Record<string, string> = {
  best:    "#EEF4FF", // 연한 인디고
  lifting: "#F0FDF4", // 연한 민트 그린
  eye:     "#FFF7ED", // 연한 피치
  rosacea: "#FFFFFF", // 흰색
  pigment: "#F5F3FF", // 연한 라벤더
  scar:    "#ECFDF5", // 연한 에메랄드
  volume:  "#FFFBEB", // 연한 골드
  botox:   "#F0F9FF", // 연한 스카이
  acne:    "#FDF4FF", // 연한 퍼플
  fungus:  "#F0FDFA", // 연한 틸
  acne_laser: "#FFF0F0", // 연한 코랄
  vitiligo: "#F0FFF4", // 연한 그린
  psoriasis: "#FFF8F0", // 연한 오렌지
};

// 카테고리별 탭 활성 텍스트 색상 (진한 상응 색)
const CAT_TAB_TEXT: Record<string, string> = {
  best:    "#3730A3", // 인디고
  lifting: "#166534", // 그린
  eye:     "#9A3412", // 오렌지
  rosacea: "#9F1239", // 로즈
  pigment: "#5B21B6", // 라벤더
  scar:    "#065F46", // 에메랄드
  volume:  "#92400E", // 앙버
  botox:   "#0C4A6E", // 스카이
  acne:    "#6B21A8", // 퍼플
  fungus:  "#0F766E", // 틸
  acne_laser: "#B91C1C", // 코랄 레드
  vitiligo: "#166534", // 딥 그린
  psoriasis: "#9A3412", // 딥 오렌지
};

// ────────────────────────────────────────────────────────────────────────────────
// 시술 카드 컴포넌트
// ────────────────────────────────────────────────────────────────────────────────
// 상세 페이지가 있는 시술 slug 매핑
const DETAIL_PAGE_SLUGS: Record<string, string> = {
  "울쎄라피 프라임": "ulthera",
  "써마지 FLX": "thermage",
  "눈밑지방재배치": "under-eye-fat",
};

// ── 카테고리 label 언어별 선택 헬퍼 ─────────────────────────────────────────
function getCatLabel(cat: { label: string; labelEn: string; labelJa?: string; labelZh?: string }, lang: string): string {
  if (lang === 'en') return cat.labelEn;
  if (lang === 'ja' && cat.labelJa) return cat.labelJa;
  if (lang === 'zh' && cat.labelZh) return cat.labelZh;
  if (lang !== 'ko' && cat.labelEn) return cat.labelEn;
  return cat.label;
}

function TreatmentCard({ item, index, imgBg, catTextColor }: { item: Treatment; index: number; imgBg: string; catTextColor: string }) {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { t, lang } = useLang();
  const tr = t.treatments;
  const detailSlug = DETAIL_PAGE_SLUGS[item.name];

  // [MAINT-P1-1] getText → @/hooks/useLocalizedText 공유 hook 사용
  const { getText } = useLocalizedText();

  return (
    <>
      <div
        className="treatment-card group cursor-pointer"
        style={{ animation: `cardFadeIn 0.35s ease ${Math.min(index * 0.07, 0.42)}s both` }}
        onClick={() => setOpen(true)}
      >
        {/* 이미지 */}
        <div className="relative overflow-hidden" style={{ height: item.cardBannerImage ? 'auto' : '192px', background: item.cardBannerImage ? "transparent" : "#f6efe0" }}>
          {item.cardBannerImage ? (
            <OptimizedImage
              src={item.cardBannerImage}
              alt={item.name}
              className="w-full h-auto block transition-transform duration-400 group-hover:scale-105"
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.5"; }}
            />
          ) : item.images && item.images.length >= 2 ? (
            // 두 이미지 나란히 표시 - 균형잡힌 레이아웃
            <div className="w-full h-full flex items-center justify-center gap-2 transition-transform duration-400 group-hover:scale-105" style={{ padding: "8px 6px" }}>
              {item.images.map((imgSrc, i) => (
                <OptimizedImage
                  key={i}
                  src={imgSrc}
                  alt={`${item.name} ${i + 1}`}
                  className="object-contain flex-none"
                  style={{
                    height: "85%",
                    maxWidth: "48%",
                    filter: "drop-shadow(1px 2px 4px rgba(0,0,0,0.08))",
                  }}
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.5"; }}
                />
              ))}
            </div>
          ) : (
            <OptimizedImage
              src={item.image}
              alt={getText(item.name, item.nameEn, item.nameJa, item.nameZh)}
              className="w-full h-full object-contain transition-transform duration-400 group-hover:scale-115"
              style={{ padding: "10px" }}
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.5"; }}
            />
          )}
          {/* 배지 제거됨 */}
        </div>

        {/* 텍스트 */}
        <div className="p-3 sm:p-4">
          <p className="text-xs font-normal mb-0.5 font-montserrat" style={{ color: "#d1ab67" }}>{item.nameEn}</p>
          <h3 className="text-base sm:text-lg font-bold mb-1" style={{ color: "#1F2937" }}>{getText(item.name, item.nameEn, item.nameJa, item.nameZh)}</h3>
          <p className="text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3" style={{ color: "#6B7280" }}>{getText(item.desc, item.descEn, item.descJa, item.descZh)}</p>
          <div className="flex gap-3 flex-wrap items-center justify-between">
            <div className="flex gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-xs" style={{ color: "#9CA3AF" }}>
                <Clock size={11} /> {getText(item.time, item.timeEn, item.timeJa, item.timeZh)}
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: "#9CA3AF" }}>
                <RefreshCw size={11} /> {lang === 'ko' ? '회복 ' : lang === 'ja' ? '回復 ' : lang === 'zh' ? '恢复 ' : 'Recovery '}{getText(item.recovery, item.recoveryEn, item.recoveryJa, item.recoveryZh)}
              </span>
            </div>
            <span
                className="inline-flex items-center justify-center rounded-full transition-all duration-200 group-hover:bg-[#d1ab67] group-hover:text-white"
                style={{ width: 22, height: 22, background: "#f6efe0", color: "#d1ab67" }}
              >
                <ChevronRight size={12} />
              </span>
          </div>
        </div>
      </div>

      {/* 상세 모달 */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden" style={{ borderRadius: "1.25rem" }} showCloseButton={false}>
          <DialogTitle className="sr-only">{getText(item.name, item.nameEn, item.nameJa, item.nameZh)}</DialogTitle>
          {/* 모달 콘텐츠 */}
          <div className="p-6 flex flex-col" style={{ maxHeight: "90vh", overflow: "hidden" }}>
            {/* 스크롤 가능한 콘텐츠 영역 */}
            <div className="flex-1 overflow-y-auto pr-2">
              {/* YouTube 영상 또는 모달 이미지 (해당 시술에만 표시) */}
              {!item.youtubeUrl && item.cardBannerImage && (
                <div className="mb-5">
                  <OptimizedImage
                    src={item.cardBannerImage}
                    alt={`${item.name} 베너`}
                    className="w-full rounded-xl shadow-md object-cover"
                  />
                </div>
              )}
              {item.youtubeUrl && (
                <div className="mb-4">
                <div
                  className="relative w-full rounded-xl overflow-hidden shadow-md"
                  style={{ paddingBottom: "56.25%", height: 0 }}
                >
                  <iframe
                    src={item.youtubeUrl}
                    title={`${item.name} 소개 영상`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ border: 0 }}
                  />
                  </div>
                </div>
              )}

              <p className="text-xs font-normal mb-1 font-montserrat" style={{ color: "#d1ab67" }}>{item.nameEn}</p>
              <h2 className="text-xl font-bold mb-3" style={{ color: "#1F2937" }}>{getText(item.name, item.nameEn, item.nameJa, item.nameZh)}</h2>

              {/* 기본 정보 */}
              <div className="flex gap-4 mb-4 p-3 rounded-xl" style={{ background: "#f6efe0" }}>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} style={{ color: "#d1ab67" }} />
                  <div>
                    <p className="text-xs" style={{ color: "#9CA3AF" }}>{tr.modalTime}</p>
                    <p className="text-sm font-semibold" style={{ color: "#374151" }}>{getText(item.time, item.timeEn, item.timeJa, item.timeZh)}</p>
                  </div>
                </div>
                <div className="w-px" style={{ background: "#E5E7EB" }} />
                <div className="flex items-center gap-1.5">
                  <RefreshCw size={14} style={{ color: "#d1ab67" }} />
                  <div>
                    <p className="text-xs" style={{ color: "#9CA3AF" }}>{tr.modalRecovery}</p>
                    <p className="text-sm font-semibold" style={{ color: "#374151" }}>{getText(item.recovery, item.recoveryEn, item.recoveryJa, item.recoveryZh)}</p>
                  </div>
                </div>
                {item.sessions && (
                  <>
                    <div className="w-px" style={{ background: "#E5E7EB" }} />
                    <div className="flex items-center gap-1.5">
                      <Repeat size={14} style={{ color: "#d1ab67" }} />
                      <div>
                        <p className="text-xs" style={{ color: "#9CA3AF" }}>{tr.modalSessions}</p>
                        <p className="text-sm font-semibold" style={{ color: "#374151" }}>{item.sessions}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 상세 설명 */}
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#4B5563" }}>
                {item.detail ?? getText(item.desc, item.descEn, item.descJa, item.descZh)}
              </p>

              {/* 기대 효과 */}
              {item.effect && (
                <div className="mb-4" style={{ borderTop: "1px solid #f0e8d4", paddingTop: "14px" }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles size={12} style={{ color: "#d1ab67" }} />
                    <p className="text-xs font-bold" style={{ color: "#d1ab67" }}>{tr.modalEffect}</p>
                  </div>
                  <p className="text-sm" style={{ color: "#374151", lineHeight: 1.6 }}>{item.effect}</p>
                </div>
              )}

            {/* 연관 시술 추천 및 치료 단계는 사용하지 않음 */}
            </div>
            {/* CTA - 스크롤 가능 영역 하단에 고정 */}
            {detailSlug && (
              <button type="button"
                onClick={() => { setOpen(false); setLocation(`/treatments/${detailSlug}`); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 hover:brightness-95 active:scale-95 mt-3 flex-shrink-0 border"
                style={{ background: "#f0f4fa", color: "#2D4A7A", borderColor: "#c7d2fe" }}
              >
                <ExternalLink size={14} />
                {tr.modalDetailBtn}
              </button>
            )}
            <a
              href={lang === 'zh' ? 'https://u.wechat.com/star2006beauty' : lang === 'ja' ? 'https://lin.ee/tyuRdUc' : lang === 'en' ? 'https://pf.kakao.com/_HNyGC' : 'https://pf.kakao.com/_HNyGC'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all duration-200 hover:brightness-95 active:scale-95 mt-2 flex-shrink-0"
              style={{ background: lang === 'zh' || lang === 'ja' ? '#07C160' : '#FEE500', color: lang === 'zh' || lang === 'ja' ? 'white' : '#191919' }}
              onClick={() => setOpen(false)}
            >
              {tr.modalConsultBtn}
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// 장비 패널 컴포넌트 (접기/펼치기 포함)
// ─────────────────────────────────────────────────────────────────────────────
function EquipmentPanel({ items, catId }: { items: Equipment[]; catId: string }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedEq, setSelectedEq] = useState<Equipment | null>(null);
  const visible = expanded ? items : items.slice(0, 4);
  const { lang } = useLang();

  // [MAINT-P1-1] getEqText → @/hooks/useLocalizedText 공유 hook 사용
  const { getText: getEqText } = useLocalizedText();

  return (
    <>
    {selectedEq && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={() => setSelectedEq(null)}
      >
        <div
          className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: "white" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-5" style={{ background: "#f6efe0", borderBottom: "1px solid #e8dfc8" }}>
            <button type="button"
              onClick={() => setSelectedEq(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
              style={{ background: "rgba(0,0,0,0.08)", color: "#6B7280" }}
            >
              ✕
            </button>
            <p className="text-xs font-semibold mb-1" style={{ color: "#d1ab67" }}>{selectedEq.brand}</p>
            <h3 className="text-xl font-bold" style={{ color: "#1F2937" }}>{getEqText(selectedEq.name, selectedEq.brand, selectedEq.nameJa, selectedEq.nameZh)}</h3>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>{getEqText(selectedEq.desc, selectedEq.descEn, selectedEq.descJa, selectedEq.descZh)}</p>
          </div>
          <div className="flex justify-center py-6" style={{ background: "white" }}>
            <OptimizedImage
              src={selectedEq.image}
              alt={selectedEq.name}
              className="h-32 object-contain"
              height={128}
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.5"; }}
            />
          </div>
          <div className="px-6 py-5">
            {selectedEq.detail ? (
              <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{selectedEq.detail}</p>
            ) : (
              <p className="text-sm" style={{ color: "#9CA3AF" }}>
                {lang === 'en' ? 'Detailed information coming soon.' : lang === 'ja' ? '詳細情報は準備中です。' : lang === 'zh' ? '详细信息准备中。' : '상세 정보 준비 중입니다.'}
              </p>
            )}
          </div>
          <div className="px-6 pb-6">
            <a
              href={lang === 'zh' ? 'https://u.wechat.com/star2006beauty' : lang === 'ja' ? 'https://lin.ee/tyuRdUc' : 'http://pf.kakao.com/_xnxmKxj/chat'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ background: lang === 'zh' || lang === 'ja' ? '#07C160' : '#FEE500', color: lang === 'zh' || lang === 'ja' ? 'white' : '#191919' }}
            >
              {lang === 'zh' ? '通过微信咨询设备' : lang === 'ja' ? 'LINEで機器について相談する' : lang === 'en' ? 'Consult via KakaoTalk' : '카카오톡으로 장비 상담하기'}
            </a>
          </div>
        </div>
      </div>
    )}
    <div
      className="rounded-2xl overflow-hidden h-fit"
      style={{
        background: "white",
        border: "1px solid #e8dfc8",
        animation: `cardFadeIn 0.4s ease 0.1s both`,
      }}
    >
      {/* 패널 헤더 */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ background: "#f6efe0", borderBottom: "1px solid #e8dfc8" }}
      >
        <div>
          <p className="text-xs font-semibold tracking-wider mb-0.5" style={{ color: "#d1ab67" }}>
            EQUIPMENT
          </p>
          <h3 className="text-base font-bold" style={{ color: "#1F2937" }}>
            {lang === 'en' ? 'Related Equipment' : lang === 'ja' ? '関連機器' : lang === 'zh' ? '相关设备' : '관련 장비'}
          </h3>
        </div>
        <span
          className="px-3 py-1 rounded-full text-xs font-bold text-white"
          style={{ background: "#e8dfc8", color: "#d1ab67" }}
        >
          {items.length}{lang === 'en' ? ' units' : lang === 'ja' ? '種類' : lang === 'zh' ? '台' : '종 보유'}
        </span>
      </div>

      {/* 장비 목록 */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((eq, i) => (
          <div
            key={`${catId}-eq-${i}`}
            className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 hover:shadow-md group cursor-pointer"
            style={{ background: "#FAF8F4", border: "1px solid #e8dfc8", animation: `cardFadeIn 0.3s ease ${i * 0.06}s both` }}
            onClick={() => setSelectedEq(eq)}
          >
            {/* 장비 이미지 */}
            <div
              className="rounded-lg overflow-hidden flex items-center justify-center"
              style={{ width: "80px", height: "80px", background: "#f6efe0", aspectRatio: "1 / 1" }}
            >
              <OptimizedImage
                src={eq.image}
                alt={eq.name}
                className="w-[85%] h-[85%] object-contain transition-transform duration-300 group-hover:scale-110"
                width={68}
                height={68}
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.5"; }}
              />
            </div>
            {/* 장비 정보 */}
            <div className="text-center w-full">
              <p className="text-xs font-semibold" style={{ color: "#d1ab67" }}>{eq.brand}</p>
              <p className="text-sm font-bold" style={{ color: "#1F2937" }}>{getEqText(eq.name, eq.brand, eq.nameJa, eq.nameZh)}</p>
              <p className="text-xs line-clamp-2" style={{ color: "#6B7280" }}>{getEqText(eq.desc, eq.descEn, eq.descJa, eq.descZh)}</p>
            </div>
          </div>        ))}
      </div>

      {/* 더보기/접기 버튼 */}
      {items.length > 4 && (
        <button type="button"
          className="w-full py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors hover:bg-[#EEF7F7]"
          style={{ color: "#d1ab67", borderTop: "1px solid #e8dfc8" }}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <><ChevronUp size={14} /> {lang === 'en' ? 'Collapse' : lang === 'ja' ? '閉じる' : lang === 'zh' ? '收起' : '접기'}</>
          ) : (
            <><ChevronDown size={14} /> {lang === 'en' ? `${items.length - 4} more` : lang === 'ja' ? `${items.length - 4}種類もっと見る` : lang === 'zh' ? `再显示${items.length - 4}台` : `${items.length - 4}개 장비 더보기`}</>
          )}
        </button>
      )}
    </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────────────────────────────────────
export default function TreatmentsEquipmentSection() {
  const { t, lang } = useLang();
  const tr = t.treatments;
  const [activeId, setActiveId] = useState("best");
  const [showAll, setShowAll] = useState(true);
  const [sortBy, setSortBy] = useState<"name" | "time" | "popular">("popular");
  const [filterOpen, setFilterOpen] = useState(false);

  // 모바일: 3개, 데스크톱: 6개
  const INITIAL_SHOW = typeof window !== 'undefined' && window.innerWidth < 640 ? 3 : 6;
  const handleTabChange = (id: string) => {
    setActiveId(id);
    // 모든 카드 항상 펼쳐서 표시
  };
  const sectionRef = useSectionReveal(60);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const sectionTopRef = useRef<HTMLDivElement>(null);

  // 모바일: 활성 탭이 항상 중앙에 오도록 자동 스크롤
  useEffect(() => {
    const container = tabContainerRef.current;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLButtonElement>('[data-active="true"]');
    if (!activeBtn) return;
    const containerWidth = container.offsetWidth;
    const btnLeft = activeBtn.offsetLeft;
    const btnWidth = activeBtn.offsetWidth;
    container.scrollTo({
      left: btnLeft - containerWidth / 2 + btnWidth / 2,
      behavior: "smooth",
    });
  }, [activeId]);

  const filteredTreatments = useMemo(() => {
    let items = TREATMENTS[activeId] ?? [];
    
    // 정렬 적용
    if (sortBy === "name") {
      items = [...items].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    } else if (sortBy === "time") {
      items = [...items].sort((a, b) => {
        const timeA = parseInt(a.time?.replace(/[^0-9]/g, '') || "0");
        const timeB = parseInt(b.time?.replace(/[^0-9]/g, '') || "0");
        return timeA - timeB;
      });
    }
    // "popular"는 기본 순서 유지
    
    return items;
  }, [activeId, sortBy]);

  return (
    <section ref={sectionRef} id="treatments" className="py-16 sm:py-24" style={{ background: "#ffffff" }}>
      <div className="container">

        {/* 스크롤 복원 앵커 */}
        <div ref={sectionTopRef} />
        {/* ── 섹션 헤더 ── */}
        <div className="text-center mb-8 sm:mb-12 reveal-heading">
          <p className="text-sm tracking-widest mb-3 font-montserrat" style={{ color: "#d1ab67", fontWeight: 300, fontSize: '12px' }}>
            TREATMENTS & EQUIPMENT
          </p>
          <h2
            className="mb-4"
            style={{ color: "#1F2937", fontSize: "clamp(1.4rem, 5vw, 2.6rem)", fontWeight: 800 }}
          >
            {lang === 'ko' ? '검증된 숙련도와 최상의 솔루션' : tr.title}
          </h2>

          <p className="text-base max-w-2xl mx-auto leading-snug sm:leading-normal" style={{ color: '#d1ab67', paddingTop: '7px' }}>
            <span style={{fontSize: '18px'}}>{tr.subtitle}</span>
          </p>
        </div>

          {/* 카테고리 탭 + 필터/정렬 통합 카드 ── */}
        <div
          className="rounded-2xl px-4 py-4 mb-6"
          style={{
            background: "#fafafa", marginBottom: '15px', backgroundColor: '#ffffff',
          }}
        >
          {/* 필터/정렬 버튼 (상단 우측) */}
          <div className="flex justify-end gap-2 mb-4">
            {/* 정렬 드롭다운 */}
            <div className="relative">
                <button type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: "#f3f4f6",
                  color: "#6b7280",
                  border: "1px solid #e5e7eb"
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {tr.sortLabel}
              </button>
              {filterOpen && (
                <div
                  className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10 border border-gray-200"
                >
                  {[
                    { value: "popular", label: tr.sortPopular },
                    { value: "name", label: tr.sortName },
                    { value: "time", label: tr.sortTime },
                  ].map((option) => (
                    <button type="button"
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value as "name" | "time" | "popular");
                        setFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortBy === option.value
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* 탭 컨테이너 - 모바일: 2열 그리드, 데스크탑: flex-wrap 가로 배열 */}
          <div
            ref={tabContainerRef}
            className="mb-4"
          >
              {/* 모바일: 2열 그리드 */}
              <div className="grid grid-cols-2 gap-2 sm:hidden">
              {CATEGORIES.map((cat) => {
                const isActive = activeId === cat.id;
                return (
                  <button type="button"
                    key={cat.id}
                    data-active={isActive ? "true" : "false"}
                    onClick={() => handleTabChange(cat.id)}
                    className="flex items-center justify-center gap-1.5 whitespace-nowrap transition-all duration-250 w-full"
                    style={{
                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "0.78rem",
                      fontWeight: isActive ? 700 : 500,
                      background: isActive ? "#d1ab67" : "#fafaf8",
                      color: isActive ? "white" : "#6B7280",
                      border: isActive ? "1.5px solid #d1ab67" : "1.5px solid #E5E7EB",
                      boxShadow: isActive ? "0 4px 12px rgba(209,171,103,0.30)" : "0 1px 3px rgba(0,0,0,0.04)",
                      transform: isActive ? "translateY(-1px)" : "none",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", color: isActive ? "white" : "#9CA3AF" }}>
                      {React.createElement(CATEGORY_ICON_MAP[cat.id] ?? Star, { size: 12 })}
                    </span>
                    <span>{getCatLabel(cat, lang)}</span>
                  </button>
                );
              })}
              </div>
              {/* 데스크탑: flex-wrap 가로 배열 */}
              <div className="hidden sm:flex sm:flex-wrap gap-2" style={{marginTop: '9px', marginRight: '5px', marginBottom: '-4px', marginLeft: '16px'}}>
              {CATEGORIES.map((cat) => {
                const isActive = activeId === cat.id;
                return (
                  <button type="button"
                    key={cat.id}
                    data-active={isActive ? "true" : "false"}
                    onClick={() => handleTabChange(cat.id)}
                    className="flex items-center justify-center gap-1.5 whitespace-nowrap transition-all duration-250"
                    style={{
                      padding: "6px 14px",
                      borderRadius: "999px",
                      fontSize: "0.82rem",
                      fontWeight: isActive ? 700 : 500,
                      background: isActive ? "#d1ab67" : "#fafaf8",
                      color: isActive ? "white" : "#6B7280",
                      border: isActive ? "1.5px solid #d1ab67" : "1.5px solid #E5E7EB",
                      boxShadow: isActive ? "0 4px 12px rgba(209,171,103,0.30)" : "0 1px 3px rgba(0,0,0,0.04)",
                      transform: isActive ? "translateY(-1px)" : "none",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", color: isActive ? "white" : "#9CA3AF" }}>
                      {React.createElement(CATEGORY_ICON_MAP[cat.id] ?? Star, { size: 13 })}
                    </span>
                    <span>{getCatLabel(cat, lang)}</span>
                  </button>
                );
              })}
              </div>
          </div>
        </div>
        {/* ── 배너 + 시술 카드 통합 카드 ── */}
        {(() => {
          const cat = CATEGORIES.find(c => c.id === activeId);
          if (!cat) return null;
          return (
            <div
              key={`content-${activeId}`}
              className="rounded-2xl mb-8 overflow-hidden"
              style={{
                background: "#FAF6EF",
                animation: "cardFadeIn 0.4s ease both",
              }}
            >
              {/* 시술 카드 그리드 */}
              <div className="px-5 pt-5 pb-5" style={{ background: "white", borderRadius: "0 0 1rem 1rem" }}>
                <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTreatments.length === 0 ? (
                    <div className="col-span-full text-center py-16" style={{ color: "#9CA3AF" }}>
                      <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <p className="text-sm font-medium">{tr.noResults}</p>
                      <p className="text-xs mt-1">{tr.noResultsHint}</p>
                    </div>
                  ) : (showAll ? filteredTreatments : filteredTreatments.slice(0, INITIAL_SHOW)).map((item, i) => (
                    <TreatmentCard key={`${activeId}-t-${i}`} item={item} index={i} imgBg={CAT_IMG_BG[activeId] ?? "#F0F6F8"} catTextColor={CAT_TAB_TEXT[activeId] ?? "#3730A3"} />
                  ))}
                </div>
                {/* 더 보기 / 접기 버튼 - 비활성화: 모든 카드 항상 표시 */}
                {false && filteredTreatments.length > INITIAL_SHOW && (
                  <div className="flex justify-center" style={{marginTop: '68px'}}>
                    <button type="button"
                      onClick={() => {
                        if (showAll) {
                          sectionTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                        setShowAll(!showAll);
                      }}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:shadow-md active:scale-95"
                      style={{
                        background: showAll ? "white" : "#d1ab67",
                        color: showAll ? "#6B7280" : "white",
                        border: showAll ? "1.5px solid #e8dfc8" : "none",
                      }}
                    >
                      {showAll ? (
                        <>
                          <ChevronUp size={16} />
                          접기
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} />
                          {filteredTreatments.length - INITIAL_SHOW}개 더 보기
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })()}


      </div>
    </section>
  );
}

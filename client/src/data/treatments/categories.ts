/**
 * categories.ts
 * 시술 카테고리 정의 및 관련 UI 상수.
 * 카테고리 ID, 다국어 레이블, 설명, 색상 매핑을 포함한다.
 */
import React from "react";
import {
  Star, Zap, Eye, Heart, Sun, Microscope, Droplets, Pill,
  Leaf, Wind, Circle, Layers, Footprints,
} from "lucide-react";
import type { Category } from "@/types/treatment";

export const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
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

export const CATEGORIES: Category[] = [
  { id: "best",       label: "Best 시술",          labelEn: "BEST",          labelJa: "ベスト施術",          labelZh: "精选项目",
    desc: "스타피부과에서 가장 많이 선택되는 대표 시술 프로그램입니다. 전문의가 직접 상담 후 피부 상태에 맞는 최적의 조합을 제안해 드립니다.",
    descEn: "The most popular treatment programs at Star Dermatology. Our specialists will recommend the optimal combination for your skin condition after a thorough consultation.",
    descJa: "スター皮膚科で最も多く選ばれる代表的な施術プログラムです。専門医が直接カウンセリングを行い、お肌の状態に合った最適な組み合わせをご提案します。",
    descZh: "星皮肤科最受欢迎的代表性治疗项目。专科医生亲自咨询后，为您推荐最适合您肤质的最佳组合方案。" },
  { id: "lifting",    label: "리프팅·탄력",        labelEn: "LIFTING",       labelJa: "リフティング・弾力",  labelZh: "提升·弹力",
    desc: "처진 피부와 볼륨 감소를 개선하는 비수술 리프팅 시술입니다. 울쎄라피·써마지 등 검증된 장비로 자연스럽고 지속적인 리프팅 효과를 제공합니다.",
    descEn: "Non-surgical lifting treatments to improve sagging skin and volume loss. Proven devices like Ultherapy and Thermage provide natural and lasting lifting effects.",
    descJa: "たるんだ肌とボリューム減少を改善する非手術リフティング施術です。ウルセラピー・サーマジなどの実証済み機器で自然で持続的なリフティング効果を提供します。",
    descZh: "改善皮肤松弛和容量减少的非手术提升治疗。使用Ultherapy、Thermage等经过验证的设备，提供自然持久的提升效果。" },
  { id: "eye",        label: "눈밑지방재배치",     labelEn: "EYE",           labelJa: "目の下の脂肪再配置", labelZh: "眼下脂肪重置",
    desc: "눈 아래 지방 탈출로 인한 애교살·다크서클·눈물고랑을 개선합니다. 최소 절개로 지방을 재배치하여 자연스럽고 생기 있는 눈매를 만들어 드립니다.",
    descEn: "Improves aegyo-sal, dark circles, and tear troughs caused by fat prolapse under the eyes. Minimal incision fat repositioning creates natural, vibrant eyes.",
    descJa: "目の下の脂肪脱出による涙袋・クマ・涙溝を改善します。最小切開で脂肪を再配置し、自然で生き生きとした目元を作ります。",
    descZh: "改善因眼下脂肪脱垂引起的卧蚕、黑眼圈和泪沟。通过最小切口重新定位脂肪，打造自然有神的眼部轮廓。" },
  { id: "vitiligo",   label: "백반증",             labelEn: "VITILIGO",      labelJa: "白斑症",              labelZh: "白癜风",
    desc: "피부 색소 소실로 인한 백반증을 전문적으로 치료합니다. 엑시머 레이저와 광선 치료를 병행하여 색소 재생을 유도합니다.",
    descEn: "Specialized treatment for vitiligo caused by loss of skin pigmentation. Combining excimer laser and phototherapy to stimulate pigment regeneration.",
    descJa: "皮膚の色素消失による白斑を専門的に治療します。エキシマレーザーと光線治療を併用して色素再生を促進します。",
    descZh: "专业治疗因皮肤色素脱失引起的白癜风。结合准分子激光和光线治疗，促进色素再生。" },
  { id: "pigment",    label: "색소·문신",           labelEn: "PIGMENT",       labelJa: "色素・タトゥー",      labelZh: "色素·纹身",
    desc: "기미, 잡티, 문신 등 색소 병변을 효과적으로 제거합니다. 피부 타입에 맞는 레이저를 선택하여 부작용 없이 깨끗한 피부를 되찾아 드립니다.",
    descEn: "Effectively removes pigmented lesions such as melasma, freckles, and tattoos. Restore clear skin without side effects by selecting the right laser for your skin type.",
    descJa: "シミ、そばかす、タトゥーなどの色素病変を効果的に除去します。肌タイプに合ったレーザーを選択して、副作用なくきれいな肌を取り戻します。",
    descZh: "有效去除黄褐斑、雀斑、纹身等色素病变。根据肤质选择合适的激光，无副作用地恢复净白肌肤。" },
  { id: "scar",       label: "흉터·모공",           labelEn: "SCAR",          labelJa: "傷跡・毛穴",          labelZh: "疤痕·毛孔",
    desc: "여드름 흉터, 수술 흉터, 넓어진 모공을 개선하는 시술입니다. 프락셀·CO2 레이저로 피부 재생을 촉진하여 매끄러운 피부결을 만들어 드립니다.",
    descEn: "Treatments to improve acne scars, surgical scars, and enlarged pores. Fraxel and CO2 lasers stimulate skin regeneration for smoother skin texture.",
    descJa: "ニキビ跡、手術跡、毛穴の開きを改善する施術です。フラクセル・CO2レーザーで皮膚再生を促進し、なめらかな肌質を作ります。",
    descZh: "改善痘疤、手术疤痕和毛孔粗大的治疗方案。通过飞梭激光、CO2激光促进皮肤再生，打造细腻肌肤。" },
  { id: "acne_laser", label: "여드름",              labelEn: "ACNE",          labelJa: "ニキビ",              labelZh: "痘痘",
    desc: "여드름 원인을 근본적으로 치료하는 복합 시술 프로그램입니다. 피지 분비 조절부터 염증 완화, 흉터 예방까지 단계별로 관리해 드립니다.",
    descEn: "A comprehensive treatment program that addresses the root causes of acne. Step-by-step management from sebum regulation to inflammation relief and scar prevention.",
    descJa: "ニキビの原因を根本的に治療する複合施術プログラムです。皮脂分泌調整から炎症緩和、瘢痕予防まで段階的に管理します。",
    descZh: "从根本上治疗痘痘原因的综合治疗方案。从皮脂分泌调节到消炎、预防疤痕，进行阶段性管理。" },
  { id: "rosacea",    label: "홍조·혈관",           labelEn: "ROSACEA",       labelJa: "紅潮・血管",          labelZh: "红肌·血管",
    desc: "얼굴 홍조, 실핏줄, 혈관 확장 등 혈관성 피부 고민을 해결합니다. 레이저 치료로 피부 톤을 균일하게 정돈해 드립니다.",
    descEn: "Resolves vascular skin concerns such as facial redness, broken capillaries, and dilated blood vessels. Laser treatment evens out skin tone.",
    descJa: "顔の紅潮、毛細血管拡張などの血管性肌悩みを解決します。レーザー治療で肌のトーンを均一に整えます。",
    descZh: "解决面部潮红、毛细血管扩张等血管性皮肤问题。通过激光治疗使肤色均匀。" },
  { id: "acne",       label: "액취증·다한증",       labelEn: "HYPERHIDROSIS", labelJa: "腋臭・多汗症",        labelZh: "腋臭·多汗症",
    desc: "겨드랑이 냄새(액취증)와 과도한 땀 분비(다한증)를 효과적으로 치료합니다. 보톡스 주사, 레이저 치료로 일상의 불편함을 해소해 드립니다.",
    descEn: "Effective treatment for axillary odor (bromhidrosis) and excessive sweating (hyperhidrosis). Botox injections and laser treatments relieve daily discomfort.",
    descJa: "わきが（アポクリン汗腺臭）と多汗症を効果的に治療します。ボトックス注射、レーザー治療で日常の不快感を解消します。",
    descZh: "有效治疗腋臭和多汗症。通过肉毒素注射和激光治疗，消除日常生活中的不适。" },
  { id: "fungus",     label: "손·발톱무좀",         labelEn: "NAIL FUNGUS",   labelJa: "爪水虫",              labelZh: "甲癣",
    desc: "주변 조직 손상 없이 곰팡이균만을 파괴하는 무좀 전용 레이저로 빠르고 간편하게 손·발톱무좀을 치료합니다.",
    descEn: "Fungal nail infection treated with a dedicated laser that destroys only the fungus without damaging surrounding tissue — fast and simple.",
    descJa: "周囲の組織を傷つけることなく真菌だけを破壊する爪水虫専用レーザーで、素早く簡単に爪水虫を治療します。",
    descZh: "使用专用激光在不损伤周围组织的情况下仅破坏真菌，快速简便地治疗甲癣（灰指甲）。" },
  { id: "psoriasis",  label: "건선·아토피",         labelEn: "PSORIASIS",     labelJa: "乾癬・アトピー",      labelZh: "银屑病·特应性",
    desc: "만성 염증성 피부 질환인 건선과 아토피를 체계적으로 관리합니다. 증상 완화와 재발 방지를 위한 맞춤형 치료 계획을 제공합니다.",
    descEn: "Systematic management of psoriasis and atopic dermatitis, chronic inflammatory skin diseases. Customized treatment plans for symptom relief and relapse prevention.",
    descJa: "慢性炎症性皮膚疾患である乾癬とアトピーを体系的に管理します。症状緩和と再発防止のための個別化された治療計画を提供します。",
    descZh: "系统管理银屑病和特应性皮炎等慢性炎症性皮肤病。提供个性化治疗方案，缓解症状并预防复发。" },
  { id: "volume",     label: "볼륨·부스터",         labelEn: "VOLUME",        labelJa: "ボリューム・ブースター", labelZh: "丰盈·提亮",
    desc: "피부 속 수분과 볼륨을 채워 생기 있는 피부를 만드는 시술입니다. 리쥴란·엑소좀 등 피부 재생 성분으로 탄력과 광채를 동시에 개선합니다.",
    descEn: "Treatments to fill skin with moisture and volume for a radiant complexion. Rejuran, exosomes, and other skin regeneration ingredients improve elasticity and glow simultaneously.",
    descJa: "肌の中に水分とボリュームを補充して生き生きとした肌を作る施術です。リジュランやエクソソームなどの皮膚再生成分で弾力と輝きを同時に改善します。",
    descZh: "为肌肤补充水分和丰盈度，打造充满活力的肌肤。通过婴儿针、外泌体等皮肤再生成分，同时改善弹力和光泽。" },
  { id: "botox",      label: "보톡스·필러",         labelEn: "BOTOX",         labelJa: "ボトックス・フィラー", labelZh: "肉毒素·填充",
    desc: "주름 개선과 얼굴 윤곽 교정에 효과적인 시술입니다. 자연스러운 결과를 위해 소량씩 정밀하게 시술하며, 당일 일상 복귀가 가능합니다.",
    descEn: "Effective treatments for wrinkle improvement and facial contouring. Precise micro-dosing for natural results with same-day return to daily activities.",
    descJa: "しわ改善と顔のライン矯正に効果的な施術です。自然な結果のために少量ずつ精密に施術し、当日日常復帰が可能です。",
    descZh: "有效改善皱纹和面部轮廓的治疗。精准微量注射，效果自然，当天即可恢复日常生活。" },
];

/** 카테고리 label 언어별 선택 헬퍼 */
export function getCatLabel(cat: Category, lang: string): string {
  if (lang === "en") return cat.labelEn;
  if (lang === "ja" && cat.labelJa) return cat.labelJa;
  if (lang === "zh" && cat.labelZh) return cat.labelZh;
  if (lang !== "ko" && cat.labelEn) return cat.labelEn;
  return cat.label;
}

/** 카테고리별 시술 카드 이미지 배경 색상 */
export const CAT_IMG_BG: Record<string, string> = {
  best:       "#EEF4FF",
  lifting:    "#F0FDF4",
  eye:        "#FFF7ED",
  rosacea:    "#FFFFFF",
  pigment:    "#F5F3FF",
  scar:       "#ECFDF5",
  volume:     "#FFFBEB",
  botox:      "#F0F9FF",
  acne:       "#FDF4FF",
  fungus:     "#F0FDFA",
  acne_laser: "#FFF0F0",
  vitiligo:   "#F0FFF4",
  psoriasis:  "#FFF8F0",
};

/** 카테고리별 탭 활성 텍스트 색상 */
export const CAT_TAB_TEXT: Record<string, string> = {
  best:       "#3730A3",
  lifting:    "#166534",
  eye:        "#9A3412",
  rosacea:    "#9F1239",
  pigment:    "#5B21B6",
  scar:       "#065F46",
  volume:     "#92400E",
  botox:      "#0C4A6E",
  acne:       "#6B21A8",
  fungus:     "#0F766E",
  acne_laser: "#B91C1C",
  vitiligo:   "#166534",
  psoriasis:  "#9A3412",
};

/** 상세 페이지가 있는 시술 slug 매핑 */
export const DETAIL_PAGE_SLUGS: Record<string, string> = {
  "울쎄라피 프라임": "ulthera",
  "써마지 FLX":     "thermage",
  "눈밑지방재배치": "under-eye-fat",
};

import type { TreatmentI18n } from "./index";
// [v6-FINAL] source of truth: CLINIC_STATS.eyeBagCases 단일 소스 참조
import { CLINIC_STATS } from "../../lib/constants";
const _n = CLINIC_STATS.eyeBagCases.toLocaleString("ko-KR"); // "4,000"

const CDN2 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB";

export const underEyeFat: TreatmentI18n = {
  slug: "under-eye-fat",
  nameEn: "Under-eye Fat Repositioning",

  name: {
    ko: "눈밑지방재배치",
    en: "Under-eye Fat Repositioning",
    ja: "目の下脂肪再配置",
    zh: "眼下脂肪重置术",
  },

  category: {
    ko: "눈밑·성형",
    en: "Under-eye & Contouring",
    ja: "目の下・形成",
    zh: "眼下·整形",
  },

  badge: {
    ko: "BEST",
    en: "BEST",
    ja: "BEST",
    zh: "BEST",
  },
  badgeColor: "#4A6FA5",

  image: "/manus-storage/treat-eyelid-new-6Qge5k6ndWTS5nFXDZSXRF_1bdb9103.webp",
  cardBannerImage: `${CDN2}/눈밑지방_4c0b8a51.png`,

  desc: {
    ko: `${_n}례 이상의 경험으로 다크서클과 눈밑 볼록함을 동시에 개선. 지방을 재배치하여 자연스러운 눈밑 라인을 만드는 스타피부과 대표 시술.`,
    en: `With over ${_n} cases of experience, this procedure simultaneously improves dark circles and under-eye puffiness by repositioning fat to create a natural under-eye contour — Star Dermatology's signature treatment.`,
    ja: `${_n}例以上の経験でクマと目の下のふくらみを同時に改善。脂肪を再配置して自然な目の下のラインを作るスター皮膚科の代表施術。`,
    zh: `凭借${_n}例以上的丰富经验，同时改善黑眼圈和眼下膨出。通过脂肪重置打造自然眼下轮廓，是STAR皮肤科的招牌施术。`,
  },

  detail: {
    ko: `눈밑지방재배치술은 눈 아래 과잉 축적된 지방을 제거하지 않고 꺼진 눈물고랑(tear trough) 부위로 재배치하여 다크서클과 눈밑 볼록함을 동시에 개선하는 시술입니다. 스타피부과는 ${_n}례 이상의 풍부한 시술 경험을 보유하고 있으며, 절개를 최소화하여 흉터 위험을 낮춥니다. 지방을 제거하지 않고 재배치하는 방식이므로 시술 후 지방 공동이나 외관 변형이 거의 없고, 자연스러운 눈밑 라인을 기대할 수 있습니다.`,
    en: `Under-eye fat repositioning does not remove excess fat beneath the eyes — instead, it repositions the fat into the sunken tear trough area to simultaneously improve dark circles and under-eye puffiness. Star Dermatology has performed over ${_n} cases and uses minimal incisions to reduce scarring risk. Because the fat is repositioned rather than removed, there is virtually no hollow appearance or contour deformity after the procedure, and a natural under-eye line can be expected.`,
    ja: `目の下脂肪再配置術は、目の下に過剰に蓄積した脂肪を除去せず、くぼんだ涙溝（ tear trough）部位に再配置することで、クマと目の下のふくらみを同時に改善する施術です。スター皮膚科は${_n}例以上の豊富な施術経験を持ち、切開を最小限に抑えて傷跡リスクを低減します。脂肪を除去せず再配置する方式のため、施術後の脂肪空洞や外観変形がほとんどなく、自然な目の下のラインが期待できます。`,
    zh: `眼下脂肪重置术并不切除眼下多余脂肪，而是将其重新填充至凹陷的泪沟区域，从而同时改善黑眼圈和眼下膨出。STAR皮肤科拥有${_n}例以上的丰富施术经验，采用最小化切口降低疤痕风险。由于是重置而非切除脂肪，术后几乎不会出现脂肪空洞或外观变形，可期待自然的眼下轮廓。`,
  },

  effect: {
    ko: "다크서클 개선, 눈밑 볼록함 해소, 눈물고랑 음영 완화, 자연스러운 눈밑 라인, 피로해 보이는 인상 개선",
    en: "Dark circle improvement, under-eye puffiness reduction, tear trough shadow reduction, natural under-eye contour, fresher and more rested appearance",
    ja: "クマの改善、目の下のふくらみ解消、涙溝の陰影緩和、自然な目の下のライン、疲れた印象の改善",
    zh: "改善黑眼圈、消除眼下膨出、淡化泪沟阴影、打造自然眼下轮廓、改善疲惫感",
  },

  caution: {
    ko: "시술 후 3~7일간 붓기와 멍이 나타날 수 있으며, 완전한 결과 확인까지 4~8주가 소요됩니다. 시술 후 1주일간 격렬한 운동과 음주를 피하고, 엎드려 자는 자세를 삼가세요. 눈을 비비거나 강하게 누르는 행동을 피하고, 선글라스 착용으로 자외선을 차단하세요.",
    en: "Swelling and bruising may occur for 3–7 days after the procedure, and full results may take 4–8 weeks to appear. Avoid strenuous exercise and alcohol for one week after treatment, and refrain from sleeping face-down. Avoid rubbing or pressing the eye area, and wear sunglasses to protect against UV exposure.",
    ja: "施術後3〜7日間、腫れやあざが現れることがあり、完全な結果の確認には4〜8週間かかります。施術後1週間は激しい運動と飲酒を避け、うつ伏せで寝る姿勢は控えてください。目をこすったり強く押したりする行動を避け、サングラスで紫外線を遮断してください。",
    zh: "术后3～7天可能出现肿胀和淤青，完整效果需4～8周才能显现。术后一周内避免剧烈运动和饮酒，不要俯卧睡眠。避免揉眼或用力按压眼部，佩戴墨镜防止紫外线照射。",
  },

  time: {
    ko: "30~60분",
    en: "30–60 min",
    ja: "30〜60分",
    zh: "30～60分钟",
  },

  recovery: {
    ko: "3~7일",
    en: "3–7 days",
    ja: "3〜7日",
    zh: "3～7天",
  },

  sessions: {
    ko: "1회 (반영구적 효과)",
    en: "1 session (semi-permanent results)",
    ja: "1回（半永久的な効果）",
    zh: "1次（半永久效果）",
  },

  youtubeUrl: "https://www.youtube.com/embed/Y2ia8A-nBjw",

  schemaBodyLocation: {
    ko: "눈밑, 눈물고랑",
    en: "Under-eye area, tear trough",
    ja: "目の下、涙溝",
    zh: "眼下区域、泪沟",
  },

  seoTitle: {
    ko: `눈밑지방재배치 | 부산 서면 스타피부과 - ${_n}례 이상 경험`,
    en: `Under-eye Fat Repositioning | Star Dermatology Seomyeon Busan – ${_n}+ Cases`,
    ja: `目の下脂肪再配置 | 釜山西面 スター皮膚科 – ${_n}例以上の経験`,
    zh: `眼下脂肪重置术 | 釜山西面 STAR 皮肤科 – ${_n}例以上经验`,
  },

  seoDescription: {
    ko: `부산 서면 스타피부과의 눈밑지방재배치 시술 안내. ${_n}례 이상의 풍부한 경험. 다크서클과 눈밑 볼록함을 동시에 개선하는 스타피부과 대표 시술. 피부과 전문의 직접 시술.`,
    en: `Under-eye fat repositioning at Star Dermatology, Seomyeon, Busan. Over ${_n} cases of experience. Star Dermatology's signature procedure that simultaneously improves dark circles and under-eye puffiness. Performed directly by board-certified dermatologists.`,
    ja: `釜山西面スター皮膚科の目の下脂肪再配置施術案内。${_n}例以上の豊富な経験。クマと目の下のふくらみを同時に改善するスター皮膚科の代表施術。皮膚科専門医が直接施術。`,
    zh: `釜山西面STAR皮肤科眼下脂肪重置术介绍。拥有${_n}例以上丰富经验。同时改善黑眼圈和眼下膨出的招牌施术，由皮肤科专科医生亲自操作。`,
  },

  seoKeywords: {
    ko: "눈밑지방재배치, 다크서클, 눈밑볼록, 눈물고랑, 부산피부과, 스타피부과, 서면피부과, 눈밑시술, 눈밑지방, 피부과전문의",
    en: "under-eye fat repositioning, dark circles, under-eye puffiness, tear trough, Busan dermatology, Star Dermatology, Seomyeon clinic, eye treatment, board-certified dermatologist",
    ja: "目の下脂肪再配置, クマ, 目の下のふくらみ, 涙溝, 釜山皮膚科, スター皮膚科, 西面皮膚科, 目の下施術, 皮膚科専門医",
    zh: "眼下脂肪重置, 黑眼圈, 眼下膨出, 泪沟, 釜山皮肤科, STAR皮肤科, 西面皮肤科, 眼下施术, 皮肤科专科医生",
  },

  faq: {
    ko: [
      { question: "눈밑지방재배치 시술 시간은 얼마나 걸리나요?", answer: "보통 30~60분 정도 소요됩니다. 국소마취 후 진행하므로 통증은 최소화됩니다." },
      { question: "눈밑지방재배치 회복 기간은 얼마나 되나요?", answer: "시술 후 3~7일간 붓기와 멍이 나타날 수 있습니다. 완전한 결과 확인까지는 4~8주가 소요됩니다." },
      { question: "눈밑지방재배치 효과는 얼마나 지속되나요?", answer: "지방을 재배치하는 방식이므로 반영구적인 효과를 기대할 수 있습니다. 노화에 따른 변화는 있을 수 있습니다." },
      { question: "눈밑지방재배치와 필러의 차이는 무엇인가요?", answer: "필러는 임시적인 볼륨 보충이지만, 눈밑지방재배치는 자신의 지방을 활용하므로 더 자연스럽고 반영구적인 효과를 얻을 수 있습니다." },
    ],
    en: [
      { question: "How long does under-eye fat repositioning take?", answer: "The procedure typically takes 30–60 minutes. Local anesthesia is used to minimize discomfort." },
      { question: "What is the recovery time for under-eye fat repositioning?", answer: "Swelling and bruising may occur for 3–7 days after the procedure. Full results can be assessed after 4–8 weeks." },
      { question: "How long do the results last?", answer: "Because fat is repositioned rather than removed, the results are semi-permanent. Some changes may occur naturally with aging." },
      { question: "What is the difference between under-eye fat repositioning and filler?", answer: "Filler provides temporary volume, while fat repositioning uses your own fat for a more natural and semi-permanent result." },
    ],
    ja: [
      { question: "目の下脂肪再配置の施術時間はどのくらいですか？", answer: "通常30〜60分程度かかります。局所麻酔を使用するため、痛みは最小限です。" },
      { question: "目の下脂肪再配置の回復期間はどのくらいですか？", answer: "施術後3〜7日間、腫れやあざが現れることがあります。完全な結果の確認には4〜8週間かかります。" },
      { question: "目の下脂肪再配置の効果はどのくらい続きますか？", answer: "脂肪を再配置する方式のため、半永久的な効果が期待できます。加齢による変化は生じることがあります。" },
      { question: "目の下脂肪再配置とフィラーの違いは何ですか？", answer: "フィラーは一時的なボリューム補充ですが、脂肪再配置は自分の脂肪を活用するため、より自然で半永久的な効果が得られます。" },
    ],
    zh: [
      { question: "眼下脂肪重置术需要多长时间？", answer: "通常需要30～60分钟。采用局部麻醉，将疼痛降至最低。" },
      { question: "眼下脂肪重置术的恢复期是多久？", answer: "术后3～7天可能出现肿胀和淤青。完整效果需4～8周才能评估。" },
      { question: "眼下脂肪重置术的效果能持续多久？", answer: "由于是重置而非切除脂肪，效果为半永久性。随着年龄增长可能会有自然变化。" },
      { question: "眼下脂肪重置术与填充剂有什么区别？", answer: "填充剂是临时性的容量补充，而脂肪重置术利用自身脂肪，效果更自然且为半永久性。" },
    ],
  },
};

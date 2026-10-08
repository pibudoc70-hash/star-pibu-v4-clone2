import type { Lang } from "@/lib/i18n";

export type ThermageFlxPresentation = {
  heroTitle: string;
  heroDescription: string;
  trustTitles: readonly [string, string, string];
  trustSubtitles: readonly [string, string, string];
  whatParagraph: string;
  transferFeatures: readonly [string, string, string];
  collagenTitle: string;
  collagenLabels: readonly [string, string, string];
  collagenIntro: string;
  tipTitle: string;
  tipsIntro: string;
  tipDescriptions: readonly [string, string];
  painTitle: string;
  painParagraphs: readonly [string, string];
  combinationTitle: string;
  combinationIntro: string;
  combinationBadges: readonly [string, string, string, string, string];
  combinationDescriptions: readonly [string, string, string, string, string];
  recommendTitle: string;
  starTitle: string;
  starIntro: string;
  strengths: readonly [string, string, string, string];
  certificationHeading: string;
  certificationDescription: string;
  adviserHeadline: string;
  adviserDescription: string;
};

export const THERMAGE_FLX_PRESENTATION: Record<Lang, ThermageFlxPresentation> = {
  "ko": {
    "heroTitle": "4세대에 걸친 진화된 써마지 FLX로 리프팅을 넘어 강력한 타이트닝 효과까지",
    "heroDescription": "부산 서면 스타피부과에서 정품 써마지 FLX를 경험하세요!",
    "trustTitles": [
      "써마지 FLX 정품팁",
      "FDA & MFDS 승인",
      "피부과 전문의 진료"
    ],
    "trustSubtitles": [
      "100% 정품팁만 사용",
      "장비 관련 허가 정보",
      "믿고 안전하게 !"
    ],
    "whatParagraph": "미국 FDA 승인을 받은 솔타사의 단극성 고주파 장비로 기존 3세대에서 진화한 써마지 FLX는 고주파 열에너지를 이용해 피부 진피층 콜라겐 섬유의 변성 및 수축을 일으켜 콜라겐 재생 및 탄력, 주름 개선 효과를 나타냅니다.",
    "transferFeatures": [
      "더 커진 토탈팁으로 시술은 더 빠르게! 효과부위는 더 넓게!",
      "최적화된 에너지를 전달하는 알고리즘 기술로 효과적",
      "쿨링 펄스 기술로 적은 통증으로 편안한 시술 경험"
    ],
    "collagenTitle": "콜라겐 재생 촉진과 리프팅을 동시에!",
    "collagenLabels": [
      "늘어진 콜라겐",
      "고주파 에너지 전달",
      "콜라겐 재생 촉진"
    ],
    "collagenIntro": "표피를 냉각시키고 진피 조직에 열을 발생시키는 원리를 사용해 고주파 에너지를 전달함으로써 콜라겐 섬유의 변성 및 수축을 일으켜 콜라겐 재생이 이루어지면서 피부 탄력 개선에 도움을 줍니다.",
    "tipTitle": "얼굴부터 눈가주름까지 부위별 집중 케어",
    "tipsIntro": "보통 눈가 주변은 피부가 얇고 예민하여서 시술하기가 힘든데, 써마지 FLX는 아이 전용팁이 있어 눈가주름도 필 수 있으며, 토탈팁은 얼굴에 빠르게 시술 가능합니다.",
    "tipDescriptions": [
      "기존 써마지 팁 3.0㎠ 크기보다 큰 4.0㎠ 크기로 업그레이드되어 25% 더 빠른 시술 속도를 제공합니다.",
      "눈가 미세 부위까지 정밀하고 섬세하게 적용하여 눈가 피부처짐, 다크서클을 개선합니다."
    ],
    "painTitle": "써마지 FLX, 통증때문에 고민이라면?",
    "painParagraphs": [
      "스타피부과는 통증케어 시스템(마취크림, 국소마취주사)을 통해 통증을 줄이고, 보다 통증에 민감하신 경우 선택적인 수면마취 시스템까지 제공하고 있어 높은 효율의 편안한 시술이 가능합니다.",
      "특히 수면마취는 시술 통증을 줄이고, 환자의 긴장감과 불안함을 해소하여 편안한 상태에서 시술 받을 수 있다는 장점이 있습니다."
    ],
    "combinationTitle": "써마지 FLX와 함께하면 좋은 시술",
    "combinationIntro": "피부타입, 연령, 성별에 맞춰 써마지 FLX의 만족도를 높이는 파워 부스팅 시술로 확실한 리프팅 효과를 경험해보세요.",
    "combinationBadges": [
      "BEST",
      "인기",
      "",
      "",
      ""
    ],
    "combinationDescriptions": [
      "고주파와 초음파 장비의 특성을 함께 고려해 피부 상태와 관리 목표에 맞춰 상담할 수 있는 조합",
      "피부 고민과 예산, 관리 범위를 함께 고려해 상담할 수 있는 리프팅 조합",
      "이중턱·심부볼·볼 처짐 등 고민 부위를 바탕으로 상담할 수 있는 복합 관리 조합",
      "피부 컨디션과 관리 목표에 따라 함께 고려할 수 있는 피부 탄력·컨디션 관리 조합",
      "피부결과 표정 주름 등 개별적인 피부 고민을 함께 상담할 수 있는 조합"
    ],
    "recommendTitle": "써마지 FLX, 이런 분께 추천합니다",
    "starTitle": "당신의 소중한 젊음, 스타피부과가 돌려드립니다.",
    "starIntro": "스타피부과는 개인별 피부 타입과 얼굴형에 맞춰 시술 층의 깊이, 샷수, 부위 등 한 샷 한 샷 신중하게 시술하여 가장 아름다운 얼굴선을 이끌어 냅니다.",
    "strengths": [
      "대한민국 의사의 단 2% 피부과전문의",
      "대학병원 교수출신, 20년 이상의 시술 경험",
      "1:1 체계적인 맞춤 플랜 리프팅",
      "써마지 FLX 외 리프팅 장비 다수 보유"
    ],
    "certificationHeading": "스타피부과는 써마지 FLX 정품팁을 사용합니다.",
    "certificationDescription": "스타피부과는 미국 식품의약국(FDA)와 한국 식약처(MFDS)의 승인을 받은 써마지 FLX 장비와 정품팁을 사용하고 있습니다. 써마지 FLX 시술 팁은 한 분에게만 제공되는 1회용 소모품으로써 식품의약품안전처 허가받은 정품팁을 사용하는지 반드시 확인하셔야 합니다.",
    "adviserHeadline": "스타피부과 조시형 원장님은 써마지 FLX 본사에서 공식인증한 써마지 FLX 임상자문의입니다.",
    "adviserDescription": "풍부한 임상 경험과 실력 차이를 바탕으로 써마지 FLX 시술을 통해 만족스러운 시술 경험을 제공하고 있습니다."
  },
  "en": {
    "heroTitle": "With the evolution of fourth-generation Thermage FLX, experience not only lifting but also more intensive skin tightening",
    "heroDescription": "Experience authentic Thermage FLX at STAR Dermatology in Seomyeon, Busan.",
    "trustTitles": [
      "Authentic Thermage FLX Tips",
      "FDA & MFDS Approval",
      "Dermatologist Care"
    ],
    "trustSubtitles": [
      "Only 100% authentic tips are used",
      "Device approval information",
      "Care you can trust, with safety in mind"
    ],
    "whatParagraph": "Thermage FLX, an advancement of the previous third-generation system, is a monopolar radiofrequency device by Solta that has received U.S. FDA approval. It uses radiofrequency thermal energy to induce denaturation and contraction of collagen fibers in the dermis, supporting collagen regeneration and improvements in skin elasticity and wrinkles.",
    "transferFeatures": [
      "The larger Total Tip enables faster treatment over a broader area.",
      "Algorithm technology designed to deliver optimized energy.",
      "Cooling-pulse technology for a more comfortable treatment experience with less discomfort."
    ],
    "collagenTitle": "Support Collagen Regeneration and Lifting at the Same Time",
    "collagenLabels": [
      "Lax collagen",
      "Radiofrequency energy delivery",
      "Support for collagen regeneration"
    ],
    "collagenIntro": "Radiofrequency energy is delivered using a principle that cools the epidermis while generating heat in dermal tissue. This induces denaturation and contraction of collagen fibers, supporting collagen regeneration and helping improve skin elasticity.",
    "tipTitle": "Focused Care by Area, from the Face to Wrinkles Around the Eyes",
    "tipsIntro": "The skin around the eyes is typically thin and sensitive, making treatment more challenging. Thermage FLX includes a dedicated Eye Tip, which can be used to address wrinkles around the eyes, while the Total Tip enables treatment of the face more quickly.",
    "tipDescriptions": [
      "Upgraded from the 3.0 cm² size of the previous Thermage Tip to 4.0 cm², it provides a treatment speed that is 25% faster.",
      "It can be applied precisely and delicately to fine areas around the eyes to improve sagging skin around the eyes and dark circles."
    ],
    "painTitle": "Concerned About Discomfort with Thermage FLX?",
    "painParagraphs": [
      "STAR Dermatology offers a pain-management system, including topical anesthetic cream and local anesthetic injections, to help reduce discomfort. For individuals who are especially sensitive to pain, optional sedation is also available to support a more comfortable treatment experience.",
      "In particular, sedation may help reduce treatment-related discomfort and ease a patient’s tension and anxiety, allowing treatment to be performed in a more relaxed state."
    ],
    "combinationTitle": "Treatments That Pair Well with Thermage FLX",
    "combinationIntro": "Experience a more targeted lifting approach through power-boosting treatments designed to enhance satisfaction with Thermage FLX according to skin type, age, and sex.",
    "combinationBadges": [
      "BEST",
      "Popular",
      "",
      "",
      ""
    ],
    "combinationDescriptions": [
      "A combination that can be discussed by considering the characteristics of radiofrequency and ultrasound devices in relation to skin condition and care goals.",
      "A lifting combination that can be discussed with skin concerns, budget, and treatment scope in mind.",
      "A combined-care option that can be discussed based on concerns such as a double chin, deep cheek area, or cheek laxity.",
      "A combination that can be considered according to skin condition and goals for skin firmness and skin-condition care.",
      "A combination that can be discussed for individual skin concerns, such as skin texture and expression lines."
    ],
    "recommendTitle": "Thermage FLX Is Recommended for These Individuals",
    "starTitle": "STAR Dermatology Helps Restore Your Precious Youth",
    "starIntro": "STAR Dermatology carefully plans every shot—including treatment depth, number of shots, and areas treated—according to each individual’s skin type and facial shape, to create the most balanced facial contours.",
    "strengths": [
      "Dermatology specialists represent only 2% of physicians in South Korea",
      "Former university hospital professor with more than 20 years of treatment experience",
      "Systematic one-to-one customized lifting plans",
      "A wide range of lifting devices in addition to Thermage FLX"
    ],
    "certificationHeading": "STAR Dermatology Uses Authentic Thermage FLX Tips.",
    "certificationDescription": "Thermage FLX treatment tips are single-use consumables provided for one person only. Please ensure that an authentic tip approved by the Ministry of Food and Drug Safety is being used.",
    "adviserHeadline": "Dr. Cho Si-hyung of STAR Dermatology is an officially certified Thermage FLX clinical advisor.",
    "adviserDescription": "With extensive clinical experience, STAR Dermatology provides carefully planned Thermage FLX treatment."
  },
  "ja": {
    "heroTitle": "第4世代へと進化したThermage FLXで、リフティングを超えた力強いタイトニング効果まで",
    "heroDescription": "釜山・西面のSTAR皮膚科で、正規品のThermage FLXをご体験ください！",
    "trustTitles": [
      "Thermage FLX正規チップ",
      "FDA・MFDS承認",
      "皮膚科専門医による診療"
    ],
    "trustSubtitles": [
      "100%正規チップのみを使用",
      "機器に関する許可情報",
      "安心・安全に！"
    ],
    "whatParagraph": "米国FDAの承認を受けたSolta社製のモノポーラ高周波機器であり、第3世代から進化したThermage FLXは、高周波の熱エネルギーを用いて皮膚真皮層のコラーゲン線維に変性・収縮を生じさせ、コラーゲンの再生を促し、肌の弾力およびしわの改善効果を示します。",
    "transferFeatures": [
      "より大きくなったトータルチップで、施術はよりスピーディーに、効果部位はより広く！",
      "最適化されたエネルギーを届けるアルゴリズム技術で効果的に",
      "クーリングパルス技術により、痛みに配慮した快適な施術体験"
    ],
    "collagenTitle": "コラーゲン再生の促進とリフティングを同時に！",
    "collagenLabels": [
      "たるんだコラーゲン",
      "高周波エネルギーの伝達",
      "コラーゲン再生の促進"
    ],
    "collagenIntro": "表皮を冷却し、真皮組織に熱を発生させる原理を用いて高周波エネルギーを伝達することで、コラーゲン線維に変性・収縮を生じさせます。コラーゲンの再生が促され、肌の弾力改善に役立ちます。",
    "tipTitle": "顔から目元のしわまで、部位別の集中ケア",
    "tipsIntro": "一般に目元は皮膚が薄くデリケートなため施術が難しい部位ですが、Thermage FLXには目元専用チップがあり、目元のしわにも対応できます。トータルチップは顔にスピーディーに施術できます。",
    "tipDescriptions": [
      "従来のThermageチップの3.0cm²より大きい4.0cm²にアップグレードされ、施術速度を25%向上させます。",
      "目元の細かな部位まで精密かつ繊細に適用し、目元の皮膚のたるみやダークサークルを改善します。"
    ],
    "painTitle": "Thermage FLX、痛みが気になってお悩みの方へ",
    "painParagraphs": [
      "STAR皮膚科では、痛みケアシステム（麻酔クリーム、局所麻酔注射）を通じて痛みを軽減し、特に痛みに敏感な方には選択的な鎮静麻酔システムも提供しているため、より効率的で快適な施術が可能です。",
      "特に鎮静麻酔は、施術時の痛みを軽減し、患者様の緊張や不安を和らげることで、リラックスした状態で施術を受けられるという利点があります。"
    ],
    "combinationTitle": "Thermage FLXとあわせるとよい施術",
    "combinationIntro": "肌タイプ、年齢、性別に合わせてThermage FLXの満足度を高めるパワーブースティング施術で、リフティング効果をご体験ください。",
    "combinationBadges": [
      "BEST",
      "人気",
      "",
      "",
      ""
    ],
    "combinationDescriptions": [
      "高周波と超音波機器の特性をあわせて考慮し、肌状態とケア目標に合わせて相談できる組み合わせ",
      "肌悩み、予算、ケア範囲を総合的に考慮して相談できるリフティングの組み合わせ",
      "二重あご・頬の深部・頬のたるみなどの悩み部位をもとに相談できる複合ケアの組み合わせ",
      "肌コンディションとケア目標に応じてあわせて検討できる、肌のハリ・コンディションケアの組み合わせ",
      "肌理や表情じわなど、個別の肌悩みをあわせて相談できる組み合わせ"
    ],
    "recommendTitle": "Thermage FLX、このような方におすすめです",
    "starTitle": "あなたの大切な若々しさを、STAR皮膚科がサポートします。",
    "starIntro": "STAR皮膚科では、お一人おひとりの肌質と顔立ちに合わせて、施術層の深さ、ショット数、部位などを1ショットずつ慎重に計画し、より美しいフェイスラインを目指します。",
    "strengths": [
      "韓国の医師のうちわずか2%の皮膚科専門医",
      "大学病院の元教授、20年以上の施術経験",
      "1対1の体系的なオーダーメイド・リフティングプラン",
      "Thermage FLXをはじめ、多数のリフティング機器を保有"
    ],
    "certificationHeading": "STAR皮膚科ではThermage FLXの正規チップを使用しています。",
    "certificationDescription": "Thermage FLXの施術チップは、お一人のみに提供される使い捨ての消耗品です。食品医薬品安全処の許可を受けた正規チップが使用されているか、必ずご確認ください。",
    "adviserHeadline": "STAR皮膚科のチョ・シヒョン院長は、Thermage FLX本社が公式認定したThermage FLX臨床顧問です。",
    "adviserDescription": "豊富な臨床経験をもとに、Thermage FLXの施術を丁寧にご提供しています。"
  },
  "zh": {
    "heroTitle": "历经四代演进的Thermage FLX，不仅支持提拉管理，更可带来强效紧致体验",
    "heroDescription": "欢迎在釜山西面STAR皮肤科体验原装Thermage FLX！",
    "trustTitles": [
      "Thermage FLX原装治疗头",
      "FDA与MFDS批准",
      "皮肤科专科医师诊疗"
    ],
    "trustSubtitles": [
      "仅使用100%原装治疗头",
      "设备相关许可信息",
      "安心、安全"
    ],
    "whatParagraph": "Thermage FLX是索塔公司（Solta）获美国FDA批准的单极射频设备，相较于原有第三代进一步升级。其利用射频热能使皮肤真皮层的胶原纤维发生变性和收缩，促进胶原再生，并有助于改善皮肤弹性和皱纹。",
    "transferFeatures": [
      "采用更大的全效治疗头，治疗更快，覆盖范围更广！",
      "通过优化能量传递的算法技术进行有效管理",
      "采用冷却脉冲技术，帮助减少疼痛并带来更舒适的治疗体验"
    ],
    "collagenTitle": "促进胶原再生与提拉，同时进行！",
    "collagenLabels": [
      "松弛的胶原纤维",
      "传递射频能量",
      "促进胶原再生"
    ],
    "collagenIntro": "通过传递射频能量，运用冷却表皮并在真皮组织产生热能的原理，使胶原纤维发生变性和收缩，促进胶原再生，并有助于改善皮肤弹性。",
    "tipTitle": "从面部到眼周细纹，按部位进行重点护理",
    "tipsIntro": "眼周皮肤通常较薄且敏感，治疗较为困难；Thermage FLX配有眼周专用治疗头，可用于眼周细纹管理，而全效治疗头则可快速用于面部治疗。",
    "tipDescriptions": [
      "相较于原有Thermage治疗头3.0cm²，已升级为更大的4.0cm²，可提供快25%的治疗速度。",
      "可精确、细致地应用于眼周等微小部位，以改善眼周皮肤松弛和黑眼圈。"
    ],
    "painTitle": "如果您因Thermage FLX的疼痛而犹豫？",
    "painParagraphs": [
      "STAR皮肤科通过疼痛管理系统（麻醉膏、局部麻醉注射）帮助减轻疼痛；对于对疼痛更敏感者，也可提供选择性的镇静麻醉管理，以便在更舒适的状态下进行治疗。",
      "尤其是镇静麻醉有助于减少治疗疼痛，并缓解紧张与不安，使治疗可在更舒适的状态下进行。"
    ],
    "combinationTitle": "适合与Thermage FLX搭配考虑的治疗",
    "combinationIntro": "可根据皮肤类型、年龄和性别，结合有助于提升Thermage FLX满意度的强化治疗，体验更有针对性的提拉管理。",
    "combinationBadges": [
      "BEST",
      "热门",
      "",
      "",
      ""
    ],
    "combinationDescriptions": [
      "可结合射频与超声设备的特点，并根据皮肤状态和管理目标进行咨询的组合。",
      "可综合皮肤困扰、预算和管理范围进行咨询的提拉组合。",
      "可根据双下巴、深层面颊、面颊松弛等困扰部位进行咨询的复合管理组合。",
      "可根据皮肤状况及紧致、肤况管理目标一同考虑的组合。",
      "可一同咨询肤质、表情纹等个体化皮肤困扰的组合。"
    ],
    "recommendTitle": "Thermage FLX，推荐给以下人群",
    "starTitle": "您珍贵的年轻状态，STAR皮肤科助您重拾。",
    "starIntro": "STAR皮肤科会依据每位顾客的皮肤类型和脸型，谨慎规划治疗层次深度、发数和部位等细节，以每一发为单位细致施治，帮助呈现更优美的面部轮廓线条。",
    "strengths": [
      "仅占韩国医生2%的皮肤科专科医师",
      "曾任大学医院教授，拥有20年以上治疗经验",
      "一对一系统化个性化提拉方案",
      "除Thermage FLX外，配备多种提拉设备"
    ],
    "certificationHeading": "STAR皮肤科使用Thermage FLX原装治疗头。",
    "certificationDescription": "Thermage FLX治疗头为仅供一位顾客使用的一次性耗材；请务必确认所使用的是经韩国食品药品安全处许可的原装治疗头。",
    "adviserHeadline": "STAR皮肤科曹时亨院长是经Thermage FLX总部官方认证的Thermage FLX临床顾问。",
    "adviserDescription": "凭借丰富的临床经验，STAR皮肤科提供审慎规划的Thermage FLX治疗。"
  },
  "zh-TW": {
    "heroTitle": "歷經四代演進的Thermage FLX，不僅著重拉提，也提供強效緊實管理",
    "heroDescription": "歡迎在釜山西面STAR皮膚科體驗原廠Thermage FLX！",
    "trustTitles": [
      "Thermage FLX原廠探頭",
      "FDA・MFDS核准",
      "皮膚科專科醫師診療"
    ],
    "trustSubtitles": [
      "僅使用100%原廠探頭",
      "設備相關核准資訊",
      "安心接受療程！"
    ],
    "whatParagraph": "Thermage FLX為Solta公司經美國FDA核准的單極射頻設備，較既有第三代機型進化；其利用射頻熱能使皮膚真皮層的膠原纖維產生變性與收縮，促進膠原蛋白再生，有助於改善肌膚彈性與皺紋。",
    "transferFeatures": [
      "升級加大的全效探頭，療程更快速、涵蓋範圍更廣！",
      "透過傳遞最佳化能量的演算法技術，提供有效的能量傳遞",
      "冷卻脈衝技術有助於減少不適感，提供較舒適的療程體驗"
    ],
    "collagenTitle": "同步促進膠原蛋白再生與拉提！",
    "collagenLabels": [
      "鬆弛的膠原蛋白",
      "傳遞射頻能量",
      "促進膠原蛋白再生"
    ],
    "collagenIntro": "藉由冷卻表皮並於真皮組織產生熱能的原理傳遞射頻能量，使膠原纖維產生變性與收縮，並在膠原蛋白再生的過程中，有助於改善肌膚彈性。",
    "tipTitle": "從臉部到眼周細紋，依部位進行集中照護",
    "tipsIntro": "眼周肌膚通常較薄且敏感，療程施作較具挑戰性；Thermage FLX配有眼周專用探頭，可用於眼周細紋照護，全效探頭則可快速施作於臉部。",
    "tipDescriptions": [
      "由既有Thermage探頭的3.0cm²升級為更大的4.0cm²，提供快25%的療程速度。",
      "可精準、細緻地施作於眼周微小部位，以改善眼周肌膚鬆弛及黑眼圈問題。"
    ],
    "painTitle": "若您因Thermage FLX的疼痛問題而猶豫？",
    "painParagraphs": [
      "STAR皮膚科透過疼痛照護系統（麻醉藥膏、局部麻醉注射）協助減少療程中的不適；對疼痛較敏感者，亦可諮詢是否適合選擇舒眠麻醉。",
      "尤其舒眠麻醉可協助減輕療程疼痛、緩和緊張與不安，讓受療者在較放鬆的狀態下接受療程。"
    ],
    "combinationTitle": "適合與Thermage FLX搭配考量的療程",
    "combinationIntro": "可依膚質、年齡與性別，透過提升Thermage FLX療程滿意度的強效加強療程，體驗明確的拉提效果。",
    "combinationBadges": [
      "BEST",
      "熱門",
      "",
      "",
      ""
    ],
    "combinationDescriptions": [
      "可結合射頻與超音波設備的特性，並依膚況與管理目標進行諮詢的組合。",
      "可一併考量肌膚困擾、預算與管理範圍進行諮詢的拉提組合。",
      "可根據雙下巴、深層臉頰或雙頰鬆弛等困擾部位進行諮詢的複合管理組合。",
      "可依膚況與管理目標，一併考量肌膚彈性及膚況管理的組合。",
      "可一併諮詢膚質、表情紋等個別肌膚困擾的組合。"
    ],
    "recommendTitle": "Thermage FLX，推薦給這樣的您",
    "starTitle": "您珍貴的青春，由STAR皮膚科為您重現。",
    "starIntro": "STAR皮膚科依個人膚質與臉型，針對療程層次深度、發數與部位等項目逐發審慎施作，勾勒出更美麗的臉部線條。",
    "strengths": [
      "僅占韓國醫師2%的皮膚科專科醫師",
      "曾任大學醫院教授，擁有20年以上療程經驗",
      "一對一系統化客製拉提規劃",
      "除Thermage FLX外，亦備有多種拉提設備"
    ],
    "certificationHeading": "STAR皮膚科使用Thermage FLX原廠探頭。",
    "certificationDescription": "Thermage FLX療程探頭為僅供一人使用的一次性耗材，請務必確認所使用的是經食品醫藥品安全處核准的原廠探頭。",
    "adviserHeadline": "STAR皮膚科趙時享院長為經Thermage FLX原廠官方認證的Thermage FLX臨床顧問。",
    "adviserDescription": "憑藉豐富的臨床經驗，STAR皮膚科提供審慎規劃的Thermage FLX療程。"
  }
};

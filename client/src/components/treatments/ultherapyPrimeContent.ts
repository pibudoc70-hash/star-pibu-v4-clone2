import type { Lang } from "@/lib/i18n";

export type UltherapyPrimeCopy = {
  trustTitles: readonly [string, string, string];
  trustSubtitles: readonly [string, string, string];
  heroTitle: string;
  heroDescription: string;
  whatTitle: string;
  whatParagraphs: readonly [string, string];
  depthTitle: string;
  depthText: string;
  authTitle: string;
  authParagraphs: readonly [string, string];
  authCaption: string;
  collagenTitle: string;
  collagenStages: readonly [string, string, string];
  collagenNote: string;
  processTitle: string;
  processDescriptions: readonly [string, string, string];
  processNote: string;
  painTitle: string;
  painOptions: readonly [string, string, string];
  painParagraphs: readonly [string, string];
  shortsTitle: string;
  combinationTitle: string;
  combinationTitles: readonly [string, string, string, string, string];
  combinationBadges: readonly [string, string, string, string, string];
  combinationDescriptions: readonly [string, string, string, string, string];
  recommendTitle: string;
  recommendations: readonly [string, string, string, string, string];
  areasCaption: string;
  starTitle: string;
  starIntro: string;
  strengths: readonly [string, string, string, string];
  certificationTitle: string;
  certificationText: string;
  shortsAriaLabel: string;
  playVideoLabel: string;
  qaTitle: string;
  watchYoutubeLabel: string;
};

export const ULTHERAPY_PRIME_COPY: Record<Lang, UltherapyPrimeCopy> = {
  ko: {
    trustTitles: ["정품 인증 병원", "FDA 승인", "피부과전문의 시술"],
    trustSubtitles: ["정품 울쎄라피 사용", "특허받은 단독기술", "믿고 안전하게!"],
    heroTitle: "한 번의 시술로 최대 1년, 안전하고 확실하게 끌어올리는 리프팅",
    heroDescription: "부산 서면 스타피부과에서, 정품 울쎄라피 프라임을 경험하세요",
    whatTitle: "울쎄라피 프라임은 어떤 시술인가요?",
    whatParagraphs: [
      "울쎄라피 프라임은 피부 표면의 손상 없이 피부 속 조직에 고강도 초음파 에너지를 전달하여 피부 속 콜라겐을 변성·수축시키고, 새로운 콜라겐을 생성시키는 리프팅 시술입니다.",
      "고강도 집속 초음파 에너지를 콜라겐 재생에 최적인 온도(60~70℃)로 피부 속에 조사하여, 피부 속 약 1mm 이하의 열 응고점(TCP)을 생성합니다.",
    ],
    depthTitle: "피부층별 깊이를 정밀하게",
    depthText: "울쎄라피 프라임은 서로 다른 종류의 트랜스듀서로 피부층별 깊이(1.5mm·3.0mm·4.5mm)에 초음파 에너지를 균일하게 전달합니다.",
    authTitle: "정품 울쎄라피 프라임 중요한 이유",
    authParagraphs: [
      "초음파 리프팅 시술의 효과를 제대로 경험하기 위해서는 꼭 정품 울쎄라피 프라임으로 시술받아야 합니다. 정품 팁이 아닌 경우 피부층에 적정 에너지가 전달되지 않거나 피부와 밀착이 잘 되지 않아 리프팅 효과 저하는 물론 화상의 위험이 있을 수 있습니다.",
      "정품 팁은 60~70℃의 열을 정밀하게 전달하도록 설계된 특허받은 단독 기술입니다.",
    ],
    authCaption: "정품 팁에서 초음파 에너지를 사용해 60~70℃의 열을 정밀하게 전달",
    collagenTitle: "콜라겐이 재생되는 과정",
    collagenStages: ["약화된 콜라겐으로 처진 피부", "울쎄라피 시술 중", "촉진된 콜라겐으로 팽팽한 피부"],
    collagenNote: "내 피부 속의 노화된 콜라겐은 점차적으로 재생되고, 건강한 콜라겐이 더 생겨나면서 리프팅 효과가 지속되고 유지될 수 있습니다.",
    processTitle: "3단계 시술 프로세스",
    processDescriptions: ["피부 속 조직층을 실시간으로 정확히 확인", "개개인의 피부 상태에 따라 맞춤 시술 계획 수립", "섬세하고 정확하게 시술"],
    processNote: "같은 시술이라도 피부 상태에 따라 달라야 하기에, 피부 깊이와 상태를 확인해 개인별 맞춤 시술을 진행합니다.",
    painTitle: "울쎄라피 프라임, 통증 때문에 고민이라면?",
    painOptions: ["마취크림", "국소마취주사", "수면마취"],
    painParagraphs: [
      "스타피부과는 통증케어 시스템(마취크림, 국소마취주사)을 통해 통증을 줄이고, 보다 통증에 민감하신 경우 선택적인 수면마취 시스템까지 제공하고 있어 높은 효율의 편안한 시술이 가능합니다.",
      "특히 수면마취는 시술 통증을 줄이고, 환자의 긴장감과 불안함을 해소하여 편안한 상태에서 시술받을 수 있다는 장점이 있습니다.",
    ],
    shortsTitle: "울쎄라피 프라임 영상으로 만나보세요",
    combinationTitle: "울쎄라피 프라임과 함께하면 좋은 시술",
    combinationTitles: ["울쎄라피 프라임 + 써마지 FLX", "울쎄라피 프라임\n+ 세르프", "울쎄라피 프라임 + 온다 + 브이로", "울쎄라피 프라임 + 루메니스원 + 리쥬란", "울쎄라피 프라임 + 스킨보톡스"],
    combinationBadges: ["BEST", "인기", "", "", ""],
    combinationDescriptions: [
      "초음파로 피부 속 콜라겐을, 고주파로 피부 겉 탄력섬유를 동시에 재생시키는 최고의 리프팅 레이저 조합",
      "고주파 에너지로 피부 속 콜라겐 재생을 돕고, 피부 탄력과 얼굴 윤곽을 함께 개선하는 리프팅 조합",
      "초음파, 고주파, 마이크로웨이브파의 시너지를 담은 이중턱·심부볼·볼처짐에 탁월한 복합 리프팅",
      "초음파 콜라겐 재생으로 피부 속 탄력을 올려주고 피부톤 개선과 물광 효과를 한 번에 느낄 수 있는 꿀조합",
      "피부 속 탄력과 진피층의 미세근섬유 주름을 동시에 개선하고 피부 광택까지",
    ],
    recommendTitle: "울쎄라피 프라임, 이런 분께 추천합니다",
    recommendations: ["수술 없이 자연스러운 리프팅 효과를 원하시는 분", "나이가 들면서 처지는 턱선이 고민이신 분", "주름, 피부 탄력의 전반적인 개선을 원하시는 분", "울퉁불퉁한 얼굴라인을 매끈하게 정리하고 싶으신 분", "회복시간이 따로 필요 없는 리프팅을 원하시는 분"],
    areasCaption: "울쎄라피 프라임 시술 가능 부위",
    starTitle: "당신의 소중한 젊음, 스타피부과가 돌려드립니다",
    starIntro: "스타피부과는 개인별 피부 타입과 얼굴형에 맞춰 시술 층의 깊이, 샷수, 부위 등 한 샷 한 샷 신중하게 시술하여 가장 아름다운 얼굴선을 이끌어 냅니다.",
    strengths: ["대한민국 의사의\n단 2% 피부과전문의", "대학병원 교수출신,\n20년 이상의 시술 경험", "1:1 체계적인\n맞춤 플랜 리프팅", "울쎄라피 프라임 외\n리프팅 장비 다수 보유"],
    certificationTitle: "울쎄라피 프라임 정품 인증 병원",
    certificationText: "스타피부과는 멀츠 본사에서 인증한 울쎄라피 프라임 공식 정품 인증 병원으로, 최신 소프트웨어인 Amplify II로 업그레이드된 정품 장비와 정품 팁을 사용하고 있습니다.",
    shortsAriaLabel: "울쎄라피 관련 숏폼 영상",
    playVideoLabel: "영상 재생",
    qaTitle: "피부과전문의가 알려주는 울쎄라피 프라임 Q&A",
    watchYoutubeLabel: "YouTube에서 영상 보기",
  },
  en: {
    trustTitles: ["Authentic Product-Certified Clinic", "FDA-Cleared", "Treatment by a Board-Certified Dermatologist"],
    trustSubtitles: ["Use of authentic Ultherapy Prime equipment", "Patented proprietary technology", "With confidence and safety!"],
    heroTitle: "Safe, reliable lifting that can last up to one year with a single treatment",
    heroDescription: "Experience authentic Ultherapy Prime at Star Dermatology in Seomyeon, Busan.",
    whatTitle: "What is Ultherapy Prime?",
    whatParagraphs: [
      "Ultherapy Prime is a lifting treatment that delivers high-intensity focused ultrasound energy to tissue beneath the skin without damaging the skin surface. It denatures and contracts collagen within the skin and stimulates the production of new collagen.",
      "High-intensity focused ultrasound energy is delivered beneath the skin at a temperature considered optimal for collagen regeneration (60–70°C), creating thermal coagulation points (TCPs) of approximately 1 mm or less.",
    ],
    depthTitle: "Precision at Each Skin-Layer Depth",
    depthText: "Ultherapy Prime uses different types of transducers to deliver ultrasound energy evenly to skin layers at depths of 1.5 mm, 3.0 mm, and 4.5 mm.",
    authTitle: "Why Authentic Ultherapy Prime Matters",
    authParagraphs: [
      "To experience the intended benefits of an ultrasound lifting treatment, it is important to receive treatment with authentic Ultherapy Prime equipment. With non-authentic tips, appropriate energy may not be delivered to the skin layer or the tip may not adhere properly to the skin, which may reduce lifting results and carry a risk of burns.",
      "Authentic tips incorporate patented proprietary technology designed to deliver heat precisely at 60–70°C.",
    ],
    authCaption: "Ultrasound energy from an authentic tip precisely delivers heat at 60–70°C",
    collagenTitle: "The Collagen Regeneration Process",
    collagenStages: ["Sagging skin with weakened collagen", "During Ultherapy treatment", "Firmer skin with stimulated collagen"],
    collagenNote: "Aged collagen beneath the skin is gradually regenerated, and as more healthy collagen is produced, lifting effects may continue and be maintained.",
    processTitle: "Three-Step Treatment Process",
    processDescriptions: ["Accurately identify tissue layers beneath the skin in real time", "Establish a customized treatment plan according to each individual’s skin condition", "Perform treatment with care and precision"],
    processNote: "Because the appropriate approach can vary according to skin condition, we assess skin depth and condition and provide a personalized treatment.",
    painTitle: "Considering Ultherapy Prime but concerned about discomfort?",
    painOptions: ["Topical anesthetic cream", "Local anesthetic injection", "Sedation"],
    painParagraphs: [
      "Through its pain-management system, including topical anesthetic cream and local anesthetic injections, Star Dermatology helps reduce discomfort. For patients who are particularly sensitive to discomfort, selective sedation is also available to support a more comfortable and efficient treatment experience.",
      "In particular, sedation can help reduce treatment discomfort and ease tension and anxiety, allowing treatment to be performed in a more comfortable state.",
    ],
    shortsTitle: "Discover Ultherapy Prime Through Video",
    combinationTitle: "Treatments That Pair Well with Ultherapy Prime",
    combinationTitles: ["Ultherapy Prime + Thermage FLX", "Ultherapy Prime\n+ XERF", "Ultherapy Prime + ONDA + V-RO", "Ultherapy Prime + Lumenis One + Rejuran", "Ultherapy Prime + Skin Botox"],
    combinationBadges: ["BEST", "POPULAR", "", "", ""],
    combinationDescriptions: [
      "A leading lifting-treatment combination that promotes collagen renewal within the skin with ultrasound and supports elastic fibers near the skin surface with radiofrequency energy at the same time.",
      "A lifting pairing that combines ultrasound and radiofrequency energy to support collagen renewal, skin firmness, and facial contouring.",
      "A combined lifting treatment that brings together the synergy of ultrasound, radiofrequency, and microwave energy for the double chin, deep cheeks, and sagging cheeks.",
      "A beneficial pairing designed to improve firmness beneath the skin through ultrasound collagen regeneration while supporting improvement in skin tone and a hydrated, radiant glow.",
      "Helps improve firmness beneath the skin and fine fibrous wrinkles in the dermis while enhancing skin radiance.",
    ],
    recommendTitle: "Ultherapy Prime May Be Recommended for the Following",
    recommendations: ["Those seeking a natural-looking lifting effect without surgery", "Those concerned about a sagging jawline with age", "Those seeking overall improvement in wrinkles and skin elasticity", "Those who want to refine an uneven facial contour for a smoother appearance", "Those seeking a lifting treatment that does not require a separate recovery period"],
    areasCaption: "Areas Suitable for Ultherapy Prime Treatment",
    starTitle: "Star Dermatology Helps Restore Your Precious Youthful Appearance",
    starIntro: "At Star Dermatology, each shot is delivered with care according to individual skin type and facial shape—including treatment-layer depth,\nnumber of shots, and treatment area—to help create a beautiful facial contour.",
    strengths: ["Board-certified dermatologists, who account for only 2% of physicians in Korea", "Medical staff with university-hospital faculty backgrounds and more than 20 years of extensive treatment experience", "A systematic one-to-one customized lifting plan", "A broad range of lifting devices in addition to Ultherapy Prime"],
    certificationTitle: "Ultherapy Prime Authentic Product-Certified Clinic",
    certificationText: "Star Dermatology is an official Ultherapy Prime authentic product-certified clinic recognized by Merz headquarters. We use authentic equipment updated with the latest Amplify II software and authentic tips.",
    shortsAriaLabel: "Ultherapy related short-form videos",
    playVideoLabel: "Play video",
    qaTitle: "Ultherapy Prime Q&A from a board-certified dermatologist",
    watchYoutubeLabel: "Watch on YouTube",
  },
  ja: {
    trustTitles: ["正規品認証クリニック", "FDA承認", "皮膚科専門医による施術"],
    trustSubtitles: ["正規品のUltherapy Primeを使用", "特許取得の独自技術", "安心・安全に配慮"],
    heroTitle: "1回の施術で最大1年。安全性に配慮し、しっかりと引き上げるリフティング",
    heroDescription: "釜山・西面のスター皮膚科で、正規品のUltherapy Primeをご体験ください",
    whatTitle: "Ultherapy Primeとは\nどのような施術ですか？",
    whatParagraphs: [
      "Ultherapy Primeは、皮膚表面を傷つけることなく、皮膚内部の組織にHIFU（高密度焦点式超音波）エネルギーを届け、皮膚内部のコラーゲンを変性・収縮させ、新たなコラーゲンの生成を促すリフティング施術です。",
      "高密度焦点式超音波エネルギーをコラーゲン再生に適した温度（60～70℃）で皮膚内部に照射し、皮膚内部に約1mm以下の熱凝固点（TCP）を形成します。",
    ],
    depthTitle: "皮膚層ごとの深さに精密にアプローチ",
    depthText: "Ultherapy Primeは、異なる種類のトランスデューサーを用いて、皮膚層ごとの深さ（1.5mm・3.0mm・4.5mm）へ超音波エネルギーを均一に届けます。",
    authTitle: "正規品のUltherapy Primeが重要な理由",
    authParagraphs: [
      "超音波リフティングの効果を十分に得るためには、必ず正規品のUltherapy Primeによる施術を受けることが大切です。正規チップではない場合、皮膚層に適切なエネルギーが伝わらなかったり、皮膚に十分密着しなかったりするため、リフティング効果の低下だけでなく、やけどのリスクが生じることがあります。",
      "正規チップは、60～70℃の熱を精密に届けるよう設計された特許取得の独自技術です。",
    ],
    authCaption: "正規チップで超音波エネルギーを用い、60～70℃の熱を精密に照射",
    collagenTitle: "コラーゲンが再生する過程",
    collagenStages: ["弱ったコラーゲンによりたるんだ肌", "Ultherapy Prime施術中", "活性化されたコラーゲンによりハリのある肌"],
    collagenNote: "肌内部の老化したコラーゲンは徐々に再生され、健康なコラーゲンが増えることで、リフティング効果の持続・維持が期待できます。",
    processTitle: "3ステップの施術プロセス",
    processDescriptions: ["皮膚内部の組織層をリアルタイムで正確に確認", "一人ひとりの肌状態に応じた施術プランを作成", "丁寧かつ正確に施術"],
    processNote: "同じ施術でも肌の状態に応じて変える必要があるため、皮膚の深さや状態を確認し、お一人おひとりに合わせた施術を行います。",
    painTitle: "Ultherapy Prime\nの痛みが気になる方へ",
    painOptions: ["麻酔クリーム", "局所麻酔注射", "睡眠麻酔"],
    painParagraphs: [
      "スター皮膚科では、痛みケアシステム（麻酔クリーム、局所麻酔注射）により痛みの軽減を図り、痛みに敏感な方には選択的な睡眠麻酔にも対応しています。より効率的で快適な施術を目指します。",
      "特に睡眠麻酔は、施術時の痛みを軽減し、患者様の緊張や不安を和らげ、リラックスした状態で施術を受けられることが特長です。",
    ],
    shortsTitle: "動画で見るUltherapy Prime",
    combinationTitle: "Ultherapy Primeと組み合わせたい施術",
    combinationTitles: ["Ultherapy Prime + Thermage FLX", "Ultherapy Prime\n+ XERF", "Ultherapy Prime + ONDA + V-RO", "Ultherapy Prime + Lumenis One + Rejuran", "Ultherapy Prime + スキンボトックス"],
    combinationBadges: ["BEST", "人気", "", "", ""],
    combinationDescriptions: [
      "超音波で皮膚深部のコラーゲンを、高周波で皮膚表面の弾性線維を同時に再生へ導く、理想的なリフティング施術の組み合わせ",
      "超音波と高周波エネルギーを組み合わせ、コラーゲン再生を促し、肌のハリとフェイスラインを同時に整えるリフティング施術の組み合わせ。",
      "超音波・高周波・マイクロ波の相乗効果により、二重あご・頬深部・頬のたるみにアプローチする複合リフティング",
      "超音波によるコラーゲン再生で肌内部のハリを高め、肌トーンの改善とみずみずしいツヤ感を一度に目指せる組み合わせ",
      "肌内部のハリと真皮層の微細な筋線維のしわに同時にアプローチし、肌のツヤ感も目指します。",
    ],
    recommendTitle: "Ultherapy Prime\nはこのような方におすすめです",
    recommendations: ["手術をせずに自然なリフティング効果を目指したい方", "年齢とともにたるむフェイスラインが気になる方", "しわや肌のハリを総合的に改善したい方", "凹凸のあるフェイスラインをなめらかに整えたい方", "ダウンタイムを必要としないリフティングを希望される方"],
    areasCaption: "Ultherapy Primeの施術可能部位",
    starTitle: "あなたの大切な若々しさを、\nスター皮膚科が取り戻すお手伝いをします",
    starIntro: "スター皮膚科は、お一人おひとりの肌質と顔立ちに合わせ、施術層の深さ、ショット数、部位などを一ショットずつ慎重に見極め、美しいフェイスラインへ導きます。",
    strengths: ["韓国の医師のうちわずか2％の皮膚科専門医", "大学病院教授出身の医療スタッフ、20年以上にわたる豊富な施術経験", "1対1の体系的なオーダーメイド・リフティングプラン", "Ultherapy Primeのほか、多数のリフティング機器を完備"],
    certificationTitle: "Ultherapy Prime正規品認証クリニック",
    certificationText: "スター皮膚科は、Merz本社が認証したUltherapy Primeの公式正規品認証クリニックです。最新ソフトウェアであるAmplify IIにアップグレードされた正規機器と正規チップを使用しています。",
    shortsAriaLabel: "Ultherapyのショート動画",
    playVideoLabel: "動画を再生",
    qaTitle: "皮膚科専門医が解説するUltherapy Prime Q&A",
    watchYoutubeLabel: "YouTubeで動画を見る",
  },
  zh: {
    trustTitles: ["正品认证医院", "FDA获批", "由皮肤科专科医师操作"],
    trustSubtitles: ["使用正品 Ultherapy Prime", "获得专利的专有技术", "安心、规范地治疗！"],
    heroTitle: "一次治疗，提升效果最长可维持1年，安心且可靠的紧致提升",
    heroDescription: "在釜山西面 Star皮肤科，体验正品 Ultherapy Prime",
    whatTitle: "Ultherapy Prime 是什么治疗？",
    whatParagraphs: [
      "Ultherapy Prime 是一种提升治疗：在不损伤皮肤表面的前提下，将高强度超声能量传递至皮肤深层组织，使胶原蛋白变性、收缩，并促进新生胶原蛋白的生成。",
      "将高强度聚焦超声（HIFU）能量以有利于胶原再生的温度（60~70℃）传递至皮肤深层，形成约1mm以下的热凝固点（TCP）。",
    ],
    depthTitle: "精准作用于各皮肤层深度",
    depthText: "Ultherapy Prime 通过不同类型的治疗头，将超声能量均匀传递至不同皮肤层深度（1.5mm·3.0mm·4.5mm）。",
    authTitle: "为何正品 Ultherapy Prime 很重要",
    authParagraphs: [
      "为充分体验超声提升治疗的效果，应使用正品 Ultherapy Prime 进行治疗。若使用非正品治疗头，可能无法将适当能量传递至皮肤层，或与皮肤贴合不佳；这不仅可能影响提升效果，也可能增加烫伤风险。",
      "原装治疗头采用获得专利的专有技术，旨在精准传递60~70℃的热能。",
    ],
    authCaption: "原装治疗头利用超声能量精准传递60~70℃的热能",
    collagenTitle: "胶原蛋白再生过程",
    collagenStages: ["因胶原蛋白减弱而松弛的肌肤", "Ultherapy Prime 治疗中", "胶原蛋白生成受到促进后更紧致的肌肤"],
    collagenNote: "皮肤内老化的胶原蛋白会逐步再生；随着健康胶原蛋白增加，提升效果有望持续并得到维持。",
    processTitle: "3步治疗流程",
    processDescriptions: ["实时、准确确认皮肤内部组织层", "根据个人皮肤状况制定个性化治疗方案", "细致、准确地进行治疗"],
    processNote: "即使是相同治疗，也应根据皮肤状况有所调整。因此，我们会确认皮肤深度与状态，并进行个性化治疗。",
    painTitle: "担心 Ultherapy Prime 治疗疼痛？",
    painOptions: ["麻醉膏", "局部麻醉注射", "镇静麻醉"],
    painParagraphs: [
      "Star皮肤科通过疼痛管理系统（麻醉膏、局部麻醉注射）帮助减轻不适；对于疼痛较敏感者，还可选择镇静麻醉，以提升治疗过程的舒适性。",
      "镇静麻醉可帮助减轻治疗过程中的疼痛感，并缓解紧张和焦虑，使患者在较舒适的状态下接受治疗。",
    ],
    shortsTitle: "通过视频了解 Ultherapy Prime",
    combinationTitle: "适合与 Ultherapy Prime 联合进行的治疗",
    combinationTitles: ["Ultherapy Prime + Thermage FLX", "Ultherapy Prime\n+ XERF", "Ultherapy Prime + ONDA + V-RO", "Ultherapy Prime + Lumenis One + Rejuran", "Ultherapy Prime + Skin Botox"],
    combinationBadges: ["BEST", "热门", "", "", ""],
    combinationDescriptions: [
      "通过超声促进皮肤深层胶原蛋白再生，并借助射频改善皮肤表层弹力纤维的联合提升方案。",
      "结合超声与射频能量，促进胶原蛋白再生，同时改善肌肤紧致度与面部轮廓的提升方案。",
      "结合超声、射频与微波能量协同作用的复合提升方案，可用于改善双下巴、深层颊部脂肪及面颊松垂问题。",
      "通过超声促进胶原蛋白再生以改善皮肤深层弹性，同时兼顾肤色改善与水光感的联合方案。",
      "可同时改善皮肤深层弹性及真皮层细小肌纤维皱纹，并提升肌肤光泽。",
    ],
    recommendTitle: "Ultherapy Prime 推荐给以下人群",
    recommendations: ["希望在不进行手术的情况下获得自然提升效果者", "因年龄增长而困扰于下颌线松弛者", "希望整体改善皱纹与皮肤弹性者", "希望使不平整的面部轮廓更显流畅者", "希望选择通常无需额外恢复期的提升治疗者"],
    areasCaption: "Ultherapy Prime 可治疗部位",
    starTitle: "您的珍贵青春，由 Star皮肤科悉心守护",
    starIntro: "Star皮肤科会根据个人皮肤类型和脸型，审慎评估治疗层次深度、发数及部位等，并逐发精细操作，力求呈现更自然的面部轮廓。",
    strengths: ["韩国仅2%的医生为皮肤科专科医师", "曾任大学医院教授的医疗团队，拥有20年以上的丰富治疗经验", "一对一系统化个性化提升方案", "除 Ultherapy Prime 外，配备多种提升设备"],
    certificationTitle: "Ultherapy Prime 正品认证医院",
    certificationText: "Star皮肤科是经 Merz 总部认证的 Ultherapy Prime 官方正品认证医院，使用升级至最新软件 Amplify II 的正品设备及原装治疗头。",
    shortsAriaLabel: "Ultherapy 相关短视频",
    playVideoLabel: "播放视频",
    qaTitle: "皮肤科专科医师讲解的 Ultherapy Prime 问答",
    watchYoutubeLabel: "在 YouTube 上观看视频",
  },
  "zh-TW": {
    trustTitles: ["原廠正貨認證診所", "FDA 核准", "皮膚科專科醫師施作"],
    trustSubtitles: ["使用原廠 Ultherapy Prime", "專利獨家技術", "安心、安全！"],
    heroTitle: "單次療程，效果最長可維持約 1 年的安全拉提",
    heroDescription: "在釜山西面 Star皮膚科，體驗原廠 Ultherapy Prime",
    whatTitle: "Ultherapy Prime 是什麼療程？",
    whatParagraphs: [
      "Ultherapy Prime 是一項拉提療程，可在不損傷皮膚表面的情況下，將高強度超音波能量傳遞至皮下組織，促使皮下膠原蛋白變性、收縮，並有助於新生膠原蛋白的生成。",
      "將高強度聚焦超音波（HIFU）能量以適合膠原蛋白再生的溫度（60~70℃）作用於皮下，可在皮下形成約 1mm 以下的微小熱凝固點（TCP）。",
    ],
    depthTitle: "精準對應各皮層深度",
    depthText: "Ultherapy Prime 使用不同種類的治療探頭，將超音波能量均勻傳遞至不同皮層深度（1.5mm·3.0mm·4.5mm）。",
    authTitle: "為何原廠 Ultherapy Prime 很重要",
    authParagraphs: [
      "為充分體驗超音波拉提療程的效果，建議使用原廠 Ultherapy Prime 進行療程。若非使用原廠探頭，能量可能無法適當傳遞至皮層，或探頭與皮膚貼合度不佳；除了可能影響拉提效果外，也可能增加燙傷風險。",
      "原廠探頭採用專利獨家技術設計，可精準傳遞 60~70℃ 的熱能。",
    ],
    authCaption: "原廠探頭運用超音波能量，精準傳遞 60~70℃ 的熱能",
    collagenTitle: "膠原蛋白再生過程",
    collagenStages: ["因膠原蛋白流失而鬆弛的肌膚", "Ultherapy Prime 療程進行中", "在膠原蛋白再生作用下更緊緻的肌膚"],
    collagenNote: "肌膚內老化的膠原蛋白會逐步再生，隨著健康膠原蛋白持續生成，拉提效果可望延續與維持。",
    processTitle: "3 步驟療程流程",
    processDescriptions: ["即時、精確確認皮下組織層次", "依個人膚況制定客製化療程規劃", "細緻且精準地進行療程"],
    processNote: "即使是相同療程，也應依膚況調整；因此會確認皮膚深度與狀態，進行個人化療程。",
    painTitle: "擔心 Ultherapy Prime 的疼痛感嗎？",
    painOptions: ["麻醉藥膏", "局部麻醉注射", "舒眠麻醉"],
    painParagraphs: [
      "Star皮膚科透過疼痛照護系統（麻醉藥膏、局部麻醉注射）協助減輕不適；對疼痛較敏感者，亦提供可選擇的舒眠麻醉服務，以提升療程舒適度。",
      "尤其舒眠麻醉有助於減輕療程不適，並緩解緊張與焦慮，使您能在較放鬆的狀態下接受療程。",
    ],
    shortsTitle: "透過影片認識 Ultherapy Prime",
    combinationTitle: "適合搭配 Ultherapy Prime 的療程",
    combinationTitles: ["Ultherapy Prime + Thermage FLX", "Ultherapy Prime\n+ XERF", "Ultherapy Prime + ONDA + V-RO", "Ultherapy Prime + Lumenis One + Rejuran", "Ultherapy Prime + 肌膚肉毒"],
    combinationBadges: ["BEST", "熱門", "", "", ""],
    combinationDescriptions: [
      "透過超音波作用於皮下膠原蛋白，並以射頻作用於表層彈力纖維，同步提升肌膚緊實度的拉提療程組合。",
      "結合超音波與射頻能量，促進膠原蛋白再生，同時改善肌膚緊實度與臉部輪廓的拉提療程組合。",
      "結合超音波、射頻與微波能量的協同作用，適合希望改善雙下巴、深層頰部與雙頰鬆弛者的複合式拉提療程。",
      "透過超音波促進膠原蛋白再生以提升肌膚緊實感，並可同時感受膚色改善與水光感的搭配療程。",
      "可同時改善肌膚緊實度與真皮層細微肌纖維紋路，並提升肌膚光澤感。",
    ],
    recommendTitle: "Ultherapy Prime 適合推薦給以下族群",
    recommendations: ["希望不透過手術，追求自然拉提效果者", "因年齡增長而在意下顎線鬆弛者", "希望整體改善皺紋與肌膚彈性者", "希望修飾不平整臉部輪廓、使線條更俐落者", "希望選擇恢復期需求較少的拉提療程者"],
    areasCaption: "Ultherapy Prime 可施作部位",
    starTitle: "您珍貴的青春，交由 Star皮膚科悉心守護",
    starIntro: "Star皮膚科會依個人膚質與臉型，審慎規劃療程層次深度、發數與施作部位，逐發細緻施作，以呈現自然協調的臉部線條。",
    strengths: ["南韓醫師中僅約 2% 為皮膚科專科醫師", "曾任大學醫院教授的醫療團隊，擁有 20 年以上豐富療程經驗", "一對一系統化客製拉提規劃", "除 Ultherapy Prime 外，另備有多種拉提儀器"],
    certificationTitle: "Ultherapy Prime 原廠正貨認證診所",
    certificationText: "Star皮膚科為 Merz 原廠認證的 Ultherapy Prime 官方正貨認證診所，使用已升級至最新 Amplify II 軟體的原廠設備與原廠探頭。",
    shortsAriaLabel: "Ultherapy 相關短影音",
    playVideoLabel: "播放影片",
    qaTitle: "皮膚科專科醫師說明的 Ultherapy Prime 問答",
    watchYoutubeLabel: "前往 YouTube 觀看影片",
  },
};

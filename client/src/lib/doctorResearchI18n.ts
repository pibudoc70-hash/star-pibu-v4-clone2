import type { Lang } from "./i18n.types";

export interface LocalizedDoctorResearchActivity {
  id: string;
  title: string;
  detail: string;
  sourceLabel: string;
}

export interface LocalizedDoctorResearchContent {
  title: string;
  activities: Array<{
    id: number;
    items: LocalizedDoctorResearchActivity[];
  }>;
}

/**
 * Doctor research and continuing-education copy is kept with the locale data,
 * while the verified source URLs remain with the doctor records. The stable
 * activity id joins both sources without duplicating or changing source links.
 */
export const DOCTOR_RESEARCH_I18N: Record<Lang, LocalizedDoctorResearchContent> = {
  ko: {
    title: "연구·발표 및 연수 활동",
    activities: [
      {
        id: 0,
        items: [
          { id: "cho-bromhidrosis", title: "액취증·다한증 치료 연구", detail: "액취증·다한증 치료 관련 공동연구로, PubMed에서 저자 Si-Hyung Cho와 논문 서지를 확인할 수 있습니다.", sourceLabel: "PubMed" },
          { id: "cho-papillomatosis", title: "융합성 망상 유두종증 항생제 치료 증례", detail: "JAAD에 게재된 융합성 망상 유두종증의 항생제 치료 증례 연구입니다.", sourceLabel: "PubMed" },
          { id: "cho-syringoma", title: "한관종 절연침 치료 연구", detail: "표피 손상을 줄이는 절연침을 이용한 한관종 치료 관련 국제 학술지 연구입니다.", sourceLabel: "PubMed" },
          { id: "cho-alopecia", title: "남성형 탈모 임상 연구", detail: "대한피부과학회지에 수록된 남성형 탈모 임상 양상 연구입니다.", sourceLabel: "스타피부과 연구·발표" },
          { id: "cho-radiofrequency", title: "고주파 주사요법 라이브 시연", detail: "대경피부미용치료 심포지엄에서 이마·미간·하안검 주름 치료 관련 라이브 시연과 발표를 진행했습니다.", sourceLabel: "스타피부과 연구·발표" },
          { id: "cho-asian-academy", title: "아시아 미용피부외과 학술대회 초청 발표", detail: "Asian Academy of Cosmetic & Dermatologic Surgery에서 미용피부과·피부외과 주제로 초청 발표했습니다.", sourceLabel: "스타피부과 연구·발표" },
          { id: "cho-domestic-conference", title: "국내 피부과 학회 임상 발표", detail: "대한피부과학회 학술대회에서 희귀 증례와 흉터 레이저박피·프락셀 병합치료 관련 공동 발표를 확인할 수 있습니다.", sourceLabel: "스타피부과 연구·발표" },
          { id: "cho-overseas-training", title: "해외 전문가 과정 및 연수", detail: "미국·브라질·독일·싱가포르에서 국소마취 지방흡입, 지방이식, 화학박피, 실리프팅 관련 전문가 과정을 이수했습니다.", sourceLabel: "스타피부과 연구·발표" },
        ],
      },
      {
        id: 1,
        items: [
          { id: "woo-neurofibromatosis", title: "두피 분절상 신경섬유종증 증례 보고", detail: "가톨릭대학교 소속 저자로 확인되는 피부과 증례 보고이며, KCI에서 논문 서지를 확인할 수 있습니다.", sourceLabel: "KCI" },
          { id: "woo-elastosis", title: "선형 국소 탄력섬유증 증례 보고", detail: "가톨릭대학교 의과대학 피부과 소속 Hye Jin Woo 저자로 확인되는 피부과 증례 논문입니다.", sourceLabel: "PubMed" },
        ],
      },
    ],
  },
  en: {
    title: "Research, Presentations & Continuing Education",
    activities: [
      {
        id: 0,
        items: [
          { id: "cho-bromhidrosis", title: "Research on Bromhidrosis and Hyperhidrosis Treatment", detail: "A co-authored study on bromhidrosis and hyperhidrosis treatment; its bibliography can be verified on PubMed under author Si-Hyung Cho.", sourceLabel: "PubMed" },
          { id: "cho-papillomatosis", title: "Antibiotic Therapy Case for Confluent and Reticulated Papillomatosis", detail: "A JAAD-published case study on antibiotic therapy for confluent and reticulated papillomatosis.", sourceLabel: "PubMed" },
          { id: "cho-syringoma", title: "Research on Syringoma Treatment with an Insulated Needle", detail: "An international-journal study of syringoma treatment using an insulated needle to reduce epidermal injury.", sourceLabel: "PubMed" },
          { id: "cho-alopecia", title: "Clinical Study of Androgenetic Alopecia", detail: "A study of clinical characteristics of androgenetic alopecia published in the Korean Journal of Dermatology.", sourceLabel: "STAR Dermatology Research & Presentations" },
          { id: "cho-radiofrequency", title: "Live Demonstration of Radiofrequency Injection Therapy", detail: "A live demonstration and presentation on radiofrequency injection therapy for forehead, glabellar, and lower-eyelid wrinkles at a dermatology aesthetic-treatment symposium.", sourceLabel: "STAR Dermatology Research & Presentations" },
          { id: "cho-asian-academy", title: "Invited Presentation at the Asian Academy of Cosmetic & Dermatologic Surgery", detail: "An invited presentation on cosmetic dermatology and dermatologic surgery at the Asian Academy of Cosmetic & Dermatologic Surgery.", sourceLabel: "STAR Dermatology Research & Presentations" },
          { id: "cho-domestic-conference", title: "Clinical Presentations at Korean Dermatology Conferences", detail: "Co-presentations at Korean Dermatological Association meetings on rare cases and combined scar laser resurfacing and fractional-laser treatment.", sourceLabel: "STAR Dermatology Research & Presentations" },
          { id: "cho-overseas-training", title: "Overseas Advanced Courses and Training", detail: "Completed advanced courses in tumescent liposuction, fat grafting, chemical peels, and thread lifting in the United States, Brazil, Germany, and Singapore.", sourceLabel: "STAR Dermatology Research & Presentations" },
        ],
      },
      {
        id: 1,
        items: [
          { id: "woo-neurofibromatosis", title: "Case Report: Segmental Neurofibromatosis of the Scalp", detail: "A dermatology case report by an author affiliated with The Catholic University of Korea; the bibliography is available through KCI.", sourceLabel: "KCI" },
          { id: "woo-elastosis", title: "Case Report: Linear Focal Elastosis", detail: "A dermatology case paper by Hye Jin Woo, affiliated with the Department of Dermatology at The Catholic University of Korea College of Medicine.", sourceLabel: "PubMed" },
        ],
      },
    ],
  },
  ja: {
    title: "研究・発表・研修活動",
    activities: [
      {
        id: 0,
        items: [
          { id: "cho-bromhidrosis", title: "腋臭・多汗症治療に関する研究", detail: "腋臭・多汗症治療に関する共同研究です。PubMedで著者 Si-Hyung Cho として論文書誌をご確認いただけます。", sourceLabel: "PubMed" },
          { id: "cho-papillomatosis", title: "融解性網状乳頭腫症に対する抗菌薬治療の症例", detail: "JAADに掲載された、融解性網状乳頭腫症の抗菌薬治療に関する症例研究です。", sourceLabel: "PubMed" },
          { id: "cho-syringoma", title: "絶縁針を用いた汗管腫治療の研究", detail: "表皮への損傷を抑える絶縁針を用いた汗管腫治療に関する国際学術誌の研究です。", sourceLabel: "PubMed" },
          { id: "cho-alopecia", title: "男性型脱毛症の臨床研究", detail: "『大韓皮膚科学会誌』に掲載された男性型脱毛症の臨床像に関する研究です。", sourceLabel: "STAR皮膚科 研究・発表" },
          { id: "cho-radiofrequency", title: "高周波注入療法のライブデモンストレーション", detail: "大慶皮膚美容治療シンポジウムで、額・眉間・下眼瞼のしわ治療に関するライブデモと発表を行いました。", sourceLabel: "STAR皮膚科 研究・発表" },
          { id: "cho-asian-academy", title: "アジア美容皮膚外科学会での招待講演", detail: "Asian Academy of Cosmetic & Dermatologic Surgeryで美容皮膚科・皮膚外科をテーマに招待講演を行いました。", sourceLabel: "STAR皮膚科 研究・発表" },
          { id: "cho-domestic-conference", title: "韓国皮膚科学会での臨床発表", detail: "大韓皮膚科学会の学術大会で、希少症例および瘢痕レーザーリサーフェシングとフラクショナルレーザー併用治療に関する共同発表を確認できます。", sourceLabel: "STAR皮膚科 研究・発表" },
          { id: "cho-overseas-training", title: "海外専門コース・研修", detail: "米国・ブラジル・ドイツ・シンガポールで、局所麻酔脂肪吸引、脂肪移植、ケミカルピーリング、スレッドリフトに関する専門コースを修了しました。", sourceLabel: "STAR皮膚科 研究・発表" },
        ],
      },
      {
        id: 1,
        items: [
          { id: "woo-neurofibromatosis", title: "頭皮の分節型神経線維腫症の症例報告", detail: "カトリック大学所属の著者として確認できる皮膚科症例報告で、KCIで論文書誌を確認できます。", sourceLabel: "KCI" },
          { id: "woo-elastosis", title: "線状限局性弾性線維症の症例報告", detail: "カトリック大学医学部皮膚科所属の Hye Jin Woo 著者による皮膚科症例論文です。", sourceLabel: "PubMed" },
        ],
      },
    ],
  },
  zh: {
    title: "研究、发表与进修活动",
    activities: [
      {
        id: 0,
        items: [
          { id: "cho-bromhidrosis", title: "腋臭与多汗症治疗研究", detail: "这是一项关于腋臭与多汗症治疗的共同研究，可在 PubMed 以作者 Si-Hyung Cho 查询论文书目。", sourceLabel: "PubMed" },
          { id: "cho-papillomatosis", title: "融合性网状乳头瘤病的抗生素治疗病例", detail: "这是发表于 JAAD 的融合性网状乳头瘤病抗生素治疗病例研究。", sourceLabel: "PubMed" },
          { id: "cho-syringoma", title: "绝缘针治疗汗管瘤的研究", detail: "这是一项使用绝缘针治疗汗管瘤、以减少表皮损伤的国际期刊研究。", sourceLabel: "PubMed" },
          { id: "cho-alopecia", title: "男性型脱发临床研究", detail: "这是收录于《韩国皮肤科学会志》的男性型脱发临床表现研究。", sourceLabel: "STAR皮肤科研究与发表" },
          { id: "cho-radiofrequency", title: "高频注射疗法现场演示", detail: "在大庆皮肤美容治疗研讨会，进行了额头、眉间和下眼睑皱纹治疗的现场演示与发表。", sourceLabel: "STAR皮肤科研究与发表" },
          { id: "cho-asian-academy", title: "亚洲美容皮肤外科学术大会受邀发表", detail: "在 Asian Academy of Cosmetic & Dermatologic Surgery 以美容皮肤科与皮肤外科为主题进行受邀发表。", sourceLabel: "STAR皮肤科研究与发表" },
          { id: "cho-domestic-conference", title: "韩国皮肤科学会临床发表", detail: "可确认在韩国皮肤科学会学术大会共同发表罕见病例及疤痕激光磨皮与点阵激光联合治疗。", sourceLabel: "STAR皮肤科研究与发表" },
          { id: "cho-overseas-training", title: "海外专家课程与进修", detail: "在美国、巴西、德国和新加坡完成了局部麻醉吸脂、脂肪移植、化学焕肤和埋线提升相关专家课程。", sourceLabel: "STAR皮肤科研究与发表" },
        ],
      },
      {
        id: 1,
        items: [
          { id: "woo-neurofibromatosis", title: "头皮节段型神经纤维瘤病病例报告", detail: "这是一篇可确认作者所属为天主教大学的皮肤科病例报告，论文书目可在 KCI 查询。", sourceLabel: "KCI" },
          { id: "woo-elastosis", title: "线状局限性弹力纤维症病例报告", detail: "这是一篇作者 Hye Jin Woo 所属为天主教大学医学院皮肤科的皮肤科病例论文。", sourceLabel: "PubMed" },
        ],
      },
    ],
  },
  "zh-TW": {
    title: "研究・發表與進修活動",
    activities: [
      {
        id: 0,
        items: [
          { id: "cho-bromhidrosis", title: "腋臭與多汗症治療研究", detail: "這項腋臭與多汗症治療的共同研究，可於 PubMed 以作者 Si-Hyung Cho 查閱論文書目。", sourceLabel: "PubMed" },
          { id: "cho-papillomatosis", title: "融合性網狀乳頭瘤症的抗生素治療病例", detail: "這是刊登於 JAAD、探討融合性網狀乳頭瘤症抗生素治療病例的研究。", sourceLabel: "PubMed" },
          { id: "cho-syringoma", title: "以絕緣針治療汗管瘤的研究", detail: "這是關於使用絕緣針治療汗管瘤、以減少表皮損傷的國際期刊研究。", sourceLabel: "PubMed" },
          { id: "cho-alopecia", title: "男性型落髮臨床研究", detail: "這是收錄於《大韓皮膚科學會誌》的男性型落髮臨床表現研究。", sourceLabel: "STAR皮膚科研究與發表" },
          { id: "cho-radiofrequency", title: "高頻注射療法現場示範", detail: "於大慶皮膚美容治療研討會，進行額頭、眉間與下眼瞼皺紋治療的現場示範與發表。", sourceLabel: "STAR皮膚科研究與發表" },
          { id: "cho-asian-academy", title: "亞洲美容皮膚外科學術大會受邀發表", detail: "於 Asian Academy of Cosmetic & Dermatologic Surgery 以美容皮膚科與皮膚外科為主題受邀發表。", sourceLabel: "STAR皮膚科研究與發表" },
          { id: "cho-domestic-conference", title: "國內皮膚科學會臨床發表", detail: "可確認於大韓皮膚科學會學術大會共同發表罕見病例及疤痕雷射磨皮與飛梭雷射合併治療。", sourceLabel: "STAR皮膚科研究與發表" },
          { id: "cho-overseas-training", title: "海外專家課程與研修", detail: "於美國、巴西、德國及新加坡完成局部麻醉抽脂、脂肪移植、化學換膚與埋線拉提相關專家課程。", sourceLabel: "STAR皮膚科研究與發表" },
        ],
      },
      {
        id: 1,
        items: [
          { id: "woo-neurofibromatosis", title: "頭皮節段型神經纖維瘤症病例報告", detail: "這是可確認作者所屬為天主教大學的皮膚科病例報告，論文書目可於 KCI 查閱。", sourceLabel: "KCI" },
          { id: "woo-elastosis", title: "線狀局限性彈力纖維症病例報告", detail: "這是作者所屬為天主教大學醫學院皮膚科的 Hye Jin Woo 皮膚科病例論文。", sourceLabel: "PubMed" },
        ],
      },
    ],
  },
};

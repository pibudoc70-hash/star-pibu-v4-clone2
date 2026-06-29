/**
 * Equipment & Treatment Translations
 * 운영자가 쉽게 수정 가능한 다국어 번역 데이터 구조
 * ko / en / ja / zh 언어별로 관리
 */
// [v5-FINAL] source of truth: 수치 변경 시 constants.ts의 CLINIC_STATS만 수정하면 전체 반영
// constants.ts → equipmentTranslations.ts는 단방향 참조 (순환 참조 없음)
import { CLINIC_STATS } from "./constants";
// 눈밑지방재배치 시술 건수 — 4개 언어 공통 사용
const _eyeBagCases = CLINIC_STATS.eyeBagCases.toLocaleString("ko-KR"); // "4,000"

export interface EquipmentText {
  title: string;
  desc1: string;
  desc2?: string;
  cta?: string;
}

export interface EquipmentTranslations {
  ko: Record<string, EquipmentText>;
  en: Record<string, EquipmentText>;
  ja: Record<string, EquipmentText>;
  zh: Record<string, EquipmentText>;
}

export const equipmentTranslations: EquipmentTranslations = {
  ko: {
    thermage: {
      title: "써마지 FLX",
      desc1: "4세대 RF 리프팅의 정점",
      desc2: "피부 깊숙이 콜라겐을 자극하여 탄력 개선 및 주름 완화",
    },
    xerf: {
      title: "세르프 XERF",
      desc1: "차세대 고강도 RF 리프팅 장비",
      desc2: "절개 없이 자연스러운 리프트업과 탄력 개선",
    },
    ulthera: {
      title: "울쎄라",
      desc1: "집중 초음파 에너지로 SMAS층까지 도달하는 본격 리프팅",
      desc2: "FDA 승인 비수술 시술로 자연스러운 탄력 회복",
    },
    tensera: {
      title: "텐쎄라",
      desc1: "RF와 초음파 에너지를 동시에 활용하는 복합 리프팅",
      desc2: "피부 탄력 개선 및 페이스라인 정리에 효과적인 프리미엄 시술",
    },
    virtue: {
      title: "버츄RF",
      desc1: "마이크로니들 RF로 피부 깊숙이 에너지 전달",
      desc2: "탄력 개선과 모공 축소를 동시에 기대",
    },
    shrink: {
      title: "슈링크 유니버스",
      desc1: "다중 깊이 에너지 전달이 가능한 업그레이드 HIFU 리프팅",
      desc2: "기존 슈링크보다 광범위를 빠르게 커버하여 시술 시간 단축",
    },
    onda: {
      title: "온다 ONDA",
      desc1: "특허 기술 마이크로웨이브로 리프트업과 타이트닝 실현",
      desc2: "콜라겐 리모델링을 촉진하여 즉각적인 탄력감 제공",
    },
    tensma: {
      title: "텐써마",
      desc1: "바늘 없이 유효 성분을 진피층으로 전달하는 노니들 시술",
      desc2: "리프팅과 피부 재생이 기대되며 시술 후 즉시 일상 복귀 가능",
    },
    bblskin: {
      title: "BBL 스킨타이트",
      desc1: "미국 SCITON 고성능 장비로 시행하는 시술",
      desc2: "적외선이 피부 내부 콜라겐을 자극하여 자연스러운 탄력감 향상",
    },
    trinity: {
      title: "트리니티 리프토닝",
      desc1: "1064nm, 808nm, 755nm 3파장을 동시 조사하는 한국 최초 복합 레이저",
      desc2: "리프트업과 토닝을 동시에 진행하여 기미, 칙칙함, 홍조까지 개선",
    },
    undereye: {
      title: "눈밑지방재배치",
      desc1: `${_eyeBagCases}례 이상의 경험을 바탕으로 다크서클과 눈밑 부음을 동시 개선`,
      desc2: "지방을 재배치하여 자연스럽고 매끄러운 눈밑 라인 형성",
    },
    lunchtime: {
      title: "런치타임 눈밑레이저",
      desc1: "특수 패치와 레이저 충격파로 눈밑 지방을 감소시키는 비수술 시술",
      desc2: "점심시간에도 가능할 정도로 간편하며 피부 탄력 개선도 기대",
    },
    advatx: {
      title: "아드바 TX",
      desc1: "혈관 및 색소 병변 치료에 사용되는 레이저 장비",
      desc2: "피부 자극을 최소화하면서 홍조와 모세혈관 확장 개선",
    },
    bbllaser: {
      title: "BBL 레이저",
      desc1: "광 치료로 홍조 진정과 피부 탄력 개선을 동시에 시행",
      desc2: "반복 시술로 피부 노화 개선도 기대 가능",
    },
    excelv: {
      title: "엑셀 V+",
      desc1: "혈관 선택성이 우수한 듀얼 파장 레이저로 홍조와 모세혈관 확장 집중 관리",
      desc2: "주변 조직 손상을 최소화하면서 홍조를 효과적으로 개선",
    },
    starwalker: {
      title: "스타워커 MAQX",
      desc1: "Q스위치 Nd:YAG와 피코초 레이저를 결합한 복합 색소 치료 장비",
      desc2: "다중 파장으로 다양한 색소 병변에 대응",
    },
    profound: {
      title: "프로파운드 RF 리프팅",
      desc1: "마이크로니들 RF로 진피층에 직접 에너지를 전달하는 고효과 리프팅",
      desc2: "1회 시술로도 확실한 탄력 개선을 원하는 분들께 추천",
    },
    volume: {
      title: "볼륨업 프로그램",
      desc1: "FDA 승인 스컬프트라로 자신의 콜라겐 생성을 촉진하여 자연스러운 볼륨 회복",
      desc2: "주름 개선, 탄력, 볼륨 회복 효과는 평균 2년 이상 지속",
    },
    stemcell: {
      title: "줄기세포 치료",
      desc1: "자신의 혈액·지방에서 추출한 줄기세포를 피부에 주입하는 자가 세포 치료",
      desc2: "부작용 위험이 낮으며 피부 재생 및 탄력 개선 기대",
    },
    scar: {
      title: "흉터 치료 프로그램",
      desc1: "울트라펄스 레이저, DRT, 미라젯, 트리필 PRO를 결합한 집중 흉터 치료",
      desc2: "통증 부담을 최소화하면서 여드름 흉터와 움푹 들어간 흉터 효과적 개선",
    },
    redness: {
      title: "홍조 치료 프로그램",
      desc1: "엑셀 V+와 아드바 TX 듀얼 레이저로 홍조와 모세혈관 확장 전문 치료",
      desc2: "피부 표면 손상 없이 홍조 피부를 눈에 띄게 개선",
    },
  },
  en: {
    thermage: {
      title: "Thermage FLX",
      desc1: "The pinnacle of 4th-generation RF lifting",
      desc2: "Stimulates deep collagen to improve firmness and reduce wrinkles",
    },
    xerf: {
      title: "XERF",
      desc1: "A next-generation high-intensity RF lifting device",
      desc2: "Delivers natural lifting and improved elasticity without incisions",
    },
    ulthera: {
      title: "Ultherapy",
      desc1: "A classic lifting treatment that reaches the SMAS layer with focused ultrasound energy",
      desc2: "An FDA-cleared non-surgical procedure for naturally firmer skin",
    },
    tensera: {
      title: "Tensera",
      desc1: "A combined lifting treatment using both RF and ultrasound energy",
      desc2: "A premium procedure effective for skin firmness and facial contouring",
    },
    virtue: {
      title: "Virtue RF",
      desc1: "Microneedle RF delivers energy directly into the deeper skin layers",
      desc2: "Helps improve firmness while refining enlarged pores",
    },
    shrink: {
      title: "Shrink Universe",
      desc1: "An upgraded HIFU lifting treatment with multi-depth energy delivery",
      desc2: "Covers a wider area faster than conventional Shurink, reducing treatment time",
    },
    onda: {
      title: "ONDA",
      desc1: "A patented microwave-based treatment for lifting and tightening",
      desc2: "Supports ongoing collagen remodeling for immediate lifting and firmer skin",
    },
    tensma: {
      title: "Tensma",
      desc1: "A needle-free treatment that delivers active ingredients directly into the dermis",
      desc2: "Helps support lifting and skin regeneration with minimal downtime",
    },
    bblskin: {
      title: "BBL SkinTight",
      desc1: "A treatment performed with SCITON's high-performance device",
      desc2: "Infrared light stimulates collagen to naturally improve skin firmness",
    },
    trinity: {
      title: "Trinity Lifting",
      desc1: "Korea's first multi-combination laser delivering 1064nm, 808nm, and 755nm simultaneously",
      desc2: "Lifting and toning in one treatment for clearer skin affected by melasma, spots, and redness",
    },
    undereye: {
      title: "Under-Eye Fat Repositioning",
      desc1: `Backed by ${_eyeBagCases}+ cases, this signature treatment improves both dark circles and under-eye bulging`,
      desc2: "Fat is repositioned to create a smoother, more natural under-eye contour",
    },
    lunchtime: {
      title: "Lunchtime Under-Eye Laser",
      desc1: "A non-surgical treatment that reduces under-eye fat using special patches and laser shockwave technology",
      desc2: "Quick enough for a lunchtime visit and also helps improve skin firmness",
    },
    advatx: {
      title: "ADVATX",
      desc1: "A laser device used for vascular and pigmented lesion treatments",
      desc2: "Helps improve facial redness and dilated vessels with minimal skin irritation",
    },
    bbllaser: {
      title: "BBL Laser",
      desc1: "Light-based therapy that helps calm redness while improving firmness",
      desc2: "Repeated sessions may also help improve visible signs of skin aging",
    },
    excelv: {
      title: "Excel V+",
      desc1: "A dual-wavelength vascular laser designed to target facial redness and visible capillaries",
      desc2: "Effectively improves red skin while minimizing damage to surrounding tissue",
    },
    starwalker: {
      title: "StarWalker MAQX",
      desc1: "A combined pigment-treatment device integrating Q-switched Nd:YAG and picosecond laser technology",
      desc2: "Multiple wavelengths allow customized treatment for various pigmented lesions",
    },
    profound: {
      title: "Profound RF Lifting",
      desc1: "A high-impact lifting treatment using microneedle RF to deliver energy directly into the dermis",
      desc2: "Recommended for those seeking dramatic firmness improvement in a single session",
    },
    volume: {
      title: "Volume Up Program",
      desc1: "FDA-cleared Sculptra stimulates your skin's own collagen production for natural volume restoration",
      desc2: "Benefits for wrinkles, firmness, and volume can last for around two years or more",
    },
    stemcell: {
      title: "Stem Cell Therapy",
      desc1: "An autologous cell therapy using stem cells derived from your own blood or fat",
      desc2: "Offers low risk of adverse reaction while supporting skin regeneration and elasticity",
    },
    scar: {
      title: "Scar Treatment Program",
      desc1: "An intensive scar-care program combining UltraPulse laser, DRT, MIRAJET, and TRIFILL PRO",
      desc2: "Designed to improve acne scars and depressed scars effectively with reduced discomfort",
    },
    redness: {
      title: "Redness Treatment Program",
      desc1: "A dual-laser program using Excel V+ and ADVATX to target facial redness and visible capillaries",
      desc2: "Improves red, sensitive skin noticeably without injuring the surface",
    },
  },
  ja: {
    thermage: {
      title: "サーマージ FLX",
      desc1: "第4世代RFリフトの到達点",
      desc2: "肌深部のコラーゲンを刺激し、ハリ改善としわ緩和に優れています",
    },
    xerf: {
      title: "セルフ XERF",
      desc1: "最新の高出力RFリフティング機器",
      desc2: "切開なしで自然なリフトアップと弾力改善が期待できます",
    },
    ulthera: {
      title: "ウルセラ",
      desc1: "超音波エネルギーでSMAS層までアプローチする本格リフティング",
      desc2: "FDA承認の非外科的施術で、自然なハリを取り戻します",
    },
    tensera: {
      title: "テンセラ",
      desc1: "高周波と超音波を同時に活用する複合リフティング",
      desc2: "肌のハリ改善とフェイスラインの引き締めに効果的なプレミアム施術です",
    },
    virtue: {
      title: "バーチュRF",
      desc1: "マイクロニードルRFで肌深部に直接エネルギーを届けます",
      desc2: "ハリ改善と毛穴縮小を同時に期待できます",
    },
    shrink: {
      title: "シュリンク ユニバース",
      desc1: "集束超音波リフトのアップグレード版",
      desc2: "従来のシュリンクより広範囲をスピーディーにカバーし、施術時間を短縮します",
    },
    onda: {
      title: "オンダ ONDA",
      desc1: "特許取得のマイクロウェーブ技術で、リフトアップとタイトニングを実現",
      desc2: "コラーゲンリモデリングを促し、即時的な引き締め感と弾力向上が期待できます",
    },
    tensma: {
      title: "テンスマ",
      desc1: "針を使わず有効成分を真皮層へ届けるノーニードル施術",
      desc2: "リフティングと肌再生が期待でき、施術後すぐに日常生活へ戻れます",
    },
    bblskin: {
      title: "BBL スキンタイト",
      desc1: "米国SCITON社の高性能機器で行う施術です",
      desc2: "赤外線が肌内部のコラーゲンを刺激し、自然なハリ感を高めます",
    },
    trinity: {
      title: "トリニティ リフトニング",
      desc1: "1064nm・808nm・755nmの3波長を同時照射する韓国初の複合レーザー",
      desc2: "リフトアップとトーニングを同時に行い、肝斑・くすみ・赤みまで明るく整えます",
    },
    undereye: {
      title: "目の下の脂肪再配置",
      desc1: `${_eyeBagCases}件以上の経験をもとに、クマと目の下のふくらみを同時に改善`,
      desc2: "脂肪を再配置し、自然でなめらかな目元ラインをつくる代表施術です",
    },
    lunchtime: {
      title: "ランチタイム 目の下レーザー",
      desc1: "特殊パッチとレーザー衝撃波で組織損傷を抑えながら目の下の脂肪を減らす非手術施術",
      desc2: "ランチタイムにも受けられるほど手軽で、肌のハリ改善も期待できます",
    },
    advatx: {
      title: "アドバ TX",
      desc1: "血管・色素病変の治療に用いられるレーザー機器です",
      desc2: "肌への刺激を抑えながら、赤ら顔や毛細血管拡張を改善します",
    },
    bbllaser: {
      title: "BBL レーザー",
      desc1: "光治療により赤みの緩和と肌のハリ改善を同時にケア",
      desc2: "継続施術により肌老化の改善も期待できます",
    },
    excelv: {
      title: "エクセル V+",
      desc1: "血管選択性に優れたデュアル波長レーザーで、赤ら顔や毛細血管拡張を集中ケア",
      desc2: "周囲組織へのダメージを抑えながら、赤みを効果的に改善します",
    },
    starwalker: {
      title: "スターウォーカー MAQX",
      desc1: "QスイッチNd:YAGとピコ秒レーザーを組み合わせた複合色素治療機器",
      desc2: "多波長により、さまざまな色素病変に対応します",
    },
    profound: {
      title: "プロファウンド RF リフティング",
      desc1: "マイクロニードルRFで真皮層へ直接エネルギーを届ける高効果リフティング",
      desc2: "1回でもしっかりとしたハリ改善を望む方におすすめです",
    },
    volume: {
      title: "ボリュームアップ プログラム",
      desc1: "FDA承認のスカルプトラで、自身のコラーゲン生成を促し自然なボリュームを回復",
      desc2: "しわ改善・弾力・ボリューム回復効果は平均2年以上持続します",
    },
    stemcell: {
      title: "幹細胞治療",
      desc1: "ご自身の血液・脂肪から抽出した幹細胞を肌に注入する自己細胞治療です",
      desc2: "副反応リスクが低く、肌再生や弾力改善が期待できます",
    },
    scar: {
      title: "瘢痕治療 プログラム",
      desc1: "ウルトラパルスレーザー・DRT・ミラジェット・TRIFILL PROを組み合わせた集中瘢痕治療プログラム",
      desc2: "痛みの負担を抑えながら、ニキビ跡や凹み瘢痕を効果的に改善します",
    },
    redness: {
      title: "赤み治療 プログラム",
      desc1: "Excel V+・ADVATXのデュアルレーザーで、赤ら顔や毛細血管拡張を専門的に治療",
      desc2: "肌表面を傷つけずに、赤み肌を目に見えて改善するプログラムです",
    },
  },
  zh: {
    thermage: {
      title: "热玛吉 FLX",
      desc1: "第四代射频提拉的代表疗程",
      desc2: "刺激肌肤深层胶原蛋白，显著改善松弛与细纹",
    },
    xerf: {
      title: "赛尔夫 XERF",
      desc1: "新一代高强度射频提拉设备",
      desc2: "无需切开，即可带来自然提升与弹力改善效果",
    },
    ulthera: {
      title: "超声刀",
      desc1: "通过聚焦超声直达SMAS层的经典提拉疗程",
      desc2: "FDA认证的非手术项目，帮助肌肤自然恢复紧致弹性",
    },
    tensera: {
      title: "天瑟拉",
      desc1: "结合射频与超声能量的复合提拉疗程",
      desc2: "有助于提升肌肤弹性并改善面部轮廓",
    },
    virtue: {
      title: "维图RF",
      desc1: "微针射频将能量直接传递至皮肤深层",
      desc2: "可同时改善弹力与毛孔粗大问题",
    },
    shrink: {
      title: "舒力可 宇宙版",
      desc1: "升级版聚焦超声提拉疗程，可向不同深度精准传递能量",
      desc2: "相较传统舒力可更快速覆盖更大范围，缩短治疗时间",
    },
    onda: {
      title: "翁达 ONDA",
      desc1: "采用专利微波技术，带来提拉与紧致效果",
      desc2: "持续促进胶原重塑，帮助实现即时提升与弹力改善",
    },
    tensma: {
      title: "天丝玛",
      desc1: "无针将有效成分直接导入真皮层的疗程",
      desc2: "有助于提拉与肌肤修复，术后可较快恢复日常生活",
    },
    bblskin: {
      title: "BBL 紧肤",
      desc1: "采用美国SCITON高性能设备进行治疗",
      desc2: "通过红外光刺激肌肤内部胶原蛋白，自然提升紧致度",
    },
    trinity: {
      title: "三合一 提拉",
      desc1: "韩国首款同时发射1064nm、808nm、755nm三种波长的复合激光",
      desc2: "一次兼顾提拉与焕肤，改善黄褐斑、色斑与泛红，令肌肤更净透",
    },
    undereye: {
      title: "眼下脂肪重置",
      desc1: `基于${_eyeBagCases}例以上经验，同时改善黑眼圈与眼下膨隆`,
      desc2: "通过脂肪重新定位，打造更自然平整的眼下轮廓",
    },
    lunchtime: {
      title: "午间 眼下激光",
      desc1: "通过特殊贴片与激光冲击波，在尽量减少组织损伤的同时改善眼下脂肪的非手术疗程",
      desc2: "时间短、负担轻，午休时间也可进行，并有助于提升眼周弹性",
    },
    advatx: {
      title: "阿德瓦 TX",
      desc1: "用于治疗血管性与色素性病变的激光设备",
      desc2: "在尽量减少皮肤刺激的情况下改善泛红与毛细血管扩张",
    },
    bbllaser: {
      title: "BBL 激光",
      desc1: "通过光疗同时改善泛红与肌肤紧致度",
      desc2: "持续治疗有助于改善可见性肌肤老化问题",
    },
    excelv: {
      title: "卓越 V+",
      desc1: "双波长血管激光，针对面部泛红与毛细血管扩张进行集中改善",
      desc2: "在尽量减少周围组织损伤的同时，有效改善泛红肌肤",
    },
    starwalker: {
      title: "星行者 MAQX",
      desc1: "结合Q开关Nd:YAG与皮秒技术的复合色素治疗设备",
      desc2: "通过多波长模式，可应对多种色素性问题",
    },
    profound: {
      title: "深层 RF 提拉",
      desc1: "通过微针射频将能量直接作用于真皮层的高效提拉疗程",
      desc2: "适合希望通过一次治疗获得明显紧致改善的人群",
    },
    volume: {
      title: "丰盈 计划",
      desc1: "FDA认证的Sculptra可促进自身胶原生成，自然恢复面部饱满度",
      desc2: "改善细纹、弹性与凹陷的效果平均可维持2年以上",
    },
    stemcell: {
      title: "干细胞 治疗",
      desc1: "采用从自身血液或脂肪中提取的干细胞进行的自体细胞治疗",
      desc2: "不良反应风险较低，有助于肌肤修复与弹力提升",
    },
    scar: {
      title: "疤痕 治疗计划",
      desc1: "结合UltraPulse激光、DRT、MIRAJET与TRIFILL PRO的综合疤痕治疗方案",
      desc2: "在尽量降低不适感的同时，有效改善痘坑与凹陷性疤痕",
    },
    redness: {
      title: "泛红 治疗计划",
      desc1: "采用Excel V+与ADVATX双激光，针对面部泛红与毛细血管扩张进行治疗",
      desc2: "无需损伤皮肤表面，也能明显改善泛红肌肤",
    },
  },
};

// 장비 ID 매핑 (카드 컴포넌트에서 사용)
export const equipmentIdMap: Record<string, keyof typeof equipmentTranslations.ko> = {
  thermage: "thermage",
  xerf: "xerf",
  ulthera: "ulthera",
  tensera: "tensera",
  virtue: "virtue",
  shrink: "shrink",
  onda: "onda",
  tensma: "tensma",
  bblskin: "bblskin",
  trinity: "trinity",
  undereye: "undereye",
  lunchtime: "lunchtime",
  advatx: "advatx",
  bbllaser: "bbllaser",
  excelv: "excelv",
  starwalker: "starwalker",
  profound: "profound",
  volume: "volume",
  stemcell: "stemcell",
  scar: "scar",
  redness: "redness",
};

/**
 * 주어진 장비 ID와 언어로 번역 텍스트 가져오기
 */
export function getEquipmentText(equipmentId: string, lang: "ko" | "en" | "ja" | "zh"): EquipmentText | null {
  const key = equipmentIdMap[equipmentId];
  if (!key) return null;
  return equipmentTranslations[lang][key] || null;
}

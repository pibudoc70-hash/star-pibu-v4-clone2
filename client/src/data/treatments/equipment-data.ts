/**
 * equipment-data.ts
 * 장비 카테고리별 정적 데이터.
 * 이 파일은 순수 데이터만 포함하며 React 의존성이 없다.
 */
import type { Equipment } from "@/types/treatment";


const EQUIPMENT: Record<string, Equipment[]> = {
  best: [
    { brand: "MERZ AESTHETICS", name: "울쎄라피 프라임", desc: "집속초음파 기술을 적용한 최신 버전", descEn: "Latest version using focused ultrasound technology", descJa: "集束超音波技術を採用した最新バージョン", descZh: "采用聚焦超声波技术的最新版本", image: "/api/storage/ulthera-prime_1_798484e7_c9058abb.png" },
    { brand: "THERMAGE FLX", name: "써마지 FLX", desc: "조시형 원장 공식 자문의 장비", descEn: "Official advisory device of Dr. Jo Si-hyeong", descJa: "趙時亨院長公式アドバイザー機器", descZh: "赵时亨院长官方顾问设备", image: "/api/storage/thermage-flx_f1163ff8_03a0e6ae.png" },
    { brand: "REJURAN", name: "리쥬란 힐러", desc: "피부 재생 연어 주사", descEn: "Salmon DNA skin regeneration injection", descJa: "皮膚再生サーモンDNA注射", descZh: "皮肤再生三文鱼DNA注射", image: "/api/storage/lasemd-ultra_a5fd8612_006e0525.png" },
    { brand: "ULTRAPULSE CO₂", name: "울트라펄스", desc: "흉터 치료 전문 CO₂ 레이저", descEn: "Specialized CO2 laser for scar treatment", descJa: "瘢痕治療専門CO2レーザー", descZh: "疤痕治疗专用CO2激光", image: "/api/storage/playduo_6eccf485_7b4b7fa8.png" },
    { brand: "EXCEL V+", name: "엑셀 V플러스", desc: "홍조·혈관 치료의 표준", descEn: "Standard for redness and vascular treatment", descJa: "紅潮・血管治療の標準", descZh: "红肌和血管治疗的标准", image: "/api/storage/excel-v_5364dd04_e71c3bd4.png" },
    { brand: "ADVATX", name: "아드바티엑스", desc: "홍조 탄력 개선 레이저", descEn: "Laser for redness and elasticity improvement", descJa: "紅潮弾力改善レーザー", descZh: "红肌弹力改善激光", image: "/api/storage/adva-tx_e865914d_6315b701.png" },
    { brand: "SCULPTRA", name: "스컬트라", desc: "FDA 승인 콜라겐 자극제", descEn: "FDA-approved collagen stimulator", descJa: "FDA承認コラーゲン刺激剤", descZh: "FDA批准的胶原蛋白刺激剂", image: "/api/storage/lasemd-ultra_a5fd8612_006e0525.png" },
    { brand: "PROFOUND RF", name: "프로파운드", desc: "진피층 직접 자극 RF 리프팅", descEn: "RF lifting that directly stimulates the dermis layer", descJa: "真皮層を直接刺激するRFリフティング", descZh: "直接刺激真皮层的RF提升", image: "/api/storage/profound_481e0c83_b36d0ef8.png" },
  ],
  lifting: [
    { brand: "MERZ AESTHETICS", name: "울쎄라피 프라임", desc: "집속초음파 기술을 적용한 최신 버전", descEn: "Latest version using focused ultrasound technology", descJa: "集束超音波技術を採用した最新バージョン", descZh: "采用聚焦超声波技术的最新版本", image: "/api/storage/ulthera-prime_1_798484e7_c9058abb.png" },
    { brand: "THERMAGE FLX", name: "써마지 FLX", desc: "조시형 원장 공식 자문의 장비", descEn: "Official advisory device of Dr. Jo Si-hyeong", descJa: "趙時亨院長公式アドバイザー機器", descZh: "赵时亨院长官方顾问设备", image: "/api/storage/thermage-flx_f1163ff8_03a0e6ae.png" },
    { brand: "REVINAS", name: "세르프 리프팅", desc: "최신 고강도 RF 리프팅", descEn: "Latest high-intensity RF lifting", descJa: "最新高強度RFリフティング", descZh: "最新高强度射频提升", image: `/api/storage/equip-xerf-cropped_d21e359e_16d3dcea.png` },
    { brand: "SHURINK UNIVERSE", name: "스른크 유니버스", desc: "집속 초음파 리프팅의 진화", descEn: "Evolution of focused ultrasound lifting", descJa: "集束超音波リフティングの進化", descZh: "聚焦超声提升的进化", image: "/api/storage/shurink_77cc74d6_6b7e0dec.png" },
    { brand: "PROFOUND RF", name: "프로파운드", desc: "진피층 직접 자극 RF 리프팅", descEn: "RF lifting that directly stimulates the dermis layer", descJa: "真皮層を直接刺激するRFリフティング", descZh: "直接刺激真皮层的RF提升", image: "/api/storage/profound_481e0c83_b36d0ef8.png" },
    { brand: "VIRTUE RF", name: "버츄RF", desc: "마이크로니들 RF 리프팅", descEn: "Microneedle RF lifting treatment", descJa: "マイクロニードルRFリフティング", descZh: "微针RF提升治疗", image: "/api/storage/virtue-rf_47204eff_0ae44252.png" },
    { brand: "OLIGIO X", name: "올리지오X", desc: "RF 고주파 리프팅의 새로운 기준", descEn: "New standard in RF high-frequency lifting", descJa: "RF高周波リフティングの新基準", descZh: "射频高频提升的新标准", image: "/api/storage/oligio-x_e1e54986_86f0c9be.png" },
    { brand: "TRINITY LIFTONING", name: "트리니티 리프토닝", desc: "리프팅과 토닝을 동시에", descEn: "Simultaneous lifting and skin toning", descJa: "リフティングとトーニングを同時に", descZh: "同时进行提升和调肤", image: "/api/storage/trinity-liftoning_4ef97ebc_90a2d003.png" },
    { brand: "LAFERRA", name: "라페라 리프팅", desc: "고주파 얼굴 탄력 리프팅", descEn: "High-frequency facial elasticity lifting", descJa: "高周波顔面弾力リフティング", descZh: "高频面部弹力提升", image: "/api/storage/lasemd-ultra_a5fd8612_006e0525.png" },
    { brand: "EXILIS ULTRA", name: "엑실리스 울트라", desc: "RF+초음파 복합 리프팅", descEn: "Combined RF + ultrasound lifting", descJa: "RF+超音波複合リフティング", descZh: "射频+超声波复合提升", image: "/api/storage/exilis-ultra_5449a8ed_09b4fe4b.png" },
    { brand: "TENSERA", name: "테늤라", desc: "고주파 초음파 복합 리프팅", descEn: "Combined high-frequency ultrasound lifting", descJa: "高周波超音波複合リフティング", descZh: "高频超声波复合提升", image: "/api/storage/tensera-modal_9b5a5348_2e3e3932.png" },
    { brand: "TENSEMA", name: "테늤마", desc: "고주파 초음파 복합 리프팅", descEn: "Combined high-frequency ultrasound lifting", descJa: "高周波超音波複合リフティング", descZh: "高频超声波复合提升", image: "/api/storage/tensera-modal_9b5a5348_2e3e3932.png" },
  ],
  eye: [
    { brand: "DERMASHINE PRO", name: "더마샤인 프로", desc: "수분 공급과 리프팅 동시", descEn: "Simultaneous moisture supply and lifting", descJa: "水分補給とリフティングを同時に", descZh: "同时补水和提升", image: "/api/storage/lasemd-ultra_a5fd8612_006e0525.png" },
    { brand: "ENERJET", name: "에너젯", desc: "무침 약물 주입 리프팅", descEn: "Needle-free drug delivery lifting", descJa: "無針薬物注入リフティング", descZh: "无针药物注入提升", image: "/api/storage/enerjet_afcf856d_370d2a25.png" },
  ],
  rosacea: [
    { brand: "EXCEL V+", name: "엑셀 V플러스", desc: "혈관·색소 치료의 표준", descEn: "Standard for vascular and pigment treatment", descJa: "血管・色素治療の標準", descZh: "血管和色素治疗的标准", image: "/api/storage/excel-v_5364dd04_e71c3bd4.png" },
    { brand: "BBL HERO", name: "BBL 히어로", desc: "광치료 홍조·색소 복합 개선", descEn: "Phototherapy for combined redness and pigment improvement", descJa: "光治療による紅潮・色素複合改善", descZh: "光疗复合改善红肌和色素", image: "/api/storage/bbl-removebg-preview_f5544d44_fdb327f5.png" },
  ],
  pigment: [
    { brand: "DISCOVERY PICO", name: "디스커버리 피코", desc: "피코초 레이저 색소·문신 제거", descEn: "Picosecond laser for pigment and tattoo removal", descJa: "ピコ秒レーザーによる色素・タトゥー除去", descZh: "皮秒激光去除色素和纹身", image: "/api/storage/discovery-pico_41237d61_0b78b97d.png" },
    { brand: "PICOSURE", name: "피코슈어", desc: "755nm 피코초 레이저", descEn: "755nm picosecond laser", descJa: "755nmピコ秒レーザー", descZh: "755nm皮秒激光", image: "/api/storage/picosure_71bad6af_8e64bc90.png" },
    { brand: "ENLIGHTEN 3RD", name: "인라이튼 루비피코", desc: "3세대 피코초 레이저", descEn: "3rd-generation picosecond laser", descJa: "第3世代ピコ秒レーザー", descZh: "第三代皮秒激光", image: "/api/storage/enlighten-ruby-pico_43c3fbfb_5b70e61c.png" },
    { brand: "STAR WALKER MAQX", name: "스타워커 MAQX", desc: "색소 치료 전문 레이저", descEn: "Specialized laser for pigment treatment", descJa: "色素治療専門レーザー", descZh: "色素治疗专用激光", image: "/api/storage/starwalker_7ba78892_61be4721.png", detail: "스타워커 MAQX는 Q-스위치 Nd:YAG 레이저와 피코초 레이저를 결합한 복합 색소 치료 장비입니다. 532nm·1064nm·585nm·650nm 다중 파장을 지원하여 기미·잡티·문신·검버섯·오타모반 등 다양한 색소 병변에 대응합니다. 피코초 펄스로 색소 입자를 미세하게 분쇄하여 체내 흡수·배출을 촉진하며, 주변 정상 조직 손상을 최소화합니다.", detailEn: "StarWalker MAQX is a multi-pigment treatment device combining Q-switched Nd:YAG and picosecond laser. Supports 532nm, 1064nm, 585nm, and 650nm wavelengths to address various pigment lesions including melasma, freckles, tattoos, seborrheic keratosis, and Ota nevus. Picosecond pulses finely shatter pigment particles to promote absorption and elimination while minimizing damage to surrounding normal tissue.", detailJa: "スターウォーカーMAQXはQスイッチNd:YAGレーザーとピコ秒レーザーを組み合わせた複合色素治療機器です。532nm・1064nm・585nm・650nmの多重波長に対応し、シミ・そばかす・タトゥー・脂漏性角化症・太田母斑など様々な色素病変に対応します。ピコ秒パルスで色素粒子を微細に粉砕して体内吸収・排出を促進し、周囲の正常組織へのダメージを最小化します。", detailZh: "StarWalker MAQX是结合Q开关Nd:YAG激光和皮秒激光的复合色素治疗设备。支持532nm、1064nm、585nm、650nm多波长，可应对黄褐斑、雀斑、纹身、脂溢性角化症、太田痣等各种色素病变。皮秒脉冲精细粉碎色素颗粒，促进体内吸收排出，同时最大限度减少对周围正常组织的损伤。" },
    { brand: "PENTO 9900", name: "펜토 9900", desc: "색소 탄력 복합 치료", descEn: "Combined pigment and elasticity treatment", descJa: "色素弾力複合治療", descZh: "色素和弹力综合治疗", image: "/api/storage/pento9900_3af14ef2_b901c4f9.png" },
    { brand: "JOULE LASER", name: "줄 레이저", desc: "색소·흉터·박피 다목적 레이저", descEn: "Multi-purpose laser for pigment, scars, and resurfacing", descJa: "色素・瘢痕・剥離の多目的レーザー", descZh: "色素、疤痕和磨皮多功能激光", image: "/api/storage/healer_6ec6c8e4_bb1418ab.png" },
  ],
  scar: [
    { brand: "PLADUO", name: "플라듀오 레이저", desc: "여드름 흉터 전용 레이저", descEn: "Dedicated laser for acne scar treatment", descJa: "ニキビ瘢痕専用レーザー", descZh: "痘疤专用激光", image: "/api/storage/playduo_6eccf485_7b4b7fa8.png" },
    { brand: "TIXEL LASER", name: "틱셀 레이저", desc: "여드름·흉터·모공 개선", descEn: "Acne, scar, and pore improvement", descJa: "ニキビ・瘢痕・毛穴改善", descZh: "痘痘、疤痕和毛孔改善", image: "/api/storage/tixel_98a5cbdf_3d21a076.png" },
    { brand: "ADVATX", name: "아드바티엑스", desc: "흉터 탄력 개선 레이저", descEn: "Laser for scar and elasticity improvement", descJa: "瘢痕弾力改善レーザー", descZh: "疤痕和弹力改善激光", image: "/api/storage/adva-tx_e865914d_6315b701.png" },
    { brand: "PROFOUND RF", name: "프로파운드", desc: "진피층 직접 자극 RF", descEn: "RF energy directly targeting the dermis layer", descJa: "真皮層を直接刺激するRFエネルギー", descZh: "直接作用于真皮层的RF能量", image: "/api/storage/profound_481e0c83_b36d0ef8.png" },
  ],
  volume: [
    { brand: "DERMASHINE PRO", name: "더마샤인 프로", desc: "수분·탄력 스킨부스터", descEn: "Moisture and elasticity skin booster", descJa: "水分・弾力スキンブースター", descZh: "水分和弹力皮肤促进剂", image: "/api/storage/lasemd-ultra_a5fd8612_006e0525.png" },
    { brand: "ENERJET", name: "에너젯", desc: "무침 약물 주입 리프팅", descEn: "Needle-free drug delivery lifting treatment", descJa: "無針薬物注入リフティング", descZh: "无针药物注射提升治疗", image: "/api/storage/enerjet_afcf856d_370d2a25.png" },
  ],
  botox: [
    { brand: "DERMASHINE PRO", name: "더마샤인 프로", desc: "수분·탄력 스킨부스터", descEn: "Moisture and elasticity skin booster", descJa: "水分・弾力スキンブースター", descZh: "水分和弹力皮肤促进剂", image: "/api/storage/lasemd-ultra_a5fd8612_006e0525.png" },
    { brand: "ENERJET", name: "에너젯", desc: "무침 약물 주입 리프팅", descEn: "Needle-free drug delivery lifting treatment", descJa: "無針薬物注入リフティング", descZh: "无针药物注射提升治疗", image: "/api/storage/enerjet_afcf856d_370d2a25.png" },
  ],
  acne_laser: [
    { brand: "AVICLEAR", name: "아비클리어", desc: "FDA 승인 여드름 전용 1,726nm 레이저", descEn: "FDA-approved 1,726nm laser dedicated to acne treatment", descJa: "FDA承認ニキビ専用1,726nmレーザー", descZh: "FDA批准的1,726nm痘痘专用激光", image: "/api/storage/aviclear_2d9cab50_01f97741.png" },
    { brand: "CAPRI LASER", name: "카프리", desc: "염증성 여드름 이중 파장 레이저", descEn: "Dual-wavelength laser for inflammatory acne", descJa: "炎症性ニキビ二重波長レーザー", descZh: "炎症性痘痘双波长激光", image: "/api/storage/aviclear_2d9cab50_01f97741.png" },
    { brand: "PLADUO", name: "플라듀오", desc: "플라즈마+레이저 복합 여드름 치료", descEn: "Combined plasma and laser acne treatment", descJa: "プラズマ+レーザー複合ニキビ治療", descZh: "等离子体+激光复合痘痘治疗", image: "/api/storage/playduo_6eccf485_7b4b7fa8.png" },
    { brand: "PLATINUM PTT", name: "플래티넘PTT", desc: "플래티넘 나노입자 광열 여드름 치료", descEn: "Platinum nanoparticle photothermal acne treatment", descJa: "プラチナナノ粒子光熱ニキビ治療", descZh: "铂纳米粒子光热痘痘治疗", image: "/api/storage/aviclear_2d9cab50_01f97741.png" },
    { brand: "NEOGEN PLASMA", name: "네오젠플라즈마", desc: "플라즈마 에너지 피부 재생", descEn: "Plasma energy skin regeneration", descJa: "プラズマエネルギー皮膚再生", descZh: "等离子体能量皮肤再生", image: "/api/storage/aviclear_2d9cab50_01f97741.png" },
    { brand: "KOBAYASHI", name: "고바야시 절연침", desc: "절연침 기술 고주파 에너지 여드름 치료", descEn: "Insulated needle RF energy acne treatment", descJa: "絶縁針技術高周波エネルギーニキビ治療", descZh: "绝缘针技术高频能量痘痘治疗", image: "/api/storage/aviclear_2d9cab50_01f97741.png" },
  ],
  psoriasis: [
    { brand: "NB-UVB SYSTEM", name: "전신자외선 치료기", desc: "협대역 자외선B 건선·아토피 치료", descEn: "Narrowband UVB phototherapy for psoriasis and atopic dermatitis", descJa: "協帯域UVB乾癬・アトピー治療", descZh: "窄带UVB银屑病和特应性皮炎治疗", image: "/api/storage/excimer-v7_5a8a4340_abe47dad.jpg", detail: "311nm NB-UVB를 전신에 균일 조사하는 광선 치료 장비. 건선·아토피 피부염·백반증에 활용됩니다.", detailEn: "Full-body phototherapy device that uniformly irradiates 311nm NB-UVB. Used for psoriasis, atopic dermatitis, and vitiligo.", detailJa: "311nm NB-UVBを全身に均一照射する光線治療機器。乾癬・アトピー性皮膚炎・白斑に活用されます。", detailZh: "将311nm NB-UVB均匀照射全身的光线治疗设备。用于银屑病、特应性皮炎和白癜风。" },
    { brand: "EXCIMER V7", name: "엑시머 V7 (건선)", desc: "308nm 건선 병변 집중 레이저", descEn: "308nm excimer laser for focused psoriasis lesion treatment", descJa: "308nm乾癬病変集中レーザー", descZh: "308nm银屑病病变集中激光", image: "/api/storage/excimer-v7_5a8a4340_abe47dad.jpg", detail: "308nm 엑시머 레이저로 건선 병변 부위에만 집중 조사. 전신 광선 치료 대비 치료 횟수를 단축합니다.", detailEn: "308nm excimer laser for focused irradiation only on psoriasis lesion areas. Reduces treatment sessions compared to full-body phototherapy.", detailJa: "308nmエキシマレーザーで乾癬病変部位のみに集中照射。全身光線治療と比べて治療回数を短縮します。", detailZh: "308nm准分子激光仅集中照射银屑病病变部位。与全身光线治疗相比减少治疗次数。" },
  ],
  vitiligo: [
    { brand: "EXCIMER V7", name: "엑시머 V7", desc: "308nm 백반증 전문 엑시머 레이저", descEn: "308nm excimer laser specialized for vitiligo", descJa: "308nm白斑専門エキシマレーザー", descZh: "308nm白癜风专用准分子激光", image: "/api/storage/excimer-v7_5a8a4340_abe47dad.jpg", detail: "엑시머 V7은 308nm 파장의 엑시머 레이저를 이용한 백반증·건선 전문 치료 장비입니다. 병변 부위에만 집중 조사하여 정상 피부 노출을 최소화하며, FDA 승인을 받은 안전한 장비입니다.", detailEn: "Excimer V7 is a specialized treatment device for vitiligo and psoriasis using 308nm wavelength excimer laser. It concentrates irradiation only on lesion areas to minimize normal skin exposure, and is FDA-approved safe equipment.", detailJa: "エキシマV7は308nm波長のエキシマレーザーを利用した白斑・乾癬専門治療機器です。病変部位のみに集中照射して正常皮膚の露出を最小化し、FDA承認を受けた安全な機器です。", detailZh: "Excimer V7是使用308nm波长准分子激光的白癜风和银屑病专科治疗设备。仅集中照射病变部位，最大限度减少正常皮肤暴露，是FDA认证的安全设备。" },
    { brand: "NB-UVB SYSTEM", name: "전신자외선 치료기", desc: "협대역 자외선B 전신 광선 치료", descEn: "Narrowband UVB full-body phototherapy", descJa: "狭帯域UVB全身光線治療", descZh: "窄带UVB全身光线治疗", image: "/api/storage/excimer-v7_5a8a4340_abe47dad.jpg", detail: "311nm 협대역 자외선B(NB-UVB)를 전신에 균일하게 조사하는 광선 치료 장비입니다. 전신 백반증·건선·아토피 피부염 등 다양한 피부 질환에 활용됩니다.", detailEn: "Full-body phototherapy device that uniformly irradiates 311nm narrowband UVB. Used for various skin conditions including vitiligo, psoriasis, and atopic dermatitis.", detailJa: "311nm狭帯域UVB（NB-UVB）を全身に均一に照射する光線治療機器です。全身白斑・乾癬・アトピー性皮膚炎など様々な皮膚疾患に活用されます。", detailZh: "将311nm窄带UVB（NB-UVB）均匀照射全身的光线治疗设备。用于全身白癜风、银屑病、特应性皮炎等各种皮肤疾病。" },
    { brand: "EPIDERMAL GRAFT", name: "표피이식 시스템", desc: "흡입 수포법 표피이식 전용 장비", descEn: "Epidermal graft system using suction blister method", descJa: "吸引水疱法表皮移植専用機器", descZh: "使用吸引水疱法的表皮移植专用设备", image: "/api/storage/excimer-v7_5a8a4340_abe47dad.jpg", detail: "흡입 수포법(Suction Blister)을 이용해 정상 피부 표피를 분리·채취하는 표피이식 전용 장비입니다. 안정기 백반증 수술적 치료에 활용됩니다.", detailEn: "Dedicated epidermal graft device that separates and harvests normal skin epidermis using the Suction Blister method. Used for surgical treatment of stable vitiligo.", detailJa: "吸引水疱法（Suction Blister）を用いて正常皮膚の表皮を分離・採取する表皮移植専用機器です。安定期白斑の外科的治療に活用されます。", detailZh: "使用吸引水疱法（Suction Blister）分离和采集正常皮肤表皮的表皮移植专用设备。用于稳定期白癜风的外科治疗。" },
  ],
  acne: [
    {
      brand: "SOLTA MEDICAL", name: "miraDry Fresh",
      desc: "마이크로파 에너지로 겨드랑이 땀샘을 영구 제거하는 FDA 승인 장비", descEn: "FDA-approved device for permanent underarm sweat gland removal using microwave energy", descJa: "マイクロ波エネルギーで脇の汗腺を永久除去するFDA承認機器", descZh: "使用微波能量永久去除腋下汗腺的FDA认证设备",
      image: "/api/storage/miradry_69912512_a893a498.png",
      detail: "Solta Medical의 miraDry Fresh는 2.45GHz 마이크로파 에너지를 이용해 에크린·아포크린 땀샘을 비절개로 영구 파괴합니다. 냉각 시스템이 표피를 보호하며 FDA 510(k) 승인 장비입니다.",
      detailEn: "Solta Medical's miraDry Fresh uses 2.45GHz microwave energy to permanently destroy eccrine and apocrine sweat glands without incision. The cooling system protects the epidermis while FDA 510(k) approval ensures safety and efficacy. The treatment effect is permanent and does not require repeated treatments.",
      detailJa: "Solta MedicalのmiraDry Freshは2.45GHzマイクロ波エネルギーを利用してエクリン・アポクリン汗腺を非切開で永久破壊します。冷却システムが表皮を保護しFDA 510(k)承認で安全性と有効性が確認されています。施術効果は永続的で繰り返しの施術が不要です。",
      detailZh: "Solta Medical的miraDry Fresh使用2.45GHz微波能量，以非切口方式永久破坏外分泌和顶泌汗腺。冷却系统保护表皮，FDA 510(k)批准确保安全性和有效性。治疗效果是永久性的，不需要重复治疗。",
    },
    {
      brand: "LIPOSAT", name: "라이포샛 (Liposat)",
      desc: "고주파 에너지로 겨드랑이 땀샘과 지방을 동시 제거하는 비절개 장비", descEn: "Non-incision device for simultaneous removal of underarm sweat glands and fat using RF energy", descJa: "RFエネルギーで脇の汗腺と脂肪を非切開で同時除去する機器", descZh: "使用射频能量无切口同时去除腋下汗腺和脂肪的设备",
      image: "/api/storage/enerjet_afcf856d_370d2a25.png",
      detail: "라이포샛(Liposat)은 RF 에너지를 미세 캐뉼라를 통해 피부 아래 지방층에 전달하여 아포크린 땀샘과 지방 세포를 선택적으로 파괴합니다. 겨드랑이 라인 개선과 액취증 치료를 동시에 실현합니다.",
      detailEn: "Liposat delivers RF energy through a micro-cannula to the fat layer beneath the skin to selectively destroy apocrine sweat glands and fat cells. It simultaneously achieves armpit line improvement and bromhidrosis treatment. The treatment effect is permanent.",
      detailJa: "ライポサット（Liposat）はRFエネルギーを微細カニューレを通して皮膚下の脂肪層に伝達してアポクリン汗腺と脂肪細胞を選択的に破壊します。わきのラインの改善とわきが治療を同時に実現します。施術効果は永続的です。",
      detailZh: "Liposat通过微型套管将RF能量传递到皮肤下方的脂肪层，选择性地破坏顶泌汗腺和脂肪细胞。同时实现腋下轮廓改善和腋臭治疗。治疗效果是永久性的。",
    },
    {
      brand: "ALLERGAN", name: "보톡스 주사 장비",
      desc: "보툴리눔 독소를 정밀 주사하는 다한증 비수술 치료 장비", descEn: "Non-surgical hyperhidrosis treatment device for precise botulinum toxin injection", descJa: "ボツリヌス毒素を精密注射する多汗症非手術治療機器", descZh: "精准注射肉毒素的多汗症非手术治疗设备",
      image: "/api/storage/enerjet_afcf856d_370d2a25.png",
      detail: "미세 주사 기법으로 보툴리눔 독소를 겨드랑이·손바닥·발바닥 등 다한증 부위에 정밀 투여합니다. 아세틸콜린 분비를 억제하여 땀샘 신호를 차단하며, 시술 시간이 짧고 회복 기간이 없습니다.",
      detailEn: "Botulinum toxin is precisely administered to hyperhidrosis areas such as armpits, palms, and soles using micro-injection technique. It inhibits acetylcholine secretion to block sweat gland stimulation signals, with short treatment time and no recovery period. The effect lasts 6-12 months.",
      detailJa: "微細注射技法でボツリヌス毒素をわきの下・手のひら・足の裏など多汗症部位に精密投与します。アセチルコリン分泌を抑制して汗腺刺激信号を遮断し、施術時間が短く回復期間がありません。効果は6〜12ヶ月持続します。",
      detailZh: "使用微注射技术将肉毒杆菌毒素精准注射到腋下、手掌、脚底等多汗症区域。抑制乙酰胆碱分泌，阻断汗腺刺激信号，治疗时间短，无恢复期。效果持续6-12个月。",
    },
    {
      brand: "CUREMAX", name: "큐어맥스",
      desc: "CO2 레이저 여드름 흉터 및 단초 제거 장비", descEn: "CO2 laser device for acne scar and lesion removal", descJa: "CO2レーザーニキビ瘢痕・病変除去機器", descZh: "CO2激光痘疤和病变去除设备",
      image: "/api/storage/curemax_nobg_e5919a31_c4557e3c.png",
      detail: "큐어맥스(CureMax)는 초단위 CO2 레이저 기술을 적용한 여드름 흉터 제거 및 단초 제거 전문 장비입니다. 비침습적 CO2 레이저로 여드름 흉터와 단초를 정밀하게 제거하며, 빠른 치료 시간과 효과적인 결과를 제공합니다.",
      detailEn: "CureMax is a specialized device for acne scar removal and stitch mark removal that applies ultra-short CO2 laser technology. Non-invasive CO2 laser precisely removes acne scars and stitch marks, with fast treatment time and effective results. Immediate return to daily activities is possible after treatment.",
      detailJa: "キュアマックス（CureMax）は超短時間CO2レーザー技術を適用したニキビ跡除去および縫合跡除去専門機器です。非侵襲的CO2レーザーでニキビ跡と縫合跡を精密に除去し、治療時間が短く効果的な結果を提供します。施術後すぐに日常復帰が可能です。",
      detailZh: "CureMax是应用超短CO2激光技术的痘疤去除和缝合痕迹去除专用设备。非侵入性CO2激光精准去除痘疤和缝合痕迹，治疗时间短，效果显著。治疗后可立即恢复日常生活。",
    },
  ],
};

export { EQUIPMENT };

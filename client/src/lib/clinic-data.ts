/**
 * clinic-data.ts
 * JSON-LD 스키마 생성용 의사·시술 정적 데이터.
 *
 * [R16-P2-3] constants.ts에서 분리:
 *   - CLINIC_DOCTORS: MedicalOrganization.employee 스키마용
 *   - CLINIC_PROCEDURES: MedicalProcedure 스키마용
 *
 * 이 파일은 seoHelpers.ts에서만 import한다.
 * 화면 렌더링용 의사 데이터는 client/src/lib/doctors-data.ts를 사용한다.
 *
 * [SSoT] CLINIC_DOCTORS는 doctors-data.ts의 doctors 배열을 변환하여 생성한다.
 * 원장 정보 수정 시 doctors-data.ts만 편집하면 된다.
 */

import { doctors } from "@/lib/doctors-data";
import { LIFTING_DIRECT_CARE_DESCRIPTION } from "@shared/liftingPositioning";

// ── 공통 workLocation (전 원장 동일) ────────────────────────────────────────────
const _WORK_LOCATION = {
  name: "스타피부과",
  address: "부산광역시 부산진구 서면로 74 아이온시티빌딩 4층",
} as const;

// ── 의사 데이터 (JSON-LD MedicalOrganization.employee 스키마용) ─────────────────
// doctors-data.ts의 doctors 배열을 JSON-LD 스키마 형식으로 변환
export const CLINIC_DOCTORS = doctors.map((doc) => {
  // credentials 배열에서 텍스트만 추출 (icon/label 제거)
  const credentialTexts = doc.credentials.map((c) => c.text);

  return {
    name: doc.name.replace(" 원장", ""), // "조시형 원장" → "조시형"
    // nameEn: slug 기반으로 @id 생성 시 사용하므로 slug 포함 형식 유지
    nameEn: (() => {
      // "Dr. JO SI-HYUNG" → slug 기반 nameEn 매핑
      const slugToNameEn: Record<string, string> = {
        cho: "Cho Si-hyung",
        woo: "Woo Hye-jin",
        lee: "Lee Gi-wook",
      };
      return slugToNameEn[doc.slug] ?? doc.nameEn.replace("Dr. ", "");
    })(),
    honorificPrefix: "Dr.",
    jobTitle: doc.title,
    jobTitleEn: doc.jobTitleEn ?? "Dermatologist, MD",
    nationality: "KR",
    slug: doc.slug,
    url: `https://star-pibu.com/#dr-${doc.slug}`,
    image: doc.image.replace(/\.[^.]+$/, ".png"), // webp → png (스키마용)
    description: `${doc.schemaDescription ?? doc.intro[0] ?? ""} ${LIFTING_DIRECT_CARE_DESCRIPTION}`.trim(),
    sameAs: doc.sameAs ?? [
      "https://www.youtube.com/@starpibu",
      "https://blog.naver.com/starpibu",
      "https://instagram.com/starpibu",
    ],
    credentials: credentialTexts,
    specialties: [...doc.specialties],
    knowsAbout: [...doc.specialties, "리프팅 시술", "통증 관리"],
    alumniOf: doc.alumniOf ?? [],
    memberOf: doc.memberOf ?? [],
    award: doc.award ?? [],
    workLocation: _WORK_LOCATION,
    availableService: doc.availableService ?? [],
  };
});

// ── 주요 시술 목록 (JSON-LD MedicalProcedure 스키마용) ──────────────────────────
export const CLINIC_PROCEDURES = [
  {
    name: "울쎄라피 프라임",
    nameEn: "Ultherapy Prime",
    url: "https://star-pibu.com/equipment3/ultherapy",
    description: "초음파 에너지를 이용한 비침습적 리프팅 시술. SMAS층까지 에너지를 전달하여 피부 탄력 개선 및 리프팅 효과를 제공합니다.",
    bodyLocation: "얼굴, 목, 데콜테",
    procedureType: "Noninvasive",
    followup: "시술 후 특별한 회복 기간 없음",
    howPerformed: "집속 초음파(HIFU) 에너지를 피부 심층부에 전달하여 콜라겐 재생을 유도합니다.",
  },
  {
    name: "써마지 FLX",
    nameEn: "Thermage FLX",
    url: "https://star-pibu.com/equipment3/thermage",
    description: "고주파(RF) 에너지를 이용한 피부 탄력 개선 시술. 콜라겐 재생을 촉진하여 피부 탄력을 높이고 주름을 개선합니다.",
    bodyLocation: "얼굴, 목, 눈가, 몸",
    procedureType: "Noninvasive",
    followup: "시술 후 특별한 회복 기간 없음",
    howPerformed: "고주파(RF) 에너지를 피부 진피층에 전달하여 콜라겐 재생을 유도합니다.",
  },
  {
    name: "눈밑지방재배치",
    nameEn: "Lower Eyelid Fat Repositioning",
    url: "https://star-pibu.com/equipment3/eye-bag",
    description: "눈밑 과잉 지방을 눈물고랑으로 재배치하여 다크서클과 눈밑 볼록함을 동시에 개선하는 수술적 시술입니다.",
    bodyLocation: "눈밑",
    procedureType: "Surgical",
    followup: "시술 후 1~2주 회복 기간 필요",
    howPerformed: "결막을 통해 눈밑 지방을 분리하여 눈물고랑 부위로 재배치합니다.",
  },
  {
    name: "리주란힐러",
    nameEn: "Rejuran Healer",
    url: "https://star-pibu.com/equipment3/rejuran",
    description: "연어 DNA(PDRN) 성분을 피부에 주입하여 피부 재생과 탄력을 개선하는 주사 시술입니다.",
    bodyLocation: "얼굴 전체",
    procedureType: "Injection",
    followup: "시술 후 2~3일 내 회복",
    howPerformed: "미세 주사를 통해 PDRN 성분을 진피층에 주입합니다.",
  },
  {
    name: "피코레이저",
    nameEn: "Pico Laser",
    url: "https://star-pibu.com/equipment3/pico-laser",
    description: "피코초 단위의 레이저로 색소 병변을 분해하고 피부 톤을 개선하는 레이저 시술입니다.",
    bodyLocation: "얼굴, 몸",
    procedureType: "Laser",
    followup: "시술 후 2~3일 내 회복",
    howPerformed: "피코초 레이저 에너지로 멜라닌 색소를 분해합니다.",
  },
  {
    name: "흉터치료",
    nameEn: "Scar Treatment",
    url: "https://star-pibu.com/equipment3/scar",
    description: "여드름 흉터, 수술 흉터 등 다양한 흉터를 레이저와 주사 치료로 개선합니다.",
    bodyLocation: "얼굴, 몸",
    procedureType: "Laser",
    followup: "치료 방법에 따라 회복 기간 상이",
    howPerformed: "레이저 및 주사 치료를 통해 흉터 조직을 재생합니다.",
  },
] as const;

// ── 관리 장비 데이터 타입 ─────────────────────────────────────────────────────
export interface ManagementDevice {
  id: string;
  name: string;
  nameEn: string;
  nameJa: string;
  nameZh: string;
  nameZhTw?: string;
  shortDesc: string;
  shortDescEn: string;
  shortDescJa: string;
  shortDescZh: string;
  shortDescZhTw?: string;
  imgId: string;
}

// ── 관리 장비 CDN 경로 ────────────────────────────────────────────────────────
export const MANAGEMENT_DEVICE_CDN = "/api/storage";

// ── 관리 장비 이미지 맵 ───────────────────────────────────────────────────────
export const MANAGEMENT_DEVICE_IMAGES: Record<string, string> = {
  sonopeel: `/api/storage/sonopeel_53d2c9d1_98e548a0.jpg`,
  porederm: `/api/storage/porederm_new_896695b4_2bd9152b.jpg`,
  airbubble: `/api/storage/airbubble_9631da26_03e03b84.jpg`,
  oxyjet: `/api/storage/oxyet_a81daa05_06a40b0e.jpg`,
  inbio: `/api/storage/inbio_new_f3628f96_da0b433c.jpg`,
  flawless: `/api/storage/flawless_48eb550e_5e78910f.jpg`,
  dermalight: `/api/storage/dermalight_new_0effb3eb_2b192086.jpg`,
  fray: `/api/storage/fray_66504ffe_6a6a0764.jpg`,
  ionzyme: `/api/storage/ionzyme_ec731187_aeb6531a.png`,
  healingbright: `/api/storage/healingbright_d060a2aa_ac3bcf4b.jpg`,
  mesoskin: `/api/storage/mesoskin_new_32137830_3a93cfe5.jpg`,
  ultraduo: `/api/storage/ultraduo_af289409_e79e4dfa.jpg`,
  triplemultigel: `/api/storage/supersonic_5df47d2e_38e98bb4.jpg`,
  ldm: `/api/storage/ldm_ac66d69e_8129485d.jpg`,
  ilumi: `/api/storage/ilumi_new_3d286596_5121300a.jpg`,
  transkin: `/api/storage/transskin_67357f56_e00fae32.jpg`,
};

// ── 관리 장비 목록 (4개 언어 완전 번역) ──────────────────────────────────────
export const MANAGEMENT_DEVICES: ManagementDevice[] = [
  {
    id: "1",
    name: "소노필",
    nameEn: "SONOPEEL",
    nameJa: "ソノピール",
    nameZh: "超声波去角质",
    nameZhTw: "超音波去角質",
    shortDesc: "초음파 진동에너지와 이온의 전기적 특성을 이용하여 피부 각질을 제거하고 영양 성분을 깊이 침투시키는 복합 관리 장비입니다.",
    shortDescEn: "A multi-functional device that uses ultrasonic vibration energy and ionic electrical properties to exfoliate skin and deeply penetrate active ingredients.",
    shortDescJa: "超音波振動エネルギーとイオンの電気的特性を利用して皮膚の角質を除去し、栄養成分を深く浸透させる複合ケア機器です。",
    shortDescZh: "利用超声波振动能量和离子电特性去除皮肤角质，并将营养成分深度渗透的复合护理设备。",
    shortDescZhTw: "利用超音波振動能量與離子電特性去除皮膚角質，並將營養成分深度滲透的複合護理設備。",
    imgId: "sonopeel",
  },
  {
    id: "2",
    name: "포어덤",
    nameEn: "POREDERM",
    nameJa: "ポアダーム",
    nameZh: "无针导入仪",
    nameZhTw: "無針導入儀",
    shortDesc: "전기 전공법을 이용하여 바늘 없이 고농도 비타민을 진피층 깊숙이 직접 투여하는 무침 약물 전달 장비입니다.",
    shortDescEn: "A needle-free drug delivery device that uses electroporation to directly deliver high-concentration vitamins deep into the dermis without needles.",
    shortDescJa: "電気穿孔法を利用して針なしで高濃度ビタミンを真皮層の奥深くに直接投与する無針薬物送達機器です。",
    shortDescZh: "利用电穿孔技术，无需针头直接将高浓度维生素输送至真皮深层的无针药物传递设备。",
    shortDescZhTw: "利用電穿孔技術，無需針頭直接將高濃度維生素輸送至真皮深層的無針藥物傳遞設備。",
    imgId: "porederm",
  },
  {
    id: "3",
    name: "에어버블",
    nameEn: "AIR BUBBLE THERAPY",
    nameJa: "エアバブルセラピー",
    nameZh: "气泡氧疗",
    nameZhTw: "氣泡氧療",
    shortDesc: "순수 산소와 함께 활성 성분을 피부에 분사하여 노폐물을 제거하고 혈액순환을 개선하며 세포 재생력을 촉진하는 장비입니다.",
    shortDescEn: "A device that sprays active ingredients along with pure oxygen onto the skin to remove waste, improve blood circulation, and promote cell regeneration.",
    shortDescJa: "純酸素と共に活性成分を皮膚に噴射し、老廃物を除去して血液循環を改善し、細胞再生力を促進する機器です。",
    shortDescZh: "将活性成分与纯氧一起喷射到皮肤上，去除废物、改善血液循环并促进细胞再生的设备。",
    shortDescZhTw: "將活性成分與純氧一起噴射至皮膚上，去除廢物、改善血液循環並促進細胞再生的設備。",
    imgId: "airbubble",
  },
  {
    id: "4",
    name: "옥시젯",
    nameEn: "OXYET-LIRO",
    nameJa: "オキシジェット",
    nameZh: "氧气水光注射",
    nameZhTw: "氧氣水光注射",
    shortDesc: "바늘 없는 메조테라피 방식으로 산소와 활성 성분을 피부에 안전하고 효과적으로 침투시켜 수분과 광채를 개선하는 장비입니다.",
    shortDescEn: "A needle-free mesotherapy device that safely and effectively penetrates oxygen and active ingredients into the skin to improve moisture and radiance.",
    shortDescJa: "針なしのメソセラピー方式で酸素と活性成分を皮膚に安全かつ効果的に浸透させ、水分と輝きを改善する機器です。",
    shortDescZh: "采用无针中胚层疗法，将氧气和活性成分安全有效地渗透到皮肤中，改善水分和光泽的设备。",
    shortDescZhTw: "採用無針中胚層療法，將氧氣和活性成分安全有效地滲透到皮膚中，改善水分和光澤的設備。",
    imgId: "oxyjet",
  },
  {
    id: "5",
    name: "인바이오",
    nameEn: "INBIO 880",
    nameJa: "インバイオ880",
    nameZh: "高频射频仪",
    nameZhTw: "高頻射頻儀",
    shortDesc: "절개 없이 고주파를 인체에 직접 가하여 콜라겐 재생을 촉진하고 피부 탄력과 리프팅 효과를 극대화하는 비침습 관리 장비입니다.",
    shortDescEn: "A non-invasive device that applies high-frequency energy directly to the body without incisions to stimulate collagen regeneration and maximize skin elasticity and lifting effects.",
    shortDescJa: "切開なしで高周波を人体に直接加えてコラーゲン再生を促進し、皮膚の弾力とリフティング効果を最大化する非侵襲ケア機器です。",
    shortDescZh: "无需切开，直接对人体施加高频能量，促进胶原蛋白再生，最大化皮肤弹力和提升效果的非侵入性护理设备。",
    shortDescZhTw: "無需切開，直接對人體施加高頻能量，促進膠原蛋白再生，最大化皮膚彈力和提升效果的非侵入性護理設備。",
    imgId: "inbio",
  },
  {
    id: "6",
    name: "플로리스",
    nameEn: "FLAWLESS",
    nameJa: "フローリス",
    nameZh: "高压超声提升仪",
    nameZhTw: "高壓超音提升儀",
    shortDesc: "고압 침투 초음파를 이용하여 피부 처짐과 주름을 개선하는 비침습 리프팅 장비입니다.",
    shortDescEn: "A non-invasive lifting device that uses high-pressure penetrating ultrasound to improve skin sagging and wrinkles.",
    shortDescJa: "高圧浸透超音波を利用して皮膚のたるみとしわを改善する非侵襲リフティング機器です。",
    shortDescZh: "利用高压穿透超声波改善皮肤松弛和皱纹的非侵入性提升设备。",
    shortDescZhTw: "利用高壓穿透超音波改善皮膚鬆弛和皺紋的非侵入性提升設備。",
    imgId: "flawless",
  },
  {
    id: "7",
    name: "광선조사기",
    nameEn: "DERMA LIGHT",
    nameJa: "光線照射器",
    nameZh: "光疗照射仪",
    nameZhTw: "光療照射儀",
    shortDesc: "복합 광학 이중시스템으로 세포 분열을 활성화하고 피부 재생을 촉진하며 레이저 시술 후 회복을 보조하는 광선 조사 장비입니다.",
    shortDescEn: "A light irradiation device with a dual optical system that activates cell division, promotes skin regeneration, and supports recovery after laser treatments.",
    shortDescJa: "複合光学二重システムで細胞分裂を活性化し、皮膚再生を促進し、レーザー施術後の回復を補助する光線照射機器です。",
    shortDescZh: "采用复合光学双系统，激活细胞分裂、促进皮肤再生并辅助激光治疗后恢复的光线照射设备。",
    shortDescZhTw: "採用複合光學雙系統，激活細胞分裂、促進皮膚再生並輔助雷射治療後恢復的光線照射設備。",
    imgId: "dermalight",
  },
  {
    id: "8",
    name: "에프레이",
    nameEn: "F-RAY",
    nameJa: "エフレイ",
    nameZh: "皮肤3D诊断仪",
    nameZhTw: "皮膚3D診斷儀",
    shortDesc: "빛의 원리를 이용하여 얼굴 표면의 주름·모공 깊이를 3D로 정밀 분석하고 시술 전후 데이터를 제공하는 피부 진단 장비입니다.",
    shortDescEn: "A skin diagnostic device that uses light principles to precisely analyze wrinkle and pore depth on the face in 3D and provides before/after treatment data.",
    shortDescJa: "光の原理を利用して顔面のしわ・毛穴の深さを3Dで精密分析し、施術前後のデータを提供する皮膚診断機器です。",
    shortDescZh: "利用光学原理对面部皱纹和毛孔深度进行3D精密分析，并提供治疗前后数据的皮肤诊断设备。",
    shortDescZhTw: "利用光學原理對面部皺紋和毛孔深度進行3D精密分析，並提供治療前後數據的皮膚診斷設備。",
    imgId: "fray",
  },
  {
    id: "9",
    name: "이온자임",
    nameEn: "IONZYME",
    nameJa: "イオンザイム",
    nameZh: "离子导入仪",
    nameZhTw: "離子導入儀",
    shortDesc: "전기이온 영동법과 초음파를 동시에 이용해 고농도 비타민을 피부에 직접 침투시켜 미백과 항산화 효과를 제공하는 장비입니다.",
    shortDescEn: "A device that uses electro-ionic iontophoresis and ultrasound simultaneously to directly penetrate high-concentration vitamins into the skin for whitening and antioxidant effects.",
    shortDescJa: "電気イオン泳動法と超音波を同時に利用して高濃度ビタミンを皮膚に直接浸透させ、美白と抗酸化効果を提供する機器です。",
    shortDescZh: "同时利用电离子导入法和超声波，将高浓度维生素直接渗透到皮肤中，提供美白和抗氧化效果的设备。",
    shortDescZhTw: "同時利用離子導入法與超音波，將高濃度維生素直接滲透到皮膚中，提供美白和抗氧化效果的設備。",
    imgId: "ionzyme",
  },
  {
    id: "10",
    name: "힐링브라이트",
    nameEn: "HEALING BRIGHT",
    nameJa: "ヒーリングブライト",
    nameZh: "光疗修复仪",
    nameZhTw: "光療修復儀",
    shortDesc: "특수 파장의 광에너지를 조사하여 세포 활성화와 진피 치유를 촉진하고 피부 재생 및 시술 후 회복을 단축시키는 장비입니다.",
    shortDescEn: "A device that irradiates special wavelength light energy to promote cell activation and dermal healing, shortening skin regeneration and post-treatment recovery.",
    shortDescJa: "特殊波長の光エネルギーを照射して細胞活性化と真皮治癒を促進し、皮膚再生および施術後の回復を短縮する機器です。",
    shortDescZh: "照射特殊波长光能，促进细胞活化和真皮愈合，缩短皮肤再生和治疗后恢复时间的设备。",
    shortDescZhTw: "照射特殊波長光能，促進細胞活化和真皮癒合，縮短皮膚再生和治療後恢復時間的設備。",
    imgId: "healingbright",
  },
  {
    id: "11",
    name: "메조스킨",
    nameEn: "MESOSKIN",
    nameJa: "メゾスキン",
    nameZh: "微针导入仪",
    nameZhTw: "微針導入儀",
    shortDesc: "특허 받은 마이크로 침으로 피부 표면에 채널을 열어 영양 성분을 심층 침투시키고 콜라겐 생성을 자극하는 최소 침습 장비입니다.",
    shortDescEn: "A minimally invasive device that uses patented micro-needles to open channels on the skin surface, deeply penetrate active ingredients, and stimulate collagen production.",
    shortDescJa: "特許取得のマイクロ針で皮膚表面にチャンネルを開き、栄養成分を深層浸透させてコラーゲン生成を刺激する最小侵襲機器です。",
    shortDescZh: "使用专利微针在皮肤表面开通通道，深层渗透营养成分并刺激胶原蛋白生成的微创设备。",
    shortDescZhTw: "使用專利微針在皮膚表面開通通道，深層滲透營養成分並刺激膠原蛋白生成的微創設備。",
    imgId: "mesoskin",
  },
  {
    id: "12",
    name: "울트라듀오",
    nameEn: "ULTRADUO",
    nameJa: "ウルトラデュオ",
    nameZh: "超声双频仪",
    nameZhTw: "超音雙頻儀",
    shortDesc: "강한 자극 없이 세포 단위의 콜라겐 활성과 히알루론산 합성을 자연스럽게 유도하여 수분과 탄력을 동시에 개선하는 장비입니다.",
    shortDescEn: "A device that naturally induces cellular collagen activation and hyaluronic acid synthesis without strong stimulation, simultaneously improving moisture and elasticity.",
    shortDescJa: "強い刺激なしに細胞単位のコラーゲン活性とヒアルロン酸合成を自然に誘導し、水分と弾力を同時に改善する機器です。",
    shortDescZh: "无需强烈刺激，自然诱导细胞级胶原蛋白活化和透明质酸合成，同时改善水分和弹力的设备。",
    shortDescZhTw: "無需強烈刺激，自然誘導細胞級膠原蛋白活化與玻尿酸合成，同時改善水分和彈力的設備。",
    imgId: "ultraduo",
  },
  {
    id: "13",
    name: "트리플물광젯",
    nameEn: "SUPERSONIC TECHNOLOGY",
    nameJa: "トリプルウォータージェット",
    nameZh: "三重水光注射仪",
    nameZhTw: "三重水光注射儀",
    shortDesc: "초미세 솔루션 물방울을 피부 속 깊숙이 전달하여 콜라겐 형성을 돕고 수분을 집중 공급하는 무침 물광 관리 장비입니다.",
    shortDescEn: "A needle-free hydro-glow device that delivers ultra-fine solution droplets deep into the skin to support collagen formation and intensively supply moisture.",
    shortDescJa: "超微細溶液の水滴を皮膚の奥深くに届けてコラーゲン形成を助け、水分を集中供給する無針水光ケア機器です。",
    shortDescZh: "将超微细溶液水滴深入输送至皮肤内部，帮助胶原蛋白形成并集中补充水分的无针水光护理设备。",
    shortDescZhTw: "將超微細溶液水滴深入輸送至皮膚內部，幫助膠原蛋白形成並集中補充水分的無針水光護理設備。",
    imgId: "triplemultigel",
  },
  {
    id: "14",
    name: "LDM",
    nameEn: "LDM",
    nameJa: "LDM",
    nameZh: "LDM局部动态微按摩",
    nameZhTw: "LDM局部動態微按摩",
    shortDesc: "국소 동적 마이크로마사지 방식의 초음파로 피부 수분 보유력을 강화하고 피부 톤을 개선하며 염증성 피부 케어에 적합한 장비입니다.",
    shortDescEn: "An ultrasound device using local dynamic micro-massage to strengthen skin moisture retention, improve skin tone, and care for inflammatory skin conditions.",
    shortDescJa: "局所動的マイクロマッサージ方式の超音波で皮膚の水分保持力を強化し、肌のトーンを改善し、炎症性皮膚ケアに適した機器です。",
    shortDescZh: "采用局部动态微按摩方式的超声波，增强皮肤保湿能力、改善肤色，适合炎症性皮肤护理的设备。",
    shortDescZhTw: "採用局部動態微按摩方式的超音波，增強皮膚保濕能力、改善膚色，適合炎症性皮膚護理的設備。",
    imgId: "ldm",
  },
  {
    id: "15",
    name: "일루미",
    nameEn: "ILUMI-ST",
    nameJa: "イルミ",
    nameZh: "光子嫩肤仪",
    nameZhTw: "光子嫩膚儀",
    shortDesc: "레이저 시술 후 착색각화 현상을 완화하고 세포 재생을 광범위하게 촉진하여 색소 침착을 예방하고 피부를 안정화하는 장비입니다.",
    shortDescEn: "A device that alleviates post-laser pigmentation and keratinization, broadly promotes cell regeneration, prevents hyperpigmentation, and stabilizes the skin.",
    shortDescJa: "レーザー施術後の着色角化現象を緩和し、細胞再生を広範囲に促進して色素沈着を予防し、皮膚を安定化する機器です。",
    shortDescZh: "缓解激光治疗后的色素角化现象，广泛促进细胞再生，预防色素沉着并稳定皮肤的设备。",
    shortDescZhTw: "緩解雷射治療後的色素角化現象，廣泛促進細胞再生，預防色素沉著並穩定皮膚的設備。",
    imgId: "ilumi",
  },
  {
    id: "16",
    name: "트랜스킨",
    nameEn: "TRANS SKIN",
    nameJa: "トランスキン",
    nameZh: "胶原蛋白导入仪",
    nameZhTw: "膠原蛋白導入儀",
    shortDesc: "콜라겐 성분을 피부 조직 깊숙이 침투시켜 피부 손상 회복과 항노화 탄력 강화, 건조·손상 피부 집중 케어를 제공하는 장비입니다.",
    shortDescEn: "A device that penetrates collagen components deep into skin tissue to restore skin damage, strengthen anti-aging elasticity, and provide intensive care for dry and damaged skin.",
    shortDescJa: "コラーゲン成分を皮膚組織の奥深くに浸透させて皮膚損傷の回復と抗老化弾力強化、乾燥・損傷皮膚の集中ケアを提供する機器です。",
    shortDescZh: "将胶原蛋白成分深度渗透至皮肤组织，修复皮肤损伤、强化抗衰老弹力，为干燥受损皮肤提供集中护理的设备。",
    shortDescZhTw: "將膠原蛋白成分深度滲透至皮膚組織，修復皮膚損傷、強化抗衰老彈力，為乾燥受損皮膚提供集中護理的設備。",
    imgId: "transkin",
  },
];

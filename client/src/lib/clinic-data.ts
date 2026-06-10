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
 */

// ── 의사 데이터 (JSON-LD MedicalOrganization.employee 스키마용) ─────────────────
export const CLINIC_DOCTORS = [
  {
    name: "조시형",
    nameEn: "Cho Si-hyung",
    jobTitle: "피부과 전문의 · 의학박사",
    jobTitleEn: "Dermatologist, MD, PhD",
    url: "https://star-pibu.com/#doctors",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub_01_03_01_2e3c0c6f.jpg",
    description: "20년 이상의 임상 경험을 보유한 피부과 전문의. 눈밑지방재배치 4,000례 이상의 경험으로 국내 최고 수준의 기술을 자랑합니다. 써마지 FLX 공식 자문의로 활동 중입니다.",
    sameAs: [
      "https://www.youtube.com/@starpibu",
      "https://blog.naver.com/starpibu",
      "https://instagram.com/starpibu"
    ],
    credentials: [
      "피부과 전문의",
      "부산대학병원 피부과 수련",
      "인제대 피부과 교수 역임",
      "부산경남울산피부과의사회 회장 역임",
      "써마지 FLX 공식 자문의",
      "미국 피부과 학회 정회원(AAD)",
    ],
    specialties: ["눈밑지방재배치", "리프팅", "울쎄라", "써마지", "흉터치료", "색소치료"],
    alumniOf: [
      { name: "부산대학교 의과대학", url: "https://med.pusan.ac.kr" },
      { name: "인제대학교 의과대학", url: "https://med.inje.ac.kr" }
    ],
  },
  {
    name: "우혜진",
    nameEn: "Woo Hye-jin",
    jobTitle: "피부과 전문의",
    jobTitleEn: "Dermatologist, MD",
    url: "https://star-pibu.com/#doctors",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub_01_03_02_8e3c0c6f.jpg",
    description: "카톨릭의대에서 수련한 피부과 전문의. 리프팅, 울쎄라, 써마지 등 최신 장비를 활용한 시술에 전문성을 갖추고 있습니다.",
    sameAs: [
      "https://www.youtube.com/@starpibu",
      "https://blog.naver.com/starpibu",
      "https://instagram.com/starpibu"
    ],
    credentials: [
      "피부과 전문의",
      "카톨릭의대 피부과 수련",
      "카톨릭의대 피부과 외래교수 역임",
      "대한 피부과 학회 정회원",
      "미국 피부과 학회 정회원(AAD)",
    ],
    specialties: ["리프팅", "울쎄라", "써마지", "흉터치료", "색소치료", "피부질환"],
    alumniOf: [
      { name: "카톨릭대학교 의과대학", url: "https://med.catholic.ac.kr" }
    ],
  },
  {
    name: "이기욱",
    nameEn: "Lee Gi-wook",
    jobTitle: "피부과 전문의 · 의학박사",
    jobTitleEn: "Dermatologist, MD, PhD",
    url: "https://star-pibu.com/#doctors",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub_01_03_03_8e3c0c6f.jpg",
    description: "고신대학교 의과대학 의학박사. 리프팅, 색소치료, 백반증 치료 등 다양한 피부질환 치료에 전문성을 갖추고 있습니다.",
    sameAs: [
      "https://www.youtube.com/@starpibu",
      "https://blog.naver.com/starpibu",
      "https://instagram.com/starpibu"
    ],
    credentials: [
      "피부과 전문의",
      "고신대학교 의과대학 의학박사",
      "고신대학교 의과대학 피부과 외래교수",
      "대한 피부과학회 정회원",
      "대한 피부과의사회 정회원",
    ],
    specialties: ["리프팅", "울쎄라", "써마지", "색소치료", "백반증", "피부질환"],
    alumniOf: [
      { name: "고신대학교 의과대학", url: "https://med.ksu.ac.kr" }
    ],
  },
] as const;

// ── 주요 시술 목록 (JSON-LD MedicalProcedure 스키마용) ──────────────────────────
export const CLINIC_PROCEDURES = [
  {
    name: "울쎄라피 프라임",
    nameEn: "Ultherapy Prime",
    url: "https://star-pibu.com/treatments/ulthera",
    description: "집속 초음파(HIFU)로 SMAS층까지 자극하는 FDA 승인 비수술 리프팅 시술. 시술 당일 일상 복귀 가능.",
    bodyLocation: "얼굴, 목, 데콜테",
    procedureType: "Noninvasive",
    followup: "1~2회 (6~12개월 간격)",
    howPerformed: "집속 초음파(HIFU) 에너지를 피부 깊은 층인 SMAS(근막층)까지 전달하여 리프팅 효과 유도",
  },
  {
    name: "써마지 FLX",
    nameEn: "Thermage FLX",
    url: "https://star-pibu.com/treatments/thermage",
    description: "4세대 고주파(RF) 리프팅 장비. 콜라겐 재생 및 피부 탄력 개선. 조시형 원장 공식 자문의.",
    bodyLocation: "얼굴, 목, 눈가, 바디",
    procedureType: "Noninvasive",
    followup: "1~2회 (6~12개월 간격)",
    howPerformed: "고주파(RF) 에너지로 피부 깊은 층의 콜라겐을 가열하여 즉각적인 수축 효과와 장기적인 콜라겐 재생 유도",
  },
  {
    name: "눈밑지방재배치",
    nameEn: "Under-eye Fat Repositioning",
    url: "https://star-pibu.com/treatments/under-eye-fat",
    description: "4,000례 이상 경험. 눈밑 과잉 지방을 눈물고랑으로 재배치하여 다크서클과 눈밑 볼록함을 동시에 개선.",
    bodyLocation: "눈밑, 눈물고랑",
    procedureType: "Surgical",
    followup: "1회 (반영구적 효과)",
    howPerformed: "눈 아래 과잉 지방을 제거하지 않고 꺼진 눈물고랑 부위로 재배치하여 자연스러운 눈밑 라인 형성",
  },
  {
    name: "리주란힐러",
    nameEn: "Rejuran Healer",
    url: "https://star-pibu.com",
    description: "연어 DNA(PN) 성분으로 피부 재생 및 탄력 개선. 피부 속부터 근본적인 재생을 유도하는 항노화 시술.",
    bodyLocation: "얼굴 전체",
    procedureType: "Minimally Invasive",
    followup: "4~6회 (2~4주 간격)",
    howPerformed: "연어 DNA(PN) 성분을 진피층에 주입하여 피부 재생 인자 활성화",
  },
  {
    name: "피코레이저 토닝",
    nameEn: "Pico Laser Toning",
    url: "https://star-pibu.com",
    description: "피코초 단위 레이저로 색소 분해 및 피부 톤 개선. 기미·잡티·모공 개선에 효과적.",
    bodyLocation: "얼굴 전체",
    procedureType: "Noninvasive",
    followup: "5~10회 (1~2주 간격)",
    howPerformed: "피코초(1조분의 1초) 단위 레이저 펄스로 색소 입자를 미세 분쇄하여 자연 배출 유도",
  },
] as const;

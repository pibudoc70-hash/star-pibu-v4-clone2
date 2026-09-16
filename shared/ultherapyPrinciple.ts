export const ULTHERAPY_PRIME_SLUG = "울쎄라피프라임";

export const ULTHERAPY_PRIME_PRINCIPLE = {
  heading: "울쎄라, 피부 속에서 시작되는 탄력 리프팅",
  subtitle: "미세집속 초음파 에너지를 필요한 깊이에 정밀하게 전달합니다.",
  layerHeading: "피부층과 목표 깊이",
  layers: [
    { name: "표피", depth: "1.5mm", description: "피부 표면에 가까운 층을 정밀하게 타깃합니다." },
    { name: "진피", depth: "3.0mm", description: "탄력과 밀도에 관여하는 진피층까지 에너지를 전달합니다." },
    { name: "피하지지층", depth: "4.5mm", description: "피부를 지지하는 깊은 층을 목표로 합니다." },
  ],
  principleHeading: "4단계 시술 원리",
  steps: [
    { title: "피부층 확인", description: "실시간 초음파 영상으로 피부 속 구조를 확인합니다." },
    { title: "목표 깊이 정밀 타깃", description: "1.5mm·3.0mm·4.5mm 목표 깊이를 정밀하게 설정합니다." },
    { title: "미세 열응고점 형성", description: "초점 부위에만 작은 열 자극을 전달합니다." },
    { title: "콜라겐 리모델링", description: "피부의 자연스러운 회복 과정이 탄력 개선을 돕습니다." },
  ],
  timelineHeading: "회복 과정 타임라인",
  timeline: [
    { label: "시술 직후", description: "느슨하고 불규칙한 콜라겐 구조" },
    { label: "수 주 후", description: "새로운 콜라겐 생성 및 구조 재정렬" },
    { label: "수개월 후", description: "탄력 있고 정돈된 콜라겐 구조" },
  ],
  notice: "시술 효과와 유지 기간은 개인별 피부 상태와 치료 계획에 따라 달라질 수 있습니다. 시술 전 의료진 상담이 필요합니다.",
} as const;

export function isUltherapyPrimeSlug(slug: string | null | undefined): boolean {
  return slug === ULTHERAPY_PRIME_SLUG;
}

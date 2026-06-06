/**
 * treatment.ts
 * TreatmentsEquipmentSection에서 사용하는 도메인 타입 정의.
 * 이 파일은 순수 타입만 포함하며 런타임 의존성이 없다.
 */

export interface Treatment {
  name: string;
  nameEn: string;
  nameJa?: string;
  nameZh?: string;
  desc: string;
  descEn?: string;
  descJa?: string;
  descZh?: string;
  time: string;
  timeEn?: string;
  timeJa?: string;
  timeZh?: string;
  recovery: string;
  recoveryEn?: string;
  recoveryJa?: string;
  recoveryZh?: string;
  badge?: string | null;
  badgeColor?: string;
  image: string;
  images?: string[];          // 복수 이미지 (나란히 표시)
  imgBg?: string;             // 이미지 배경 색상
  cardBannerImage?: string;   // 카드 이미지 영역 전체를 덮는 배너 이미지
  best?: boolean;
  // 상세 모달용 추가 필드
  detail?: string;            // 더 긴 상세 설명 (ko)
  detailEn?: string;          // 상세 설명 (en)
  detailJa?: string;          // 상세 설명 (ja)
  detailZh?: string;          // 상세 설명 (zh)
  caution?: string;           // 주의사항 (ko)
  sessions?: string;          // 권장 횟수/주기 (ko)
  sessionsEn?: string;        // 권장 횟수/주기 (en)
  sessionsJa?: string;        // 권장 횟수/주기 (ja)
  sessionsZh?: string;        // 권장 횟수/주기 (zh)
  effect?: string;            // 기대 효과 (ko)
  effectEn?: string;          // 기대 효과 (en)
  effectJa?: string;          // 기대 효과 (ja)
  effectZh?: string;          // 기대 효과 (zh)
  related?: string[];         // 연관 시술 추천
  steps?: { step: number; title: string; desc: string }[]; // 치료 단계
  youtubeUrl?: string;        // 상세 모달 내 YouTube 영상 URL
  modalImage?: string;        // 유튜브 대신 모달에 표시할 이미지 URL
}

export interface Equipment {
  brand: string;
  name: string;
  nameJa?: string;
  nameZh?: string;
  desc: string;
  descEn?: string;
  descJa?: string;
  descZh?: string;
  image: string;
  detail?: string;
  detailEn?: string;
  detailJa?: string;
  detailZh?: string;
  sessions?: string;
  sessionsEn?: string;
  sessionsJa?: string;
  sessionsZh?: string;
  effect?: string;
  effectEn?: string;
  effectJa?: string;
  effectZh?: string;
}

export interface Category {
  id: string;
  label: string;
  labelEn: string;
  labelJa?: string;
  labelZh?: string;
  desc: string;
  descEn: string;
  descJa: string;
  descZh: string;
}

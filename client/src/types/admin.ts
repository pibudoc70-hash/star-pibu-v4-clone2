/**
 * admin.ts - 관리자 대시보드 전용 타입 정의
 * AdminDashboard.tsx에서 사용하는 모든 타입을 중앙 관리합니다.
 */

// ── 예약 상태 ──────────────────────────────────────────────────────────────────
export type ReservationStatus = "pending" | "confirmed" | "completed" | "cancelled";

// ── 관리자 탭 ──────────────────────────────────────────────────────────────────
export type AdminTab =
  | "users"
  | "popup"
  | "events"
  | "treatments"
  | "treatmentsV2"
  | "reservations"
  | "unavailableSlots"
  | "youtube"
  | "keywords";

// ── 예약 필터 ──────────────────────────────────────────────────────────────────
export type ReservationFilter = "all" | "member" | "guest";

// ── 팝업 이벤트 (trpc.popup.adminList 반환 타입과 일치) ─────────────────────────
export interface PopupEventItem {
  id: number;
  tab: string;
  badge: string;
  title: string;
  subtitle: string;
  desc: string;
  note: string;
  imageUrl: string | null;
  clickUrl: string | null;
  accent: string;
  accentLight: string;
  sortOrder: number;
  isActive: "0" | "1";
  priceItems: { label: string; original: string; price: string }[];
  startAt: number | null;
  endAt: number | null;
  targetLang: "all" | "ko" | "en" | "ja" | "zh";
}

// ── 팝업 폼 상태 ──────────────────────────────────────────────────────────────
export interface PopupFormState {
  tab: string;
  badge: string;
  imageUrl: string;
  clickUrl: string;
  sortOrder: number;
  isActive: "0" | "1";
  startAt: number | null;
  endAt: number | null;
  targetLang: "all" | "ko" | "en" | "ja" | "zh";
}

// ── 이벤트 목록 아이템 (trpc.events.list 반환 타입과 일치) ──────────────────────
export interface EventListItem extends Record<string, unknown> {
  id: number;
  type?: string;
  tab?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  desc?: string;
  note?: string;
  imageUrl?: string | null;
  accent?: string;
  accentLight?: string;
  sortOrder?: number;
  isActive?: "0" | "1";
  featured?: boolean;
  date?: string;
  category?: string;
  views?: number;
  priceItems?: { label: string; original: string; price: string }[];
  startAt?: number | null;
  endAt?: number | null;
  // 다국어 필드 (DB는 null 반환 가능성 있음)
  titleEn?: string | null;
  titleJa?: string | null;
  titleZh?: string | null;
  subtitleEn?: string | null;
  subtitleJa?: string | null;
  subtitleZh?: string | null;
  descEn?: string | null;
  descJa?: string | null;
  descZh?: string | null;
  productName?: string | null;
  productNameEn?: string | null;
  productNameJa?: string | null;
  productNameZh?: string | null;
  isSpecialEvent?: string | null;
  anesthesiaFee?: string | null;
  targetLang?: string | null;
  priceRows?: PriceRow[] | string | null;
}

// ── 가격 행 ──────────────────────────────────────────────────────────────────
export interface PriceRow {
  label: string;
  normalPrice: number;
  discountPrice: number;
}

// ── 이벤트 폼 상태 (events 테이블 전체 컬럼과 일치) ───────────────────────────
export interface EventFormState {
  id?: number;
  type?: string;
  title: string;
  subtitle?: string;
  desc?: string;
  content?: string;
  isFeatured?: "0" | "1";
  badge?: string;
  tag?: string;
  hot?: "0" | "1";
  cta?: string;
  accent?: string;
  accentDark?: string;
  accentBg?: string;
  iconBg?: string;
  iconType?: string;
  badgeColor?: string;
  imageUrl?: string;
  date?: string;
  views?: number;
  sortOrder?: number;
  isActive?: "0" | "1";
  category?: string;
  isSpecialEvent?: "0" | "1";
  productName?: string;
  normalPrice?: number;
  discountPrice?: number;
  priceRows: PriceRow[];
  anesthesiaFee?: string;
  targetLang?: string;
  titleEn?: string;
  titleJa?: string;
  titleZh?: string;
  subtitleEn?: string;
  subtitleJa?: string;
  subtitleZh?: string;
  descEn?: string;
  descJa?: string;
  descZh?: string;
  productNameEn?: string;
  productNameJa?: string;
  productNameZh?: string;
}

// ── 예약 아이템 (trpc.admin.listReservations 반환 타입과 일치) ─────────────────
export interface ReservationItem {
  id: number;
  patientName: string;
  phone: string;
  treatmentName: string;
  preferredDate: number;
  preferredTime: string;
  notes: string | null;
  status: ReservationStatus;
  adminNote: string | null;
  createdAt: Date;
  userId: number | null;
}

// ── 관리자 통계 (trpc.admin.stats 반환 타입과 일치) ───────────────────────────
export interface AdminStats {
  totalUsers: number;
  adminUsers: number;
  recentSignups: number;
  reservations: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
}

// ── 상태 설정 레코드 ──────────────────────────────────────────────────────────
export interface StatusConfig {
  label: string;
  color: string;
  bg: string;
}

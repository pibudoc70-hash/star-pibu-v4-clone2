import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, bigint, index, real } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const guestOtps = mysqlTable("guestOtps", {
  id: int("id").autoincrement().primaryKey(),
  phone: varchar("phone", { length: 20 }).notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  verified: mysqlEnum("verified", ["0", "1"]).notNull().default("0"),
  expiresAt: bigint("expiresAt", { mode: "number" }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  attemptCount: int("attemptCount").notNull().default(0),
  lockedUntil: bigint("lockedUntil", { mode: "number" }),
}, (table) => ({
  // P0-1: OTP 레이트리밋 쿼리 (WHERE phone = ? AND expiresAt > ?) 성능 최적화
  phoneIdx: index("guestOtps_phone_idx").on(table.phone),
  phoneExpiresIdx: index("guestOtps_phone_expires_idx").on(table.phone, table.expiresAt),
}));
export type GuestOtp = typeof guestOtps.$inferSelect;
export type InsertGuestOtp = typeof guestOtps.$inferInsert;

export const reservations = mysqlTable("reservations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  isGuest: mysqlEnum("isGuest", ["0", "1"]).notNull().default("0"),
  patientName: varchar("patientName", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  treatmentCategory: varchar("treatmentCategory", { length: 100 }).notNull(),
  treatmentName: varchar("treatmentName", { length: 200 }).notNull(),
  preferredDate: bigint("preferredDate", { mode: "number" }).notNull(),
  preferredTime: varchar("preferredTime", { length: 10 }).notNull(),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  adminNote: text("adminNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  // P0-1: 예약 조회 성능 최적화 (회원 예약 목록, 전화번호 조회, 상태별 필터)
  userIdIdx: index("reservations_userId_idx").on(table.userId),
  phoneIdx: index("reservations_phone_idx").on(table.phone),
  statusIdx: index("reservations_status_idx").on(table.status),
  userIdStatusIdx: index("reservations_userId_status_idx").on(table.userId, table.status),
}));
export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = typeof reservations.$inferInsert;

export const popupEvents = mysqlTable("popupEvents", {
  id: int("id").autoincrement().primaryKey(),
  tab: varchar("tab", { length: 50 }).notNull(),
  badge: varchar("badge", { length: 100 }).notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  subtitle: varchar("subtitle", { length: 100 }).notNull().default(""),
  desc: text("desc").notNull().default(""),
  priceItems: text("priceItems").notNull().default("[]"),
  note: varchar("note", { length: 200 }).notNull().default(""),
  imageUrl: text("imageUrl"),
  clickUrl: text("clickUrl"),
  accent: varchar("accent", { length: 20 }).notNull().default("#4A6FA5"),
  accentLight: varchar("accentLight", { length: 20 }).notNull().default("#EEF4FF"),
  startAt: bigint("startAt", { mode: "number" }),
  endAt: bigint("endAt", { mode: "number" }),
  sortOrder: int("sortOrder").notNull().default(0),
  isActive: mysqlEnum("isActive", ["0", "1"]).notNull().default("1"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  isActiveIdx: index("popupEvents_isActive_idx").on(table.isActive),
}));
export type PopupEvent = typeof popupEvents.$inferSelect;
export type InsertPopupEvent = typeof popupEvents.$inferInsert;

export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["이벤트", "공지"]).notNull().default("이벤트"),
  title: varchar("title", { length: 200 }).notNull(),
  subtitle: varchar("subtitle", { length: 150 }).notNull().default(""),
  desc: text("desc").notNull(),
  content: text("content").notNull(),
  isFeatured: mysqlEnum("isFeatured", ["0", "1"]).notNull().default("0"),
  badge: varchar("badge", { length: 50 }).notNull().default(""),
  tag: varchar("tag", { length: 50 }).notNull().default(""),
  hot: mysqlEnum("hot", ["0", "1"]).notNull().default("0"),
  cta: varchar("cta", { length: 50 }).notNull().default("자세히 보기"),
  accent: varchar("accent", { length: 20 }).notNull().default("#4A6FA5"),
  accentDark: varchar("accentDark", { length: 20 }).notNull().default("#2D4A7B"),
  accentBg: varchar("accentBg", { length: 20 }).notNull().default("#EEF3FA"),
  iconBg: varchar("iconBg", { length: 20 }).notNull().default("#E0EBF7"),
  iconType: varchar("iconType", { length: 20 }).notNull().default("tag"),
  badgeColor: varchar("badgeColor", { length: 20 }).notNull().default("#4A6FA5"),
  imageUrl: text("imageUrl"),
  date: varchar("date", { length: 50 }).notNull(),
  views: int("views").notNull().default(0),
  sortOrder: int("sortOrder").notNull().default(0),
  isActive: mysqlEnum("isActive", ["0", "1"]).notNull().default("1"),
  category: mysqlEnum("category", ["신규시술", "이벤트", "공지사항", "기타"]).notNull().default("이벤트"),
  // SPECIAL EVENT 필드
  isSpecialEvent: mysqlEnum("isSpecialEvent", ["0", "1"]).notNull().default("0"),
  productName: varchar("productName", { length: 200 }).default(""),
  normalPrice: int("normalPrice").default(0),
  discountPrice: int("discountPrice").default(0),
  priceRows: text("priceRows").notNull(), // JSON 형식으로 여러 가격 행 저장
  anesthesiaFee: varchar("anesthesiaFee", { length: 200 }).default(""), // 수면마취비 정보 (예: "수면마취비 별도")
  // 다국어 지원 필드
  targetLang: varchar("targetLang", { length: 20 }).notNull().default("ko"), // "ko" | "en" | "ja" | "zh"
  titleEn: varchar("titleEn", { length: 200 }).default(""),
  titleJa: varchar("titleJa", { length: 200 }).default(""),
  titleZh: varchar("titleZh", { length: 200 }).default(""),
  subtitleEn: varchar("subtitleEn", { length: 150 }).default(""),
  subtitleJa: varchar("subtitleJa", { length: 150 }).default(""),
  subtitleZh: varchar("subtitleZh", { length: 150 }).default(""),
  descEn: text("descEn"),
  descJa: text("descJa"),
  descZh: text("descZh"),
  productNameEn: varchar("productNameEn", { length: 200 }).default(""),
  productNameJa: varchar("productNameJa", { length: 200 }).default(""),
  productNameZh: varchar("productNameZh", { length: 200 }).default(""),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  // 성능 최적화: 자주 사용되는 WHERE 조건 커럼 인덱스
  isActiveIdx: index("events_isActive_idx").on(table.isActive),
  isActiveSpecialIdx: index("events_isActive_special_idx").on(table.isActive, table.isSpecialEvent),
  isActiveLangIdx: index("events_isActive_lang_idx").on(table.isActive, table.targetLang),
  sortOrderIdx: index("events_sortOrder_idx").on(table.sortOrder),
}));
export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// 시술·장비 관리 테이블
// ─────────────────────────────────────────────────────────────────────────────
export const treatments = mysqlTable("treatments", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: varchar("categoryId", { length: 50 }).notNull(), // best, lifting, eye, vitiligo, pigment, scar, acne_laser, rosacea, acne, fungus, psoriasis, volume, botox
  name: varchar("name", { length: 200 }).notNull(),
  nameEn: varchar("nameEn", { length: 200 }).notNull(),
  nameJa: varchar("nameJa", { length: 200 }).default(""),
  nameZh: varchar("nameZh", { length: 200 }).default(""),
  desc: text("desc").notNull(),
  descEn: text("descEn").default(""),
  descJa: text("descJa").default(""),
  descZh: text("descZh").default(""),
  time: varchar("time", { length: 50 }).notNull(),
  timeEn: varchar("timeEn", { length: 50 }).default(""),
  timeJa: varchar("timeJa", { length: 50 }).default(""),
  timeZh: varchar("timeZh", { length: 50 }).default(""),
  recovery: varchar("recovery", { length: 50 }).notNull(),
  recoveryEn: varchar("recoveryEn", { length: 50 }).default(""),
  recoveryJa: varchar("recoveryJa", { length: 50 }).default(""),
  recoveryZh: varchar("recoveryZh", { length: 50 }).default(""),
  badge: varchar("badge", { length: 100 }).default(""),
  badgeEn: varchar("badgeEn", { length: 100 }).default(""),
  badgeJa: varchar("badgeJa", { length: 100 }).default(""),
  badgeZh: varchar("badgeZh", { length: 100 }).default(""),
  badgeColor: varchar("badgeColor", { length: 20 }).default("#4A6FA5"),
  image: text("image"), // 메인 이미지 URL
  images: text("images").default("[]"), // JSON 배열: 복수 이미지
  imgBg: varchar("imgBg", { length: 20 }).default(""),
  cardBannerImage: text("cardBannerImage"), // 카드 배너 이미지
  detail: text("detail"),
  detailEn: text("detailEn").default(""),
  detailJa: text("detailJa").default(""),
  detailZh: text("detailZh").default(""),
  caution: text("caution"),
  cautionEn: text("cautionEn").default(""),
  cautionJa: text("cautionJa").default(""),
  cautionZh: text("cautionZh").default(""),
  sessions: varchar("sessions", { length: 200 }).default(""),
  sessionsEn: varchar("sessionsEn", { length: 200 }).default(""),
  sessionsJa: varchar("sessionsJa", { length: 200 }).default(""),
  sessionsZh: varchar("sessionsZh", { length: 200 }).default(""),
  effect: text("effect"),
  effectEn: text("effectEn").default(""),
  effectJa: text("effectJa").default(""),
  effectZh: text("effectZh").default(""),
  related: text("related").default("[]"), // JSON 배열: 연관 시술
  steps: text("steps").default("[]"), // JSON 배열: 치료 단계
  youtubeUrl: text("youtubeUrl"), // YouTube 영상 URL
  modalImage: text("modalImage"), // 모달 이미지 (유튜브 대신)
  slug: varchar("slug", { length: 200 }).unique(),
  slugEn: varchar("slugEn", { length: 200 }).default(""),
  slugJa: varchar("slugJa", { length: 200 }).default(""),
  slugZh: varchar("slugZh", { length: 200 }).default(""),
  best: mysqlEnum("best", ["0", "1"]).default("0"), // Best 시술 여부
  section: mysqlEnum("section", ["v1", "v2"]).notNull().default("v1"), // v1: 기존 시술·장비소개, v2: 새로운 시술·장비소개 2
  sortOrder: int("sortOrder").notNull().default(0),
  isActive: mysqlEnum("isActive", ["0", "1"]).notNull().default("1"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Treatment = typeof treatments.$inferSelect;
export type InsertTreatment = typeof treatments.$inferInsert;

export const treatmentCategories = mysqlTable("treatmentCategories", {
  id: varchar("id", { length: 50 }).primaryKey(), // best, lifting, eye, vitiligo, etc.
  label: varchar("label", { length: 100 }).notNull(),
  labelEn: varchar("labelEn", { length: 100 }).notNull(),
  desc: text("desc").notNull(),
  icon: varchar("icon", { length: 50 }).notNull(), // lucide-react 아이콘 이름
  sortOrder: int("sortOrder").notNull().default(0),
  isActive: mysqlEnum("isActive", ["0", "1"]).notNull().default("1"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type TreatmentCategory = typeof treatmentCategories.$inferSelect;
export type InsertTreatmentCategory = typeof treatmentCategories.$inferInsert;


export const youtubeVideos = mysqlTable("youtubeVideos", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  videoId: varchar("videoId", { length: 50 }).notNull(),
  type: mysqlEnum("type", ["video", "shorts"]).notNull(),
  sortOrder: int("sortOrder").notNull().default(0),
  isActive: mysqlEnum("isActive", ["0", "1"]).notNull().default("1"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  isActiveIdx: index("youtubeVideos_isActive_idx").on(table.isActive),
  typeIsActiveIdx: index("youtubeVideos_type_isActive_idx").on(table.type, table.isActive),
}));
export type YouTubeVideo = typeof youtubeVideos.$inferSelect;
export type InsertYouTubeVideo = typeof youtubeVideos.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// 공지사항 게시판
// ─────────────────────────────────────────────────────────────────────────────
export const notices = mysqlTable("notices", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  content: text("content").notNull(),
  isPinned: mysqlEnum("isPinned", ["0", "1"]).notNull().default("0"),
  views: int("views").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  isPinnedIdx: index("notices_isPinned_idx").on(table.isPinned),
  createdAtIdx: index("notices_createdAt_idx").on(table.createdAt),
}));
export type Notice = typeof notices.$inferSelect;
export type InsertNotice = typeof notices.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// notice_images: 공지사항 첨부 이미지
// ─────────────────────────────────────────────────────────────────────────────
export const noticeImages = mysqlTable("notice_images", {
  id: int("id").autoincrement().primaryKey(),
  noticeId: int("noticeId").notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  url: varchar("url", { length: 1000 }).notNull(),
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  noticeIdIdx: index("noticeImages_noticeId_idx").on(table.noticeId),
}));
export type NoticeImage = typeof noticeImages.$inferSelect;
export type InsertNoticeImage = typeof noticeImages.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// equipment3: DB 연동 시술·장비 소개 (관리자 등록·수정·순서변경 → /equipment3/:slug)
// ─────────────────────────────────────────────────────────────────────────────
export const equipment3 = mysqlTable("equipment3", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  // 시술명 (4개 언어)
  name: varchar("name", { length: 200 }).notNull(),
  nameEn: varchar("nameEn", { length: 200 }).notNull().default(""),
  nameJa: varchar("nameJa", { length: 200 }).default(""),
  nameZh: varchar("nameZh", { length: 200 }).default(""),
  // 카테고리
  category: varchar("category", { length: 100 }).notNull().default(""),
  categoryEn: varchar("categoryEn", { length: 100 }).default(""),
  categoryJa: varchar("categoryJa", { length: 100 }).default(""),
  categoryZh: varchar("categoryZh", { length: 100 }).default(""),
  // 짧은 설명 (카드 미리보기용)
  desc: text("desc").notNull().default(""),
  descEn: text("descEn").default(""),
  descJa: text("descJa").default(""),
  descZh: text("descZh").default(""),
  // 상세 설명 (마크다운)
  detail: text("detail").default(""),
  detailEn: text("detailEn").default(""),
  detailJa: text("detailJa").default(""),
  detailZh: text("detailZh").default(""),
  // 기대 효과
  effect: text("effect").default(""),
  effectEn: text("effectEn").default(""),
  effectJa: text("effectJa").default(""),
  effectZh: text("effectZh").default(""),
  // 주의사항
  caution: text("caution").default(""),
  cautionEn: text("cautionEn").default(""),
  cautionJa: text("cautionJa").default(""),
  cautionZh: text("cautionZh").default(""),
  // 권장 횟수
  sessions: varchar("sessions", { length: 200 }).default(""),
  sessionsEn: varchar("sessionsEn", { length: 200 }).default(""),
  sessionsJa: varchar("sessionsJa", { length: 200 }).default(""),
  sessionsZh: varchar("sessionsZh", { length: 200 }).default(""),
  // 시술 시간
  time: varchar("time", { length: 50 }).default(""),
  timeEn: varchar("timeEn", { length: 50 }).default(""),
  timeJa: varchar("timeJa", { length: 50 }).default(""),
  timeZh: varchar("timeZh", { length: 50 }).default(""),
  // 회복 기간
  recovery: varchar("recovery", { length: 50 }).default(""),
  recoveryEn: varchar("recoveryEn", { length: 50 }).default(""),
  recoveryJa: varchar("recoveryJa", { length: 50 }).default(""),
  recoveryZh: varchar("recoveryZh", { length: 50 }).default(""),
  // 미디어
  imageUrl: text("imageUrl"),
  bgImageUrl: text("bgImageUrl"),          // 배경 전용 이미지 (텍스트 오버레이용)
  images: text("images").default("[]"),   // JSON 배열
  youtubeUrl: text("youtubeUrl"),
  modalImage: text("modalImage"),
  // 뱃지
  badge: varchar("badge", { length: 100 }).default(""),
  badgeColor: varchar("badgeColor", { length: 20 }).default("#4A6FA5"),
  // 정렬·활성화
  sortOrder: int("sortOrder").notNull().default(0),
  isActive: mysqlEnum("isActive", ["0", "1"]).notNull().default("1"),
  // Best 시술 여부
  isBest: mysqlEnum("isBest", ["0", "1"]).notNull().default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Equipment3Item = typeof equipment3.$inferSelect;
export type InsertEquipment3Item = typeof equipment3.$inferInsert;

export const unavailableSlots = mysqlTable("unavailableSlots", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull(),
  reason: text("reason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type UnavailableSlot = typeof unavailableSlots.$inferSelect;
export type InsertUnavailableSlot = typeof unavailableSlots.$inferInsert;

// ── 프리미엄 상담 폼 ──────────────────────────────────────────────────────────
export const consultationRequests = mysqlTable("consultationRequests", {
  id: int("id").autoincrement().primaryKey(),
  // 기본 정보
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  concern: varchar("concern", { length: 200 }).notNull(),  // 희망 시술 또는 고민 부위
  message: text("message").notNull(),                       // 상담 내용
  privacyAgreed: varchar("privacyAgreed", { length: 1 }).notNull().default("1"),
  // 스팸 방지
  ipAddress: varchar("ipAddress", { length: 45 }),          // IPv4/IPv6
  turnstileVerified: varchar("turnstileVerified", { length: 1 }).notNull().default("0"),
  // 상태
  status: mysqlEnum("status", ["pending", "contacted", "done", "spam"]).notNull().default("pending"),
  // 메타
  lang: varchar("lang", { length: 5 }).default("ko"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  // rate limit 조회용 복합 인덱스
  ipCreatedIdx: index("idx_consultation_ip_created").on(table.ipAddress, table.createdAt),
  phoneCreatedIdx: index("idx_consultation_phone_created").on(table.phone, table.createdAt),
}));
export type ConsultationRequest = typeof consultationRequests.$inferSelect;
export type InsertConsultationRequest = typeof consultationRequests.$inferInsert;


// ── 키워드 트렌드 대시보드 ──────────────────────────────────────────────────────
export const keywordTrends = mysqlTable("keywordTrends", {
  id: int("id").autoincrement().primaryKey(),
  keyword: varchar("keyword", { length: 100 }).notNull(),
  searchVolume: int("searchVolume").notNull().default(0), // 검색량 (상대값 0-100)
  trendScore: real("trendScore").notNull().default(0), // 트렌드 점수 (증감률 %)
  category: varchar("category", { length: 50 }).default("general"), // 카테고리 (treatment, equipment, etc)
  source: varchar("source", { length: 50 }).default("google"),      // 데이터 소스 (google, naver, etc)
  collectedAt: timestamp("collectedAt").defaultNow().notNull(),      // 수집 시간
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  // 키워드별 최신 트렌드 조회
  keywordIdx: index("keywordTrends_keyword_idx").on(table.keyword),
  // 카테고리별 트렌드 조회
  categoryIdx: index("keywordTrends_category_idx").on(table.category),
  // 수집 시간별 조회 (최신 데이터 먼저)
  collectedAtIdx: index("keywordTrends_collectedAt_idx").on(table.collectedAt),
  // 복합 인덱스: 카테고리 + 수집 시간 (대시보드 조회 최적화)
  categoryCollectedIdx: index("keywordTrends_category_collected_idx").on(table.category, table.collectedAt),
}));
export type KeywordTrend = typeof keywordTrends.$inferSelect;
export type InsertKeywordTrend = typeof keywordTrends.$inferInsert;

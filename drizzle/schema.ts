import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, bigint } from "drizzle-orm/mysql-core";

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
});
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
});
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
  accent: varchar("accent", { length: 20 }).notNull().default("#4A6FA5"),
  accentLight: varchar("accentLight", { length: 20 }).notNull().default("#EEF4FF"),
  startAt: bigint("startAt", { mode: "number" }),
  endAt: bigint("endAt", { mode: "number" }),
  sortOrder: int("sortOrder").notNull().default(0),
  isActive: mysqlEnum("isActive", ["0", "1"]).notNull().default("1"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

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

/**
 * 이벤트 & 공지사항 테이블
 */
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["이벤트", "공지"]).notNull().default("이벤트"),
  title: varchar("title", { length: 200 }).notNull(),
  subtitle: varchar("subtitle", { length: 150 }).notNull().default(""),
  desc: text("desc").notNull(),
  content: text("content").notNull().default(""),
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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

/**
 * 이벤트 팝업 테이블
 */
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

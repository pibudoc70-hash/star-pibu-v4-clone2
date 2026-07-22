import { and, eq, desc, count } from "drizzle-orm";
import { createHash } from "crypto";
import { authIdentities, InsertUser, users } from "../../drizzle/schema";
import type { SocialProfile } from "../_core/socialAuth";
import { ENV } from "../_core/env";
import { logger } from "../_core/logger";
import { getDb } from "./connection";

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { logger.warn("Database", "Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    logger.error("Database", "Failed to upsert user", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

function socialOpenId(provider: SocialProfile["provider"], providerUserId: string) {
  // The external identifier itself remains only in authIdentities. This stable,
  // bounded value keeps compatibility with legacy code that still uses openId.
  return `social_${provider}_${createHash("sha256").update(providerUserId).digest("hex")}`;
}

/** Find a social identity or create its local user on the first social sign-in. */
export async function findOrCreateSocialUser(profile: SocialProfile) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");

  const existing = await db
    .select({ user: users })
    .from(authIdentities)
    .innerJoin(users, eq(authIdentities.userId, users.id))
    .where(and(eq(authIdentities.provider, profile.provider), eq(authIdentities.providerUserId, profile.providerUserId)))
    .limit(1);
  if (existing[0]?.user) {
    await db.update(users).set({
      name: profile.name,
      email: profile.email,
      loginMethod: profile.provider,
      lastSignedIn: new Date(),
    }).where(eq(users.id, existing[0].user.id));
    return { ...existing[0].user, name: profile.name, email: profile.email, loginMethod: profile.provider, lastSignedIn: new Date() };
  }

  try {
    return await db.transaction(async (tx) => {
      const openId = socialOpenId(profile.provider, profile.providerUserId);
      const inserted = await tx.insert(users).values({
        openId,
        name: profile.name,
        email: profile.email,
        loginMethod: profile.provider,
        lastSignedIn: new Date(),
      });
      const userId = Number(inserted[0].insertId);
      await tx.insert(authIdentities).values({ userId, provider: profile.provider, providerUserId: profile.providerUserId });
      const created = await tx.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!created[0]) throw new Error("Failed to create social user");
      return created[0];
    });
  } catch (error) {
    // A concurrent first login may have inserted the unique provider identity.
    const raced = await db
      .select({ user: users })
      .from(authIdentities)
      .innerJoin(users, eq(authIdentities.userId, users.id))
      .where(and(eq(authIdentities.provider, profile.provider), eq(authIdentities.providerUserId, profile.providerUserId)))
      .limit(1);
    if (raced[0]?.user) return raced[0].user;
    throw error;
  }
}

/** 페이지네이션 회원 목록 */
export async function listUsers(page: number, pageSize: number) {
  const db = await getDb();
  if (!db) return { users: [], total: 0 };
  const offset = (page - 1) * pageSize;
  const [rows, totalRows] = await Promise.all([
    db.select().from(users).orderBy(desc(users.createdAt)).limit(pageSize).offset(offset),
    db.select({ count: count() }).from(users),
  ]);
  return { users: rows, total: totalRows[0]?.count ?? 0 };
}

/** 회원 역할 변경 */
export async function updateUserRole(userId: number, role: "user" | "admin") {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(users).set({ role }).where(eq(users.id, userId));
}

/** 관리자 대시보드 사용자 통계 */
export async function getUserStats() {
  const db = await getDb();
  if (!db) return { totalUsers: 0, adminUsers: 0, recentSignups: 0 };
  const [totalRows, adminRows, allUsers] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(users).where(eq(users.role, "admin")),
    db.select({ createdAt: users.createdAt }).from(users),
  ]);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentSignups = allUsers.filter(u => u.createdAt && u.createdAt >= sevenDaysAgo).length;
  return {
    totalUsers: totalRows[0]?.count ?? 0,
    adminUsers: adminRows[0]?.count ?? 0,
    recentSignups,
  };
}

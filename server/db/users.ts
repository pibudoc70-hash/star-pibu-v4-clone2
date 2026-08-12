import { eq, desc, count } from "drizzle-orm";
import { InsertUser, users } from "../../drizzle/schema";
import { ENV } from "../_core/env";
import { logger } from "../_core/logger";
import { getDb } from "./connection";

export class LastAdminRoleChangeError extends Error {
  constructor() {
    super("At least one administrator must remain active");
    this.name = "LastAdminRoleChangeError";
  }
}

export class SelfAdminRoleChangeError extends Error {
  constructor() {
    super("Administrators cannot remove their own administrator role");
    this.name = "SelfAdminRoleChangeError";
  }
}

export class UserRoleChangeNotFoundError extends Error {
  constructor() {
    super("User not found");
    this.name = "UserRoleChangeNotFoundError";
  }
}

export function wouldRemoveLastAdmin(
  currentRole: "user" | "admin",
  nextRole: "user" | "admin",
  activeAdminCount: number,
): boolean {
  return currentRole === "admin" && nextRole === "user" && activeAdminCount <= 1;
}

export function wouldRemoveOwnAdminRole(
  actorUserId: number,
  targetUserId: number,
  nextRole: "user" | "admin",
): boolean {
  return actorUserId === targetUserId && nextRole === "user";
}

export type UserRoleChangeResult = {
  changed: boolean;
  reason: "UPDATED" | "UNCHANGED";
};

export type UserRoleChangeDecision =
  | "NOT_FOUND"
  | "SELF_ADMIN_DEMOTION"
  | "LAST_ADMIN_DEMOTION"
  | "UNCHANGED"
  | "UPDATE";

export function evaluateUserRoleChange(input: {
  actorUserId: number;
  targetUserId: number;
  targetExists: boolean;
  currentRole: "user" | "admin";
  nextRole: "user" | "admin";
  activeAdminCount: number;
}): UserRoleChangeDecision {
  if (!input.targetExists) return "NOT_FOUND";
  if (wouldRemoveOwnAdminRole(input.actorUserId, input.targetUserId, input.nextRole)) {
    return "SELF_ADMIN_DEMOTION";
  }
  if (input.currentRole === input.nextRole) return "UNCHANGED";
  if (wouldRemoveLastAdmin(input.currentRole, input.nextRole, input.activeAdminCount)) {
    return "LAST_ADMIN_DEMOTION";
  }
  return "UPDATE";
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
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
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/** 페이지네이션 회원 목록 */
export async function listUsers(page: number, pageSize: number) {
  const db = await getDb();
  const offset = (page - 1) * pageSize;
  const [rows, totalRows] = await Promise.all([
    db.select().from(users).orderBy(desc(users.createdAt)).limit(pageSize).offset(offset),
    db.select({ count: count() }).from(users),
  ]);
  return { users: rows, total: totalRows[0]?.count ?? 0 };
}

/** 회원 역할 변경 */
export async function updateUserRole(
  userId: number,
  role: "user" | "admin",
  actorUserId: number,
): Promise<UserRoleChangeResult> {
  const db = await getDb();
  return db.transaction(async (tx) => {
    // 모든 admin 행을 잠가 동시 강등 요청에서도 마지막 admin이 사라지지 않게 한다.
    const lockedAdmins = await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, "admin"))
      .for("update");

    const targetRows = await tx
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .for("update");
    const target = targetRows[0];
    const decision = evaluateUserRoleChange({
      actorUserId,
      targetUserId: userId,
      targetExists: Boolean(target),
      currentRole: target?.role ?? "user",
      nextRole: role,
      activeAdminCount: lockedAdmins.length,
    });
    if (decision === "NOT_FOUND") throw new UserRoleChangeNotFoundError();
    if (decision === "SELF_ADMIN_DEMOTION") throw new SelfAdminRoleChangeError();
    if (decision === "LAST_ADMIN_DEMOTION") throw new LastAdminRoleChangeError();
    if (decision === "UNCHANGED") return { changed: false, reason: "UNCHANGED" };

    await tx.update(users).set({ role }).where(eq(users.id, userId));
    return { changed: true, reason: "UPDATED" };
  });
}

/** 관리자 대시보드 사용자 통계 */
export async function getUserStats() {
  const db = await getDb();
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

import {
  canAccessModule,
  type AccessLevel,
  type ModuleKey,
  type UserRole
} from "@autofocus/domain";
import type { Doc } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

type Ctx = QueryCtx | MutationCtx;

const DEMO_SESSION_ID = "demo-admin";

export async function resolveIdentity(ctx: Ctx, sessionId?: string) {
  if (sessionId) {
    return sessionId;
  }

  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject ?? DEMO_SESSION_ID;
}

export async function getCurrentUserRecord(ctx: Ctx, sessionId?: string) {
  const identityId = await resolveIdentity(ctx, sessionId);

  return ctx.db
    .query("users")
    .withIndex("by_clerkId", (query: any) => query.eq("clerkId", identityId))
    .unique();
}

export async function requireCurrentUser(
  ctx: Ctx,
  sessionId?: string
): Promise<Doc<"users">> {
  const user = await getCurrentUserRecord(ctx, sessionId);

  if (!user) {
    throw new Error("User is not signed in or has not been synced.");
  }

  return user;
}

export async function requireModuleAccess(
  ctx: Ctx,
  moduleKey: ModuleKey,
  sessionId?: string
) {
  const user = await requireCurrentUser(ctx, sessionId);

  if (!canAccessModule(user.accessLevel as AccessLevel, moduleKey)) {
    throw new Error("Insufficient access level for the requested module.");
  }

  return user;
}

export async function requireRole(
  ctx: Ctx,
  allowedRoles: UserRole[],
  sessionId?: string
) {
  const user = await requireCurrentUser(ctx, sessionId);

  if (!allowedRoles.includes(user.role as UserRole)) {
    throw new Error("User does not have the required role.");
  }

  return user;
}

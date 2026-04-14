import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserRecord, requireModuleAccess } from "./auth";
import { accessLevelValidator, userRoleValidator } from "./lib";

function createLoginId(email: string) {
  return `demo-${email.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export const me = query({
  args: {
    sessionId: v.string()
  },
  handler: async (ctx: any, args: any) => {
    return getCurrentUserRecord(ctx, args.sessionId);
  }
});

export const loginOptions = query({
  args: {},
  handler: async (ctx: any) => {
    const users = await ctx.db.query("users").collect();
    return users
      .filter((user: any) => user.isActive)
      .sort((left: any, right: any) => left.fullName.localeCompare(right.fullName))
      .map((user: any) => ({
        clerkId: user.clerkId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        accessLevel: user.accessLevel
      }));
  }
});

export const list = query({
  args: {
    sessionId: v.string()
  },
  handler: async (ctx: any, args: any) => {
    await requireModuleAccess(ctx, "admin_access", args.sessionId);
    return ctx.db.query("users").collect();
  }
});

export const create = mutation({
  args: {
    sessionId: v.string(),
    email: v.string(),
    fullName: v.string(),
    role: userRoleValidator,
    accessLevel: accessLevelValidator,
    phone: v.optional(v.string())
  },
  handler: async (ctx: any, args: any) => {
    await requireModuleAccess(ctx, "admin_access", args.sessionId);

    return ctx.db.insert("users", {
      clerkId: createLoginId(args.email),
      email: args.email,
      fullName: args.fullName,
      role: args.role,
      accessLevel: args.accessLevel,
      phone: args.phone,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
});

export const syncFromClerk = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    fullName: v.string(),
    role: userRoleValidator,
    accessLevel: accessLevelValidator
  },
  handler: async (ctx: any, args: any) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (query: any) => query.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        fullName: args.fullName,
        role: args.role,
        accessLevel: args.accessLevel,
        updatedAt: Date.now()
      });
      return existing._id;
    }

    return ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      fullName: args.fullName,
      role: args.role,
      accessLevel: args.accessLevel,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
});

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireModuleAccess } from "./auth";
import { employmentTypeValidator, resourceStatusValidator, userRoleValidator } from "./lib";

export const equipmentList = query({
  args: {
    sessionId: v.string()
  },
  handler: async (ctx: any, args: any) => {
    await requireModuleAccess(ctx, "equipment", args.sessionId);
    return ctx.db.query("equipment").collect();
  }
});

export const createEquipment = mutation({
  args: {
    sessionId: v.string(),
    name: v.string(),
    category: v.string(),
    inventoryNumber: v.string(),
    serialNumber: v.optional(v.string()),
    location: v.string(),
    technicalState: v.string(),
    currentStatus: resourceStatusValidator,
    notes: v.optional(v.string())
  },
  handler: async (ctx: any, args: any) => {
    await requireModuleAccess(ctx, "equipment", args.sessionId);
    return ctx.db.insert("equipment", {
      name: args.name,
      category: args.category,
      inventoryNumber: args.inventoryNumber,
      serialNumber: args.serialNumber,
      location: args.location,
      technicalState: args.technicalState,
      currentStatus: args.currentStatus,
      notes: args.notes,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
});

export const studioList = query({
  args: {
    sessionId: v.string()
  },
  handler: async (ctx: any, args: any) => {
    await requireModuleAccess(ctx, "studios", args.sessionId);
    return ctx.db.query("studios").collect();
  }
});

export const createStudio = mutation({
  args: {
    sessionId: v.string(),
    name: v.string(),
    slug: v.string(),
    capacity: v.number(),
    location: v.string(),
    workingHours: v.string(),
    currentStatus: resourceStatusValidator,
    notes: v.optional(v.string())
  },
  handler: async (ctx: any, args: any) => {
    await requireModuleAccess(ctx, "studios", args.sessionId);
    return ctx.db.insert("studios", {
      name: args.name,
      slug: args.slug,
      capacity: args.capacity,
      location: args.location,
      workingHours: args.workingHours,
      currentStatus: args.currentStatus,
      notes: args.notes,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
});

export const staffList = query({
  args: {
    sessionId: v.string()
  },
  handler: async (ctx: any, args: any) => {
    await requireModuleAccess(ctx, "staff", args.sessionId);
    return ctx.db.query("staffProfiles").collect();
  }
});

export const createStaffProfile = mutation({
  args: {
    sessionId: v.string(),
    fullName: v.string(),
    primaryRole: userRoleValidator,
    team: v.string(),
    specialty: v.string(),
    employmentType: employmentTypeValidator,
    phone: v.optional(v.string()),
    isActive: v.boolean()
  },
  handler: async (ctx: any, args: any) => {
    await requireModuleAccess(ctx, "staff", args.sessionId);
    return ctx.db.insert("staffProfiles", {
      fullName: args.fullName,
      primaryRole: args.primaryRole,
      team: args.team,
      specialty: args.specialty,
      employmentType: args.employmentType,
      phone: args.phone,
      isActive: args.isActive,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
});

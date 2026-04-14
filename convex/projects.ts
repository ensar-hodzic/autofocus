import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireCurrentUser, requireModuleAccess } from "./auth";
import { priorityValidator, projectStatusValidator } from "./lib";

export const list = query({
  args: {
    sessionId: v.string()
  },
  handler: async (ctx: any, args: any) => {
    await requireModuleAccess(ctx, "projects", args.sessionId);

    const projects = await ctx.db.query("projects").collect();
    const users = await ctx.db.query("users").collect();
    const userMap = new Map<any, any>(users.map((item: any) => [item._id, item]));

    return projects
      .sort((left: any, right: any) => left.startDate - right.startDate)
      .map((project: any) => ({
        ...project,
        createdByName: userMap.get(project.createdBy)?.fullName ?? "Unknown user"
      }));
  }
});

export const detail = query({
  args: {
    sessionId: v.string(),
    projectId: v.id("projects")
  },
  handler: async (ctx: any, args: any) => {
    await requireModuleAccess(ctx, "projects", args.sessionId);
    return ctx.db.get(args.projectId);
  }
});

export const create = mutation({
  args: {
    sessionId: v.string(),
    title: v.string(),
    clientName: v.string(),
    type: v.string(),
    priority: priorityValidator,
    status: projectStatusValidator,
    startDate: v.number(),
    endDate: v.number(),
    location: v.optional(v.string()),
    description: v.optional(v.string())
  },
  handler: async (ctx: any, args: any) => {
    const user = await requireCurrentUser(ctx, args.sessionId);
    await requireModuleAccess(ctx, "projects", args.sessionId);

    return ctx.db.insert("projects", {
      title: args.title,
      clientName: args.clientName,
      type: args.type,
      priority: args.priority,
      status: args.status,
      startDate: args.startDate,
      endDate: args.endDate,
      location: args.location,
      description: args.description,
      createdBy: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
});

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { canTransitionEventStatus } from "@autofocus/domain";
import { eventSeverityValidator, eventStatusValidator } from "./lib";
import { requireCurrentUser, requireModuleAccess } from "./auth";

export const list = query({
  args: {},
  handler: async (ctx: any) => {
    await requireModuleAccess(ctx, "events");
    return ctx.db.query("events").collect();
  }
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    severity: eventSeverityValidator,
    type: v.optional(v.string()),
    sourceModule: v.string(),
    relatedEntityType: v.optional(v.string()),
    relatedEntityId: v.optional(v.string())
  },
  handler: async (ctx: any, args: any) => {
    const user = await requireCurrentUser(ctx);
    await requireModuleAccess(ctx, "events");

    const eventId = await ctx.db.insert("events", {
      ...args,
      status: "open",
      assigneeUserId: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    await ctx.db.insert("eventUpdates", {
      eventId,
      authorUserId: user._id,
      status: "open",
      message: "Event created.",
      createdAt: Date.now()
    });

    return eventId;
  }
});

export const updateStatus = mutation({
  args: {
    eventId: v.id("events"),
    nextStatus: eventStatusValidator,
    message: v.string()
  },
  handler: async (ctx: any, args: any) => {
    const user = await requireCurrentUser(ctx);
    await requireModuleAccess(ctx, "events");

    const event = await ctx.db.get(args.eventId);

    if (!event) {
      throw new Error("Event was not found.");
    }

    if (!canTransitionEventStatus(event.status, args.nextStatus)) {
      throw new Error("Invalid event status transition.");
    }

    await ctx.db.patch(args.eventId, {
      status: args.nextStatus,
      updatedAt: Date.now()
    });

    await ctx.db.insert("eventUpdates", {
      eventId: args.eventId,
      authorUserId: user._id,
      status: args.nextStatus,
      message: args.message,
      createdAt: Date.now()
    });

    return args.eventId;
  }
});

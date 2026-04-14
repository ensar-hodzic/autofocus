import { query } from "./_generated/server";
import { v } from "convex/values";
import { hasWindowConflict } from "@autofocus/domain";
import { requireModuleAccess } from "./auth";

export const detectStudioConflicts = query({
  args: {
    studioId: v.id("studios"),
    startAt: v.number(),
    endAt: v.number()
  },
  handler: async (ctx: any, args: any) => {
    await requireModuleAccess(ctx, "studios");
    const bookings = await ctx.db
      .query("studioBookings")
      .withIndex("by_studioId", (query: any) => query.eq("studioId", args.studioId))
      .collect();

    return bookings.filter((booking: any) =>
      hasWindowConflict(
        { startAt: args.startAt, endAt: args.endAt },
        { startAt: booking.startAt, endAt: booking.endAt }
      ).overlaps
    );
  }
});

export const detectEquipmentConflicts = query({
  args: {
    equipmentId: v.id("equipment"),
    startAt: v.number(),
    endAt: v.number()
  },
  handler: async (ctx: any, args: any) => {
    await requireModuleAccess(ctx, "equipment");
    const reservations = await ctx.db
      .query("equipmentReservations")
      .withIndex("by_equipmentId", (query: any) => query.eq("equipmentId", args.equipmentId))
      .collect();

    return reservations.filter((reservation: any) =>
      hasWindowConflict(
        { startAt: args.startAt, endAt: args.endAt },
        { startAt: reservation.startAt, endAt: reservation.endAt }
      ).overlaps
    );
  }
});

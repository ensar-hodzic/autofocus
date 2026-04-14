import { v } from "convex/values";

export const accessLevelValidator = v.union(
  v.literal("admin"),
  v.literal("management"),
  v.literal("operations"),
  v.literal("technical_support")
);

export const userRoleValidator = v.union(
  v.literal("administrator"),
  v.literal("production_manager"),
  v.literal("project_coordinator"),
  v.literal("photographer"),
  v.literal("videographer"),
  v.literal("lighting_technician"),
  v.literal("studio_operator"),
  v.literal("it_support"),
  v.literal("editor"),
  v.literal("render_operator")
);

export const resourceStatusValidator = v.union(
  v.literal("available"),
  v.literal("reserved"),
  v.literal("confirmed"),
  v.literal("conditionally_available"),
  v.literal("maintenance"),
  v.literal("in_transport"),
  v.literal("out_of_service")
);

export const priorityValidator = v.union(
  v.literal("low"),
  v.literal("medium"),
  v.literal("high")
);

export const bookingStatusValidator = v.union(
  v.literal("draft"),
  v.literal("pending"),
  v.literal("confirmed"),
  v.literal("cancelled"),
  v.literal("completed")
);

export const eventSeverityValidator = v.union(
  v.literal("info"),
  v.literal("warning"),
  v.literal("high"),
  v.literal("critical")
);

export const eventStatusValidator = v.union(
  v.literal("open"),
  v.literal("acknowledged"),
  v.literal("in_progress"),
  v.literal("resolved"),
  v.literal("closed")
);

export const projectStatusValidator = v.union(
  v.literal("lead"),
  v.literal("planning"),
  v.literal("scheduled"),
  v.literal("in_production"),
  v.literal("in_postproduction"),
  v.literal("delivered"),
  v.literal("cancelled")
);

export const projectPhaseTypeValidator = v.union(
  v.literal("preproduction"),
  v.literal("production"),
  v.literal("postproduction")
);

export const employmentTypeValidator = v.union(
  v.literal("internal"),
  v.literal("external"),
  v.literal("freelance")
);

export function createTimestampRangeValidator() {
  return {
    startAt: v.number(),
    endAt: v.number()
  };
}

export async function createAuditLog(
  ctx: { db: { insert: (table: "auditLogs", value: Record<string, unknown>) => Promise<unknown> } },
  input: {
    actorId?: string;
    entityType: string;
    entityId: string;
    action: string;
    summary: string;
  }
) {
  await ctx.db.insert("auditLogs", {
    actorId: input.actorId,
    entityType: input.entityType,
    entityId: input.entityId,
    action: input.action,
    summary: input.summary,
    createdAt: Date.now()
  });
}

export async function createSystemEvent(
  ctx: { db: { insert: (table: "events", value: Record<string, unknown>) => Promise<unknown> } },
  input: {
    title: string;
    severity: "info" | "warning" | "high" | "critical";
    sourceModule: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
  }
) {
  await ctx.db.insert("events", {
    title: input.title,
    severity: input.severity,
    status: "open",
    sourceModule: input.sourceModule,
    relatedEntityType: input.relatedEntityType,
    relatedEntityId: input.relatedEntityId,
    createdAt: Date.now()
  });
}

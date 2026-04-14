import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  accessLevelValidator,
  bookingStatusValidator,
  eventSeverityValidator,
  eventStatusValidator,
  projectPhaseTypeValidator,
  projectStatusValidator,
  resourceStatusValidator,
  userRoleValidator
} from "./lib";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    fullName: v.string(),
    role: userRoleValidator,
    accessLevel: accessLevelValidator,
    isActive: v.boolean(),
    phone: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_clerkId", ["clerkId"]),

  projects: defineTable({
    title: v.string(),
    clientName: v.string(),
    type: v.string(),
    status: projectStatusValidator,
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    location: v.optional(v.string()),
    description: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_status", ["status"]),

  projectPhases: defineTable({
    projectId: v.id("projects"),
    type: projectPhaseTypeValidator,
    title: v.string(),
    status: bookingStatusValidator,
    plannedStartAt: v.number(),
    plannedEndAt: v.number(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_projectId", ["projectId"]),

  equipment: defineTable({
    name: v.string(),
    category: v.string(),
    inventoryNumber: v.string(),
    serialNumber: v.optional(v.string()),
    location: v.string(),
    technicalState: v.string(),
    currentStatus: resourceStatusValidator,
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_inventoryNumber", ["inventoryNumber"]),

  studios: defineTable({
    name: v.string(),
    slug: v.string(),
    capacity: v.number(),
    location: v.string(),
    workingHours: v.string(),
    currentStatus: resourceStatusValidator,
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_slug", ["slug"]),

  staffProfiles: defineTable({
    userId: v.optional(v.id("users")),
    fullName: v.string(),
    primaryRole: userRoleValidator,
    team: v.string(),
    specialty: v.string(),
    employmentType: v.union(
      v.literal("internal"),
      v.literal("external"),
      v.literal("freelance")
    ),
    phone: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_userId", ["userId"]),

  staffAssignments: defineTable({
    projectId: v.id("projects"),
    staffProfileId: v.id("staffProfiles"),
    role: userRoleValidator,
    status: bookingStatusValidator,
    startAt: v.number(),
    endAt: v.number(),
    location: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_projectId", ["projectId"])
    .index("by_staffProfileId", ["staffProfileId"]),

  equipmentReservations: defineTable({
    projectId: v.id("projects"),
    equipmentId: v.id("equipment"),
    status: bookingStatusValidator,
    startAt: v.number(),
    endAt: v.number(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_projectId", ["projectId"])
    .index("by_equipmentId", ["equipmentId"]),

  studioBookings: defineTable({
    projectId: v.id("projects"),
    studioId: v.id("studios"),
    status: bookingStatusValidator,
    startAt: v.number(),
    endAt: v.number(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_projectId", ["projectId"])
    .index("by_studioId", ["studioId"]),

  maintenanceWindows: defineTable({
    resourceType: v.union(v.literal("equipment"), v.literal("studio")),
    equipmentId: v.optional(v.id("equipment")),
    studioId: v.optional(v.id("studios")),
    status: resourceStatusValidator,
    startAt: v.number(),
    endAt: v.number(),
    reason: v.string(),
    createdAt: v.number(),
    updatedAt: v.number()
  }),

  availabilityDependencies: defineTable({
    projectId: v.id("projects"),
    label: v.string(),
    equipmentIds: v.array(v.id("equipment")),
    studioIds: v.array(v.id("studios")),
    staffProfileIds: v.array(v.id("staffProfiles")),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_projectId", ["projectId"]),

  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    severity: eventSeverityValidator,
    status: eventStatusValidator,
    type: v.optional(v.string()),
    sourceModule: v.string(),
    relatedEntityType: v.optional(v.string()),
    relatedEntityId: v.optional(v.string()),
    assigneeUserId: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.optional(v.number())
  }).index("by_status", ["status"]),

  eventUpdates: defineTable({
    eventId: v.id("events"),
    authorUserId: v.optional(v.id("users")),
    status: eventStatusValidator,
    message: v.string(),
    createdAt: v.number()
  }).index("by_eventId", ["eventId"]),

  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    body: v.string(),
    isRead: v.boolean(),
    link: v.optional(v.string()),
    createdAt: v.number()
  }).index("by_userId", ["userId"]),

  auditLogs: defineTable({
    actorId: v.optional(v.string()),
    entityType: v.string(),
    entityId: v.string(),
    action: v.string(),
    summary: v.string(),
    createdAt: v.number()
  })
});

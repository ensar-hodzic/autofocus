import { mutation } from "./_generated/server";

const DAY = 24 * 60 * 60 * 1000;

function offsetDate(days: number, hour: number, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date.getTime();
}

export const bootstrap = mutation({
  args: {},
  handler: async (ctx: any) => {
    const existingUsers = await ctx.db.query("users").collect();

    if (existingUsers.length > 0) {
      return { seeded: false };
    }

    const now = Date.now();

    const adminUserId = await ctx.db.insert("users", {
      clerkId: "demo-admin",
      email: "admin@autofocus.local",
      fullName: "Amina Selimovic",
      role: "administrator",
      accessLevel: "admin",
      isActive: true,
      phone: "+38760000111",
      createdAt: now,
      updatedAt: now
    });

    const managerUserId = await ctx.db.insert("users", {
      clerkId: "demo-management",
      email: "manager@autofocus.local",
      fullName: "Tarik Kovacevic",
      role: "production_manager",
      accessLevel: "management",
      isActive: true,
      phone: "+38760000112",
      createdAt: now,
      updatedAt: now
    });

    const operationsUserId = await ctx.db.insert("users", {
      clerkId: "demo-operations",
      email: "operations@autofocus.local",
      fullName: "Mia Kovac",
      role: "project_coordinator",
      accessLevel: "operations",
      isActive: true,
      phone: "+38760000113",
      createdAt: now,
      updatedAt: now
    });

    const supportUserId = await ctx.db.insert("users", {
      clerkId: "demo-support",
      email: "support@autofocus.local",
      fullName: "Vedad Basic",
      role: "it_support",
      accessLevel: "technical_support",
      isActive: true,
      phone: "+38760000114",
      createdAt: now,
      updatedAt: now
    });

    const auroraProjectId = await ctx.db.insert("projects", {
      title: "Aurora Campaign",
      clientName: "Aurora Skin",
      type: "commercial",
      status: "in_production",
      priority: "high",
      location: "Studio A",
      description: "Hero spot and photo set for the spring campaign.",
      startDate: offsetDate(0, 9),
      endDate: offsetDate(2, 18),
      createdBy: managerUserId,
      createdAt: now,
      updatedAt: now
    });

    const lookbookProjectId = await ctx.db.insert("projects", {
      title: "Lookbook S25",
      clientName: "Atelier Nord",
      type: "fashion",
      status: "scheduled",
      priority: "medium",
      location: "Studio B",
      description: "Studio shoot for the spring/summer collection.",
      startDate: offsetDate(0, 11, 30),
      endDate: offsetDate(1, 18),
      createdBy: managerUserId,
      createdAt: now,
      updatedAt: now
    });

    const interviewProjectId = await ctx.db.insert("projects", {
      title: "Interview Series",
      clientName: "Media Hub",
      type: "interview",
      status: "planning",
      priority: "medium",
      location: "Postproduction",
      description: "A series of short interviews with internal editing.",
      startDate: offsetDate(1, 8),
      endDate: offsetDate(3, 17),
      createdBy: operationsUserId,
      createdAt: now,
      updatedAt: now
    });

    const teaserProjectId = await ctx.db.insert("projects", {
      title: "Festival Teaser",
      clientName: "Sarajevo Lights",
      type: "promo",
      status: "lead",
      priority: "high",
      location: "Studio B",
      description: "Teaser video and static assets for the festival launch.",
      startDate: offsetDate(1, 14),
      endDate: offsetDate(4, 20),
      createdBy: managerUserId,
      createdAt: now,
      updatedAt: now
    });

    const studioAId = await ctx.db.insert("studios", {
      name: "Studio A",
      slug: "studio-a",
      capacity: 24,
      location: "Sarajevo HQ",
      workingHours: "08:00 - 20:00",
      currentStatus: "confirmed",
      notes: "Main studio for campaigns and video sets.",
      createdAt: now,
      updatedAt: now
    });

    const studioBId = await ctx.db.insert("studios", {
      name: "Studio B",
      slug: "studio-b",
      capacity: 18,
      location: "Sarajevo HQ",
      workingHours: "08:00 - 20:00",
      currentStatus: "reserved",
      notes: "Fashion and product sessions.",
      createdAt: now,
      updatedAt: now
    });

    const studioCId = await ctx.db.insert("studios", {
      name: "Studio C",
      slug: "studio-c",
      capacity: 10,
      location: "Sarajevo HQ",
      workingHours: "09:00 - 18:00",
      currentStatus: "available",
      notes: "Smaller studio for interviews and podcast setups.",
      createdAt: now,
      updatedAt: now
    });

    const fx6Id = await ctx.db.insert("equipment", {
      name: "Sony FX6 package",
      category: "camera",
      inventoryNumber: "CAM-001",
      serialNumber: "FX6-11293",
      location: "Warehouse A",
      technicalState: "Ready for shooting",
      currentStatus: "reserved",
      notes: "Includes cage, monitor, and V-mount setup.",
      createdAt: now,
      updatedAt: now
    });

    const batterySetId = await ctx.db.insert("equipment", {
      name: "Battery set B-14",
      category: "power",
      inventoryNumber: "PWR-014",
      serialNumber: "B14-7781",
      location: "Service shelf",
      technicalState: "Needs stability inspection",
      currentStatus: "maintenance",
      notes: "Voltage oscillation was reported.",
      createdAt: now,
      updatedAt: now
    });

    const arriLightsId = await ctx.db.insert("equipment", {
      name: "ARRI lighting kit",
      category: "lighting",
      inventoryNumber: "LGT-021",
      serialNumber: "ARRI-4401",
      location: "Warehouse B",
      technicalState: "Fully operational",
      currentStatus: "confirmed",
      notes: "Three fixtures and grip accessories.",
      createdAt: now,
      updatedAt: now
    });

    await ctx.db.insert("equipment", {
      name: "Mobile audio kit",
      category: "audio",
      inventoryNumber: "AUD-010",
      serialNumber: "AUD-010-55",
      location: "On site",
      technicalState: "In transit to location",
      currentStatus: "in_transport",
      notes: "Lav, boom, and recorder package.",
      createdAt: now,
      updatedAt: now
    });

    const photographerId = await ctx.db.insert("staffProfiles", {
      userId: operationsUserId,
      fullName: "Lejla Hadzic",
      primaryRole: "photographer",
      team: "Photo",
      specialty: "Fashion photography",
      employmentType: "internal",
      phone: "+38760000221",
      isActive: true,
      createdAt: now,
      updatedAt: now
    });

    const lightingId = await ctx.db.insert("staffProfiles", {
      fullName: "Amar Mekic",
      primaryRole: "lighting_technician",
      team: "Lighting",
      specialty: "Studio lighting setups",
      employmentType: "internal",
      phone: "+38760000222",
      isActive: true,
      createdAt: now,
      updatedAt: now
    });

    const editorId = await ctx.db.insert("staffProfiles", {
      fullName: "Faris Delic",
      primaryRole: "editor",
      team: "Post",
      specialty: "Interview and social edits",
      employmentType: "internal",
      phone: "+38760000223",
      isActive: true,
      createdAt: now,
      updatedAt: now
    });

    const studioOperatorId = await ctx.db.insert("staffProfiles", {
      userId: supportUserId,
      fullName: "Nina Radic",
      primaryRole: "studio_operator",
      team: "Studio Ops",
      specialty: "Stage turnover and logistics",
      employmentType: "freelance",
      phone: "+38760000224",
      isActive: true,
      createdAt: now,
      updatedAt: now
    });

    await ctx.db.insert("studioBookings", {
      projectId: auroraProjectId,
      studioId: studioAId,
      status: "confirmed",
      startAt: offsetDate(0, 9),
      endAt: offsetDate(0, 15),
      notes: "Full-day hero shoot.",
      createdAt: now,
      updatedAt: now
    });

    await ctx.db.insert("studioBookings", {
      projectId: teaserProjectId,
      studioId: studioBId,
      status: "draft",
      startAt: offsetDate(1, 14),
      endAt: offsetDate(1, 20),
      notes: "Tentative slot.",
      createdAt: now,
      updatedAt: now
    });

    await ctx.db.insert("equipmentReservations", {
      projectId: lookbookProjectId,
      equipmentId: fx6Id,
      status: "pending",
      startAt: offsetDate(0, 11, 30),
      endAt: offsetDate(0, 18),
      notes: "Primary camera for the lookbook set.",
      createdAt: now,
      updatedAt: now
    });

    await ctx.db.insert("equipmentReservations", {
      projectId: auroraProjectId,
      equipmentId: arriLightsId,
      status: "confirmed",
      startAt: offsetDate(0, 8, 30),
      endAt: offsetDate(0, 15, 30),
      notes: "Lighting setup for the hero shot.",
      createdAt: now,
      updatedAt: now
    });

    await ctx.db.insert("staffAssignments", {
      projectId: lookbookProjectId,
      staffProfileId: photographerId,
      role: "photographer",
      status: "confirmed",
      startAt: offsetDate(0, 10),
      endAt: offsetDate(0, 16),
      location: "Studio B",
      createdAt: now,
      updatedAt: now
    });

    await ctx.db.insert("staffAssignments", {
      projectId: auroraProjectId,
      staffProfileId: lightingId,
      role: "lighting_technician",
      status: "confirmed",
      startAt: offsetDate(0, 8, 30),
      endAt: offsetDate(0, 15, 30),
      location: "Studio A",
      createdAt: now,
      updatedAt: now
    });

    await ctx.db.insert("staffAssignments", {
      projectId: interviewProjectId,
      staffProfileId: editorId,
      role: "editor",
      status: "confirmed",
      startAt: offsetDate(0, 12),
      endAt: offsetDate(0, 18),
      location: "Postproduction",
      createdAt: now,
      updatedAt: now
    });

    await ctx.db.insert("events", {
      title: "Render node is delayed exporting the final version",
      description: "Possible delay in final file delivery.",
      severity: "critical",
      status: "in_progress",
      type: "technical",
      sourceModule: "events",
      relatedEntityType: "project",
      relatedEntityId: `${auroraProjectId}`,
      assigneeUserId: supportUserId,
      createdAt: now - 18 * 60 * 1000,
      updatedAt: now - 5 * 60 * 1000
    });

    await ctx.db.insert("events", {
      title: "Battery set B-14 reported as unstable",
      description: "Inspection required before the next field deployment.",
      severity: "high",
      status: "acknowledged",
      type: "equipment",
      sourceModule: "equipment",
      relatedEntityType: "equipment",
      relatedEntityId: `${batterySetId}`,
      assigneeUserId: supportUserId,
      createdAt: now - 42 * 60 * 1000,
      updatedAt: now - 30 * 60 * 1000
    });

    await ctx.db.insert("events", {
      title: "Freelancer arrival for field shoot is delayed",
      description: "Call time needs to move by 30 minutes.",
      severity: "warning",
      status: "open",
      type: "staff",
      sourceModule: "staff",
      relatedEntityType: "staffProfile",
      relatedEntityId: `${studioOperatorId}`,
      assigneeUserId: operationsUserId,
      createdAt: now - 70 * 60 * 1000,
      updatedAt: now - 70 * 60 * 1000
    });

    await ctx.db.insert("notifications", {
      userId: managerUserId,
      title: "Aurora shoot is active",
      body: "Studio A and key equipment are confirmed for today's slot.",
      isRead: false,
      link: "/",
      createdAt: now - DAY
    });

    return {
      seeded: true
    };
  }
});

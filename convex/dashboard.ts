import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireModuleAccess } from "./auth";

function formatDateTime(timestamp: number) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(timestamp);
}

export const overview = query({
  args: {
    sessionId: v.string()
  },
  handler: async (ctx: any, args: any) => {
    await requireModuleAccess(ctx, "dashboard", args.sessionId);

    const [projects, equipment, studios, staff, events, equipmentReservations, studioBookings, assignments, users] =
      await Promise.all([
        ctx.db.query("projects").collect(),
        ctx.db.query("equipment").collect(),
        ctx.db.query("studios").collect(),
        ctx.db.query("staffProfiles").collect(),
        ctx.db.query("events").collect(),
        ctx.db.query("equipmentReservations").collect(),
        ctx.db.query("studioBookings").collect(),
        ctx.db.query("staffAssignments").collect(),
        ctx.db.query("users").collect()
      ]);

    const activeProjects = projects.filter(
      (project: any) => !["delivered", "cancelled"].includes(project.status)
    );
    const totalResources = equipment.length + studios.length + staff.length;
    const readyResources =
      equipment.filter((item: any) =>
        ["available", "reserved", "confirmed", "conditionally_available"].includes(item.currentStatus)
      ).length +
      studios.filter((item: any) =>
        ["available", "reserved", "confirmed", "conditionally_available"].includes(item.currentStatus)
      ).length +
      staff.filter((item: any) => item.isActive).length;
    const confirmedBookings =
      equipmentReservations.filter((item: any) => item.status === "confirmed").length +
      studioBookings.filter((item: any) => item.status === "confirmed").length +
      assignments.filter((item: any) => item.status === "confirmed").length;
    const openCriticalEvents = events.filter(
      (item: any) =>
        ["high", "critical"].includes(item.severity) &&
        !["resolved", "closed"].includes(item.status)
    );

    const projectMap = new Map<any, any>(projects.map((item: any) => [item._id, item]));
    const equipmentMap = new Map<any, any>(equipment.map((item: any) => [item._id, item]));
    const studioMap = new Map<any, any>(studios.map((item: any) => [item._id, item]));
    const staffMap = new Map<any, any>(staff.map((item: any) => [item._id, item]));
    const userMap = new Map<any, any>(users.map((item: any) => [item._id, item]));

    const upcomingBookings = [
      ...equipmentReservations.map((item: any) => ({
        id: item._id,
        projectTitle: projectMap.get(item.projectId)?.title ?? "Unknown project",
        resourceLabel: equipmentMap.get(item.equipmentId)?.name ?? "Unknown equipment",
        resourceType: "equipment",
        status: item.status,
        startsAt: item.startAt,
        scheduledFor: `${formatDateTime(item.startAt)} - ${formatDateTime(item.endAt)}`
      })),
      ...studioBookings.map((item: any) => ({
        id: item._id,
        projectTitle: projectMap.get(item.projectId)?.title ?? "Unknown project",
        resourceLabel: studioMap.get(item.studioId)?.name ?? "Unknown studio",
        resourceType: "studio",
        status: item.status,
        startsAt: item.startAt,
        scheduledFor: `${formatDateTime(item.startAt)} - ${formatDateTime(item.endAt)}`
      })),
      ...assignments.map((item: any) => ({
        id: item._id,
        projectTitle: projectMap.get(item.projectId)?.title ?? "Unknown project",
        resourceLabel: staffMap.get(item.staffProfileId)?.fullName ?? "Unknown staff member",
        resourceType: "staff",
        status: item.status,
        startsAt: item.startAt,
        scheduledFor: `${formatDateTime(item.startAt)} - ${formatDateTime(item.endAt)}`
      }))
    ]
      .sort((left, right) => left.startsAt - right.startsAt)
      .slice(0, 4)
      .map(({ startsAt, ...item }) => item);

    const utilization = [
      {
        key: "equipment",
        label: "Equipment",
        utilization: equipment.length
          ? Math.round(
              (equipment.filter((item: any) => item.currentStatus !== "available").length /
                equipment.length) *
                100
            )
          : 0,
        note: `${equipment.filter((item: any) => item.currentStatus === "maintenance").length} items are in maintenance`
      },
      {
        key: "studios",
        label: "Studios",
        utilization: studios.length
          ? Math.round(
              (studios.filter((item: any) => item.currentStatus !== "available").length /
                studios.length) *
                100
            )
          : 0,
        note: `${studios.filter((item: any) => item.currentStatus === "available").length} studios are currently free`
      },
      {
        key: "staff",
        label: "Staff",
        utilization: staff.length ? Math.round((assignments.length / staff.length) * 100) : 0,
        note: `${staff.filter((item: any) => item.isActive).length} active profiles are in rotation`
      }
    ];

    const incidents = openCriticalEvents
      .sort((left: any, right: any) => right.createdAt - left.createdAt)
      .slice(0, 3)
      .map((item: any) => ({
        id: item._id,
        title: item.title,
        severity: item.severity,
        status: item.status,
        module: item.sourceModule,
        createdAtLabel: formatDateTime(item.createdAt),
        owner: item.assigneeUserId
          ? userMap.get(item.assigneeUserId)?.fullName ?? "Unassigned"
          : "Unassigned"
      }));

    const assignmentItems = assignments
      .sort((left: any, right: any) => left.startAt - right.startAt)
      .slice(0, 3)
      .map((item: any) => ({
        id: item._id,
        person: staffMap.get(item.staffProfileId)?.fullName ?? "Unknown staff member",
        role: item.role,
        projectTitle: projectMap.get(item.projectId)?.title ?? "Unknown project",
        window: `${formatDateTime(item.startAt)} - ${formatDateTime(item.endAt)}`,
        location: item.location ?? "On site"
      }));

    return {
      metrics: [
        {
          key: "active-projects",
          label: "Active projects",
          value: `${activeProjects.length}`,
          delta: `${projects.length} total projects`,
          tone: "success"
        },
        {
          key: "resource-readiness",
          label: "Resource readiness",
          value: `${totalResources ? Math.round((readyResources / totalResources) * 100) : 0}%`,
          delta: `${totalResources - readyResources} resources need attention`,
          tone: "warning"
        },
        {
          key: "confirmed-bookings",
          label: "Confirmed bookings",
          value: `${confirmedBookings}`,
          delta: `${upcomingBookings.length} upcoming bookings`,
          tone: "default"
        },
        {
          key: "critical-events",
          label: "Open incidents",
          value: `${openCriticalEvents.length}`,
          delta: `${events.length} total recorded events`,
          tone: openCriticalEvents.length > 0 ? "danger" : "success"
        }
      ],
      upcomingBookings,
      utilization,
      incidents,
      assignments: assignmentItems
    };
  }
});

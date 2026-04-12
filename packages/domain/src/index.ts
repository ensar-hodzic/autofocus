export const accessLevels = [
  "admin",
  "management",
  "operations",
  "technical_support"
] as const;

export const userRoles = [
  "administrator",
  "production_manager",
  "project_coordinator",
  "photographer",
  "videographer",
  "lighting_technician",
  "studio_operator",
  "it_support",
  "editor",
  "render_operator"
] as const;

export const resourceStatuses = [
  "available",
  "reserved",
  "confirmed",
  "conditionally_available",
  "maintenance",
  "in_transport",
  "out_of_service"
] as const;

export const bookingStatuses = [
  "draft",
  "pending",
  "confirmed",
  "cancelled",
  "completed"
] as const;

export const eventSeverities = ["info", "warning", "high", "critical"] as const;

export const eventStatuses = [
  "open",
  "acknowledged",
  "in_progress",
  "resolved",
  "closed"
] as const;

export const projectStatuses = [
  "lead",
  "planning",
  "scheduled",
  "in_production",
  "in_postproduction",
  "delivered",
  "cancelled"
] as const;

export const projectPhaseTypes = [
  "preproduction",
  "production",
  "postproduction"
] as const;

export const moduleKeys = [
  "dashboard",
  "projects",
  "equipment",
  "studios",
  "staff",
  "events",
  "admin_access"
] as const;

export type AccessLevel = (typeof accessLevels)[number];
export type UserRole = (typeof userRoles)[number];
export type ResourceStatus = (typeof resourceStatuses)[number];
export type BookingStatus = (typeof bookingStatuses)[number];
export type EventSeverity = (typeof eventSeverities)[number];
export type EventStatus = (typeof eventStatuses)[number];
export type ProjectStatus = (typeof projectStatuses)[number];
export type ProjectPhaseType = (typeof projectPhaseTypes)[number];
export type ModuleKey = (typeof moduleKeys)[number];

export type RoutePermission = {
  href: string;
  key: ModuleKey;
  label: string;
  allowedAccessLevels: AccessLevel[];
};

export type AppSession = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  accessLevel: AccessLevel;
  authMode: "clerk" | "demo";
};

export type DashboardMetric = {
  key: string;
  label: string;
  value: string;
  delta: string;
  tone: "default" | "success" | "warning" | "danger";
};

export type DashboardBooking = {
  id: string;
  projectTitle: string;
  resourceLabel: string;
  resourceType: "equipment" | "studio" | "staff";
  status: BookingStatus;
  scheduledFor: string;
};

export type DashboardUtilization = {
  key: string;
  label: string;
  utilization: number;
  note: string;
};

export type DashboardIncident = {
  id: string;
  title: string;
  severity: EventSeverity;
  status: EventStatus;
  module: ModuleKey;
  createdAtLabel: string;
  owner: string;
};

export type DashboardAssignment = {
  id: string;
  person: string;
  role: UserRole;
  projectTitle: string;
  window: string;
  location: string;
};

export type ManagementDashboardData = {
  metrics: DashboardMetric[];
  upcomingBookings: DashboardBooking[];
  utilization: DashboardUtilization[];
  incidents: DashboardIncident[];
  assignments: DashboardAssignment[];
};

export const routePermissions: RoutePermission[] = [
  {
    key: "dashboard",
    href: "/dashboard",
    label: "Dashboard",
    allowedAccessLevels: ["admin", "management", "operations", "technical_support"]
  },
  {
    key: "projects",
    href: "/projects",
    label: "Projekti",
    allowedAccessLevels: ["admin", "management"]
  },
  {
    key: "equipment",
    href: "/resources/equipment",
    label: "Oprema",
    allowedAccessLevels: ["admin", "management", "operations", "technical_support"]
  },
  {
    key: "studios",
    href: "/resources/studios",
    label: "Studiji",
    allowedAccessLevels: ["admin", "management", "operations"]
  },
  {
    key: "staff",
    href: "/resources/staff",
    label: "Osoblje",
    allowedAccessLevels: ["admin", "management", "operations"]
  },
  {
    key: "events",
    href: "/events",
    label: "Događaji",
    allowedAccessLevels: ["admin", "management", "technical_support"]
  },
  {
    key: "admin_access",
    href: "/admin/access",
    label: "Pristupi",
    allowedAccessLevels: ["admin"]
  }
];

export const defaultDemoSession: AppSession = {
  id: "demo-production-manager",
  fullName: "Demo Menadžer",
  email: "demo@autofocus.local",
  role: "production_manager",
  accessLevel: "management",
  authMode: "demo"
};

export function canAccessModule(
  accessLevel: AccessLevel,
  moduleKey: ModuleKey
): boolean {
  const permission = routePermissions.find((entry) => entry.key === moduleKey);
  return permission ? permission.allowedAccessLevels.includes(accessLevel) : false;
}

export function getVisibleRoutes(accessLevel: AccessLevel): RoutePermission[] {
  return routePermissions.filter((entry) =>
    entry.allowedAccessLevels.includes(accessLevel)
  );
}

export function isAccessLevel(value: string): value is AccessLevel {
  return accessLevels.includes(value as AccessLevel);
}

export function isUserRole(value: string): value is UserRole {
  return userRoles.includes(value as UserRole);
}

export function isBookingStatus(value: string): value is BookingStatus {
  return bookingStatuses.includes(value as BookingStatus);
}

export function isEventStatus(value: string): value is EventStatus {
  return eventStatuses.includes(value as EventStatus);
}

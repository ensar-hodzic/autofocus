import type { ManagementDashboardData } from "@autofocus/domain";

export const managementDashboardData: ManagementDashboardData = {
  metrics: [
    {
      key: "active-projects",
      label: "Active projects",
      value: "12",
      delta: "+2 new assignments today",
      tone: "success"
    },
    {
      key: "resource-readiness",
      label: "Resource readiness",
      value: "87%",
      delta: "3 items need attention",
      tone: "warning"
    },
    {
      key: "confirmed-bookings",
      label: "Confirmed bookings",
      value: "28",
      delta: "6 slots in the next 24h",
      tone: "default"
    },
    {
      key: "critical-events",
      label: "Critical events",
      value: "2",
      delta: "1 directly affects delivery",
      tone: "danger"
    }
  ],
  upcomingBookings: [
    {
      id: "book-1",
      projectTitle: "Aurora Campaign",
      resourceLabel: "Studio A",
      resourceType: "studio",
      status: "confirmed",
      scheduledFor: "Today, 09:00 - 15:00"
    },
    {
      id: "book-2",
      projectTitle: "Lookbook S25",
      resourceLabel: "Sony FX6 package",
      resourceType: "equipment",
      status: "pending",
      scheduledFor: "Today, 11:30 - 18:00"
    },
    {
      id: "book-3",
      projectTitle: "Interview Series",
      resourceLabel: "Mia Kovac",
      resourceType: "staff",
      status: "confirmed",
      scheduledFor: "Tomorrow, 08:00 - 12:00"
    },
    {
      id: "book-4",
      projectTitle: "Festival Teaser",
      resourceLabel: "Studio B",
      resourceType: "studio",
      status: "draft",
      scheduledFor: "Tomorrow, 14:00 - 20:00"
    }
  ],
  utilization: [
    {
      key: "equipment",
      label: "Equipment",
      utilization: 78,
      note: "4 items are currently in service"
    },
    {
      key: "studios",
      label: "Studios",
      utilization: 92,
      note: "Only Studio C has an available afternoon slot"
    },
    {
      key: "staff",
      label: "Staff",
      utilization: 71,
      note: "Editors are lighter on load until Thursday"
    }
  ],
  incidents: [
    {
      id: "evt-1",
      title: "Render node is delayed exporting the final version",
      severity: "critical",
      status: "in_progress",
      module: "events",
      createdAtLabel: "18 min ago",
      owner: "IT support"
    },
    {
      id: "evt-2",
      title: "Battery set B-14 reported as unstable",
      severity: "high",
      status: "acknowledged",
      module: "equipment",
      createdAtLabel: "42 min ago",
      owner: "Technical support"
    },
    {
      id: "evt-3",
      title: "Freelancer arrival for field shoot is delayed",
      severity: "warning",
      status: "open",
      module: "staff",
      createdAtLabel: "1h 10m ago",
      owner: "Project coordinator"
    }
  ],
  assignments: [
    {
      id: "asg-1",
      person: "Lejla Hadzic",
      role: "photographer",
      projectTitle: "Lookbook S25",
      window: "10:00 - 16:00",
      location: "Studio B"
    },
    {
      id: "asg-2",
      person: "Amar Mekic",
      role: "lighting_technician",
      projectTitle: "Aurora Campaign",
      window: "08:30 - 15:30",
      location: "Studio A"
    },
    {
      id: "asg-3",
      person: "Faris Delic",
      role: "editor",
      projectTitle: "Interview Series",
      window: "12:00 - 18:00",
      location: "Postproduction"
    }
  ]
};

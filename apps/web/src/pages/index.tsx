import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import type { ManagementDashboardData } from "@autofocus/domain";
import { AppFrame } from "@/components/AppFrame";
import { api } from "@convex/_generated/api";
import { useSession } from "@/lib/session";

const toneColors = {
  default: "#0f5cc0",
  success: "#157347",
  warning: "#ad6800",
  danger: "#b43838"
} as const;

const severityBackgrounds = {
  info: "#dbeafe",
  warning: "#fef3c7",
  high: "#fed7aa",
  critical: "#fee2e2"
} as const;

export default function DashboardPage() {
  const { sessionId } = useSession();
  const dashboard = useQuery(api.dashboard.overview, sessionId ? { sessionId } : "skip") as
    | ManagementDashboardData
    | undefined;

  return (
    <AppFrame title="Dashboard">
      {!dashboard ? (
        <div className="status-card">Loading dashboard data...</div>
      ) : (
        <>
          <section className="grid-4">
            {dashboard.metrics.map((metric) => (
              <article key={metric.key} className="metric-card">
                <div className="metric-card__label">{metric.label}</div>
                <div
                  className="metric-card__value"
                  style={{ color: toneColors[metric.tone as keyof typeof toneColors] }}
                >
                  {metric.value}
                </div>
                <div className="metric-card__delta">{metric.delta}</div>
              </article>
            ))}
          </section>

          <section className="grid-main">
            <article className="panel">
              <div className="panel__header">
                <h3 className="panel__title">Upcoming bookings</h3>
                <Link className="panel__action" to="/projects">
                  Open module
                </Link>
              </div>

              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Resource</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Schedule</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.upcomingBookings.map((item) => (
                      <tr key={item.id}>
                        <td>{item.projectTitle}</td>
                        <td>{item.resourceLabel}</td>
                        <td>{item.resourceType}</td>
                        <td>{item.status}</td>
                        <td>{item.scheduledFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="panel">
              <div className="panel__header">
                <h3 className="panel__title">Resource utilization</h3>
              </div>

              <div className="list">
                {dashboard.utilization.map((item) => (
                  <div key={item.key}>
                    <div className="list-card__row" style={{ marginBottom: 8 }}>
                      <strong>{item.label}</strong>
                      <span>{item.utilization}%</span>
                    </div>
                    <div className="progress">
                      <span style={{ width: `${item.utilization}%` }} />
                    </div>
                    <div className="muted" style={{ marginTop: 8, fontSize: 14 }}>
                      {item.note}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="grid-secondary">
            <article className="panel">
              <div className="panel__header">
                <h3 className="panel__title">Key incidents</h3>
                <Link className="panel__action" to="/events">
                  All events
                </Link>
              </div>

              <div className="list">
                {dashboard.incidents.map((item) => (
                  <div key={item.id} className="list-card">
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                      <span
                        className="pill"
                        style={{
                          background:
                            severityBackgrounds[item.severity as keyof typeof severityBackgrounds],
                          color: "#7c2d12"
                        }}
                      >
                        {item.severity}
                      </span>
                      <span className="pill" style={{ background: "rgba(25,32,44,0.08)", color: "#18212f" }}>
                        {item.status}
                      </span>
                      <span className="muted" style={{ fontSize: 12, alignSelf: "center" }}>
                        {item.createdAtLabel}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700 }}>{item.title}</div>
                    <div className="muted" style={{ marginTop: 6, fontSize: 14 }}>
                      Owner: {item.owner}
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel">
              <div className="panel__header">
                <h3 className="panel__title">Today's assignments</h3>
                <Link className="panel__action" to="/resources/staff">
                  View staff
                </Link>
              </div>

              <div className="list">
                {dashboard.assignments.map((item) => (
                  <div key={item.id} className="list-card">
                    <div className="list-card__row">
                      <div>
                        <div style={{ fontWeight: 700 }}>{item.person}</div>
                        <div className="muted" style={{ fontSize: 14 }}>
                          {item.role}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{item.projectTitle}</div>
                        <div className="muted" style={{ fontSize: 14 }}>
                          {item.window} | {item.location}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </>
      )}
    </AppFrame>
  );
}

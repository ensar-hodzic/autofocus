import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { projectStatuses } from "@autofocus/domain";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { DataPage } from "@/components/DataPage";
import { useSession } from "@/lib/session";

type ProjectFormState = {
  title: string;
  clientName: string;
  type: string;
  priority: "low" | "medium" | "high";
  status: (typeof projectStatuses)[number];
  location: string;
  description: string;
  startDate: string;
  endDate: string;
};

const initialState: ProjectFormState = {
  title: "",
  clientName: "",
  type: "",
  priority: "medium",
  status: "planning",
  location: "",
  description: "",
  startDate: "",
  endDate: ""
};

export default function ProjectsPage() {
  const { sessionId } = useSession();
  const projects = useQuery(api.projects.list, sessionId ? { sessionId } : "skip") as
    | (Doc<"projects"> & { createdByName: string })[]
    | undefined;
  const createProject = useMutation(api.projects.create);
  const [form, setForm] = useState<ProjectFormState>(initialState);

  return (
    <DataPage
      title="Projects"
      eyebrow="Production planning and execution phases"
      form={
        <>
          <h3 className="panel__title">New project</h3>
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault();
              if (!sessionId) {
                return;
              }

              void createProject({
                sessionId,
                title: form.title,
                clientName: form.clientName,
                type: form.type,
                priority: form.priority,
                status: form.status,
                location: form.location || undefined,
                description: form.description || undefined,
                startDate: new Date(form.startDate).getTime(),
                endDate: new Date(form.endDate).getTime()
              }).then(() => setForm(initialState));
            }}
          >
            <label><span>Project name</span><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
            <label><span>Client</span><input value={form.clientName} onChange={(event) => setForm({ ...form, clientName: event.target.value })} required /></label>
            <label><span>Type</span><input value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} required /></label>
            <label><span>Priority</span><select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as ProjectFormState["priority"] })}><option value="low">low</option><option value="medium">medium</option><option value="high">high</option></select></label>
            <label><span>Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ProjectFormState["status"] })}>{projectStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
            <label><span>Location</span><input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></label>
            <label><span>Start</span><input type="datetime-local" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} required /></label>
            <label><span>End</span><input type="datetime-local" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} required /></label>
            <label className="form-grid__full"><span>Description</span><textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
            <button className="button-link button-link--primary" type="submit">Save project</button>
          </form>
        </>
      }
    >
      <div className="panel__header">
        <h3 className="panel__title">Active projects</h3>
        <span className="pill">{projects?.length ?? 0}</span>
      </div>
      {!projects ? (
        <div className="status-card">Loading projects...</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Client</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Location</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id}>
                  <td>{project.title}</td>
                  <td>{project.clientName}</td>
                  <td>{project.status}</td>
                  <td>{project.priority}</td>
                  <td>{project.location ?? "-"}</td>
                  <td>{project.createdByName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DataPage>
  );
}

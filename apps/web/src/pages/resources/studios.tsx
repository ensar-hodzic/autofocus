import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { resourceStatuses } from "@autofocus/domain";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { DataPage } from "@/components/DataPage";
import { useSession } from "@/lib/session";

type StudioFormState = {
  name: string;
  capacity: string;
  location: string;
  workingHours: string;
  currentStatus: (typeof resourceStatuses)[number];
  notes: string;
};

const initialState: StudioFormState = {
  name: "",
  capacity: "",
  location: "",
  workingHours: "08:00 - 20:00",
  currentStatus: "available",
  notes: ""
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function StudiosPage() {
  const { sessionId } = useSession();
  const studios = useQuery(
    api.resources.studioList,
    sessionId ? { sessionId } : "skip"
  ) as Doc<"studios">[] | undefined;
  const createStudio = useMutation(api.resources.createStudio);
  const [form, setForm] = useState<StudioFormState>(initialState);

  return (
    <DataPage
      title="Studios"
      eyebrow="Capacity, schedules, and space constraints"
      form={
        <>
          <h3 className="panel__title">New studio</h3>
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault();
              if (!sessionId) {
                return;
              }

              void createStudio({
                sessionId,
                name: form.name,
                slug: slugify(form.name),
                capacity: Number(form.capacity),
                location: form.location,
                workingHours: form.workingHours,
                currentStatus: form.currentStatus,
                notes: form.notes || undefined
              }).then(() => setForm(initialState));
            }}
          >
            <label><span>Name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
            <label><span>Capacity</span><input type="number" min="1" value={form.capacity} onChange={(event) => setForm({ ...form, capacity: event.target.value })} required /></label>
            <label><span>Location</span><input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} required /></label>
            <label><span>Working hours</span><input value={form.workingHours} onChange={(event) => setForm({ ...form, workingHours: event.target.value })} required /></label>
            <label><span>Status</span><select value={form.currentStatus} onChange={(event) => setForm({ ...form, currentStatus: event.target.value as StudioFormState["currentStatus"] })}>{resourceStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
            <label className="form-grid__full"><span>Notes</span><textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
            <button className="button-link button-link--primary" type="submit">Add studio</button>
          </form>
        </>
      }
    >
      <div className="panel__header">
        <h3 className="panel__title">Studio spaces</h3>
        <span className="pill">{studios?.length ?? 0}</span>
      </div>
      {!studios ? (
        <div className="status-card">Loading studios...</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Capacity</th>
                <th>Location</th>
                <th>Working hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {studios.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.capacity}</td>
                  <td>{item.location}</td>
                  <td>{item.workingHours}</td>
                  <td>{item.currentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DataPage>
  );
}

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { userRoles } from "@autofocus/domain";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { DataPage } from "@/components/DataPage";
import { useSession } from "@/lib/session";

type StaffFormState = {
  fullName: string;
  primaryRole: (typeof userRoles)[number];
  team: string;
  specialty: string;
  employmentType: "internal" | "external" | "freelance";
  phone: string;
  isActive: boolean;
};

const initialState: StaffFormState = {
  fullName: "",
  primaryRole: "photographer",
  team: "",
  specialty: "",
  employmentType: "internal",
  phone: "",
  isActive: true
};

export default function StaffPage() {
  const { sessionId } = useSession();
  const staff = useQuery(api.resources.staffList, sessionId ? { sessionId } : "skip") as
    | Doc<"staffProfiles">[]
    | undefined;
  const createStaff = useMutation(api.resources.createStaffProfile);
  const [form, setForm] = useState<StaffFormState>(initialState);

  return (
    <DataPage
      title="Staff"
      eyebrow="Assignments, expertise, and team availability"
      form={
        <>
          <h3 className="panel__title">New staff profile</h3>
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault();
              if (!sessionId) {
                return;
              }

              void createStaff({
                sessionId,
                fullName: form.fullName,
                primaryRole: form.primaryRole,
                team: form.team,
                specialty: form.specialty,
                employmentType: form.employmentType,
                phone: form.phone || undefined,
                isActive: form.isActive
              }).then(() => setForm(initialState));
            }}
          >
            <label><span>Full name</span><input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required /></label>
            <label><span>Primary role</span><select value={form.primaryRole} onChange={(event) => setForm({ ...form, primaryRole: event.target.value as StaffFormState["primaryRole"] })}>{userRoles.map((role) => <option key={role} value={role}>{role}</option>)}</select></label>
            <label><span>Team</span><input value={form.team} onChange={(event) => setForm({ ...form, team: event.target.value })} required /></label>
            <label><span>Specialty</span><input value={form.specialty} onChange={(event) => setForm({ ...form, specialty: event.target.value })} required /></label>
            <label><span>Employment type</span><select value={form.employmentType} onChange={(event) => setForm({ ...form, employmentType: event.target.value as StaffFormState["employmentType"] })}><option value="internal">internal</option><option value="external">external</option><option value="freelance">freelance</option></select></label>
            <label><span>Phone</span><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
            <label className="checkbox-field"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} /><span>Active profile</span></label>
            <button className="button-link button-link--primary" type="submit">Add profile</button>
          </form>
        </>
      }
    >
      <div className="panel__header">
        <h3 className="panel__title">Current staff</h3>
        <span className="pill">{staff?.length ?? 0}</span>
      </div>
      {!staff ? (
        <div className="status-card">Loading staff...</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Team</th>
                <th>Specialty</th>
                <th>Type</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((item) => (
                <tr key={item._id}>
                  <td>{item.fullName}</td>
                  <td>{item.primaryRole}</td>
                  <td>{item.team}</td>
                  <td>{item.specialty}</td>
                  <td>{item.employmentType}</td>
                  <td>{item.isActive ? "yes" : "no"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DataPage>
  );
}

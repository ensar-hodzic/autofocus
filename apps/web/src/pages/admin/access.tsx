import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { accessLevels, userRoles } from "@autofocus/domain";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { DataPage } from "@/components/DataPage";
import { useSession } from "@/lib/session";

type AccessFormState = {
  fullName: string;
  email: string;
  role: (typeof userRoles)[number];
  accessLevel: (typeof accessLevels)[number];
  phone: string;
};

const initialState: AccessFormState = {
  fullName: "",
  email: "",
  role: "project_coordinator",
  accessLevel: "operations",
  phone: ""
};

export default function AccessPage() {
  const { sessionId } = useSession();
  const users = useQuery(api.users.list, sessionId ? { sessionId } : "skip") as
    | Doc<"users">[]
    | undefined;
  const createUser = useMutation(api.users.create);
  const [form, setForm] = useState<AccessFormState>(initialState);

  return (
    <DataPage
      title="Access"
      form={
        <>
          <h3 className="panel__title">New user</h3>
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault();
              if (!sessionId) {
                return;
              }

              void createUser({
                sessionId,
                fullName: form.fullName,
                email: form.email,
                role: form.role,
                accessLevel: form.accessLevel,
                phone: form.phone || undefined
              }).then(() => setForm(initialState));
            }}
          >
            <label><span>Full name</span><input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required /></label>
            <label><span>Email</span><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
            <label><span>Role</span><select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as AccessFormState["role"] })}>{userRoles.map((role) => <option key={role} value={role}>{role}</option>)}</select></label>
            <label><span>Access level</span><select value={form.accessLevel} onChange={(event) => setForm({ ...form, accessLevel: event.target.value as AccessFormState["accessLevel"] })}>{accessLevels.map((level) => <option key={level} value={level}>{level}</option>)}</select></label>
            <label className="form-grid__full"><span>Phone</span><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
            <button className="button-link button-link--primary" type="submit">Add user</button>
          </form>
        </>
      }
    >
      <div className="panel__header">
        <h3 className="panel__title">User accounts</h3>
        <span className="pill">{users?.length ?? 0}</span>
      </div>
      {!users ? (
        <div className="status-card">Loading users...</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Access</th>
                <th>Login ID</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item._id}>
                  <td>{item.fullName}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td>{item.accessLevel}</td>
                  <td>{item.clerkId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DataPage>
  );
}

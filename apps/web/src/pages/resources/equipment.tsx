import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { resourceStatuses } from "@autofocus/domain";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { DataPage } from "@/components/DataPage";
import { useSession } from "@/lib/session";

type EquipmentFormState = {
  name: string;
  category: string;
  inventoryNumber: string;
  serialNumber: string;
  location: string;
  technicalState: string;
  currentStatus: (typeof resourceStatuses)[number];
  notes: string;
};

const initialState: EquipmentFormState = {
  name: "",
  category: "",
  inventoryNumber: "",
  serialNumber: "",
  location: "",
  technicalState: "",
  currentStatus: "available",
  notes: ""
};

export default function EquipmentPage() {
  const { sessionId } = useSession();
  const equipment = useQuery(
    api.resources.equipmentList,
    sessionId ? { sessionId } : "skip"
  ) as Doc<"equipment">[] | undefined;
  const createEquipment = useMutation(api.resources.createEquipment);
  const [form, setForm] = useState<EquipmentFormState>(initialState);

  return (
    <DataPage
      title="Equipment"
      eyebrow="Inventory and technical resource status"
      form={
        <>
          <h3 className="panel__title">New equipment item</h3>
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault();
              if (!sessionId) {
                return;
              }

              void createEquipment({
                sessionId,
                name: form.name,
                category: form.category,
                inventoryNumber: form.inventoryNumber,
                serialNumber: form.serialNumber || undefined,
                location: form.location,
                technicalState: form.technicalState,
                currentStatus: form.currentStatus,
                notes: form.notes || undefined
              }).then(() => setForm(initialState));
            }}
          >
            <label><span>Name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
            <label><span>Category</span><input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required /></label>
            <label><span>Inventory number</span><input value={form.inventoryNumber} onChange={(event) => setForm({ ...form, inventoryNumber: event.target.value })} required /></label>
            <label><span>Serial number</span><input value={form.serialNumber} onChange={(event) => setForm({ ...form, serialNumber: event.target.value })} /></label>
            <label><span>Location</span><input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} required /></label>
            <label><span>Status</span><select value={form.currentStatus} onChange={(event) => setForm({ ...form, currentStatus: event.target.value as EquipmentFormState["currentStatus"] })}>{resourceStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
            <label className="form-grid__full"><span>Technical condition</span><input value={form.technicalState} onChange={(event) => setForm({ ...form, technicalState: event.target.value })} required /></label>
            <label className="form-grid__full"><span>Notes</span><textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
            <button className="button-link button-link--primary" type="submit">Add equipment</button>
          </form>
        </>
      }
    >
      <div className="panel__header">
        <h3 className="panel__title">Current equipment</h3>
        <span className="pill">{equipment?.length ?? 0}</span>
      </div>
      {!equipment ? (
        <div className="status-card">Loading equipment...</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Inventory</th>
                <th>Status</th>
                <th>Location</th>
                <th>Condition</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.inventoryNumber}</td>
                  <td>{item.currentStatus}</td>
                  <td>{item.location}</td>
                  <td>{item.technicalState}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DataPage>
  );
}

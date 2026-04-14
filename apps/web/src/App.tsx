import { Navigate, Route, Routes } from "react-router-dom";
import AccessPage from "@/pages/admin/access";
import DashboardPage from "@/pages/index";
import ProjectsPage from "@/pages/projects";
import EquipmentPage from "@/pages/resources/equipment";
import StaffPage from "@/pages/resources/staff";
import StudiosPage from "@/pages/resources/studios";
import SignInPage from "@/pages/sign-in";
import { ModuleRoute } from "@/components/ModuleRoute";
import { AuthRoute } from "@/components/AuthRoute";
import EventsPage from "@/pages/events";

export default function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<AuthRoute><SignInPage /></AuthRoute>} />
      <Route path="/" element={<ModuleRoute moduleKey="dashboard"><DashboardPage /></ModuleRoute>} />
      <Route path="/projects" element={<ModuleRoute moduleKey="projects"><ProjectsPage /></ModuleRoute>} />
      <Route
        path="/resources/equipment"
        element={<ModuleRoute moduleKey="equipment"><EquipmentPage /></ModuleRoute>}
      />
      <Route
        path="/resources/studios"
        element={<ModuleRoute moduleKey="studios"><StudiosPage /></ModuleRoute>}
      />
      <Route
        path="/resources/staff"
        element={<ModuleRoute moduleKey="staff"><StaffPage /></ModuleRoute>}
      />
      <Route path="/events" element={<ModuleRoute moduleKey="events"><EventsPage /></ModuleRoute>} />
      <Route
        path="/admin/access"
        element={<ModuleRoute moduleKey="admin_access"><AccessPage /></ModuleRoute>}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

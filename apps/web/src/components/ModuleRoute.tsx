import { Navigate, useLocation } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { canAccessModule, type ModuleKey } from "@autofocus/domain";
import { useSession } from "@/lib/session";

export function ModuleRoute({
  children,
  moduleKey
}: PropsWithChildren<{ moduleKey: ModuleKey }>) {
  const location = useLocation();
  const { sessionId, currentUser } = useSession();

  if (!sessionId) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  if (currentUser === undefined) {
    return <div className="status-card">Loading user session...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!canAccessModule(currentUser.accessLevel, moduleKey)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

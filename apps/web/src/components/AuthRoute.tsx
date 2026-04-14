import { Navigate } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useSession } from "@/lib/session";

export function AuthRoute({ children }: PropsWithChildren) {
  const { sessionId, currentUser } = useSession();

  if (!sessionId) {
    return <>{children}</>;
  }

  if (currentUser === undefined) {
    return <div className="status-card">Loading user session...</div>;
  }

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

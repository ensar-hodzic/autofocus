import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";
import { useQuery } from "convex/react";
import type { Doc } from "@convex/_generated/dataModel";
import { api } from "@convex/_generated/api";

type SessionContextValue = {
  sessionId: string | null;
  currentUser: Doc<"users"> | null | undefined;
  signIn: (nextSessionId: string) => void;
  signOut: () => void;
};

const STORAGE_KEY = "autofocus.session";
const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [sessionId, setSessionId] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(STORAGE_KEY);
  });

  const currentUser = useQuery(api.users.me, sessionId ? { sessionId } : "skip");

  useEffect(() => {
    if (!sessionId) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, sessionId);
  }, [sessionId]);

  const value = useMemo<SessionContextValue>(
    () => ({
      sessionId,
      currentUser,
      signIn: (nextSessionId) => setSessionId(nextSessionId),
      signOut: () => setSessionId(null)
    }),
    [currentUser, sessionId]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("Session provider is missing.");
  }

  return context;
}

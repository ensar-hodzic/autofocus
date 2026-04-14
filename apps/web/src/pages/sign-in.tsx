import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "@convex/_generated/api";
import { useSession } from "@/lib/session";

type LoginOption = {
  clerkId: string;
  fullName: string;
  email: string;
  role: string;
  accessLevel: string;
};

export default function SignInPage() {
  const navigate = useNavigate();
  const { signIn } = useSession();
  const loginOptions = useQuery(api.users.loginOptions, {}) as LoginOption[] | undefined;
  const bootstrap = useMutation(api.seed.bootstrap);
  const [isBootstrapping, setIsBootstrapping] = useState(false);

  useEffect(() => {
    if (loginOptions && loginOptions.length === 0 && !isBootstrapping) {
      setIsBootstrapping(true);
      void bootstrap().finally(() => setIsBootstrapping(false));
    }
  }, [bootstrap, isBootstrapping, loginOptions]);

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-card__eyebrow">Autofocus</div>
        <h1 className="auth-card__title">Sign in</h1>

        <div className="auth-list">
          {!loginOptions ? <div className="status-card">Loading users...</div> : null}
          {loginOptions?.map((option) => (
            <button
              key={option.clerkId}
              type="button"
              className="auth-user"
              onClick={() => {
                signIn(option.clerkId);
                navigate("/", { replace: true });
              }}
            >
              <strong>{option.fullName}</strong>
              <span>{option.email}</span>
              <span>
                {option.role.replaceAll("_", " ")} | {option.accessLevel.replaceAll("_", " ")}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

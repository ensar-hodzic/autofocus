import { Link } from "react-router-dom";
import { AppFrame } from "@/components/AppFrame";

type ModulePageProps = {
  title: string;
  eyebrow: string;
  description?: string;
  highlights?: string[];
  nextStep?: string;
};

export function ModulePage({
  title,
  eyebrow,
  description,
  highlights,
  nextStep
}: ModulePageProps) {
  return (
    <AppFrame title={title} eyebrow={eyebrow}>
      <div className="module-page">
        <div className="module-page__summary">{description}</div>

        <div className="module-page__grid">
          {highlights &&
            <section className="panel">
              <h3 className="panel__title">Current focus</h3>
              <ul style={{ display: "grid", gap: 12, paddingLeft: 20, marginBottom: 0 }}>
                {highlights?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          }

          {nextStep && <section className="panel">
            <h3 className="panel__title">Next step</h3>
            <p className="muted">{nextStep}</p>
            <Link to="/" className="button-link button-link--primary">
              Back to dashboard
            </Link>
          </section>
          }
        </div>
      </div>
    </AppFrame>
  );
}

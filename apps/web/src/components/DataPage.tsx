import type { PropsWithChildren, ReactNode } from "react";
import { AppFrame } from "@/components/AppFrame";

export function DataPage({
  title,
  eyebrow,
  description,
  form,
  children
}: PropsWithChildren<{
  title: string;
  eyebrow?: string;
  description?: string;
  form: ReactNode;
}>) {
  return (
    <AppFrame title={title} eyebrow={eyebrow}>
      <div className="module-page">
        {description &&
          <section className="panel">
            <p className="module-page__summary">{description}</p>
          </section>}
        <div className="module-page__grid">
          <section className="panel">{form}</section>
          <section className="panel">{children}</section>
        </div>
      </div>
    </AppFrame>
  );
}

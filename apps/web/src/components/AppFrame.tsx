import { NavLink } from "react-router-dom";
import { canAccessModule, type ModuleKey } from "@autofocus/domain";
import type { PropsWithChildren } from "react";
import { useSession } from "@/lib/session";

const navItems: { href: string; label: string; key: ModuleKey }[] = [
  { href: "/", label: "Dashboard", key: "dashboard" },
  { href: "/projects", label: "Projects", key: "projects" },
  { href: "/resources/equipment", label: "Equipment", key: "equipment" },
  { href: "/resources/studios", label: "Studios", key: "studios" },
  { href: "/resources/staff", label: "Staff", key: "staff" },
  { href: "/events", label: "Events", key: "events" },
  { href: "/admin/access", label: "Access", key: "admin_access" }
];

export function AppFrame({
  title,
  eyebrow,
  children
}: PropsWithChildren<{ title: string; eyebrow?: string }>) {
  const { currentUser, signOut } = useSession();
  const visibleItems = currentUser
    ? navItems.filter((item) => canAccessModule(currentUser.accessLevel, item.key))
    : navItems;

  return (
    <div className="page-shell">
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar__brand">
            <h1 className="sidebar__title">Autofocus</h1>
          </div>

          {currentUser ? (
            <div className="sidebar__session">
              <strong>{currentUser.fullName}</strong>
              <span>{currentUser.role.replaceAll("_", " ")}</span>
              <span>{currentUser.accessLevel.replaceAll("_", " ")}</span>
            </div>
          ) : null}

          <nav className="nav">
            {visibleItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === "/"}
                className={({ isActive }) => `nav__link${isActive ? " nav__link--active" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button type="button" className="sidebar__signout" onClick={signOut}>
            Sign out
          </button>
        </aside>

        <main className="content">
          <section className="header-card">
            <div>
              <h2 className="header-card__title">{title}</h2>
              <p className="header-card__eyebrow">{eyebrow}</p>
            </div>
          </section>

          {children}
        </main>
      </div>
    </div>
  );
}

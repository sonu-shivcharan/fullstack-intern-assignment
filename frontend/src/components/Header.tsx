import React from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/auth-context";

export interface HeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="mb-8 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40">
      <div className="container mx-auto flex flex-col gap-4 py-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {user && (
            <nav className="flex items-center gap-4 text-sm font-medium border-t border-border pt-2 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-6">
              {user.role === "ADMIN" && (
                <>
                  <Link
                    to="/admin"
                    activeOptions={{ exact: true }}
                    className="text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground [&.active]:font-semibold"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    className="text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground [&.active]:font-semibold"
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/stores"
                    className="text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground [&.active]:font-semibold"
                  >
                    Stores
                  </Link>
                </>
              )}
              {user.role === "USER" && (
                <Link
                  to="/"
                  activeOptions={{ exact: true }}
                  className="text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground [&.active]:font-semibold"
                >
                  Home
                </Link>
              )}
              {user.role === "STORE_OWNER" && (
                <Link
                  to="/owner"
                  activeOptions={{ exact: true }}
                  className="text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground [&.active]:font-semibold"
                >
                  Dashboard
                </Link>
              )}
            </nav>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-3">{actions}</div>
        )}
      </div>
    </header>
  );
}

export default Header;

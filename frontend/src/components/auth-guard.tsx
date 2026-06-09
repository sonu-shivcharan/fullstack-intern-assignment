import React, { useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/contexts/auth-context";
import LoaderPage from "./ui/loader";

const publicRoutes = ["/signin", "/signup"];
export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, checkRole, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = pathname.startsWith("/admin");
  const isOwnerRoute = pathname.startsWith("/owner");

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated && !isPublicRoute) {
      navigate({ to: "/signin" });
      return;
    }

    if (isAuthenticated) {
      if (isPublicRoute) {
        if (checkRole("ADMIN")) {
          navigate({ to: "/admin" });
        } else if (checkRole("STORE_OWNER")) {
          navigate({ to: "/owner" });
        } else {
          navigate({ to: "/" });
        }
        return;
      }
      if (isAdminRoute && !checkRole("ADMIN")) {
        if (checkRole("STORE_OWNER")) {
          navigate({ to: "/owner" });
        } else {
          navigate({ to: "/" });
        }
        return;
      }

      if (isOwnerRoute && !checkRole("STORE_OWNER")) {
        if (checkRole("ADMIN")) {
          navigate({ to: "/admin" });
        } else {
          navigate({ to: "/" });
        }
        return;
      }

      if (pathname === "/") {
        if (checkRole("ADMIN")) {
          navigate({ to: "/admin" });
        } else if (checkRole("STORE_OWNER")) {
          navigate({ to: "/owner" });
        }
        return;
      }
    }
  }, [isAuthenticated, pathname, navigate, isLoading]);

  if (isLoading) {
    return <LoaderPage />;
  }
  if (!isAuthenticated && !isPublicRoute) {
    return <LoaderPage />;
  }
  return <>{children}</>;
};

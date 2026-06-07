import React, { useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/contexts/auth-context";

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const isPublicRoute = pathname === "/signin" || pathname === "/signup";
  const isAdminRoute = pathname.startsWith("/admin");
  const isOwnerRoute = pathname.startsWith("/owner");
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("user", user);
      if (isPublicRoute) {
        if (user.role === "ADMIN") {
          navigate({ to: "/admin" });
        } else if (user.role === "STORE_OWNER") {
          navigate({ to: "/owner" });
        } else {
          navigate({ to: "/" });
        }
        return;
      }

      if (isAdminRoute && user.role !== "ADMIN") {
        if (user.role === "STORE_OWNER") {
          navigate({ to: "/owner" });
        } else {
          navigate({ to: "/" });
        }
        return;
      }

      if (isOwnerRoute && user.role !== "STORE_OWNER") {
        if (user.role === "ADMIN") {
          navigate({ to: "/admin" });
        } else {
          navigate({ to: "/" });
        }
        return;
      }

      if (pathname === "/") {
        if (user.role === "ADMIN") {
          navigate({ to: "/admin" });
        } else if (user.role === "STORE_OWNER") {
          navigate({ to: "/owner" });
        }
      }
    } else {
      if (!isPublicRoute) {
        navigate({ to: "/signin" });
      }
    }
  }, [isAuthenticated, user, pathname, navigate]);

  if (isAuthenticated && user) {
    return <>{children}</>;
  }
  if (!isPublicRoute) {
    return null;
  }
  return <>{children}</>;
};

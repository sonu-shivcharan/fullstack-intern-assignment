import ChangePasswordModal from "@/components/auth/ChangePasswordModal";
import LogoutButton from "@/components/auth/LogoutButton";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/auth-context";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_user")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user: currentUser } = useAuth();
  return (
    <>
      <Header
        title={`Welcome, ${currentUser?.name || "User"}`}
        subtitle="Explore local stores, check ratings, and submit your customer feedback."
        actions={
          <>
            <ChangePasswordModal />
            <LogoutButton />
          </>
        }
      />
      <Outlet />
    </>
  );
}

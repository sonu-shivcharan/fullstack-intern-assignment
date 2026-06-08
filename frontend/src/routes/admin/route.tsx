import LogoutButton from "@/components/auth/LogoutButton";
import Header from "@/components/Header";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Header title="Admin Dashboard" actions={<LogoutButton />} />
      <div className="container mx-auto p-2">
        <Outlet />
      </div>
    </>
  );
}

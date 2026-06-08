import StoreOwnerDashboard from "@/components/store-owner/StoreOwnerDashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/owner/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <StoreOwnerDashboard />;
}


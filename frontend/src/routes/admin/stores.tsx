import StoreListings from "@/components/admin/StoreListings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/stores")({
  component: RouteComponent,
});

function RouteComponent() {
  return <StoreListings />;
}

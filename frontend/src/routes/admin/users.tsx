import UserListings from "@/components/admin/UserListings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users")({
  component: UserListings,
});

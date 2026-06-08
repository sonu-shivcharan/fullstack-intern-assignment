import { createFileRoute } from "@tanstack/react-router";
import UserDashboard from "@/components/user/UserDashboard";

export const Route = createFileRoute("/_user/")({
  component: App,
});

function App() {
  return <UserDashboard />;
}

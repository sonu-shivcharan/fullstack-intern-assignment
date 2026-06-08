import { createFileRoute } from "@tanstack/react-router";
import StoreDetailsPage from "@/components/user/StoreDetailsPage";

export const Route = createFileRoute("/_user/store/$storeId")({
  component: StoreDetailsPageRoute,
});

function StoreDetailsPageRoute() {
  const { storeId } = Route.useParams();
  return <StoreDetailsPage storeId={Number(storeId)} />;
}

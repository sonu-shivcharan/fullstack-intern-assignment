import { useQuery } from "@tanstack/react-query";
import { getUserStoreDetails } from "@/helpers/user-helpers";
import { Loader } from "@/components/ui/loader";

import StoreInfoSection from "./StoreInfoSection";
import StoreReviewForm from "./StoreReviewForm";
import StoreReviews from "./StoreReviews";

interface StoreDetailsPageProps {
  storeId: number;
}

export function StoreDetailsPage({ storeId }: StoreDetailsPageProps) {
  const { data: storeDetails, isLoading } = useQuery({
    queryKey: ["storeDetails", storeId],
    queryFn: () => getUserStoreDetails(storeId),
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-10 w-10 text-primary" />
      </div>
    );
  }

  if (!storeDetails) {
    return (
      <div className="mx-auto max-w-lg p-6">
        <div className="rounded-xl border border-destructive bg-destructive/10 p-4 text-center text-sm text-destructive">
          Store not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <StoreInfoSection storeId={storeId} />
        </div>

        <StoreReviewForm storeId={storeId} />

        <StoreReviews storeId={storeId} />
      </div>
    </div>
  );
}

export default StoreDetailsPage;

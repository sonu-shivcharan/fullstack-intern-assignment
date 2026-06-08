import { useQuery } from "@tanstack/react-query";
import { getStoreRatings, type UserRatingDetail } from "@/helpers/user-helpers";
import { Star, MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";

interface StoreReviewsProps {
  storeId: number;
}

export function StoreReviews({ storeId }: StoreReviewsProps) {
  const { data: ratingsData, isLoading: ratingsLoading } = useQuery({
    queryKey: ["storeRatings", storeId],
    queryFn: () => getStoreRatings(storeId),
  });

  if (ratingsLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-bold text-foreground">Community Reviews</h2>
        </div>
        <div className="flex h-32 items-center justify-center">
          <Loader className="h-6 w-6 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-bold text-foreground">Community Reviews</h2>
      </div>

      {!ratingsData || ratingsData.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground bg-card">
          No reviews or ratings received yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {ratingsData.map((userRating) => (
            <ReviewCard key={userRating.id} userRating={userRating} />
          ))}
        </div>
      )}
    </div>
  );
}

interface ReviewCardProps {
  userRating: UserRatingDetail;
}

export function ReviewCard({ userRating }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/20"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-semibold text-foreground text-sm">
              {userRating.user.name}
            </CardTitle>
            <CardDescription className="text-xs">
              Reviewed on {new Date(userRating.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          {renderStars(userRating.rating)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {userRating.review || (
            <span className="italic text-muted-foreground/50">
              No review comments provided.
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

export default StoreReviews;


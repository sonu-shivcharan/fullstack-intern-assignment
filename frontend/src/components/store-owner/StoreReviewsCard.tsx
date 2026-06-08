import { useState, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getStoreOwnerRatingsPaged,
  type UserWithRating,
} from "@/helpers/store-owner-helpers";
import { Star, MessageSquare, Calendar, ChevronDown } from "lucide-react";
import { Loader } from "../ui/loader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function StoreReviewsCard() {
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["storeOwnerRatingsPaged", order],
    queryFn: ({ pageParam = 1 }) =>
      getStoreOwnerRatingsPaged({
        page: pageParam,
        limit: 2,
        order,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });

  const allReviews = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.users);
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive bg-destructive/10 p-4 text-center text-sm text-destructive">
        {error.message || "Failed to load reviews. Please try again."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-bold text-foreground">
            Customer Reviews
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Sort by:
          </span>
          <Select
            value={order}
            onValueChange={(val) => setOrder(val as "asc" | "desc")}
          >
            <SelectTrigger className="h-9 min-w-[140px] cursor-pointer rounded-xl border border-border bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reviews Grid using Shadcn Card component */}
      {allReviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          No reviews or ratings received yet.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {allReviews.map((userRating) => (
              <ReviewCard key={userRating.id} userRating={userRating} />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="h-10 cursor-pointer gap-2 rounded-xl px-5 font-medium hover:bg-muted"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Load More Reviews
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ReviewCardProps {
  userRating: UserWithRating;
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
            <CardTitle className="text-sm font-semibold text-foreground">
              {userRating.name}
            </CardTitle>
            <CardDescription className="text-[11px]">
              {userRating.address}
            </CardDescription>
          </div>
          {renderStars(userRating.rating.rating)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {userRating.rating.review || (
            <span className="text-muted-foreground/50 italic">
              No review comments provided.
            </span>
          )}
        </p>
      </CardContent>
      <CardFooter className="flex items-center gap-1.5 border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
        <Calendar className="h-3.5 w-3.5 shrink-0" />
        <span>
          Reviewed on{" "}
          {new Date(userRating.rating.createdAt).toLocaleDateString()}
        </span>
      </CardFooter>
    </Card>
  );
}

export default StoreReviewsCard;

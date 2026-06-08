import { useState, useMemo, type FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import {
  getStoreRatings,
  createStoreRating,
  updateStoreRating,
  type UserRatingDetail,
} from "@/helpers/user-helpers";
import { Star, MessageSquare, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";

interface StoreReviewFormProps {
  storeId: number;
}

export function StoreReviewForm({ storeId }: StoreReviewFormProps) {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [ratingInput, setRatingInput] = useState(5);
  const [reviewInput, setReviewInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { data: ratingsData, isLoading: ratingsLoading } = useQuery({
    queryKey: ["storeRatings", storeId],
    queryFn: () => getStoreRatings(storeId),
  });

  const myReview = useMemo(() => {
    if (!ratingsData || !currentUser) return null;
    return ratingsData.find((r) => r.user.id === currentUser.id) || null;
  }, [ratingsData, currentUser]);

  const createRatingMutation = useMutation({
    mutationFn: (payload: { rating: number; review: string }) =>
      createStoreRating(storeId, payload),
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setReviewInput("");
      queryClient.invalidateQueries({ queryKey: ["storeDetails", storeId] });
      queryClient.invalidateQueries({ queryKey: ["storeRatings", storeId] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to submit review");
    },
  });

  const editRatingMutation = useMutation({
    mutationFn: (payload: {
      ratingId: number;
      rating: number;
      review: string;
    }) =>
      updateStoreRating(payload.ratingId, {
        rating: payload.rating,
        review: payload.review,
      }),
    onSuccess: () => {
      toast.success("Review updated successfully!");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["storeDetails", storeId] });
      queryClient.invalidateQueries({ queryKey: ["storeRatings", storeId] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update review");
    },
  });

  const handleStartEdit = (review: UserRatingDetail) => {
    setRatingInput(review.rating);
    setReviewInput(review.review || "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setReviewInput("");
  };

  const handleSaveReview = (e: FormEvent) => {
    e.preventDefault();
    if (isEditing && myReview) {
      editRatingMutation.mutate({
        ratingId: myReview.id,
        rating: ratingInput,
        review: reviewInput,
      });
    } else {
      createRatingMutation.mutate({
        rating: ratingInput,
        review: reviewInput,
      });
    }
  };

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

  const renderInteractiveStars = (
    currentRating: number,
    onChange: (val: number) => void
  ) => {
    return (
      <div className="flex items-center gap-1 py-1">
        {[1, 2, 3, 4, 5].map((starVal) => (
          <button
            key={starVal}
            type="button"
            onClick={() => onChange(starVal)}
            className="cursor-pointer focus:outline-none"
          >
            <Star
              className={`h-6 w-6 transition-all duration-150 hover:scale-110 ${
                starVal <= currentRating
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/20"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (ratingsLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">
            Your Review & Rating
          </h2>
        </div>
        <Card className="flex h-32 items-center justify-center border border-border">
          <Loader className="h-6 w-6 text-primary" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground">
          Your Review & Rating
        </h2>
      </div>

      {myReview && !isEditing ? (
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-foreground">
                  {myReview.user.name} (You)
                </CardTitle>
                <CardDescription className="text-xs">
                  Reviewed on{" "}
                  {new Date(myReview.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                {renderStars(myReview.rating)}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleStartEdit(myReview)}
                  className="h-8 w-8 cursor-pointer p-0 text-muted-foreground hover:text-foreground"
                  title="Edit Review"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-2">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {myReview.review || (
                <span className="text-muted-foreground/50 italic">
                  No review comments provided.
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <form onSubmit={handleSaveReview}>
            <CardContent className="space-y-3 p-4">
              <div className="flex flex-col justify-between gap-3 border-b border-border/50 pb-3 sm:flex-row sm:items-center">
                <div>
                  <CardTitle className="text-base font-semibold text-foreground">
                    {isEditing ? "Edit Your Feedback" : "Add Your Feedback"}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Rate your experience and leave comments for this store.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    Rating
                  </span>
                  {renderInteractiveStars(ratingInput, setRatingInput)}
                </div>
              </div>

              <div className="space-y-1">
                <textarea
                  placeholder="Share your thoughts about this store..."
                  value={reviewInput}
                  onChange={(e) => setReviewInput(e.target.value)}
                  className="h-16 min-h-[60px] w-full rounded-lg border border-border bg-input/50 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary disabled:opacity-50"
                  maxLength={400}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 p-4 pt-0">
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="h-8 cursor-pointer rounded-lg text-xs"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                className="h-8 cursor-pointer rounded-lg text-xs"
                disabled={
                  createRatingMutation.isPending || editRatingMutation.isPending
                }
              >
                {isEditing ? "Save Changes" : "Submit Feedback"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}

export default StoreReviewForm;

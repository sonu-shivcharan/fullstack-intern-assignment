import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserStoreDetails, getStoreRatings } from "@/helpers/user-helpers";
import { Star, Mail, MapPin } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StoreInfoSectionProps {
  storeId: number;
}

export function StoreInfoSection({ storeId }: StoreInfoSectionProps) {
  // Queries
  const { data: storeDetails, isLoading: storeLoading } = useQuery({
    queryKey: ["storeDetails", storeId],
    queryFn: () => getUserStoreDetails(storeId),
  });

  const { data: ratingsData, isLoading: ratingsLoading } = useQuery({
    queryKey: ["storeRatings", storeId],
    queryFn: () => getStoreRatings(storeId),
  });

  const averageRatingNum = useMemo(() => {
    if (!storeDetails || storeDetails.avgRating === null) return 0;
    return Number(storeDetails.avgRating);
  }, [storeDetails]);

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

  if (storeLoading || ratingsLoading) {
    return (
      <div className="flex h-40 items-center justify-center md:col-span-3">
        <Loader className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!storeDetails) {
    return (
      <div className="md:col-span-3 rounded-xl border border-destructive bg-destructive/10 p-4 text-center text-sm text-destructive">
        Store profile details not found.
      </div>
    );
  }

  return (
    <>
      {/* Store Info Details */}
      <Card className="md:col-span-2 flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Store Profile</CardTitle>
          <CardDescription>Official business registry details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 text-muted-foreground/70" />
            <span>{storeDetails.email}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground/70" />
            <span>{storeDetails.address}</span>
          </div>
        </CardContent>
      </Card>

      {/* Ratings Summary Stats */}
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-muted-foreground">Customer Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-medium tracking-tight text-foreground">
              {averageRatingNum > 0 ? averageRatingNum.toFixed(1) : "—"}
            </span>
            {averageRatingNum > 0 && (
              <span className="text-sm text-muted-foreground">/ 5.0</span>
            )}
          </div>
          {averageRatingNum > 0 && (
            <div className="mt-2">
              {renderStars(Math.round(averageRatingNum))}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-border pt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Ratings</span>
          <span className="font-semibold text-foreground">
            {ratingsData?.length || 0}
          </span>
        </CardFooter>
      </Card>
    </>
  );
}

export default StoreInfoSection;

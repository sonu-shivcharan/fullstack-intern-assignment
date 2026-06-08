import { getStoreOwnerDashboard } from "@/helpers/store-owner-helpers";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../ui/loader";
import { Star, Mail, MapPin, Store } from "lucide-react";
import { useMemo } from "react";
import StoreReviewsCard from "./StoreReviewsCard";
import Header from "@/components/Header";
import LogoutButton from "@/components/auth/LogoutButton";
import ChangePasswordModal from "@/components/auth/ChangePasswordModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function StoreOwnerDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["storeOwnerDashboard"],
    queryFn: getStoreOwnerDashboard,
  });

  const myStoreData = data?.store;

  const averageRatingNum = useMemo(() => {
    if (!myStoreData || myStoreData.averageRating === null) return 0;
    return Number(myStoreData.averageRating);
  }, [myStoreData]);

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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-10 w-10 text-primary" />
      </div>
    );
  }

  if (error || !myStoreData) {
    return (
      <div className="mx-auto max-w-lg p-6">
        <div className="rounded-xl border border-destructive bg-destructive/10 p-4 text-center text-sm text-destructive">
          {error?.message || "Failed to load store dashboard data. Please make sure a store is assigned to your account."}
        </div>
      </div>
    );
  }

  return (
    <>
      <Header
        title="Store Owner Dashboard"
        subtitle="Monitor and manage your store performance and review customer feedback."
        actions={
          <>
            <ChangePasswordModal />
            <LogoutButton />
          </>
        }
      />
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Grid: Store Info & Statistics using Shadcn Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Store Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">{myStoreData.name}</CardTitle>
                  <CardDescription className="text-xs">Store Profile</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                <span className="truncate">{myStoreData.email}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground/70" />
                <span>{myStoreData.address}</span>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-muted-foreground">Overall Rating</CardTitle>
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
              <span className="font-semibold text-foreground">{myStoreData.totalRatings}</span>
            </CardFooter>
          </Card>
        </div>

        <StoreReviewsCard />
      </div>
    </>
  );
}

export default StoreOwnerDashboard;

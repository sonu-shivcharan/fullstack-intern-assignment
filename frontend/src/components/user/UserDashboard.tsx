import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserStores } from "@/helpers/user-helpers";

import { Star, MapPin, Search, Store } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Loader } from "@/components/ui/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardStore {
  id: number;
  name: string;
  email: string;
  address: string;
  createdAt: string;
  avgRating: string | number | null;
  totalRatings?: number;
}

export function UserDashboard() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState("");

  const { data: storesData, isLoading } = useQuery<DashboardStore[]>({
    queryKey: ["stores", search],
    queryFn: () =>
      getUserStores(search || undefined) as Promise<DashboardStore[]>,
  });

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search stores by name, email or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-border pr-4 pl-9"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader />
          </div>
        ) : !storesData || storesData.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
            No stores found matching your search.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {storesData.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface StoreCardProps {
  store: DashboardStore;
}

export function StoreCard({ store }: StoreCardProps) {
  const avgRatingNum = store.avgRating !== null ? Number(store.avgRating) : 0;

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
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              {store.name}
            </CardTitle>
            <CardDescription
              className="max-w-[200px] truncate text-xs"
              title={store.email}
            >
              {store.email}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 py-2">
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          <span className="line-clamp-2">{store.address}</span>
        </div>

        <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs">
          <span className="font-medium text-muted-foreground">Rating</span>
          {avgRatingNum > 0 ? (
            <div className="flex items-center gap-1.5">
              {renderStars(Math.round(avgRatingNum))}
              <span className="font-semibold text-foreground tabular-nums">
                {avgRatingNum.toFixed(1)}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground/60 italic">No ratings</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Link
          to="/store/$storeId"
          params={{ storeId: String(store.id) }}
          className="w-full"
        >
          <Button
            variant="outline"
            className="h-9 w-full cursor-pointer rounded-xl text-xs"
          >
            View Details & Rate
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default UserDashboard;

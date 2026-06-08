import { useState, useEffect, useMemo } from "react";
import { getAllStores } from "@/helpers/store-helpers";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

import { Loader } from "../ui/loader";
import { Search, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function StoreListings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [serverSearch, setServerSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const {
    data: stores,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["adminStores", serverSearch, sortBy, order],
    queryFn: () =>
      getAllStores({
        page: 1,
        limit: 5,
        sortBy,
        order,
        search: serverSearch || undefined,
      }),
  });

  const filteredStores = useMemo(() => {
    if (!stores) return [];
    if (!searchTerm.trim()) return stores;

    const term = searchTerm.toLowerCase();
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(term) ||
        store.email.toLowerCase().includes(term) ||
        store.address.toLowerCase().includes(term)
    );
  }, [stores, searchTerm]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      if (serverSearch !== "") {
        setServerSearch("");
      }
      return;
    }

    if (filteredStores.length === 0 && serverSearch !== searchTerm) {
      const handler = setTimeout(() => {
        setServerSearch(searchTerm);
      }, 400);
      return () => clearTimeout(handler);
    }
  }, [searchTerm, filteredStores.length, serverSearch]);

  if (error) {
    return (
      <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        Error loading stores: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 lg:flex-row lg:items-center w-full">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search stores by name, email or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 rounded-xl pr-24 pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <div className="flex-1 sm:flex-initial">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-10 rounded-xl bg-card border border-border min-w-[130px] w-full cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Sort: Created</SelectItem>
                  <SelectItem value="name">Sort: Name</SelectItem>
                  <SelectItem value="email">Sort: Email</SelectItem>
                  <SelectItem value="address">Sort: Address</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 sm:flex-initial">
              <Select value={order} onValueChange={(val) => setOrder(val as "asc" | "desc")}>
                <SelectTrigger className="h-10 rounded-xl bg-card border border-border min-w-[120px] w-full cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStores.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  {isFetching || isLoading ? (
                    <Loader className="mx-auto" />
                  ) : (
                    "No stores found."
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredStores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-mono text-xs">{store.id}</TableCell>
                  <TableCell className="font-medium">{store.name}</TableCell>
                  <TableCell>{store.email}</TableCell>
                  <TableCell
                    className="max-w-[250px] truncate"
                    title={store.address}
                  >
                    {store.address}
                  </TableCell>
                  <TableCell>
                    {store.avgRating ? (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium tabular-nums">
                          {Number(store.avgRating).toFixed(1)}
                        </span>
                        {store.totalRatings !== undefined && (
                          <span className="text-xs tabular-nums">
                            ({store.totalRatings})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {new Date(store.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default StoreListings;

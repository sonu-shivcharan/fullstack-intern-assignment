import { useState, useEffect, useMemo } from "react";
import { getAdminUsers } from "@/helpers/admin-helpers";

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
import { Search, Star, UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import AddUserModal from "./AddUserModal";

function UserListings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [serverSearch, setServerSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const {
    data: users,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["adminUsers", serverSearch, roleFilter, sortBy, order],
    queryFn: () =>
      getAdminUsers({
        page: 1,
        limit: 5,
        sortBy,
        order,
        search: serverSearch || undefined,
        role: roleFilter === "ALL" ? undefined : roleFilter,
      }),
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchTerm.trim()) return users;

    const term = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.address.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      if (serverSearch !== "") {
        setServerSearch("");
      }
      return;
    }

    if (filteredUsers.length === 0 && serverSearch !== searchTerm) {
      const handler = setTimeout(() => {
        setServerSearch(searchTerm);
      }, 400);
      return () => clearTimeout(handler);
    }
  }, [searchTerm, filteredUsers.length, serverSearch]);

  if (error) {
    return (
      <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        Error loading users: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-1 flex-col gap-2 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, role or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 rounded-xl pr-24 pl-9"
            />
          </div>
          <div className="flex w-full flex-wrap gap-2 lg:w-auto">
            <div className="flex-1 sm:flex-initial">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-10 w-full min-w-[130px] cursor-pointer rounded-xl border border-border bg-card">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="STORE_OWNER">Store Owner</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 sm:flex-initial">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-10 w-full min-w-[130px] cursor-pointer rounded-xl border border-border bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Sort: Joined</SelectItem>
                  <SelectItem value="name">Sort: Name</SelectItem>
                  <SelectItem value="email">Sort: Email</SelectItem>
                  <SelectItem value="address">Sort: Address</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 sm:flex-initial">
              <Select
                value={order}
                onValueChange={(val) => setOrder(val as "asc" | "desc")}
              >
                <SelectTrigger className="h-10 w-full min-w-[120px] cursor-pointer rounded-xl border border-border bg-card">
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
        <AddUserModal
          trigger={
            <Button>
              <UserPlus className="h-4 w-4" /> Add User
            </Button>
          }
        />
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  {isFetching || isLoading ? (
                    <Loader className="mx-auto" />
                  ) : (
                    "No users found."
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs">{user.id}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start gap-1">
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-border ring-inset">
                        {user.role}
                      </span>
                      {user.role === "STORE_OWNER" && (
                        <div className="flex items-center gap-0.5 text-[11px] font-medium text-muted-foreground">
                          {user.storeAvgRating ? (
                            <>
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="tabular-nums">
                                {Number(user.storeAvgRating).toFixed(1)}
                              </span>
                            </>
                          ) : (
                            <span className="text-[10px] text-muted-foreground/60">
                              No ratings
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={user.address}
                  >
                    {user.address}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* AddUserModal is controlled trigger-based in the layout actions header */}
    </div>
  );
}

export default UserListings;

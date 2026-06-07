import { useQuery } from "@tanstack/react-query";
import { getAdminDashboardStats } from "@/helpers/admin-helpers";
import { Users, Store, Star } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { Loader } from "../ui/loader";

interface StatCardProps {
  title: string;
  value: number | undefined;
  isLoading: boolean;
  icon: ComponentType<{ className?: string }>;
  linkTo: string;
  linkText: string;
}

function StatCard({
  title,
  value,
  isLoading,
  icon: Icon,
  linkTo,
  linkText,
}: StatCardProps) {
  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-md">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>

      <CardContent className="flex items-center justify-center py-6">
        {isLoading ? (
          <Loader />
        ) : (
          <p className="text-4xl font-medium text-primary">{value ?? 0}</p>
        )}
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button asChild variant="outline">
          <Link to={linkTo}>{linkText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getAdminDashboardStats,
  });

  return (
    <div className="">
      <h1 className="container mx-auto p-4 text-2xl font-bold">
        Admin Dashboard
      </h1>
      <div className="container mx-auto flex justify-center gap-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers}
          isLoading={isLoading}
          icon={Users}
          linkTo="/admin/users"
          linkText="View Users"
        />
        <StatCard
          title="Total Stores"
          value={stats?.totalStores}
          isLoading={isLoading}
          icon={Store}
          linkTo="/admin"
          linkText="View Stores"
        />
        <StatCard
          title="Total Ratings"
          value={stats?.totalRatings}
          isLoading={isLoading}
          icon={Star}
          linkTo="/admin"
          linkText="View Ratings"
        />
      </div>
    </div>
  );
}

export default AdminDashboard;

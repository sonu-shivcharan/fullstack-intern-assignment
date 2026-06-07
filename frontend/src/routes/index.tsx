import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/helpers/auth-helpers";
import LoaderPage from "@/components/ui/loader-page";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getUser"],
    queryFn: getCurrentUser,
    retry: false,
  });

  if (isLoading) {
    return <LoaderPage />;
  }
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          {JSON.stringify(data)}
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-2">Button</Button>
        </div>
      </div>
    </div>
  );
}

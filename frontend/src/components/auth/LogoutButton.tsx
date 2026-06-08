import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import LoaderButton from "@/components/ui/loader-button";
import { toast } from "sonner";
import { signOut } from "@/helpers/auth-helpers";
import { cn } from "@/lib/utils";

export function LogoutButton({ className }: { className?: string }) {
  const { logout } = useAuth();
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    try {
      await signOut();
      logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <LoaderButton
      onClick={handleLogout}
      variant="default"
      className={cn("w-auto", className)}
      isLoading={isPending}
    >
      Log out
    </LoaderButton>
  );
}

export default LogoutButton;

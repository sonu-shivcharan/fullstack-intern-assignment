import React from "react";
import type { buttonVariants } from "./button";
import { Button } from "./button";
import { Loader2 } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export default function LoaderButton({
  isLoading = false,
  children,
  className = "",
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    isLoading: boolean;
    children: React.ReactNode;
    className?: string;
  }) {
  return (
    <Button className={cn("w-full", className)} disabled={isLoading} {...props}>
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </Button>
  );
}

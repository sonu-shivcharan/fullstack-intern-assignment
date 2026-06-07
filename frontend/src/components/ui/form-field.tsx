import * as React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.ComponentProps<"input"> {
  label?: string;
  errorMessage?: string;
}

export function FormField({
  className,
  type,
  label,
  errorMessage,
  id: customId,
  ref,
  ...props
}: FormFieldProps) {
  const defaultId = React.useId();
  const id = customId || defaultId;

  return (
    <div className="w-full space-y-1 text-left">
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "block text-sm font-medium transition-colors duration-200",
            errorMessage ? "text-red-500" : "text-foreground"
          )}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        ref={ref}
        data-slot="input"
        className={cn(
          "h-8 w-full min-w-0 rounded-2xl border border-transparent bg-input/50 px-2.5 py-1 text-base transition-[color,box-shadow] duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          errorMessage &&
            "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/30",
          className
        )}
        {...props}
      />
      {errorMessage && (
        <span className="mt-1 block text-xs text-red-500 transition-all duration-200">
          {errorMessage}
        </span>
      )}
    </div>
  );
}

export default FormField;

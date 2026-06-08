
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdminUser } from "@/helpers/admin-helpers";
import FormField from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import LoaderButton from "@/components/ui/loader-button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserRole } from "@/types/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/zod/auth";
import { z } from "zod";
import { AlertDialogCancel } from "../ui/alert-dialog";

export interface AddUserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const addUserSchema = signupSchema.extend({
  role: z.enum(["USER", "STORE_OWNER", "ADMIN"]),
});

type AddUserFormValues = z.infer<typeof addUserSchema>;

export function AddUserForm({ onSuccess, onCancel }: AddUserFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      password: "",
      role: "USER",
    },
  });

  const selectedRole = watch("role");

  const { mutate: createUserMutation, isPending } = useMutation({
    mutationFn: createAdminUser,
    onSuccess: () => {
      toast.success("User created successfully!");
      reset();
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      onSuccess?.();
    },
    onError: (err) => {
      const msg =
        err.message || "Failed to create user";
      toast.error(msg);
    },
  });

  const onSubmit = (values: AddUserFormValues) => {
    createUserMutation(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 py-2 text-left">
        <FormField
          label="Full Name"
          type="text"
          placeholder="Amit Kumar"
          errorMessage={errors.name?.message}
          {...register("name")}
        />
        <FormField
          label="Email Address"
          type="email"
          placeholder="[EMAIL_ADDRESS]"
          errorMessage={errors.email?.message}
          {...register("email")}
        />
        <FormField
          label="Address"
          type="text"
          placeholder="Pune, Maharashtra"
          errorMessage={errors.address?.message}
          {...register("address")}
        />
        <FormField
          label="Password"
          type="password"
          placeholder="••••••••"
          errorMessage={errors.password?.message}
          {...register("password")}
        />
        <div className="space-y-1.5 text-left">
          <label className="block text-sm font-medium text-foreground">
            System Role
          </label>
          <Select
            value={selectedRole}
            onValueChange={(val) =>
              setValue("role", val as UserRole, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-10 w-full cursor-pointer rounded-xl border border-border bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">User (Standard)</SelectItem>
              <SelectItem value="STORE_OWNER">Store Owner</SelectItem>
              <SelectItem value="ADMIN">System Admin</SelectItem>
            </SelectContent>
          </Select>
          {errors.role?.message && (
            <span className="mt-1 block text-xs text-red-500 transition-all duration-200">
              {errors.role.message}
            </span>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-6">
       <AlertDialogCancel asChild>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
       </AlertDialogCancel>
        <LoaderButton type="submit" isLoading={isPending} className="w-auto">
          Create User
        </LoaderButton>
      </div>
    </form>
  );
}

export default AddUserForm;

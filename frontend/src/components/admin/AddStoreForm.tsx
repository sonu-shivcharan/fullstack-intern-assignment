import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAdminStore, getAdminUsersWithoutStore } from "@/helpers/admin-helpers";
import FormField from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import LoaderButton from "@/components/ui/loader-button";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addStoreSchema, type AddStoreFormValues } from "@/zod/store";
import { AlertDialogCancel } from "../ui/alert-dialog";

export interface AddStoreFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}


export function AddStoreForm({ onSuccess, onCancel }: AddStoreFormProps) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["usersWithoutStore"],
    queryFn: getAdminUsersWithoutStore,
  });

  const newStoreOwners = useMemo(() => {
    if (!data?.users) return [];
    return data.users.filter((user) => user.role === "STORE_OWNER");
  }, [data]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddStoreFormValues>({
    resolver: zodResolver(addStoreSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
    },
  });

  const selectedOwnerId = watch("ownerId");

  const { mutate: createStoreMutation, isPending } = useMutation({
    mutationFn: createAdminStore,
    onSuccess: () => {
      toast.success("Store created successfully!");
      reset();
      queryClient.invalidateQueries({ queryKey: ["adminStores"] });
      queryClient.invalidateQueries({ queryKey: ["usersWithoutStore"] });
      onSuccess?.();
    },
    onError: (err) => {
      const msg =
        err.message || "Failed to create store";
      toast.error(msg);
    },
  });

  const onSubmit = (values: AddStoreFormValues) => {
    createStoreMutation(values);
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        Error loading store owners: {error.message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 py-2 text-left">
        <FormField
          label="Store Name"
          type="text"
          placeholder="Super Mart"
          errorMessage={errors.name?.message}
          {...register("name")}
        />
        <FormField
          label="Store Email"
          type="email"
          placeholder="info@supermart.com"
          errorMessage={errors.email?.message}
          {...register("email")}
        />
        <FormField
          label="Address"
          type="text"
          placeholder="123 Main St, Pune, Maharashtra"
          errorMessage={errors.address?.message}
          {...register("address")}
        />

        <div className="space-y-1.5 text-left">
          <label className="block text-sm font-medium text-foreground">
            Store Owner
          </label>
          {newStoreOwners.length === 0 ? (
            <div className="rounded-xl border border-amber-200/30 bg-amber-500/10 p-3 text-sm text-amber-500">
              No store owners without a store found. Please create a new user with the "Store Owner" role first on the users page.
            </div>
          ) : (
            <>
              <Select
                value={selectedOwnerId ? String(selectedOwnerId) : ""}
                onValueChange={(val) =>
                  setValue("ownerId", Number(val), { shouldValidate: true })
                }
              >
                <SelectTrigger className="h-10 w-full cursor-pointer rounded-xl border border-border bg-card">
                  <SelectValue placeholder="Select a Store Owner" />
                </SelectTrigger>
                <SelectContent>
                  {newStoreOwners.map((owner) => (
                    <SelectItem key={owner.id} value={String(owner.id)}>
                      {owner.name} ({owner.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ownerId?.message && (
                <span className="mt-1 block text-xs text-red-500 transition-all duration-200">
                  {errors.ownerId.message}
                </span>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-6">
       <AlertDialogCancel asChild>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
       </AlertDialogCancel>
        
        <LoaderButton
          type="submit"
          isLoading={isPending}
          disabled={newStoreOwners.length === 0}
          className="w-auto"
        >
          Create Store
        </LoaderButton>
      </div>
    </form>
  );
}

export default AddStoreForm;

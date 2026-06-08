import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { changePasswordSchema } from "@/zod/auth";
import { changePassword } from "@/helpers/auth-helpers";
import FormField from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import LoaderButton from "@/components/ui/loader-button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Key } from "lucide-react";

const modalSchema = changePasswordSchema
  .extend({
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  });

type FormValues = z.infer<typeof modalSchema>;

interface ChangePasswordFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ChangePasswordForm({ onSuccess, onCancel }: ChangePasswordFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(modalSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password updated successfully!");
      reset();
      onSuccess();
    } catch (error: any) {
      const message =
        error.message ||
        "Failed to update password. Please check your credentials.";
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4 py-2 text-left">
        <FormField
          label="Current Password"
          type="password"
          placeholder="••••••••"
          errorMessage={errors.oldPassword?.message}
          {...register("oldPassword")}
        />
        <FormField
          label="New Password"
          type="password"
          placeholder="••••••••"
          errorMessage={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <FormField
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          errorMessage={errors.confirmNewPassword?.message}
          {...register("confirmNewPassword")}
        />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <AlertDialogCancel asChild>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </AlertDialogCancel>
        <LoaderButton
          type="submit"
          isLoading={isSubmitting}
          className="w-auto"
        >
          Update Password
        </LoaderButton>
      </div>
    </form>
  );
}

export function ChangePasswordModal() {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline"><Key className="h-5 w-5" /> Change Password</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md animate-in fade-in-50 slide-in-from-bottom-4 duration-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold flex items-center gap-2">
             Change Password
          </AlertDialogTitle>
          <AlertDialogDescription>
            Update your account password. Once updated, you will need to use
            your new password next time you log in.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ChangePasswordForm
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ChangePasswordModal;

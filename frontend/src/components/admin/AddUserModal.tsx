import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AddUserForm from "./AddUserForm";

interface AddUserModalProps {
  trigger: React.ReactNode;
}

export function AddUserModal({ trigger }: AddUserModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">
            Add New System User
          </AlertDialogTitle>
          <AlertDialogDescription>
            Register a new administrator, store owner, or normal user.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AddUserForm
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AddUserModal;

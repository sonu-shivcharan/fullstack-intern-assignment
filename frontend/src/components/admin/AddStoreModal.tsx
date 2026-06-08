import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AddStoreForm from "./AddStoreForm";

interface AddStoreModalProps {
  trigger: React.ReactNode;
}

export function AddStoreModal({ trigger }: AddStoreModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">
            Add New Store
          </AlertDialogTitle>
          <AlertDialogDescription>
            Create a new store and assign it to an available store owner.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AddStoreForm
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AddStoreModal;

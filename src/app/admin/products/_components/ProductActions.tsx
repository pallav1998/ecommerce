"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import React, { useTransition } from "react";
import {
  deleteProduct,
  toggleProductAvilability,
} from "../../_actions/products";

export function ActiveToggleDropdownItem({
  id,
  isAvilableForPurchase,
}: Readonly<{
  id: string;
  isAvilableForPurchase: boolean;
}>) {
  const [isPending, startTransition] = useTransition();
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await toggleProductAvilability(id, !isAvilableForPurchase);
        })
      }
    >
      {isAvilableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
}

export function DeleteDropdownItem({
  id,
  disabed,
}: Readonly<{
  id: string;
  disabed: boolean;
}>) {
  const [isPending, startTransition] = useTransition();
  return (
    <DropdownMenuItem
      disabled={disabed || isPending}
      onClick={() =>
        startTransition(async () => {
          await deleteProduct(id);
        })
      }
    >
      Delete
    </DropdownMenuItem>
  );
}

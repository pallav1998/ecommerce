"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import React, { useTransition } from "react";
import {
  deleteProduct,
  toggleProductAvilability,
} from "../../_actions/products";
import { useRouter } from "next/navigation";

export function ActiveToggleDropdownItem({
  id,
  isAvilableForPurchase,
}: Readonly<{
  id: string;
  isAvilableForPurchase: boolean;
}>) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await toggleProductAvilability(id, !isAvilableForPurchase);
          router.refresh();
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
  const router = useRouter();

  return (
    <DropdownMenuItem
      className="bg-red-500 text-cyan-50 focus:bg-red-600 focus:text-cyan-50"
      disabled={disabed || isPending}
      onClick={() =>
        startTransition(async () => {
          await deleteProduct(id);
          router.refresh();
        })
      }
    >
      Delete
    </DropdownMenuItem>
  );
}

"use client";

import { deleteItem } from "@/app/actions/item";
import { Button } from "@/components/ui/button";

export function DeleteListingForm({
  itemId,
  label,
  size = "default",
}: {
  itemId: string;
  label: string;
  size?: "default" | "sm";
}) {
  return (
    <form action={deleteItem} className={size === "sm" ? "mt-4" : undefined}>
      <input type="hidden" name="itemId" value={itemId} />
      <Button type="submit" variant="outline" size={size}>
        {label}
      </Button>
    </form>
  );
}

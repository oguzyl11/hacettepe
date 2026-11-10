"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { Repeat } from "lucide-react";
import { createOffer } from "@/server/listing-actions";
import { Button } from "@/components/ui/button";
import { emptyActionState } from "@/lib/action-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function OfferDialog({
  itemId,
  targetTitle,
  ownerName,
  ownItems,
  mode,
  defaultOpen = false,
}: {
  itemId: string;
  targetTitle: string;
  ownerName: string;
  ownItems: { id: string; title: string }[];
  mode: "ready" | "signin" | "owner" | "offline";
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen && mode !== "signin" && mode !== "owner");
  const [state, action, pending] = useActionState(
    createOffer.bind(null, itemId),
    emptyActionState,
  );

  useEffect(() => {
    if (state.ok) setOpen(false);
  }, [state]);

  if (mode === "owner") {
    return <p className="text-sm text-muted-foreground">Bu ilan senin.</p>;
  }

  if (mode === "signin") {
    return (
      <Button asChild className="w-full">
        <Link href={`/giris?donus=/ilan/${itemId}`}>Teklif için giriş yap</Link>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Repeat className="size-4" />
          Takas Teklifi Yap
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{ownerName} için takas teklifi</DialogTitle>
          <DialogDescription>
            İstediğin ilan: {targetTitle}. Karşılığında kendi ilanını seçebilir veya not yazabilirsin.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/50 p-3">
            <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">İstenen</p>
            <p className="mt-1 text-sm font-semibold">{targetTitle}</p>
          </div>
          <label className="block space-y-2 text-sm font-semibold">
            Karşılığında ne teklif ediyorsun?
            <select
              name="offeredTitle"
              className="h-11 w-full rounded-lg border border-border bg-card px-3 text-sm font-normal"
              defaultValue=""
            >
              <option value="">Aktif ilanlarımdan seçme</option>
              {ownItems.map((item) => (
                <option key={item.id} value={item.title}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-2 text-sm font-semibold">
            Teklifine bir not yaz
            <Textarea
              name="message"
              required
              minLength={10}
              maxLength={1800}
              placeholder="Merhaba, Beytepe kütüphane önünde buluşabiliriz."
            />
          </label>
          {mode === "offline" ? (
            <p className="text-sm text-amber-800">Örnek ilan. Teklif veritabanı bağlanınca kaydedilir.</p>
          ) : null}
          {state.message ? (
            <p className={state.ok ? "text-sm text-emerald-700" : "text-sm text-red-700"}>{state.message}</p>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Vazgeç
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Gönderiliyor" : "Teklifi gönder"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

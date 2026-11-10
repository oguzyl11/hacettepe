"use client";

import { useActionState } from "react";
import { ImagePlus } from "lucide-react";
import { createItem } from "@/app/actions/item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { emptyActionState } from "@/lib/action-state";
import { categories, categoryLabel, conditionLabel, conditions } from "@/lib/labels";

export function ListingForm({ databaseReady }: { databaseReady: boolean }) {
  const [state, action, pending] = useActionState(createItem, emptyActionState);

  return (
    <form action={action} className="space-y-6">
      <section className="rounded-xl border border-dashed border-border bg-card p-5">
        <Label htmlFor="images" className="flex items-center gap-2 text-sm font-semibold">
          <ImagePlus className="size-4 text-primary" />
          Fotoğraflar
        </Label>
        <input
          id="images"
          name="images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="mt-3 block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          En fazla 4 görsel. JPG, PNG veya WEBP, her biri 4 MB’a kadar. Yükleme Vercel Blob token’ı ister.
        </p>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-lg font-semibold">Eşya bilgisi</h2>
        <div className="space-y-2">
          <Label htmlFor="title">Başlık</Label>
          <Input id="title" name="title" required minLength={3} maxLength={80} placeholder="Casio fx-991EX hesap makinesi" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <select id="category" name="category" className="h-11 w-full rounded-lg border border-border bg-card px-3 text-sm" required>
            {categories.map((category) => (
              <option key={category} value={category}>{categoryLabel[category]}</option>
            ))}
          </select>
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Durum</legend>
          <div className="flex flex-wrap gap-2">
            {conditions.map((condition, index) => (
              <label key={condition} className="cursor-pointer">
                <input
                  type="radio"
                  name="condition"
                  value={condition}
                  defaultChecked={index === 0}
                  className="peer sr-only"
                  required
                />
                <span className="inline-flex rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-slate-600 peer-checked:bg-primary peer-checked:text-white">
                  {conditionLabel[condition]}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="space-y-2">
          <Label htmlFor="description">Açıklama</Label>
          <Textarea id="description" name="description" required minLength={10} maxLength={2000} placeholder="Ne durumda, ne arıyorsun, nerede buluşabilirsin?" />
        </div>
      </section>

      {!databaseReady ? (
        <p className="text-sm text-amber-800">Kayıt için veritabanı bağlantısı gerekli.</p>
      ) : null}
      {state.message ? <p className="text-sm text-red-700">{state.message}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>{pending ? "Kaydediliyor" : "İlanı yayınla"}</Button>
      </div>
    </form>
  );
}

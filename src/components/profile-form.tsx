"use client";

import { useActionState } from "react";
import { ContactMethod } from "@prisma/client";
import { updateProfile } from "@/server/listing-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emptyActionState } from "@/lib/action-state";
import { contactLabel } from "@/lib/labels";

export function ProfileForm({
  name,
  email,
  instagramHandle,
  preferredContact,
  databaseReady,
}: {
  name: string;
  email: string;
  instagramHandle: string;
  preferredContact: ContactMethod;
  databaseReady: boolean;
}) {
  const [state, action, pending] = useActionState(
    updateProfile,
    emptyActionState,
  );

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Ad</Label>
        <Input id="name" name="name" defaultValue={name} required minLength={2} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Hacettepe e-postası</Label>
        <Input id="email" value={email} readOnly />
      </div>
      <div className="space-y-2">
        <Label htmlFor="instagramHandle">Instagram</Label>
        <Input
          id="instagramHandle"
          name="instagramHandle"
          defaultValue={instagramHandle}
          placeholder="kullaniciadi"
        />
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Tercih edilen iletişim</legend>
        {[ContactMethod.EMAIL, ContactMethod.INSTAGRAM].map((method) => (
          <label key={method} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="preferredContact"
              value={method}
              defaultChecked={preferredContact === method}
            />
            {contactLabel[method]}
          </label>
        ))}
      </fieldset>
      {!databaseReady ? (
        <p className="text-sm text-amber-800">
          Profil veritabanına yazılamıyor. DATABASE_URL ve migrasyon gerekli.
        </p>
      ) : null}
      {state.message ? (
        <p
          className={
            state.ok ? "text-sm text-emerald-700" : "text-sm text-red-700"
          }
        >
          {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={pending || !databaseReady}>
        {pending ? "Kaydediliyor" : "Profili kaydet"}
      </Button>
    </form>
  );
}

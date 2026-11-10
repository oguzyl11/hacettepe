"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ContactMethod } from "@prisma/client";
import { LayoutGrid } from "lucide-react";
import { updateProfile } from "@/app/actions/user";
import { emptyActionState } from "@/lib/action-state";
import { cn } from "@/lib/utils";

export type ProfilePost = {
  id: string;
  title: string;
  image: string | null;
};

export function ProfileScreen({
  name,
  email,
  instagramHandle,
  preferredContact,
  image,
  databaseReady,
  posts,
}: {
  name: string;
  email: string;
  instagramHandle: string;
  preferredContact: ContactMethod;
  image: string | null;
  databaseReady: boolean;
  posts: ProfilePost[];
}) {
  const [state, action, pending] = useActionState(updateProfile, emptyActionState);
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const handle = instagramHandle || email.split("@")[0];
  const initial = (name || handle).slice(0, 1).toLocaleUpperCase("tr");
  const photo = preview || image;

  return (
    <form action={action} className="mx-auto w-full max-w-3xl">
      <div className="flex items-center gap-6 sm:gap-10">
        <label className="group relative shrink-0 cursor-pointer">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="size-20 rounded-full object-cover sm:size-36" />
          ) : (
            <span className="grid size-20 place-items-center rounded-full bg-[#efefef] text-2xl font-semibold text-slate-700 sm:size-36 sm:text-4xl">
              {initial}
            </span>
          )}
          <input
            name="avatar"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : null);
              setEditing(true);
            }}
          />
          <span className="absolute inset-0 grid place-items-center rounded-full bg-black/0 text-[11px] font-medium text-white opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
            Değiştir
          </span>
        </label>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="truncate text-xl font-normal">{handle}</h1>
            <button
              type="button"
              onClick={() => setEditing((open) => !open)}
              className="rounded-lg bg-[#efefef] px-4 py-1.5 text-sm font-semibold"
            >
              Profili düzenle
            </button>
          </div>
          <p className="mt-4 text-sm">
            <span className="font-semibold">{posts.length}</span> ilan
          </p>
          <p className="mt-3 text-sm font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>

      {editing ? (
        <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
          <label className="block text-xs font-medium text-muted-foreground">
            Ad
            <input
              name="name"
              defaultValue={name}
              required
              minLength={2}
              className="mt-1 h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-foreground"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Instagram
            <input
              name="instagramHandle"
              defaultValue={instagramHandle}
              placeholder="kullaniciadi"
              className="mt-1 h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-foreground"
            />
          </label>
          <fieldset className="sm:col-span-2">
            <legend className="text-xs font-medium text-muted-foreground">İletişim</legend>
            <div className="mt-2 flex gap-2">
              {[ContactMethod.EMAIL, ContactMethod.INSTAGRAM].map((method) => (
                <label key={method} className="cursor-pointer">
                  <input
                    type="radio"
                    name="preferredContact"
                    value={method}
                    defaultChecked={preferredContact === method}
                    className="peer sr-only"
                  />
                  <span className="inline-flex rounded-lg bg-[#efefef] px-3 py-1.5 text-sm font-semibold peer-checked:bg-foreground peer-checked:text-white">
                    {method === ContactMethod.EMAIL ? "E-posta" : "Instagram"}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          {state.message ? (
            <p className={cn("text-sm sm:col-span-2", state.success ? "text-emerald-700" : "text-red-700")}>
              {state.message}
            </p>
          ) : null}
          {!databaseReady ? (
            <p className="text-sm text-amber-800 sm:col-span-2">Veritabanı bağlı değil.</p>
          ) : null}
          <button
            type="submit"
            disabled={pending || !databaseReady}
            className="h-10 rounded-lg bg-secondary px-4 text-sm font-semibold text-white disabled:opacity-50 sm:col-span-2 sm:w-fit"
          >
            {pending ? "Kaydediliyor" : "Kaydet"}
          </button>
        </div>
      ) : (
        <>
          <input type="hidden" name="name" value={name} />
          <input type="hidden" name="instagramHandle" value={instagramHandle} />
          <input type="hidden" name="preferredContact" value={preferredContact} />
        </>
      )}

      <div className="mt-10 border-t border-border">
        <p className="flex items-center justify-center gap-2 py-3 text-xs font-semibold tracking-widest uppercase">
          <LayoutGrid className="size-3.5" />
          İlanlar
        </p>
        {posts.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">Henüz ilan yok.</p>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {posts.map((post) => (
              <Link key={post.id} href={`/ilan/${post.id}`} className="relative aspect-square bg-[#efefef]">
                {post.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center px-2 text-center text-xs font-medium text-slate-500">
                    {post.title}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}

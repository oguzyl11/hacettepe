"use client";

import { useActionState } from "react";
import Link from "next/link";
import { addComment } from "@/server/listing-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { emptyActionState } from "@/lib/action-state";
import { formatDate } from "@/lib/utils";
import type { ListingComment } from "@/lib/listings";

export function CommentSection({
  itemId,
  comments,
  mode,
}: {
  itemId: string;
  comments: ListingComment[];
  mode: "ready" | "signin" | "offline";
}) {
  const [state, action, pending] = useActionState(
    addComment.bind(null, itemId),
    emptyActionState,
  );

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Yorumlar</h2>
      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Henüz soru yok. Ayrıntı sormak için ilk yorumu sen bırak.
        </p>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-2xl bg-muted/70 px-4 py-3">
              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {comment.authorName}
                </span>
                <time dateTime={comment.createdAt}>
                  {formatDate(comment.createdAt)}
                </time>
              </div>
              <p className="mt-1 text-sm">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}

      {mode === "ready" ? (
        <form action={action} className="space-y-3">
          <Textarea
            name="body"
            required
            minLength={2}
            maxLength={1000}
            placeholder="Durumu, teslim yerini veya takas beklentisini sor"
          />
          {state.message ? (
            <p className={state.ok ? "text-sm text-emerald-700" : "text-sm text-red-700"}>
              {state.message}
            </p>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Gönderiliyor" : "Yorum yaz"}
          </Button>
        </form>
      ) : null}

      {mode === "signin" ? (
        <Button asChild variant="outline">
          <Link href={`/giris?donus=/ilan/${itemId}`}>
            Yorum için giriş yap
          </Link>
        </Button>
      ) : null}

      {mode === "offline" ? (
        <p className="text-sm text-muted-foreground">
          Örnek ilanlara yorum kaydedilmez. Veritabanını bağladıktan sonra
          gerçek ilanlarda açılır.
        </p>
      ) : null}
    </section>
  );
}

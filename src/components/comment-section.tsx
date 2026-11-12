"use client";

import { useActionState } from "react";
import Link from "next/link";
import { addComment } from "@/app/actions/comment";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { emptyActionState } from "@/lib/action-state";
import { formatDate } from "@/lib/utils";
import type { ListingComment } from "@/lib/listings";
import { useTranslation } from "@/lib/i18n/context";

export function CommentSection({
  itemId,
  comments,
  mode,
}: {
  itemId: string;
  comments: ListingComment[];
  mode: "ready" | "signin" | "offline";
}) {
  const { t, locale } = useTranslation();
  const [state, action, pending] = useActionState(
    addComment.bind(null, itemId),
    emptyActionState
  );

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">{t.itemDetail.comments}</h2>
      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {locale === "tr"
            ? "Henüz soru yok. Ayrıntı sormak için ilk yorumu sen bırak."
            : "No questions yet. Be the first to leave a comment."}
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
            placeholder={t.itemDetail.commentPlaceholder}
          />
          {state.message ? (
            <p
              className={
                state.success
                  ? "text-sm text-emerald-700"
                  : "text-sm text-red-700"
              }
            >
              {state.message}
            </p>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? t.common.saving : t.itemDetail.writeComment}
          </Button>
        </form>
      ) : null}

      {mode === "signin" ? (
        <Button asChild variant="outline">
          <Link href={`/giris?donus=/ilan/${itemId}`}>
            {locale === "tr" ? "Yorum için giriş yap" : "Sign in to comment"}
          </Link>
        </Button>
      ) : null}

      {mode === "offline" ? (
        <p className="text-sm text-muted-foreground">
          {locale === "tr"
            ? "Örnek ilanlara yorum kaydedilmez. Veritabanını bağladıktan sonra gerçek ilanlarda açılır."
            : "Comments are disabled on sample listings. Connect database to enable on live listings."}
        </p>
      ) : null}
    </section>
  );
}

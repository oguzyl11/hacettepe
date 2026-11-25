"use client";

import Link from "next/link";
import { addComment, deleteComment } from "@/app/actions/comment";
import { markSold, rateSeller } from "@/app/actions/trade";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ListingComment } from "@/lib/listings";
import { formatDate } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/context";

export function CommentSection({
  itemId,
  comments,
  mode,
  viewerId,
  ownerId,
  status,
  buyerId,
  ratingScore,
}: {
  itemId: string;
  comments: ListingComment[];
  mode: "ready" | "signin" | "offline";
  viewerId: string | null;
  ownerId: string;
  status: "ACTIVE" | "SOLD";
  buyerId: string | null;
  ratingScore: number | null;
}) {
  const { t } = useTranslation();
  const canSell = viewerId === ownerId && status === "ACTIVE";
  const canRate = viewerId !== null && viewerId === buyerId && status === "SOLD" && ratingScore === null;

  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-5">
      <h2 className="font-display text-lg font-semibold">{t.itemDetail.messages}</h2>
      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.itemDetail.noMessages}</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-xl bg-muted px-4 py-3">
              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <Link href={`/profil/${comment.authorId}`} className="font-semibold text-foreground hover:text-primary">
                  {comment.authorName}
                </Link>
                <time dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time>
              </div>
              <p className="mt-1 text-sm leading-6">{comment.body}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {canSell && comment.authorId !== ownerId ? (
                  <form action={markSold}>
                    <input type="hidden" name="itemId" value={itemId} />
                    <input type="hidden" name="buyerId" value={comment.authorId} />
                    <Button type="submit" size="sm">
                      {t.itemDetail.markSold}
                    </Button>
                  </form>
                ) : null}
                {viewerId === comment.authorId ? (
                  <form action={deleteComment}>
                    <input type="hidden" name="commentId" value={comment.id} />
                    <input type="hidden" name="itemId" value={itemId} />
                    <Button type="submit" size="sm" variant="outline">
                      {t.itemDetail.deleteMessage}
                    </Button>
                  </form>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      {mode === "ready" && status === "ACTIVE" ? (
        <form action={addComment} className="space-y-3">
          <input type="hidden" name="itemId" value={itemId} />
          <Textarea
            name="body"
            required
            minLength={2}
            maxLength={1000}
            placeholder={t.itemDetail.messagePlaceholder}
          />
          <Button type="submit">{t.itemDetail.sendMessage}</Button>
        </form>
      ) : null}

      {canRate ? (
        <form action={rateSeller} className="flex flex-wrap items-center gap-3">
          <input type="hidden" name="itemId" value={itemId} />
          <label className="text-sm font-medium" htmlFor="score">
            {t.itemDetail.rateSeller}
          </label>
          <select
            id="score"
            name="score"
            defaultValue="5"
            className="h-11 rounded-lg border border-border bg-card px-3 text-sm"
          >
            {[5, 4, 3, 2, 1].map((score) => (
              <option key={score} value={score}>
                {score}
              </option>
            ))}
          </select>
          <Button type="submit">{t.common.save}</Button>
        </form>
      ) : null}

      {mode === "signin" && status === "ACTIVE" ? (
        <Button asChild variant="outline">
          <Link href={`/giris?donus=/ilan/${itemId}`}>{t.itemDetail.signInToMessage}</Link>
        </Button>
      ) : null}
    </section>
  );
}

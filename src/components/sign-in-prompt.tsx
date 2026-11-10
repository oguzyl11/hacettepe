import Link from "next/link";

export function SignInPrompt({ title, next }: { title: string; next: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h1 className="font-display text-2xl font-bold">{title}</h1>
      <Link href={`/giris?donus=${next}`} className="mt-3 inline-block text-sm font-semibold text-primary">
        Giriş sayfasına git
      </Link>
    </div>
  );
}

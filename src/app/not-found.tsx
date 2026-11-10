import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-start justify-center px-4 py-20">
      <h1 className="text-3xl font-semibold">İlan bulunamadı</h1>
      <p className="mt-2 text-muted-foreground">
        Bağlantı eski olabilir veya ilan kaldırılmış olabilir.
      </p>
      <Link href="/" className="mt-6 text-sm font-medium text-primary">
        İlanlara dön
      </Link>
    </main>
  );
}

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-display text-sm font-bold text-primary">Hacettepe Takas</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Beytepe ve Sıhhiye öğrencileri için güvenli, kampüs içi takas.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Yerleşkeler</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>Beytepe Merkez Kütüphane</li>
            <li>Mühendislik Fakültesi</li>
            <li>Sıhhiye Yerleşkesi</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Hızlı erişim</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link href="/" className="text-muted-foreground hover:text-foreground">Tüm ilanlar</Link></li>
            <li><Link href="/ilan/yeni" className="text-muted-foreground hover:text-foreground">İlan paylaş</Link></li>
            <li><Link href="/teklifler" className="text-muted-foreground hover:text-foreground">Tekliflerim</Link></li>
            <li><Link href="/ilanlarim" className="text-muted-foreground hover:text-foreground">İlanlarım</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Doğrulama</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Kayıt yalnızca @hacettepe.edu.tr adresleriyle açılır.
          </p>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-xs text-muted-foreground sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl justify-between gap-4">
          <span>© 2026 Hacettepe Takas</span>
          <span>Öğrenciden öğrenciye</span>
        </div>
      </div>
    </footer>
  );
}

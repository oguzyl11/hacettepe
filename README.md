# Hacettepe Takas

Kampüs içi takas platformu. Öğrenciler `@hacettepe.edu.tr` adresiyle giriş yapar, ilan verir, ilanın altında mesajlaşır. Satıcı, mesaj yazan bir öğrenciyi alıcı seçince ilan satıldı olur. Yalnızca o alıcı satıcıya 1–5 puan verir.

## Yerel Docker

```bash
docker compose up --build
```

Uygulama [http://localhost:3000](http://localhost:3000) adresindedir. Postgres yalnızca `127.0.0.1:5433` üzerinden dinler. Bu komut `compose.override.yaml` dosyasını da yükler ve geliştirme sunucusunu açar. Geliştirme girişi yalnızca bu override içinde `ALLOW_DEV_LOGIN=true` olduğu için görünür.

Canlı yığın override dosyasını almaz:

```bash
docker compose -f compose.yaml up --build
```

Canlıda `AUTH_SECRET` ve `POSTGRES_PASSWORD` benzersiz olmalıdır. Bilinen geliştirme sırrıyla üretim süreci açılmaz. Ayrıntılar `.env.example` içindedir.

`BLOB_READ_WRITE_TOKEN` yoksa ilan ve profil görselleri `uploads` volume’una yazılır ve `/media/` altından sunulur.

## Yedek

```bash
sh docker/backup.sh
```

Geri yükleme:

```bash
docker compose exec -T db psql -U hacettepe -d hacettepe < backups/hacettepe-YYYYMMDD-HHMMSS.sql
```

## Kontrol

```bash
npm run lint
npx tsc --noEmit
npm test
```

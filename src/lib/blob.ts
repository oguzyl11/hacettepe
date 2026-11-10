import { put } from "@vercel/blob";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxBytes = 4 * 1024 * 1024;

export function imageFiles(formData: FormData, field: string) {
  return formData
    .getAll(field)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

export async function uploadImages(files: File[], folder: "ilan" | "profil") {
  if (files.length === 0) return { urls: [] as string[] };

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { urls: [], error: "Görsel yüklemek için BLOB_READ_WRITE_TOKEN gerekli." };
  }

  if (files.length > 4) {
    return { urls: [], error: "En fazla 4 görsel yükleyebilirsin." };
  }

  const urls: string[] = [];
  for (const file of files) {
    if (!allowedTypes.has(file.type) || file.size > maxBytes) {
      return { urls: [], error: "Görseller JPG, PNG veya WEBP olmalı ve her biri 4 MB’ı geçmemeli." };
    }
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "").slice(-48) || "gorsel";
    const blob = await put(`${folder}/${crypto.randomUUID()}-${safeName}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    urls.push(blob.url);
  }

  return { urls };
}

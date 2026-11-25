import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";
import {
  imageContentType,
  imageExtension,
  mediaNamePattern,
  type ImageExtension,
} from "@/lib/image-signature";
import { logger } from "@/lib/logger";

const maxFiles = 4;

export function uploadRoot() {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
}

export function imageFiles(formData: FormData, field: string) {
  return formData
    .getAll(field)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

export async function uploadImages(files: File[], folder: "ilan" | "profil") {
  if (files.length === 0) return { urls: [] as string[] };
  if (files.length > maxFiles) {
    return { urls: [], error: "limit" as const };
  }

  const prepared: { bytes: Uint8Array; extension: ImageExtension }[] = [];
  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const extension = imageExtension(bytes);
    if (!extension) return { urls: [], error: "type" as const };
    prepared.push({ bytes, extension });
  }

  const urls: string[] = [];
  for (const image of prepared) {
    const name = `${folder}-${crypto.randomUUID()}.${image.extension}`;
    if (!mediaNamePattern.test(name)) return { urls: [], error: "type" as const };
    const contentType = imageContentType(image.extension);
    const body = Buffer.from(image.bytes);
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`${folder}/${name}`, body, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType,
      });
      urls.push(blob.url);
    } else {
      const root = uploadRoot();
      await mkdir(root, { recursive: true });
      await writeFile(path.join(root, name), body);
      urls.push(`/media/${name}`);
    }
  }

  return { urls };
}

export async function removeStoredImages(urls: string[]) {
  for (const url of urls) {
    if (url.startsWith("/media/")) {
      const name = url.slice("/media/".length);
      if (!mediaNamePattern.test(name)) continue;
      const root = path.resolve(uploadRoot());
      const resolved = path.resolve(root, name);
      if (!resolved.startsWith(`${root}${path.sep}`)) continue;
      await unlink(resolved).catch((error: unknown) => {
        logger.error("image.unlink", error);
      });
      continue;
    }
    if (process.env.BLOB_READ_WRITE_TOKEN && url.startsWith("https://")) {
      await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN }).catch((error: unknown) => {
        logger.error("image.blob", error);
      });
    }
  }
}

const maxBytes = 4 * 1024 * 1024;

export type ImageExtension = "jpg" | "png" | "webp";

export function imageExtension(bytes: Uint8Array): ImageExtension | null {
  if (bytes.byteLength > maxBytes) return null;
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "png";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "webp";
  }
  return null;
}

export function imageContentType(extension: ImageExtension) {
  if (extension === "jpg") return "image/jpeg";
  if (extension === "png") return "image/png";
  return "image/webp";
}

export const mediaNamePattern = /^(ilan|profil)-[0-9a-f-]{36}\.(jpg|png|webp)$/;

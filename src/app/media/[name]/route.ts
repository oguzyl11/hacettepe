import { readFile } from "node:fs/promises";
import path from "node:path";
import { imageContentType, mediaNamePattern, type ImageExtension } from "@/lib/image-signature";

export async function GET(
  _request: Request,
  context: { params: Promise<{ name: string }> },
) {
  const { name } = await context.params;
  if (!mediaNamePattern.test(name)) {
    return new Response("Not found", { status: 404 });
  }
  const extension = name.slice(name.lastIndexOf(".") + 1) as ImageExtension;
  const root = path.join(process.cwd(), "uploads");
  const resolved = path.join(root, name);
  if (!resolved.startsWith(`${root}${path.sep}`)) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const data = await readFile(resolved);
    return new Response(data, {
      headers: {
        "Content-Type": imageContentType(extension),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

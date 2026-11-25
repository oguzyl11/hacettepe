import { revalidatePath } from "next/cache";
import { locales } from "@/lib/locale";

export function revalidateLocalized(paths: string[]) {
  for (const path of paths) {
    const suffix = path === "/" ? "" : path;
    for (const locale of locales) {
      revalidatePath(`/${locale}${suffix}`);
    }
  }
}

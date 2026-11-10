import { auth } from "@/auth";
import { isHacettepeEmail } from "@/lib/utils";

export async function currentStudent() {
  const session = await auth();
  const email = session?.user?.email;
  const id = session?.user?.id;
  if (!id || !isHacettepeEmail(email)) return null;
  return { id, email };
}

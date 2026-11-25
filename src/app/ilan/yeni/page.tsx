import { Suspense } from "react";
import Link from "next/link";
import { BadgeCheck, Home, PlusCircle, Zap } from "lucide-react";
import { connection } from "next/server";
import { ListingForm } from "@/components/listing-form";
import { currentStudent } from "@/lib/current-student";
import { getPrisma } from "@/lib/prisma";
import { getServerDictionary } from "@/lib/i18n/server";

export default function NewListingPage() {
  return (
    <main className="w-full flex-1 bg-[#f8f9ff]">
      <Suspense fallback={<div className="mx-auto h-96 max-w-7xl animate-pulse px-4 py-8" />}>
        <NewListingBody />
      </Suspense>
    </main>
  );
}

async function NewListingBody() {
  await connection();
  const [student, { t }] = await Promise.all([
    currentStudent(),
    getServerDictionary(),
  ]);

  if (!student) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-16">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-[#0b1c30]">{t.newListing.signInTitle}</h1>
          <Link
            href="/giris?donus=/ilan/yeni"
            className="mt-4 inline-flex text-sm font-semibold text-[#991b1b] hover:underline"
          >
            {t.newListing.signInLink}
          </Link>
        </div>
      </div>
    );
  }

  const prisma = getPrisma();
  const profile = prisma
    ? await prisma.user.findUnique({
        where: { id: student.id },
        select: { name: true, instagramHandle: true },
      })
    : null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-3 rounded-xl bg-white p-3 shadow-sm md:flex-row md:items-center md:justify-between">
        <p className="flex flex-wrap items-center gap-1 text-sm text-[#59413e]">
          <Link href="/" className="inline-flex items-center gap-1 font-semibold hover:text-[#760009]">
            <Home className="size-4" />
            {t.newListing.breadcrumbHome}
          </Link>
          <span className="text-[#8d706d]">/</span>
          <span className="inline-flex items-center gap-1 font-semibold text-[#760009]">
            <PlusCircle className="size-4" />
            {t.newListing.breadcrumbPost}
          </span>
        </p>
        <p className="inline-flex items-center gap-1.5 rounded-full bg-[#d3e4fe] px-2.5 py-1 text-[11px] font-bold text-[#003a5b]">
          <span className="size-2 animate-pulse rounded-full bg-[#991b1b]" />
          {t.newListing.verifiedSession}
        </p>
      </div>

      <section className="relative mt-4 overflow-hidden rounded-xl bg-gradient-to-r from-[#760009] via-[#991b1b] to-[#00527e] p-5 text-white shadow-md sm:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-1 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase">
              <Zap className="size-3.5" />
              {t.newListing.heroBadge}
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.newListing.heroTitle}</h1>
            <p className="mt-2 max-w-xl text-sm text-[#ffaaa1]">{t.newListing.heroText}</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/10 p-2 backdrop-blur-sm">
            <BadgeCheck className="size-7 text-[#93ccff]" />
            <span>
              <span className="block text-[11px] font-bold">{t.newListing.verifiedProfile}</span>
              <span className="block text-xs text-[#ffaaa1]">{maskEmail(student.email)}</span>
            </span>
          </div>
        </div>
      </section>

      <div className="py-5">
        <ListingForm
          databaseReady={Boolean(prisma)}
          author={{
            name: profile?.name?.trim() || student.email.split("@")[0] || "",
            email: student.email,
            instagramHandle: profile?.instagramHandle ?? null,
          }}
        />
      </div>
    </div>
  );
}

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  return `${local.slice(0, 1)}${"*".repeat(Math.max(3, local.length - 1))}@${domain}`;
}

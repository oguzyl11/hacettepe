import { Suspense } from "react";
import { authProviders } from "@/auth";
import { SignInForm } from "@/components/sign-in-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { safeRedirectPath } from "@/lib/utils";

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; donus?: string }>;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 px-4 py-12 sm:px-6">
      <Card className="w-full">
        <CardHeader>
          <p className="text-sm font-medium text-primary">Hacettepe Takas</p>
          <h1 className="mt-1 text-2xl font-semibold">Öğrenci girişi</h1>
          <p className="mt-2 rounded-lg bg-secondary/10 px-3 py-2 text-sm font-medium text-secondary">
            Sadece @hacettepe.edu.tr e-postası ile giriş yapılabilir.
          </p>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-muted" />}>
            <SignInBody searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}

async function SignInBody({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; donus?: string }>;
}) {
  const params = await searchParams;
  return (
    <SignInForm
      callbackPath={safeRedirectPath(params.donus)}
      error={params.error}
      googleEnabled={authProviders.google}
      emailEnabled={authProviders.email}
      devLogin={process.env.NODE_ENV === "development"}
    />
  );
}

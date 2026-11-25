const knownSecrets = new Set([
  "",
  "dev-hacettepe-takas-local-docker",
  "uzun-rastgele-bir-deger",
]);

export function assertProductionSecret() {
  if (process.env.NODE_ENV !== "production") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  const secret = process.env.AUTH_SECRET ?? "";
  if (knownSecrets.has(secret)) {
    throw new Error("Set a unique AUTH_SECRET before starting production.");
  }
}

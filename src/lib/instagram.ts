const handlePattern = /^[a-z0-9._]{1,30}$/;

export function instagramUrl(handle: string | null | undefined) {
  if (!handle) return null;
  const normalized = handle.trim().replace(/^@+/, "").toLowerCase();
  if (!handlePattern.test(normalized)) return null;
  return `https://www.instagram.com/${normalized}/`;
}

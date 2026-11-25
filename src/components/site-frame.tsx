"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { stripLocalePrefix } from "@/lib/locale";

export function SiteFrame({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = stripLocalePrefix(usePathname());
  if (pathname === "/giris") {
    return <div className="flex min-h-full flex-1 flex-col bg-[#f8f9ff]">{children}</div>;
  }

  return (
    <>
      {header}
      {children}
      {footer}
    </>
  );
}

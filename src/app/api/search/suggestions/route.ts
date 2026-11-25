import { NextRequest, NextResponse, connection } from "next/server";
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";
import { getSearchSuggestions } from "@/lib/search";
import type { Locale } from "@/lib/i18n/types";

export async function GET(request: NextRequest) {
  await connection();
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") ?? "";
  const limitParam = searchParams.get("limit");
  const parsedLimit = limitParam ? Number.parseInt(limitParam, 10) : 5;
  const limit = Number.isNaN(parsedLimit) ? 5 : Math.min(5, Math.max(1, parsedLimit));
  const localeParam = searchParams.get("locale");
  const locale: Locale = localeParam === "en" ? "en" : "tr";
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`search:${ip}`, 60, 60 * 1000)) {
    return NextResponse.json(
      { query: q, listings: [], categories: [], totalMatches: 0, popularSearches: [] },
      { status: 429 },
    );
  }

  try {
    const data = await getSearchSuggestions(q, limit, locale);
    return NextResponse.json(data);
  } catch (error) {
    logger.error("search.suggestions", error);
    return NextResponse.json(
      {
        query: q,
        listings: [],
        categories: [],
        totalMatches: 0,
        popularSearches: [],
      },
      { status: 500 }
    );
  }
}

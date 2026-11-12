import { NextRequest, NextResponse, connection } from "next/server";
import { getSearchSuggestions } from "@/lib/search";
import type { Locale } from "@/lib/i18n/types";

export async function GET(request: NextRequest) {
  await connection();
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") ?? "";
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 5;
  const localeParam = searchParams.get("locale");
  const locale: Locale = localeParam === "en" ? "en" : "tr";

  try {
    const data = await getSearchSuggestions(
      q,
      isNaN(limit) ? 5 : limit,
      locale
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error("Arama önerileri alınırken hata oluştu:", error);
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

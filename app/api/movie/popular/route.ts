import { NextRequest, NextResponse } from "next/server";
import { getPopularMovies } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") || "id-ID";
  const page = Number(searchParams.get("page")) || 1;

  try {
    const data = await getPopularMovies(lang, page);
    return NextResponse.json(data);
  } catch (err: unknown) {
    let errorMessage = "Gagal mengambil data movie populer";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

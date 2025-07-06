// Mengimpor komponen dari Next.js untuk gambar dan link
import Image from "next/image";
import Link from "next/link";

// Mengimpor komponen shadcn/ui
import { Card } from "@/components/ui/card";
//import { Button } from "@/components/ui/button";
//import { Skeleton } from "@/components/ui/skeleton"; // Untuk efek loading

// Mengimpor fungsi-fungsi API dari lib/tmdb.ts
import {
  getPopularMovies,
  getPosterImageUrl,
  getOriginalBackdropUrl,
  Movie,
} from "@/lib/tmdb";
import Pagination from "@/components/Pagination";

// Komponen Halaman Beranda.
// Karena ini adalah Server Component, kita bisa menggunakan `async/await` langsung
// untuk mengambil data tanpa `useEffect` atau `useState`.
export default async function HomePage({
  searchParams,
}: {
  searchParams: { id?: string; page?: string; q?: string };
}) {
  const params = await searchParams; // Ambil query params dari URL
  const language = params?.id || "id-ID"; // Ambil bahasa dari query params, default ke "id-ID"
  const page = Number(params?.page) || 1; // Ambil halaman dari query params, default ke // Total halaman, bisa diambil dari response API jika perlu

  let movies: Movie[] = []; // Inisialisasi daftar film
  let error: string | null = null; // Untuk pesan error
  let totalPages = 1;

  try {
    // Hapus blok pencarian karena searchMovies tidak ada
    const data = await getPopularMovies(language, page);
    movies = data.results; // Ambil hanya array hasil film
    totalPages = data.total_pages;
    totalPages = totalPages > 500 ? 500 : totalPages; // Batasi total halaman maksimal 500
  } catch (err: unknown) {
    // Tangani error jika terjadi masalah saat mengambil data
    if (err instanceof Error) {
      error = err.message;
    } else {
      error = "Terjadi kesalahan saat mengambil film.";
    }
    console.error("Error fetching movies:", err);
  }

  const heroMovie = movies.length > 0 ? movies[0] : null;

  return (
    <div className="w-full">
      {/* HERO SECTION ala Netflix */}
      {heroMovie && (
        <div className="relative w-screen min-h-[80vh] flex items-end bg-black/80 overflow-hidden mb-4">
          <Image
            src={getOriginalBackdropUrl(
              // Menggunakan fungsi untuk resolusi original
              heroMovie.backdrop_path || heroMovie.poster_path
            )}
            alt={heroMovie.title}
            fill
            className="object-cover object-top w-full h-full opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="relative z-10 p-8 max-w-2xl pb-16 sm:pb-24">
            <h2 className="text-3xl sm:text-5xl font-bold text-white drop-shadow-lg mb-4">
              {heroMovie.title}
            </h2>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-yellow-400 font-bold text-lg">
                ⭐ {heroMovie.vote_average.toFixed(1)}
              </span>
              <span className="text-white/80 text-base">
                {heroMovie.release_date}
              </span>
            </div>
            <p className="text-white/90 text-base sm:text-lg line-clamp-3 mb-6 drop-shadow">
              {heroMovie.overview}
            </p>
            <Link href={`/movie/${heroMovie.id}?id=${language}`}>
              <button className="bg-transparent border border-white hover:border-red- hover:text-red-500 text-white font-normal py-2 px-6 rounded-lg text-lg shadow-lg transition-all">
                More Info
              </button>
            </Link>
          </div>
        </div>
      )}
      {/* END HERO */}
      <h1 className="text-2xl font-bold mb-6 text-white leading-tight pl-8">
        Popular Movie
      </h1>

      {/* Menampilkan pesan error jika ada */}
      {error ? (
        <div className="text-red-600 text-center text-xl mt-8 p-6 bg-red-50 border border-red-300 rounded-lg shadow-md max-w-lg mx-auto">
          <p className="font-semibold mb-2">Oops, terjadi kesalahan!</p>
          <p>{error}</p>
          <p className="mt-3 text-base text-gray-700">
            Pastikan API key Anda benar dan dikonfigurasi di file{" "}
            <code className="font-mono bg-gray-200 p-1 rounded">
              .env.local
            </code>
            .
          </p>
        </div>
      ) : (
        // Grid untuk menampilkan daftar film
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mx-auto pl-8">
          {movies.map((movie) => (
            <Link
              href={`/movie/${movie.id}?id=${language}`}
              key={movie.id}
              passHref
            >
              <Card className="relative group bg-transparent shadow-none rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-10 p-0">
                <div className="relative w-full aspect-[2/3] h-auto">
                  <Image
                    src={getPosterImageUrl(movie.poster_path)}
                    alt={movie.title}
                    fill
                    className="object-cover w-full h-full rounded-2xl"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                  />
                  {/* Overlay judul dan info saat hover */}
                  <div className="absolute inset-0 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-2xl">
                    <span className="text-lg text-gray-50 font-bold">
                      {movie.title}
                    </span>
                    <span className="text-sm text-gray-200">
                      Rilis: {movie.release_date}
                    </span>
                    <span className="text-sm text-yellow-400">
                      ⭐ {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-100 mt-2 line-clamp-2">
                      {movie.overview.length > 50
                        ? movie.overview.slice(0, 50) + " ..."
                        : movie.overview}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <div className="mt-12 flex justify-center">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import {
  getMovieDetails,
  getPosterImageUrl,
  getBackdropImageUrl,
  getMovieVideos,
} from "@/lib/tmdb"; // Mengimpor fungsi API
import { Button } from "@/components/ui/button"; // Mengimpor komponen Button shadcn/ui
import { AspectRatio } from "@radix-ui/react-aspect-ratio"; // Helper untuk aspek rasio gambar

// Tambahkan tipe untuk hasil video TMDb
interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

// Halaman detail film. Ini juga Server Component.
export default async function MovieDetailsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { id } = params;
  // Ambil language dari searchParams, default ke "id-ID"
  const language =
    typeof searchParams?.lang === "string" ? searchParams.lang : "id-ID";
  let movie;
  let videos: { results: MovieVideo[] } | undefined;
  let error: string | null = null;

  try {
    // Mengambil detail film dari API TMDb
    movie = await getMovieDetails(id, language);
    videos = await getMovieVideos(id);
  } catch (err: unknown) {
    // Menangani error jika film tidak ditemukan atau ada masalah lain
    if (err instanceof Error) {
      error = err.message;
    } else {
      error = `Terjadi kesalahan saat mengambil detail film dengan ID: ${id}.`;
    }
    console.error("Error fetching movie details:", err);
  }

  // Tampilkan pesan error jika terjadi kesalahan
  if (error) {
    return (
      <div className="text-red-600 text-center text-xl mt-8 p-6 bg-red-50 border border-red-300 rounded-lg shadow-md max-w-lg mx-auto">
        <p className="font-semibold mb-2">Gagal memuat detail film!</p>
        <p>{error}</p>
        <Link href="/" passHref>
          <Button className="mt-6 bg-red-500 hover:bg-red-600 transition-colors duration-200">
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  // Tampilkan pesan jika film tidak ditemukan (meskipun error handling di atas seharusnya sudah mencakup)
  if (!movie) {
    return (
      <div className="text-center text-xl mt-8 p-6 bg-yellow-50 border border-yellow-300 rounded-lg shadow-md max-w-lg mx-auto">
        <p className="font-semibold mb-2">Film tidak ditemukan.</p>
        <Link href="/" passHref>
          <Button className="mt-6 bg-red-500 hover:bg-red-600 transition-colors duration-200">
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  // Render detail film jika data berhasil diambil
  return (
    <div className="relative w-full flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {/* Backdrop Image */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-xl opacity-30">
        <Image
          src={getBackdropImageUrl(movie.backdrop_path)}
          alt={`Backdrop ${movie.title}`}
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          className="filter blur-sm brightness-75"
          priority // Prioritaskan gambar backdrop karena ini adalah bagian utama
        />
      </div>

      {/* Konten Utama */}
      <div className="relative z-10 bg-black bg-opacity-90 rshadow-2xl md:p-10 flex flex-col items-center w-full">
        <div className="pt-20 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10 w-full max-w-5xl">
          {/* Poster Film */}
          <div className="w-64 h-96 md:w-80 md:h-[480px] flex-shrink-0 rounded-lg overflow-hidden shadow-xl">
            <AspectRatio ratio={2 / 3}>
              {" "}
              {/* Rasio aspek poster film */}
              <Image
                src={getPosterImageUrl(movie.poster_path)}
                alt={movie.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: "cover" }}
                className="rounded-lg"
                priority // Prioritaskan gambar poster
              />
            </AspectRatio>
          </div>

          {/* Detail Film */}
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-100 mb-3 leading-tight">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-gray-300 italic text-lg mb-4">
                &quot;{movie.tagline}&quot;
              </p>
            )}

            <p className="text-gray-300 text-lg mb-2">
              <span className="font-semibold">Rilis:</span> {movie.release_date}
            </p>
            {movie.runtime && (
              <p className="text-gray-300 text-lg mb-2">
                <span className="font-semibold">Duration:</span> {movie.runtime}{" "}
                minutes
              </p>
            )}
            {movie.genres && movie.genres.length > 0 && (
              <p className="text-gray-300 text-lg mb-4">
                <span className="font-semibold">Genre:</span>{" "}
                {movie.genres.map((g) => g.name).join(", ")}
              </p>
            )}

            <div className="flex items-center justify-center md:justify-start mb-6">
              <span className="text-yellow-500 text-4xl font-bold mr-2">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-300 text-xl">/ 10</span>
            </div>

            <h2 className="text-2xl text-gray-200 font-bold mb-3">Synopsis</h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              {movie.overview ||
                "Tidak ada sinopsis yang tersedia untuk film ini."}
            </p>
          </div>
        </div>
        {/* Trailer Section */}
        <div className="w-full flex flex-col items-center mt-10 mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Trailer</h2>
          {videos &&
          videos.results &&
          videos.results.filter(
            (v) => v.site === "YouTube" && v.type === "Trailer"
          ).length > 0 ? (
            videos.results
              .filter((v) => v.site === "YouTube" && v.type === "Trailer")
              .slice(0, 1) // Ambil hanya 1 trailer
              .map((video) => (
                <div
                  key={video.key}
                  className="w-full max-w-2xl aspect-video rounded-lg overflow-hidden shadow-lg"
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-none rounded-lg"
                  />
                </div>
              ))
          ) : (
            <p className="text-gray-400 text-lg">
              Film ini tidak memiliki video trailer.
            </p>
          )}
        </div>
        {/* Tombol kembali */}
        <Link href={`/?lang=${language}`} passHref className="self-center mt-8">
          <Button
            variant="ghost"
            className="mt-6 hover:bg-transparent hover:text-red-800 hover:border-red-800 transition-colors duration-200 text-lg text-red-500 border border-red-500 px-6 py-3 rounded-lg"
          >
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

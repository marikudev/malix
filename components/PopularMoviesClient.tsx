"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Pagination from "@/components/Pagination";
import { Movie } from "@/lib/tmdb";

function ErrorMessage({ error }: { error: string }) {
  return (
    <div className="text-red-600 text-center text-xl mt-8 p-6 bg-red-50 border border-red-300 rounded-lg shadow-md max-w-lg mx-auto">
      <p className="font-semibold mb-2">Oops, terjadi kesalahan!</p>
      <p>{error}</p>
      <p className="mt-3 text-base text-gray-700">
        Pastikan API key Anda benar dan dikonfigurasi di file{" "}
        <code className="font-mono bg-gray-200 p-1 rounded">.env.local</code>.
      </p>
    </div>
  );
}

function HeroMovie({ movie, language }: { movie: Movie; language: string }) {
  return (
    <div className="relative w-screen min-h-[80vh] flex items-end bg-black/80 overflow-hidden mb-4">
      <Image
        src={
          movie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : movie.poster_path
            ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
            : "https://placehold.co/1920x1080/cccccc/333333?text=No+Image"
        }
        alt={movie.title}
        fill
        className="object-cover object-top w-full h-full opacity-70"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="relative z-10 p-8 max-w-2xl pb-16 sm:pb-24">
        <h2 className="text-3xl sm:text-5xl font-bold text-white drop-shadow-lg mb-4">
          {movie.title}
        </h2>
        <div className="flex items-center gap-4 mb-2">
          <span className="text-yellow-400 font-bold text-lg">
            ⭐ {movie.vote_average.toFixed(1)}
          </span>
          <span className="text-white/80 text-base">{movie.release_date}</span>
        </div>
        <p className="text-white/90 text-base sm:text-lg line-clamp-3 mb-6 drop-shadow">
          {movie.overview}
        </p>
        <Link href={`/movie/${movie.id}?lang=${language}`}>
          <button className="bg-transparent border border-white hover:border-red- hover:text-red-500 text-white font-normal py-2 px-6 rounded-lg text-lg shadow-lg transition-all">
            More Info
          </button>
        </Link>
      </div>
    </div>
  );
}

function MovieGrid({
  movies,
  language,
}: {
  movies: Movie[];
  language: string;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mx-auto pl-8">
      {movies.map((movie) => (
        <Link
          href={`/movie/${movie.id}?lang=${language}`}
          key={movie.id}
          passHref
        >
          <Card className="relative group bg-transparent shadow-none rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-10 p-0">
            <div className="relative w-full aspect-[2/3] h-auto">
              <Image
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://placehold.co/500x750/cccccc/333333?text=Tidak+Ada+Gambar"
                }
                alt={movie.title}
                fill
                className="object-cover w-full h-full rounded-2xl"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              />
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
  );
}

export default function PopularMoviesClient() {
  const searchParams = useSearchParams();
  const language = searchParams.get("lang") || "id-ID";
  const page = Number(searchParams.get("page")) || 1;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/movie/popular?lang=${language}&page=${page}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Gagal mengambil data movie populer");
        }
        return res.json();
      })
      .then((data) => {
        setMovies(data.results);
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Terjadi kesalahan saat mengambil film.");
      })
      .finally(() => setLoading(false));
  }, [language, page]);

  const heroMovie = movies.length > 0 ? movies[0] : null;

  return (
    <div className="w-full">
      {heroMovie && <HeroMovie movie={heroMovie} language={language} />}
      <h1 className="text-2xl font-bold mb-6 text-white leading-tight pl-8">
        Popular Movie
      </h1>
      {error ? (
        <ErrorMessage error={error} />
      ) : loading ? (
        <div className="text-center text-white py-10">Loading...</div>
      ) : (
        <MovieGrid movies={movies} language={language} />
      )}
      <div className="mt-12 flex justify-center">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}

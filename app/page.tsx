import PopularMoviesClient from "@/components/PopularMoviesClient";

// Komponen Halaman Beranda.
// Karena ini adalah Server Component, kita bisa menggunakan `async/await` langsung
// untuk mengambil data tanpa `useEffect` atau `useState`.
export default function HomePage() {
  return <PopularMoviesClient />;
}

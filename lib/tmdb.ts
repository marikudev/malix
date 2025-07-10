// Mendefinisikan interface untuk struktur data film (untuk respon) dari API TMDb
export interface Movie {
    id: number;
    title: string;
    poster_path: string | null; // Bisa null jika tidak ada poster
    release_date: string;
    overview: string;
    vote_average: number;
    backdrop_path: string | null; // Untuk gambar latar belakang halaman detail
    genres: { id: number; name: string }[]; // Array genre
    runtime: number | null; // Durasi film dalam menit
    tagline: string | null; // Slogan film
  }

  // Mendefinisikan interface untuk respons film berhalaman (untuk respon) dari API
  export interface PaginatedMoviesResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
  }

  // Mengambil API key dari evironemment variabel.
  // evironemmen Variabel ini hanya tersedia di sisi server saat menggunakan App Router.
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';
  // Base URL untuk gambar poster (ukuran w500 adalah ukuran umum yang bagus)
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
  // Base URL untuk gambar backdrop (ukuran w1280 untuk tampilan yang lebih besar)
  const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';


  // Fungsi asinkron untuk mengambil daftar film populer
  export async function getPopularMovies(language: string, page: number): Promise<PaginatedMoviesResponse> {
    // Periksa apakah API key telah dikonfigurasi
   

    // Melakukan fetch ke endpoint film populer
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=${language}&page=${page}`, {
      // next: { revalidate: 3600 } memberitahu Next.js untuk me-revalidate data ini
      // setiap 3600 detik (1 jam). Ini akan menggunakan data yang di-cache selama 1 jam,
      // lalu mengambil yang baru pada permintaan berikutnya setelah 1 jam.
      next: { revalidate: 3600 }
    });

    // Periksa apakah respons berhasil (status kode 2xx)
    if (!res.ok) {
      // Jika tidak berhasil, coba parse error message dari API jika ada
      const errorData = await res.json().catch(() => ({})); // Pastikan tidak error saat parsing
      const errorMessage = errorData.status_message || res.statusText || 'Kesalahan tidak diketahui.';
      throw new Error(`Gagal mengambil film populer: ${res.status} - ${errorMessage}`);
    }

    // Mengembalikan data JSON yang diurai
    return res.json();
  }

  // Fungsi asinkron untuk mengambil detail film berdasarkan ID
  export async function getMovieDetails(id: string, language = "id-ID"): Promise<Movie> {
    if (!TMDB_API_KEY) {
      console.error("Kesalahan: Variabel lingkungan TMDB_API_KEY tidak dikonfigurasi.");
      throw new Error("TMDB_API_KEY tidak dikonfigurasi. Harap tambahkan di file .env.local.");
    }

    // Melakukan fetch ke endpoint detail film dengan ID
    const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=${language}`, {
      next: { revalidate: 3600 } // Juga revalidate data detail film setiap jam
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.status_message || res.statusText || 'Kesalahan tidak diketahui.';
      throw new Error(`Gagal mengambil detail film ${id}: ${res.status} - ${errorMessage}`);
    }

    return res.json();
  }

  // Fungsi helper untuk mendapatkan URL gambar poster
  export function getPosterImageUrl(path: string | null): string {
    // Jika path tidak ada, kembalikan URL placeholder
    return path ? `${IMAGE_BASE_URL}${path}` : 'https://placehold.co/500x750/cccccc/333333?text=Tidak+Ada+Gambar';
  }

  // Fungsi helper untuk mendapatkan URL gambar backdrop
  export function getBackdropImageUrl(path: string | null): string {
      return path ? `${BACKDROP_BASE_URL}${path}` : 'https://placehold.co/1280x720/cccccc/333333?text=Tidak+Ada+Gambar';
  }

  // Fungsi helper untuk mendapatkan URL gambar backdrop original
  export function getOriginalBackdropUrl(path: string | null): string {
  return path ? `https://image.tmdb.org/t/p/original${path}` : 'https://placehold.co/1920x1080/cccccc/333333?text=No+Image';
  }

  // Fungsi untuk mengambil video trailer dari TMDb
  export async function getMovieVideos(id: string) {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY tidak dikonfigurasi.");
  }
  const res = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}`);
  if (!res.ok) throw new Error("Gagal mengambil video film");
  return res.json();
  
}

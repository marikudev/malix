import type { NextConfig } from "next";

const nextConfig: NextConfig =  {
  reactStrictMode: true, // Direkomendasikan untuk pengembangan
  images: {
    // Konfigurasi domain gambar yang diizinkan oleh Next.js Image Optimization.
    // Ini sangat penting agar gambar dari TMDb dapat ditampilkan dengan benar
    // menggunakan komponen <Image> dari next/image.
    domains: ['image.tmdb.org', 'placehold.co'], // 'placehold.co' untuk gambar placeholder
  },
  // Anda bisa menambahkan konfigurasi lain di sini jika diperlukan
};

export default nextConfig;

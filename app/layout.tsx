// Mengimpor CSS global Tailwind. Ini penting agar semua styling bekerja.
import "./globals.css";
// Mengimpor font Inter dari Next.js (secara otomatis dioptimalkan)
import { Inter } from "next/font/google";
// Mengimpor komponen Button dari shadcn/ui
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

// Metadata untuk halaman, akan muncul di <head> HTML
export const metadata = {
  title: "Aplikasi Film TMDb",
  description:
    "Contoh aplikasi Next.js dengan TMDb API, TypeScript, App Router, Tailwind CSS, dan shadcn/ui",
};

// Root Layout Component
export default function RootLayout({
  children, // Properti children akan berisi konten halaman yang dirender
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-black text-gray-100 antialiased`}>
        {/* Header Aplikasi */}
        <Header />

        {/* Konten utama halaman */}
        <main className="container min-h-[calc(100vh-160px)] bg-black">
          {children}
        </main>

        {/* Footer Aplikasi */}
        <footer className="bg-black text-gray-400 p-4 text-center text-sm shadow-inner mt-8">
          <p>
            &copy; {new Date().getFullYear()} Aplikasi Film TMDb. Data
            disediakan oleh The Movie Database.
          </p>
          <p className="mt-1">
            Dibuat dengan Next.js, TypeScript, Tailwind CSS, dan shadcn/ui.
          </p>
        </footer>
      </body>
    </html>
  );
}

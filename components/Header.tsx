"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LanguageSelect from "@/components/LanguageSelect";

export default function Header() {
  const searchParams = useSearchParams();
  const language = searchParams.get("id") || "id-ID";

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-transparent flex items-center justify-between px-8 py-4">
      <Link href={`/?lang=${language}`} className="select-none">
        <span className="text-3xl font-extrabold text-red-600 tracking-widest">
          MALIX
        </span>
      </Link>
      <div className="flex flex-row w-50 items-center justify-between bg-transparent">
        <Link
          href="#"
          className="hover:text-red-500 transition-colors font-bold"
        >
          Login
        </Link>
        <LanguageSelect />
      </div>
    </header>
  );
}

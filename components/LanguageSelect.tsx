"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export default function LanguageSelect() {
  const router = useRouter();
  const searchPaarams = useSearchParams();
  const currentLanguage = searchPaarams.get("id") || "id-ID";

  return (
    <Select
      onValueChange={(val) => {
        const params = new URLSearchParams(searchPaarams.toString());
        params.set("id", val);
        router.push(`?${params.toString()}`);
      }}
      defaultValue={currentLanguage}
    >
      <SelectTrigger className="w-[120px] text-white font-bold hover:text-red-500 focus:text-red-500 focus:bg-transparent active:text-red-600 active:bg-transparent transition-colors">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent className="bg-transparent text-white">
        <SelectItem value="id-ID" className="font-bold">
          Indonesia
        </SelectItem>
        <SelectItem value="en-US" className="font-bold">
          English
        </SelectItem>
        <SelectItem value="ja-JP" className="font-bold">
          日本語
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

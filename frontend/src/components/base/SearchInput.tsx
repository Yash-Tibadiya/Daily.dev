"use client";

import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative hidden lg:block">
      <input
        className="w-full lg:w-[500px] h-12 py-2 pl-10 pr-4 outline-none bg-muted rounded-2xl"
        placeholder="Search here.."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" className="absolute left-2 top-3">
        <MagnifyingGlassIcon className="h-6 w-6" />
      </button>
    </form>
  );
}

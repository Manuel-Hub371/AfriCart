"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface InventorySearchProps {
  onSearch: (query: string) => void;
}

export function InventorySearch({ onSearch }: InventorySearchProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search by product name, SKU, barcode..."
        className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      />
    </div>
  );
}

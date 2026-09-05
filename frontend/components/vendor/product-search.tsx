"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function ProductSearch({ 
  onSearch, 
  placeholder = "Search products, SKU, or barcode..." 
}: ProductSearchProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (value: string) => {
    setQuery(value);
    // Debounce in real implementation
    onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 pr-10 h-10 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-lg"
      />
      {query && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100 rounded-md"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}

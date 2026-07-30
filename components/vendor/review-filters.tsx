"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Filter, X, ArrowUpDown, Star } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface ReviewFiltersProps {
  onFilterChange: (filters: Record<string, string[]>) => void;
  onSort: (sortBy: string) => void;
}

export function ReviewFilters({ onFilterChange, onSort }: ReviewFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    rating: [],
    status: [],
  });

  const ratingOptions: FilterOption[] = [
    { label: "5 Stars", value: "5" },
    { label: "4 Stars", value: "4" },
    { label: "3 Stars", value: "3" },
    { label: "2 Stars", value: "2" },
    { label: "1 Star", value: "1" },
  ];

  const statusOptions: FilterOption[] = [
    { label: "Unanswered", value: "unanswered" },
    { label: "Replied", value: "replied" },
  ];

  const toggleFilter = (filterType: string, value: string) => {
    const current = selectedFilters[filterType] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    
    const newFilters = { ...selectedFilters, [filterType]: updated };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    onFilterChange({});
  };

  const totalActiveFilters = Object.values(selectedFilters).reduce(
    (acc, filters) => acc + filters.length,
    0
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Rating Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-50 h-9 px-3">
          <Star className="h-4 w-4" />
          Rating
          {selectedFilters.rating?.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 text-xs bg-emerald-100 text-emerald-700 font-bold">
              {selectedFilters.rating.length}
            </Badge>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter by Rating</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {ratingOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedFilters.rating?.includes(option.value)}
              onCheckedChange={() => toggleFilter("rating", option.value)}
            >
              <span className="flex-1">{option.label}</span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-50 h-9 px-3">
          <Filter className="h-4 w-4" />
          Status
          {selectedFilters.status?.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 text-xs bg-emerald-100 text-emerald-700 font-bold">
              {selectedFilters.status.length}
            </Badge>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statusOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedFilters.status?.includes(option.value)}
              onCheckedChange={() => toggleFilter("status", option.value)}
            >
              <span className="flex-1">{option.label}</span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort */}
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-50 h-9 px-3">
          <ArrowUpDown className="h-4 w-4" />
          Sort
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onSort("newest")}>
            Newest First
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort("oldest")}>
            Oldest First
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort("highest-rating")}>
            Highest Rating
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort("lowest-rating")}>
            Lowest Rating
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear Filters */}
      {totalActiveFilters > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="h-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <X className="h-4 w-4 mr-1" />
          Clear ({totalActiveFilters})
        </Button>
      )}
    </div>
  );
}

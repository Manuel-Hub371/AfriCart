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
} from "@/components/ui/dropdown-menu";
import { Filter, X, ArrowUpDown } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface CustomerFiltersProps {
  onFilterChange: (filters: Record<string, string[]>) => void;
  onSort: (sortBy: string) => void;
}

export function CustomerFilters({ onFilterChange, onSort }: CustomerFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    segment: [],
    orders: [],
  });

  const segmentOptions: FilterOption[] = [
    { label: "New", value: "new" },
    { label: "Returning", value: "returning" },
    { label: "VIP", value: "vip" },
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
      {/* Customer Segment Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-50 h-9 px-3">
          <Filter className="h-4 w-4" />
          Segment
          {selectedFilters.segment?.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 text-xs bg-emerald-100 text-emerald-700 font-bold">
              {selectedFilters.segment.length}
            </Badge>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter by Segment</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {segmentOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedFilters.segment?.includes(option.value)}
              onCheckedChange={() => toggleFilter("segment", option.value)}
            >
              <span className="flex-1">{option.label}</span>
            </DropdownMenuCheckboxItem>
          ))}
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

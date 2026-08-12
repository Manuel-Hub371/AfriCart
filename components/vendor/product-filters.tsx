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
import { Filter, X } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface ProductFiltersProps {
  onFilterChange: (filters: Record<string, string[]>) => void;
  assignedCategories?: { id: string; name: string; slug: string }[];
}

export function ProductFilters({ onFilterChange, assignedCategories = [] }: ProductFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    status: [],
    category: [],
    stock: [],
  });

  const statusOptions: FilterOption[] = [
    { label: "Published", value: "published" },
    { label: "Draft", value: "draft" },
    { label: "Archived", value: "archived" },
    { label: "Low Stock", value: "low-stock" },
    { label: "Out of Stock", value: "out-of-stock" },
  ];

  const categoryOptions: FilterOption[] = assignedCategories.map((c) => ({
    label: c.name,
    value: c.name,
  }));

  const showCategoryFilter = assignedCategories.length > 1;

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

      {/* Category Filter - Only visible when store has multiple assigned categories */}
      {showCategoryFilter && (
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-50 h-9 px-3">
            Category
            {selectedFilters.category?.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 text-xs bg-emerald-100 text-emerald-700 font-bold">
                {selectedFilters.category.length}
              </Badge>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categoryOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedFilters.category?.includes(option.value)}
                onCheckedChange={() => toggleFilter("category", option.value)}
              >
                <span className="flex-1">{option.label}</span>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Featured Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-50 h-9 px-3">
          <Filter className="h-4 w-4 text-amber-500" />
          Featured Status
          {selectedFilters.featured?.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 text-xs bg-amber-100 text-amber-800 font-bold">
              {selectedFilters.featured.length}
            </Badge>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter by Featured Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={selectedFilters.featured?.includes("featured")}
            onCheckedChange={() => toggleFilter("featured", "featured")}
          >
            <span className="flex-1 font-semibold text-amber-700">★ Featured Products</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedFilters.featured?.includes("not-featured")}
            onCheckedChange={() => toggleFilter("featured", "not-featured")}
          >
            <span className="flex-1">Not Featured</span>
          </DropdownMenuCheckboxItem>
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

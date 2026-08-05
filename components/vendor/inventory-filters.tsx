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
import { Filter, X, ArrowUpDown } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface InventoryFiltersProps {
  onFilterChange: (filters: Record<string, string[]>) => void;
  onSort: (sortBy: string) => void;
}

export function InventoryFilters({ onFilterChange, onSort }: InventoryFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    status: [],
    category: [],
    warehouse: [],
  });

  const statusOptions: FilterOption[] = [
    { label: "In Stock", value: "in-stock" },
    { label: "Low Stock", value: "low-stock" },
    { label: "Out of Stock", value: "out-of-stock" },
  ];

  const categoryOptions: FilterOption[] = [
    { label: "Electronics", value: "electronics" },
    { label: "Fashion", value: "fashion" },
    { label: "Home & Living", value: "home" },
    { label: "Beauty", value: "beauty" },
    { label: "Sports", value: "sports" },
  ];

  const warehouseOptions: FilterOption[] = [
    { label: "Main Warehouse", value: "main" },
    { label: "East Warehouse", value: "east" },
    { label: "West Warehouse", value: "west" },
    { label: "Drop Shipping", value: "dropship" },
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
      {/* Stock Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-50 h-9 px-3">
          <Filter className="h-4 w-4" />
          Stock Status
          {selectedFilters.status?.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 text-xs bg-emerald-100 text-emerald-700 font-bold">
              {selectedFilters.status.length}
            </Badge>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter by Stock Status</DropdownMenuLabel>
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

      {/* Category Filter */}
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

      {/* Sort */}
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-50 h-9 px-3">
          <ArrowUpDown className="h-4 w-4" />
          Sort
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onSort("name-asc")}>
            Product Name (A-Z)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort("stock-low")}>
            Stock Quantity (Low to High)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort("stock-high")}>
            Stock Quantity (High to Low)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort("recently-updated")}>
            Recently Updated
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

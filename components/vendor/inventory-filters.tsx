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
    { label: "In Stock", value: "in-stock", count: 1089 },
    { label: "Low Stock", value: "low-stock", count: 46 },
    { label: "Out of Stock", value: "out-of-stock", count: 23 },
    { label: "Overstocked", value: "overstocked", count: 87 },
    { label: "Incoming", value: "incoming", count: 156 },
  ];

  const categoryOptions: FilterOption[] = [
    { label: "Electronics", value: "electronics", count: 345 },
    { label: "Fashion", value: "fashion", count: 456 },
    { label: "Home & Living", value: "home", count: 234 },
    { label: "Beauty", value: "beauty", count: 123 },
    { label: "Sports", value: "sports", count: 87 },
  ];

  const warehouseOptions: FilterOption[] = [
    { label: "Main Warehouse", value: "main", count: 789 },
    { label: "East Warehouse", value: "east", count: 234 },
    { label: "West Warehouse", value: "west", count: 156 },
    { label: "Drop Shipping", value: "dropship", count: 66 },
  ];

  const toggleFilter = (filterType: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[filterType] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      
      const newFilters = { ...prev, [filterType]: updated };
      onFilterChange(newFilters);
      return newFilters;
    });
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
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 text-xs bg-emerald-100 text-emerald-700">
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
              {option.count && (
                <span className="text-xs text-gray-500 ml-2">({option.count})</span>
              )}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Category Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-50 h-9 px-3">
          Category
          {selectedFilters.category?.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 text-xs bg-emerald-100 text-emerald-700">
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
              {option.count && (
                <span className="text-xs text-gray-500 ml-2">({option.count})</span>
              )}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Warehouse Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-50 h-9 px-3">
          Warehouse
          {selectedFilters.warehouse?.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 text-xs bg-emerald-100 text-emerald-700">
              {selectedFilters.warehouse.length}
            </Badge>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter by Warehouse</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {warehouseOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedFilters.warehouse?.includes(option.value)}
              onCheckedChange={() => toggleFilter("warehouse", option.value)}
            >
              <span className="flex-1">{option.label}</span>
              {option.count && (
                <span className="text-xs text-gray-500 ml-2">({option.count})</span>
              )}
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
          <DropdownMenuItem onClick={() => onSort("inventory-value")}>
            Inventory Value
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort("highest-selling")}>
            Highest Selling
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

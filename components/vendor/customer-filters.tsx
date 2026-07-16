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

interface CustomerFiltersProps {
  onFilterChange: (filters: Record<string, string[]>) => void;
  onSort: (sortBy: string) => void;
}

export function CustomerFilters({ onFilterChange, onSort }: CustomerFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    status: [],
    orders: [],
    spend: [],
  });

  const statusOptions: FilterOption[] = [
    { label: "New", value: "new", count: 156 },
    { label: "Returning", value: "returning", count: 2234 },
    { label: "VIP", value: "vip", count: 457 },
    { label: "Inactive", value: "inactive", count: 89 },
  ];

  const ordersOptions: FilterOption[] = [
    { label: "1 Order", value: "1", count: 567 },
    { label: "2-5 Orders", value: "2-5", count: 1234 },
    { label: "6-10 Orders", value: "6-10", count: 678 },
    { label: "10+ Orders", value: "10+", count: 368 },
  ];

  const spendOptions: FilterOption[] = [
    { label: "Under $100", value: "0-100", count: 789 },
    { label: "$100 - $500", value: "100-500", count: 1234 },
    { label: "$500 - $1,000", value: "500-1000", count: 567 },
    { label: "Over $1,000", value: "1000+", count: 257 },
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
      {/* Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-50 h-9 px-3">
          <Filter className="h-4 w-4" />
          Status
          {selectedFilters.status?.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 text-xs bg-emerald-100 text-emerald-700">
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
              {option.count && (
                <span className="text-xs text-gray-500 ml-2">({option.count})</span>
              )}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Total Orders Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-50 h-9 px-3">
          Orders
          {selectedFilters.orders?.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 text-xs bg-emerald-100 text-emerald-700">
              {selectedFilters.orders.length}
            </Badge>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter by Total Orders</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {ordersOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedFilters.orders?.includes(option.value)}
              onCheckedChange={() => toggleFilter("orders", option.value)}
            >
              <span className="flex-1">{option.label}</span>
              {option.count && (
                <span className="text-xs text-gray-500 ml-2">({option.count})</span>
              )}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Lifetime Spend Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-50 h-9 px-3">
          Spend
          {selectedFilters.spend?.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 text-xs bg-emerald-100 text-emerald-700">
              {selectedFilters.spend.length}
            </Badge>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter by Lifetime Spend</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {spendOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedFilters.spend?.includes(option.value)}
              onCheckedChange={() => toggleFilter("spend", option.value)}
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
          <DropdownMenuItem onClick={() => onSort("newest")}>
            Newest First
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort("highest-spend")}>
            Highest Spending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort("most-orders")}>
            Most Orders
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort("recent-purchase")}>
            Recently Purchased
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort("alphabetical")}>
            Alphabetical (A-Z)
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

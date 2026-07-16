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

interface OrderFiltersProps {
  onFilterChange: (filters: Record<string, string[]>) => void;
  onSort: (sortBy: string) => void;
}

export function OrderFilters({ onFilterChange, onSort }: OrderFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    status: [],
    payment: [],
    shipping: [],
  });

  const statusOptions: FilterOption[] = [
    { label: "New", value: "pending", count: 47 },
    { label: "Confirmed", value: "confirmed", count: 89 },
    { label: "Processing", value: "processing", count: 123 },
    { label: "Packed", value: "packed", count: 67 },
    { label: "Ready to Ship", value: "ready-to-ship", count: 89 },
    { label: "Shipped", value: "shipped", count: 234 },
    { label: "Delivered", value: "delivered", count: 1289 },
    { label: "Cancelled", value: "cancelled", count: 34 },
  ];

  const paymentOptions: FilterOption[] = [
    { label: "Paid", value: "paid", count: 1567 },
    { label: "Pending", value: "pending", count: 178 },
    { label: "Failed", value: "failed", count: 23 },
    { label: "Refunded", value: "refunded", count: 79 },
  ];

  const shippingOptions: FilterOption[] = [
    { label: "Standard", value: "standard", count: 1234 },
    { label: "Express", value: "express", count: 456 },
    { label: "Next Day", value: "next-day", count: 157 },
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
      {/* Order Status Filter */}
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

      {/* Payment Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-50 h-9 px-3">
          Payment
          {selectedFilters.payment?.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 text-xs bg-emerald-100 text-emerald-700">
              {selectedFilters.payment.length}
            </Badge>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter by Payment</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {paymentOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedFilters.payment?.includes(option.value)}
              onCheckedChange={() => toggleFilter("payment", option.value)}
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
          <DropdownMenuItem onClick={() => onSort("oldest")}>
            Oldest First
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort("amount-high")}>
            Highest Value
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort("amount-low")}>
            Lowest Value
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

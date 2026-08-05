"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Upload,
  Download,
  RefreshCw,
  MoreHorizontal,
  Grid3x3,
  List,
  ArrowUpDown,
} from "lucide-react";
import { ProductSearch } from "./product-search";
import { ProductFilters } from "./product-filters";

interface ProductToolbarProps {
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  onSearch: (query: string) => void;
  onFilterChange: (filters: Record<string, string[]>) => void;
  onAddProduct: () => void;
  onImportProducts: () => void;
  onExportProducts: () => void;
  onRefresh: () => void;
  onSort: (sortBy: string) => void;
}

export function ProductToolbar({
  viewMode,
  onViewModeChange,
  onSearch,
  onFilterChange,
  onAddProduct,
  onImportProducts,
  onExportProducts,
  onRefresh,
  onSort,
}: ProductToolbarProps) {
  return (
    <div className="space-y-4">
      {/* Main Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Left: Search */}
        <div className="flex-1">
          <ProductSearch onSearch={onSearch} />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filters */}
          <ProductFilters onFilterChange={onFilterChange} />

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
              <DropdownMenuItem onClick={() => onSort("name-asc")}>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSort("name-desc")}>
                Name (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSort("price-low")}>
                Price (Low to High)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSort("price-high")}>
                Price (High to Low)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSort("stock")}>
                Stock Level
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSort("best-selling")}>
                Best Selling
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-white">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className={`h-7 w-7 p-0 ${
                viewMode === "grid" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "hover:bg-gray-100"
              }`}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange("table")}
              className={`h-7 w-7 p-0 ${
                viewMode === "table" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "hover:bg-gray-100"
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="h-9 w-9 p-0 border-gray-200 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

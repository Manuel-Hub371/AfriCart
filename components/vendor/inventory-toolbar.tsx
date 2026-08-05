"use client";

import { Button } from "@/components/ui/button";
import { Download, Upload, RefreshCw, Plus, Settings } from "lucide-react";
import { InventorySearch } from "./inventory-search";
import { InventoryFilters } from "./inventory-filters";

interface InventoryToolbarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: Record<string, string[]>) => void;
  onAddStock: () => void;
  onExport: () => void;
  onImport: () => void;
  onAdjustment: () => void;
  onRefresh: () => void;
  onSort: (sortBy: string) => void;
}

export function InventoryToolbar({
  onSearch,
  onFilterChange,
  onAddStock,
  onExport,
  onImport,
  onAdjustment,
  onRefresh,
  onSort,
}: InventoryToolbarProps) {
  return (
    <div className="space-y-4">
      {/* Main Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Left: Search */}
        <div className="flex-1">
          <InventorySearch onSearch={onSearch} />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filters */}
          <InventoryFilters onFilterChange={onFilterChange} onSort={onSort} />

          {/* Stock Adjustment */}
          <Button
            variant="outline"
            size="sm"
            onClick={onAdjustment}
            className="h-9 px-3 border-gray-200 hover:bg-gray-50"
          >
            <Settings className="h-4 w-4 mr-2" />
            Adjust
          </Button>

          {/* Import */}
          <Button
            variant="outline"
            size="sm"
            onClick={onImport}
            className="h-9 px-3 border-gray-200 hover:bg-gray-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>

          {/* Export */}
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="h-9 px-3 border-gray-200 hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

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

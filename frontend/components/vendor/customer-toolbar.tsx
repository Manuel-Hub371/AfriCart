"use client";

import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Send } from "lucide-react";
import { CustomerSearch } from "./customer-search";
import { CustomerFilters } from "./customer-filters";

interface CustomerToolbarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: Record<string, string[]>) => void;
  onExport: () => void;
  onRefresh: () => void;
  onSort: (sortBy: string) => void;
  onSendPromotion?: () => void;
}

export function CustomerToolbar({
  onSearch,
  onFilterChange,
  onExport,
  onRefresh,
  onSort,
  onSendPromotion,
}: CustomerToolbarProps) {
  return (
    <div className="space-y-4">
      {/* Main Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Left: Search */}
        <div className="flex-1">
          <CustomerSearch onSearch={onSearch} />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filters */}
          <CustomerFilters onFilterChange={onFilterChange} onSort={onSort} />

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

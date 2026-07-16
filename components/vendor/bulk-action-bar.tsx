"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  CheckCircle, 
  XCircle, 
  Archive, 
  Trash2, 
  Copy, 
  Tag, 
  Percent,
  Download,
  ChevronDown,
  X
} from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onAction: (action: string) => void;
}

export function BulkActionBar({ 
  selectedCount, 
  onClearSelection,
  onAction 
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl shadow-2xl border border-gray-700 px-6 py-4 flex items-center gap-4 backdrop-blur-sm">
        {/* Selection Count */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">
              {selectedCount} {selectedCount === 1 ? "product" : "products"}
            </p>
            <p className="text-xs text-gray-400">selected</p>
          </div>
        </div>

        <div className="h-10 w-px bg-gray-700"></div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-9 text-white hover:bg-white/10 hover:text-white"
            onClick={() => onAction("publish")}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Publish
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="h-9 text-white hover:bg-white/10 hover:text-white"
            onClick={() => onAction("unpublish")}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Unpublish
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="h-9 text-white hover:bg-white/10 hover:text-white"
            onClick={() => onAction("duplicate")}
          >
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>

          {/* More Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-white hover:bg-white/10 hover:text-white h-9 px-3">
              More
              <ChevronDown className="h-4 w-4 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onAction("archive")}>
                <Archive className="h-4 w-4 mr-2" />
                Archive Products
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction("assign-category")}>
                <Tag className="h-4 w-4 mr-2" />
                Assign Category
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction("apply-discount")}>
                <Percent className="h-4 w-4 mr-2" />
                Apply Discount
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction("export")}>
                <Download className="h-4 w-4 mr-2" />
                Export Selected
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onAction("delete")}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Products
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="h-10 w-px bg-gray-700"></div>

        {/* Clear Selection */}
        <Button
          size="sm"
          variant="ghost"
          className="h-9 w-9 p-0 text-white hover:bg-white/10 hover:text-white"
          onClick={onClearSelection}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

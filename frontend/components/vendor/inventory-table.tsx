"use client";

import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { InventoryStatusBadge, InventoryStatus } from "./inventory-status-badge";
import { Eye, ArrowUpDown, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  variant: string;
  category: string;
  warehouse: string;
  availableStock: number;
  reservedStock: number;
  incomingStock: number;
  reorderLevel: number;
  inventoryValue: number;
  status: InventoryStatus;
  lastUpdated: string;
  image: string;
}

interface InventoryTableProps {
  items: InventoryItem[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelect: (id: string) => void;
  onViewItem: (item: InventoryItem) => void;
  onSort: (column: string) => void;
}

export function InventoryTable({
  items,
  selectedIds,
  onSelectAll,
  onSelect,
  onViewItem,
  onSort,
}: InventoryTableProps) {
  const allSelected = items.length > 0 && selectedIds.length === items.length;

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b-2 border-gray-200">
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                aria-label="Select all items"
              />
            </TableHead>
            <TableHead className="font-semibold text-gray-900">Product</TableHead>
            <TableHead className="font-semibold text-gray-900">SKU</TableHead>
            <TableHead className="font-semibold text-gray-900">Variant</TableHead>
            <TableHead className="font-semibold text-gray-900">Category</TableHead>
            <TableHead className="font-semibold text-gray-900">Warehouse</TableHead>
            <TableHead className="font-semibold text-gray-900">
              <button
                onClick={() => onSort("available")}
                className="flex items-center gap-1 hover:text-emerald-600"
              >
                Available
                <ArrowUpDown className="h-3.5 w-3.5" />
              </button>
            </TableHead>
            <TableHead className="font-semibold text-gray-900">Reserved</TableHead>
            <TableHead className="font-semibold text-gray-900">Incoming</TableHead>
            <TableHead className="font-semibold text-gray-900">Reorder Level</TableHead>
            <TableHead className="font-semibold text-gray-900">
              <button
                onClick={() => onSort("value")}
                className="flex items-center gap-1 hover:text-emerald-600"
              >
                Value
                <ArrowUpDown className="h-3.5 w-3.5" />
              </button>
            </TableHead>
            <TableHead className="font-semibold text-gray-900">Status</TableHead>
            <TableHead className="font-semibold text-gray-900">Last Updated</TableHead>
            <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const isLowStock = item.availableStock <= item.reorderLevel;

            return (
              <TableRow
                key={item.id}
                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                  isSelected ? "bg-emerald-50/50" : ""
                }`}
              >
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => onSelect(item.id)}
                    aria-label={`Select ${item.productName}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{item.productName}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 font-mono text-sm">
                  {item.sku}
                </TableCell>
                <TableCell className="text-gray-700 text-sm">
                  {item.variant || "-"}
                </TableCell>
                <TableCell className="text-gray-700 text-sm">
                  {item.category}
                </TableCell>
                <TableCell className="text-gray-700 text-sm">
                  {item.warehouse}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${
                      isLowStock ? "text-yellow-700" : "text-gray-900"
                    }`}>
                      {item.availableStock}
                    </span>
                    {isLowStock && (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-gray-700">{item.reservedStock}</span>
                </TableCell>
                <TableCell>
                  <span className="text-blue-700 font-medium">{item.incomingStock}</span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-500 text-sm">{item.reorderLevel}</span>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-gray-900">
                    ${item.inventoryValue.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <InventoryStatusBadge status={item.status} />
                </TableCell>
                <TableCell className="text-gray-600 text-sm">
                  {item.lastUpdated}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewItem(item)}
                    className="h-8 w-8 p-0 hover:bg-emerald-50 hover:text-emerald-600"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

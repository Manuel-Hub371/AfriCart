import { Button } from "@/components/ui/button";
import { Package, RefreshCw, Upload, Plus } from "lucide-react";

interface InventoryEmptyStateProps {
  onRefresh: () => void;
  onAddProduct: () => void;
  onImport: () => void;
}

export function InventoryEmptyState({ onRefresh, onAddProduct, onImport }: InventoryEmptyStateProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="h-10 w-10 text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Inventory Records Found
        </h3>
        <p className="text-gray-600 mb-6">
          Start managing your inventory by adding products or importing your existing catalog.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={onRefresh}
            className="border-gray-200 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={onImport}
            className="border-gray-200 hover:bg-gray-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button
            onClick={onAddProduct}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Package, Plus, Upload } from "lucide-react";

interface ProductEmptyStateProps {
  onAddProduct: () => void;
  onImportProducts: () => void;
}

export function ProductEmptyState({ onAddProduct, onImportProducts }: ProductEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
        <Package className="h-12 w-12 text-emerald-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Yet</h3>
      <p className="text-gray-600 text-center max-w-md mb-8">
        Start selling by creating your first product or import products from your existing catalog.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onAddProduct}
          className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Your First Product
        </Button>
        <Button
          onClick={onImportProducts}
          variant="outline"
          className="h-12 px-6 rounded-lg border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
        >
          <Upload className="h-5 w-5 mr-2" />
          Import Products
        </Button>
      </div>
    </div>
  );
}

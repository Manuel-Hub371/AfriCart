import { Package, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Package className="h-12 w-12 text-gray-400" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        No Products Found
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        We couldn't find any products matching your filters. Try adjusting your search criteria or browse our categories.
      </p>
      
      <Button className="gap-2">
        <X className="h-4 w-4" />
        Clear Filters
      </Button>
    </div>
  );
}

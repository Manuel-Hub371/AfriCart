import { Button } from "@/components/ui/button";
import { MessageSquare, RefreshCw, Package } from "lucide-react";

interface ReviewEmptyStateProps {
  onRefresh: () => void;
  onViewProducts: () => void;
}

export function ReviewEmptyState({ onRefresh, onViewProducts }: ReviewEmptyStateProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="h-10 w-10 text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Reviews Yet
        </h3>
        <p className="text-gray-600 mb-6">
          You haven't received any customer reviews yet. Reviews will appear here once customers start reviewing your products.
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
            onClick={onViewProducts}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Package className="h-4 w-4 mr-2" />
            View Products
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Users, RefreshCw } from "lucide-react";

interface CustomerEmptyStateProps {
  onRefresh: () => void;
  onClearFilters: () => void;
}

export function CustomerEmptyState({ onRefresh, onClearFilters }: CustomerEmptyStateProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="h-10 w-10 text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Customers Found
        </h3>
        <p className="text-gray-600 mb-6">
          There are no customers matching your current filters. Try adjusting your search or clearing filters.
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
            onClick={onClearFilters}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

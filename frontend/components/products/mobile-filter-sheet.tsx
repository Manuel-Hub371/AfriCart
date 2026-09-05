"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetBody,
} from "@/components/ui/sheet";
import { FilterSidebar } from "./filter-sidebar";

interface MobileFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: any[];
  selectedCategories: string[];
  onCategoryToggle: (catSlug: string) => void;
  selectedRating?: number;
  onRatingSelect: (rating: number | undefined) => void;
  minPrice?: number;
  maxPrice?: number;
  onPriceChange: (min?: number, max?: number) => void;
  onClearAll: () => void;
  resultsCount: number;
}

export function MobileFilterSheet({
  open,
  onOpenChange,
  categories,
  selectedCategories,
  onCategoryToggle,
  selectedRating,
  onRatingSelect,
  minPrice,
  maxPrice,
  onPriceChange,
  onClearAll,
  resultsCount,
}: MobileFilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
          <SheetClose onClick={() => onOpenChange(false)} />
        </SheetHeader>
        <SheetBody className="p-4 overflow-y-auto">
          <FilterSidebar
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryToggle={onCategoryToggle}
            selectedRating={selectedRating}
            onRatingSelect={onRatingSelect}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={onPriceChange}
            onClearAll={onClearAll}
          />
        </SheetBody>
        <div className="p-4 border-t bg-white flex gap-3 shadow-lg">
          <Button
            variant="outline"
            className="flex-1 rounded-xl text-xs font-bold"
            onClick={() => {
              onClearAll();
              onOpenChange(false);
            }}
          >
            Clear All
          </Button>
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
            onClick={() => onOpenChange(false)}
          >
            Show {resultsCount} Products
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

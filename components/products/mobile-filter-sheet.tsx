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
}

export function MobileFilterSheet({ open, onOpenChange }: MobileFilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetClose onClick={() => onOpenChange(false)} />
        </SheetHeader>
        <SheetBody>
          <FilterSidebar />
        </SheetBody>
        <div className="p-6 border-t bg-white">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Clear All
            </Button>
            <Button className="flex-1" onClick={() => onOpenChange(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

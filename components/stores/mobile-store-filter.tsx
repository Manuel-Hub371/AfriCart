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
import { StoreFilter } from "./store-filter";

interface MobileStoreFilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileStoreFilter({ open, onOpenChange }: MobileStoreFilterProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Store Filters</SheetTitle>
          <SheetClose onClick={() => onOpenChange(false)} />
        </SheetHeader>
        <SheetBody>
          <StoreFilter />
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

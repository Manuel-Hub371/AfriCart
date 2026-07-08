"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface FilterSection {
  title: string;
  isOpen: boolean;
}

export function FilterSidebar() {
  const [sections, setSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    rating: true,
    vendor: false,
    brand: false,
    availability: false,
    discount: false,
  });

  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });

  const toggleSection = (section: string) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const FilterSection = ({
    title,
    id,
    children,
  }: {
    title: string;
    id: string;
    children: React.ReactNode;
  }) => (
    <div className="border-b pb-4">
      <button
        onClick={() => toggleSection(id)}
        className="flex items-center justify-between w-full py-3"
      >
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {sections[id] ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {sections[id] && <div className="space-y-3 pt-2">{children}</div>}
    </div>
  );

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        <Button variant="ghost" size="sm" className="text-primary">
          Clear All
        </Button>
      </div>

      {/* Categories */}
      <FilterSection title="Categories" id="category">
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <div>
            <Checkbox id="cat-electronics" label="Electronics" />
            <div className="ml-6 mt-2 space-y-2 text-sm">
              <Checkbox id="cat-phones" label="Phones (234)" />
              <Checkbox id="cat-laptops" label="Laptops (120)" />
              <Checkbox id="cat-cameras" label="Cameras (80)" />
            </div>
          </div>
          <Checkbox id="cat-fashion" label="Fashion" />
          <Checkbox id="cat-home" label="Home & Living" />
          <Checkbox id="cat-beauty" label="Beauty" />
          <Checkbox id="cat-sports" label="Sports" />
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" id="price">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: Number(e.target.value) })
              }
            />
            <Input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: Number(e.target.value) })
              }
            />
          </div>
          <Slider
            min={0}
            max={5000}
            step={10}
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange({ ...priceRange, max: Number(e.target.value) })
            }
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange.min}</span>
            <span>${priceRange.max}</span>
          </div>
        </div>
      </FilterSection>

      {/* Customer Rating */}
      <FilterSection title="Customer Rating" id="rating">
        <div className="space-y-2">
          <Checkbox id="rating-5" label="★★★★★ 5 stars" />
          <Checkbox id="rating-4" label="★★★★☆ 4+ stars" />
          <Checkbox id="rating-3" label="★★★☆☆ 3+ stars" />
          <Checkbox id="rating-2" label="★★☆☆☆ 2+ stars" />
          <Checkbox id="rating-1" label="★☆☆☆☆ 1+ stars" />
        </div>
      </FilterSection>

      {/* Vendor */}
      <FilterSection title="Vendor" id="vendor">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox id="vendor-1" />
            <label htmlFor="vendor-1" className="flex items-center gap-1 text-sm">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Tech World</span>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="vendor-2" />
            <label htmlFor="vendor-2" className="flex items-center gap-1 text-sm">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Fashion Hub</span>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="vendor-3" />
            <label htmlFor="vendor-3" className="flex items-center gap-1 text-sm">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Home Store</span>
            </label>
          </div>
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand" id="brand">
        <div className="space-y-2">
          <Checkbox id="brand-apple" label="Apple" />
          <Checkbox id="brand-samsung" label="Samsung" />
          <Checkbox id="brand-nike" label="Nike" />
          <Checkbox id="brand-adidas" label="Adidas" />
          <Checkbox id="brand-sony" label="Sony" />
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability" id="availability">
        <div className="space-y-2">
          <Checkbox id="avail-stock" label="In Stock" />
          <Checkbox id="avail-out" label="Out of Stock" />
          <Checkbox id="avail-delivery" label="Available for Delivery" />
        </div>
      </FilterSection>

      {/* Discount */}
      <FilterSection title="Discount" id="discount">
        <div className="space-y-2">
          <Checkbox id="disc-sale" label="On Sale" />
          <Checkbox id="disc-10" label="10% or more" />
          <Checkbox id="disc-25" label="25% or more" />
          <Checkbox id="disc-50" label="50% or more" />
        </div>
      </FilterSection>
    </div>
  );
}

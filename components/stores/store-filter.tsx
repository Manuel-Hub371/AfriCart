"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export function StoreFilter() {
  const [sections, setSections] = useState<Record<string, boolean>>({
    category: true,
    rating: true,
    status: true,
    location: false,
    type: false,
  });

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
      {sections[id] && <div className="space-y-2 pt-2">{children}</div>}
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

      {/* Store Category */}
      <FilterSection title="Store Category" id="category">
        <div className="space-y-2">
          <Checkbox id="cat-electronics" label="Electronics" />
          <Checkbox id="cat-fashion" label="Fashion" />
          <Checkbox id="cat-beauty" label="Beauty" />
          <Checkbox id="cat-home" label="Home & Furniture" />
          <Checkbox id="cat-sports" label="Sports" />
          <Checkbox id="cat-food" label="Food" />
          <Checkbox id="cat-automotive" label="Automotive" />
          <Checkbox id="cat-books" label="Books & Education" />
        </div>
      </FilterSection>

      {/* Store Rating */}
      <FilterSection title="Store Rating" id="rating">
        <div className="space-y-2">
          <Checkbox id="rating-5" label="★★★★★ 5 stars" />
          <Checkbox id="rating-4" label="★★★★ 4+ stars" />
          <Checkbox id="rating-3" label="★★★ 3+ stars" />
        </div>
      </FilterSection>

      {/* Seller Status */}
      <FilterSection title="Seller Status" id="status">
        <div className="space-y-2">
          <Checkbox id="status-verified" label="Verified Sellers" />
          <Checkbox id="status-top" label="Top Sellers" />
          <Checkbox id="status-new" label="New Sellers" />
        </div>
      </FilterSection>

      {/* Location */}
      <FilterSection title="Location" id="location">
        <div className="space-y-2">
          <Checkbox id="loc-usa" label="United States" />
          <Checkbox id="loc-uk" label="United Kingdom" />
          <Checkbox id="loc-ghana" label="Ghana" />
          <Checkbox id="loc-nigeria" label="Nigeria" />
          <Checkbox id="loc-kenya" label="Kenya" />
        </div>
      </FilterSection>

      {/* Store Type */}
      <FilterSection title="Store Type" id="type">
        <div className="space-y-2">
          <Checkbox id="type-brand" label="Brand Store" />
          <Checkbox id="type-individual" label="Individual Seller" />
          <Checkbox id="type-business" label="Business Store" />
        </div>
      </FilterSection>
    </div>
  );
}

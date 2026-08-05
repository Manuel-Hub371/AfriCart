"use client";

import { useState, useEffect } from "react";

export interface VariantItem {
  id: string;
  sku?: string | null;
  price?: number | null;
  compareAtPrice?: number | null;
  stock: number;
  attributes: Record<string, string>; // e.g. { Color: "Black", Size: "L", Material: "Cotton" }
  images?: string[] | null;
  weight?: number | null;
}

interface ProductVariantsProps {
  variants: VariantItem[];
  onVariantSelect: (variant: VariantItem | null) => void;
}

export function ProductVariants({ variants = [], onVariantSelect }: ProductVariantsProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  // Extract unique attribute keys across all variants (Color, Size, Material, Style, Capacity, Storage, Weight, etc.)
  const attributeKeys: string[] = Array.from(
    new Set(variants.flatMap((v) => Object.keys(v.attributes || {})))
  );

  // Group unique option values for each key
  const attributeOptions: Record<string, string[]> = {};
  attributeKeys.forEach((key) => {
    attributeOptions[key] = Array.from(
      new Set(variants.map((v) => v.attributes?.[key]).filter(Boolean))
    );
  });

  // Auto-select first variant on initial load
  useEffect(() => {
    if (variants.length > 0 && Object.keys(selectedAttributes).length === 0) {
      const defaultVariant = variants[0];
      if (defaultVariant?.attributes) {
        setSelectedAttributes(defaultVariant.attributes);
        onVariantSelect(defaultVariant);
      }
    }
  }, [variants]);

  const handleSelectAttribute = (key: string, value: string) => {
    const updated = { ...selectedAttributes, [key]: value };
    setSelectedAttributes(updated);

    // Find matching variant
    const matched = variants.find((v) => {
      return Object.entries(updated).every(
        ([k, val]) => v.attributes?.[k] === val
      );
    });

    onVariantSelect(matched || null);
  };

  if (variants.length === 0 || attributeKeys.length === 0) return null;

  return (
    <div className="space-y-5 py-4 border-y border-gray-100 my-4">
      {attributeKeys.map((key) => {
        const options = attributeOptions[key] || [];
        const currentSelected = selectedAttributes[key];

        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-gray-700 tracking-wider">
                {key}:{" "}
                <span className="text-emerald-700 font-extrabold normal-case">
                  {currentSelected || "Select option"}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {options.map((option) => {
                const isSelected = currentSelected === option;

                // Color swatch handling
                const isColor = key.toLowerCase() === "color";
                
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelectAttribute(key, option)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm ring-2 ring-emerald-200"
                        : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    {isColor && (
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-2 border border-gray-300 align-middle"
                        style={{ backgroundColor: option.toLowerCase() }}
                      />
                    )}
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

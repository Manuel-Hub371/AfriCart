"use client";

import { useState } from "react";

interface Variant {
  name: string;
  options: string[];
}

interface ProductVariantsProps {
  variants: Variant[];
}

export function ProductVariants({ variants }: ProductVariantsProps) {
  const [selected, setSelected] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6 py-6">
      {variants.map((variant) => (
        <div key={variant.name}>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            {variant.name}:{" "}
            <span className="text-gray-600 font-normal">
              {selected[variant.name] || "Select"}
            </span>
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {variant.options.map((option) => {
              const isSelected = selected[variant.name] === option;
              
              return (
                <button
                  key={option}
                  onClick={() =>
                    setSelected((prev) => ({ ...prev, [variant.name]: option }))
                  }
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

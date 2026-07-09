"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface Variant {
  id: string;
  option: string;
  values: string[];
}

export default function VariantManager() {
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: Date.now().toString(),
        option: "",
        values: [""],
      },
    ]);
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const addValue = (variantId: string) => {
    setVariants(
      variants.map((v) =>
        v.id === variantId ? { ...v, values: [...v.values, ""] } : v
      )
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Product Variants</h2>
          <p className="text-sm text-gray-600 mt-1">
            Add variants like size, color, or material
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hasVariants}
            onChange={(e) => setHasVariants(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-700">This product has variants</span>
        </div>
      </div>

      {hasVariants && (
        <div className="space-y-6">
          {variants.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-gray-600 mb-4">No variants added yet</p>
              <Button onClick={addVariant} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Variant Option
              </Button>
            </div>
          ) : (
            <>
              {variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Option Name
                      </label>
                      <Input
                        placeholder="e.g., Size, Color, Material"
                        defaultValue={variant.option}
                      />
                    </div>
                    <button
                      onClick={() => removeVariant(variant.id)}
                      className="mt-8 p-2 hover:bg-red-50 rounded text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Option Values
                    </label>
                    <div className="space-y-2">
                      {variant.values.map((value, valueIndex) => (
                        <Input
                          key={valueIndex}
                          placeholder="e.g., Small, Blue, Cotton"
                          defaultValue={value}
                        />
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addValue(variant.id)}
                      className="mt-2 gap-2"
                    >
                      <Plus className="h-3 w-3" />
                      Add Value
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={addVariant}
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Another Option
              </Button>

              {/* Variant Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Preview: This will create combinations
                </p>
                <p className="text-xs text-gray-600">
                  Variants will be auto-generated based on your options
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  );
}

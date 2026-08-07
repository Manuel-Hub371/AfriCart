"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, X } from "lucide-react";

export interface VariantOptionGroup {
  id: string;
  name: string;
  values: string[];
}

export interface GeneratedVariant {
  sku?: string;
  price?: number;
  stock?: number;
  attributes: Record<string, string>;
}

interface VariantManagerProps {
  basePrice?: number;
  baseStock?: number;
  initialVariants?: GeneratedVariant[];
  onVariantsChange?: (variants: GeneratedVariant[]) => void;
}

export default function VariantManager({
  basePrice = 0,
  baseStock = 0,
  initialVariants = [],
  onVariantsChange,
}: VariantManagerProps) {
  const [hasVariants, setHasVariants] = useState(false);
  const [groups, setGroups] = useState<VariantOptionGroup[]>([]);
  // Track raw comma-input per group id
  const [inputMap, setInputMap] = useState<Record<string, string>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize option groups from initialVariants on mount/load
  useEffect(() => {
    if (initialVariants && initialVariants.length > 0 && !isInitialized) {
      const groupMap: Record<string, Set<string>> = {};
      initialVariants.forEach((v) => {
        const attrs = v.attributes || (v as any).options || {};
        if (attrs && typeof attrs === "object") {
          Object.entries(attrs).forEach(([attrName, attrVal]) => {
            if (attrName && attrVal) {
              if (!groupMap[attrName]) {
                groupMap[attrName] = new Set();
              }
              groupMap[attrName].add(String(attrVal));
            }
          });
        }
      });

      const parsedGroups: VariantOptionGroup[] = Object.entries(groupMap).map(([name, valSet], idx) => ({
        id: `init-${idx}-${name}`,
        name,
        values: Array.from(valSet),
      }));

      if (parsedGroups.length > 0) {
        setHasVariants(true);
        setGroups(parsedGroups);
      }
      setIsInitialized(true);
    }
  }, [initialVariants, isInitialized]);

  const addGroup = () => {
    const id = Date.now().toString();
    setGroups((prev) => [...prev, { id, name: "", values: [] }]);
    setInputMap((prev) => ({ ...prev, [id]: "" }));
  };

  const removeGroup = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
    setInputMap((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const updateGroupName = (id: string, name: string) => {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, name } : g)));
  };

  // Parse comma-separated input into individual values on Enter or comma
  const handleValuesInput = (groupId: string, raw: string) => {
    setInputMap((prev) => ({ ...prev, [groupId]: raw }));
  };

  // When user types a comma or presses Enter, flush pending tokens into the values array
  const handleValuesKeyDown = (groupId: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const raw = inputMap[groupId] ?? "";
      const tokens = raw
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      if (tokens.length === 0) return;

      setGroups((prev) =>
        prev.map((g) => {
          if (g.id !== groupId) return g;
          const existing = new Set(g.values);
          const newVals = tokens.filter((t) => !existing.has(t));
          return { ...g, values: [...g.values, ...newVals] };
        })
      );
      setInputMap((prev) => ({ ...prev, [groupId]: "" }));
    }
  };

  // Allow pasting comma-separated list
  const handleValuesPaste = (groupId: string, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const tokens = pasted
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const existing = new Set(g.values);
        const newVals = tokens.filter((t) => !existing.has(t));
        return { ...g, values: [...g.values, ...newVals] };
      })
    );
    setInputMap((prev) => ({ ...prev, [groupId]: "" }));
  };

  const removeValue = (groupId: string, value: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return { ...g, values: g.values.filter((v) => v !== value) };
      })
    );
  };

  // Generate Cartesian Product of all valid groups
  useEffect(() => {
    if (!hasVariants) {
      onVariantsChange?.([]);
      return;
    }

    const validGroups = groups
      .map((g) => ({
        name: g.name.trim(),
        values: g.values.map((v) => v.trim()).filter(Boolean),
      }))
      .filter((g) => g.name && g.values.length > 0);

    if (validGroups.length === 0) {
      onVariantsChange?.([]);
      return;
    }

    const combinations: Record<string, string>[] = validGroups.reduce<Record<string, string>[]>(
      (acc, group) => {
        const res: Record<string, string>[] = [];
        acc.forEach((existing) => {
          group.values.forEach((val) => {
            res.push({ ...existing, [group.name]: val });
          });
        });
        return res;
      },
      [{}]
    );

    const generated: GeneratedVariant[] = combinations.map((attrs, idx) => ({
      sku: `VAR-${idx + 1}`,
      price: basePrice,
      stock: baseStock,
      attributes: attrs,
    }));

    onVariantsChange?.(generated);
  }, [hasVariants, groups, basePrice, baseStock, onVariantsChange]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Product Variants</h2>
          <p className="text-sm text-gray-600 mt-1">
            Add option groups like Color, Size, Material, Storage, Capacity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="hasVariants"
            checked={hasVariants}
            onChange={(e) => setHasVariants(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
          <label htmlFor="hasVariants" className="text-sm font-bold text-gray-700 cursor-pointer">
            This product has variants
          </label>
        </div>
      </div>

      {hasVariants && (
        <div className="space-y-6">
          {groups.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
              <p className="text-gray-600 mb-4 text-sm font-medium">No variant options configured yet</p>
              <Button type="button" onClick={addGroup} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4" />
                Add Variant Option
              </Button>
            </div>
          ) : (
            <>
              {groups.map((group) => (
                <div key={group.id} className="border border-gray-200 rounded-2xl p-4 space-y-4 bg-white shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                        Option Name
                      </label>
                      <Input
                        placeholder="e.g., Color, Size, Material, Storage"
                        value={group.name}
                        onChange={(e) => updateGroupName(group.id, e.target.value)}
                        className="h-10 text-sm font-medium"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGroup(group.id)}
                      className="mt-6 p-2 hover:bg-red-50 rounded-xl text-red-600 transition-colors"
                      title="Delete Option"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                      Option Values
                    </label>
                    <p className="text-[11px] text-gray-500 mb-2">
                      Type a value and press <kbd className="px-1 py-0.5 bg-gray-100 border rounded text-[10px]">Enter</kbd> or <kbd className="px-1 py-0.5 bg-gray-100 border rounded text-[10px]">,</kbd> to add. You can also paste a comma-separated list.
                    </p>

                    {/* Tag Pills */}
                    {group.values.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {group.values.map((val) => (
                          <Badge
                            key={val}
                            variant="secondary"
                            className="flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold pr-1"
                          >
                            {val}
                            <button
                              type="button"
                              onClick={() => removeValue(group.id, val)}
                              className="ml-0.5 hover:text-red-600 rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Comma-separated input */}
                    <Input
                      placeholder='e.g., Red, Blue, Green — or type one at a time'
                      value={inputMap[group.id] ?? ""}
                      onChange={(e) => handleValuesInput(group.id, e.target.value)}
                      onKeyDown={(e) => handleValuesKeyDown(group.id, e)}
                      onPaste={(e) => handleValuesPaste(group.id, e)}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addGroup}
                className="w-full gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                <Plus className="h-4 w-4" />
                Add Another Option Group
              </Button>
            </>
          )}
        </div>
      )}
    </Card>
  );
}

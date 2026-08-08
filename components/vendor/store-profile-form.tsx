"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OFFICIAL_STORE_CATEGORIES, mapLegacyCategoryToOfficialSlug } from "@/lib/constants/store-categories";
import { OFFICIAL_BUSINESS_TYPES } from "@/lib/constants/business-types";

interface StoreProfileFormProps {
  onSave: (data: any) => void;
  initialData?: any;
}

export function StoreProfileForm({ onSave, initialData }: StoreProfileFormProps) {
  const [storeName, setStoreName] = useState(initialData?.name || "");
  const [storeDescription, setStoreDescription] = useState(initialData?.description || "");
  const [selectedCategorySlugs, setSelectedCategorySlugs] = useState<string[]>([]);
  const [businessType, setBusinessType] = useState(initialData?.businessType || "Retailer");
  const [storeStatus, setStoreStatus] = useState(initialData?.status === "INACTIVE" ? "inactive" : "active");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setStoreName(initialData.name || "");
      setStoreDescription(initialData.description || "");
      setBusinessType(initialData.businessType || "Retailer");
      setStoreStatus(initialData.status === "INACTIVE" ? "inactive" : "active");

      // Initialize selected category slugs
      if (Array.isArray(initialData.categorySlugs) && initialData.categorySlugs.length > 0) {
        setSelectedCategorySlugs(initialData.categorySlugs);
      } else if (Array.isArray(initialData.categories) && initialData.categories.length > 0) {
        setSelectedCategorySlugs(initialData.categories.map((c: any) => c.slug || c.id));
      } else if (initialData.category) {
        setSelectedCategorySlugs([mapLegacyCategoryToOfficialSlug(initialData.category)]);
      } else {
        setSelectedCategorySlugs(["electronics-gadget"]);
      }
    }
  }, [initialData]);

  const toggleCategory = (slug: string) => {
    setSelectedCategorySlugs((prev) => {
      if (prev.includes(slug)) {
        if (prev.length === 1) return prev; // At least 1 required
        return prev.filter((s) => s !== slug);
      } else {
        return [...prev, slug];
      }
    });
  };

  const characterLimit = 500;
  const remainingChars = characterLimit - storeDescription.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategorySlugs.length === 0) return;
    setIsSubmitting(true);
    await onSave({
      name: storeName,
      description: storeDescription,
      categorySlugs: selectedCategorySlugs,
      categories: selectedCategorySlugs,
      businessType,
      status: storeStatus === "active" ? "ACTIVE" : "INACTIVE",
    });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Store Profile</h2>
          <p className="text-gray-600 text-sm">Manage your public store information and identity</p>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || selectedCategorySlugs.length === 0}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 h-11 rounded-xl"
        >
          {isSubmitting ? "Saving..." : "Save Store Profile"}
        </Button>
      </div>

      {/* Store Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          required
          className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
          placeholder="Enter your store name"
        />
        <p className="text-xs text-gray-500 mt-1">This is how customers will see your store on AfriCart</p>
      </div>

      {/* Store Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={storeDescription}
          onChange={(e) => setStoreDescription(e.target.value)}
          maxLength={characterLimit}
          rows={5}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-sm"
          placeholder="Describe your store and products..."
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">Tell customers what makes your store special</p>
          <p className={`text-xs font-medium ${remainingChars < 50 ? "text-red-600" : "text-gray-500"}`}>
            {remainingChars} characters remaining
          </p>
        </div>
      </div>

      {/* Store Categories - Multi-Select */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-900">
            Store Categories <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            You can select multiple categories
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Select all categories that apply to your store business to help customers discover your store:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
          {OFFICIAL_STORE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategorySlugs.includes(cat.slug);
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => toggleCategory(cat.slug)}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20 shadow-sm"
                    : "bg-white border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer pointer-events-none"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold leading-tight mb-0.5">{cat.name}</p>
                  <p className="text-[11px] text-gray-500 line-clamp-2 leading-normal">{cat.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Business Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Type <span className="text-red-500">*</span>
        </label>
        <select
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
        >
          {OFFICIAL_BUSINESS_TYPES.map((bt) => (
            <option key={bt.value} value={bt.value}>
              {bt.name}
            </option>
          ))}
        </select>
      </div>

      {/* Store Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Status
        </label>
        <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">Your storefront status</p>
            <Badge 
              className={
                storeStatus === "active" 
                  ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                  : "bg-gray-100 text-gray-700 border-gray-200"
              }
            >
              {storeStatus === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={storeStatus === "active"}
              onChange={(e) => setStoreStatus(e.target.checked ? "active" : "inactive")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>

      {/* Preview */}
      <div className="p-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
        <p className="text-sm font-medium text-gray-700 mb-4">Customer Preview</p>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{storeName || "Your Store Name"}</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {storeDescription || "Your store description will appear here..."}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {OFFICIAL_STORE_CATEGORIES.filter((c) => selectedCategorySlugs.includes(c.slug)).map((c) => (
              <Badge key={c.slug} className="bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold text-xs">
                {c.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}

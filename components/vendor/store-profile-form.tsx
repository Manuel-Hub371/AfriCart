"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StoreProfileFormProps {
  onSave: (data: any) => void;
  initialData?: any;
}

export function StoreProfileForm({ onSave, initialData }: StoreProfileFormProps) {
  const [storeName, setStoreName] = useState(initialData?.name || "");
  const [storeDescription, setStoreDescription] = useState(initialData?.description || "");
  const [storeCategory, setStoreCategory] = useState(initialData?.category || "electronics");
  const [storeStatus, setStoreStatus] = useState(initialData?.status === "INACTIVE" ? "inactive" : "active");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setStoreName(initialData.name || "");
      setStoreDescription(initialData.description || "");
      setStoreCategory(initialData.category || "electronics");
      setStoreStatus(initialData.status === "INACTIVE" ? "inactive" : "active");
    }
  }, [initialData]);

  const characterLimit = 500;
  const remainingChars = characterLimit - storeDescription.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave({
      name: storeName,
      description: storeDescription,
      category: storeCategory,
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
          disabled={isSubmitting}
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

      {/* Store Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Primary Category <span className="text-red-500">*</span>
        </label>
        <select
          value={storeCategory}
          onChange={(e) => setStoreCategory(e.target.value)}
          className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
        >
          <option value="electronics">Electronics & Gadgets</option>
          <option value="fashion">Fashion & Apparel</option>
          <option value="home">Home & Living</option>
          <option value="beauty">Beauty & Personal Care</option>
          <option value="sports">Sports & Fitness</option>
          <option value="books">Books & Education</option>
          <option value="food">Food & Groceries</option>
          <option value="automotive">Automotive</option>
          <option value="other">General Marketplace</option>
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
          <p className="text-sm text-gray-600 leading-relaxed">
            {storeDescription || "Your store description will appear here..."}
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge variant="outline">{storeCategory}</Badge>
          </div>
        </div>
      </div>
    </form>
  );
}

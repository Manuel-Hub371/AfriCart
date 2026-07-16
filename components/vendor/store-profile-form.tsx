"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface StoreProfileFormProps {
  onSave: (data: any) => void;
}

export function StoreProfileForm({ onSave }: StoreProfileFormProps) {
  const [storeName, setStoreName] = useState("AfriCart Electronics");
  const [storeDescription, setStoreDescription] = useState("Premium electronics and gadgets for the modern lifestyle. We offer the latest technology products with fast shipping and excellent customer service.");
  const [storeCategory, setStoreCategory] = useState("electronics");
  const [storeType, setStoreType] = useState("retail");
  const [storeStatus, setStoreStatus] = useState("active");

  const characterLimit = 500;
  const remainingChars = characterLimit - storeDescription.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Profile</h2>
        <p className="text-gray-600">Manage your public store information and identity</p>
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
          className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Enter your store name"
        />
        <p className="text-xs text-gray-500 mt-1">This is how customers will see your store</p>
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
          className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          placeholder="Describe your store and products..."
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">Tell customers what makes your store special</p>
          <p className={`text-xs font-medium ${
            remainingChars < 50 ? "text-red-600" : "text-gray-500"
          }`}>
            {remainingChars} characters remaining
          </p>
        </div>
      </div>

      {/* Store Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Category <span className="text-red-500">*</span>
        </label>
        <select
          value={storeCategory}
          onChange={(e) => setStoreCategory(e.target.value)}
          className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Select a category</option>
          <option value="electronics">Electronics & Gadgets</option>
          <option value="fashion">Fashion & Apparel</option>
          <option value="home">Home & Garden</option>
          <option value="beauty">Beauty & Personal Care</option>
          <option value="sports">Sports & Outdoors</option>
          <option value="toys">Toys & Games</option>
          <option value="books">Books & Media</option>
          <option value="food">Food & Beverages</option>
          <option value="automotive">Automotive</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Store Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { value: "retail", label: "Retail Store", desc: "Sell directly to consumers" },
            { value: "wholesale", label: "Wholesale", desc: "Bulk orders only" },
            { value: "both", label: "Both", desc: "Retail & wholesale" },
          ].map((type) => (
            <label
              key={type.value}
              className={`flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all ${
                storeType === type.value
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="storeType"
                value={type.value}
                checked={storeType === type.value}
                onChange={(e) => setStoreType(e.target.value)}
                className="sr-only"
              />
              <span className="text-sm font-medium text-gray-900 mb-1">{type.label}</span>
              <span className="text-xs text-gray-600">{type.desc}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Store Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Status
        </label>
        <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">Your store is currently</p>
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
        <p className="text-xs text-gray-500 mt-1">
          Customers can only purchase from active stores
        </p>
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
            <Badge variant="outline">{storeCategory || "Category"}</Badge>
            <Badge variant="outline">{storeType}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

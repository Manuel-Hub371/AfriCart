"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Eye,
  CheckCircle,
  Calendar,
  Globe,
  Store,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth/context";

interface PublishPanelProps {
  onPublish: () => void;
  onSaveDraft: () => void;
  productData?: {
    name?: string;
    description?: string;
    price?: number;
    compareAtPrice?: number;
    category?: string;
    stock?: number;
    status?: string;
  };
  images?: string[];
  saving?: boolean;
  isFeatured?: boolean;
  onIsFeaturedChange?: (val: boolean) => void;
}

export default function PublishPanel({
  onPublish,
  onSaveDraft,
  productData = {},
  images = [],
  saving = false,
  isFeatured = false,
  onIsFeaturedChange,
}: PublishPanelProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState("published");
  const [visibility, setVisibility] = useState("public");
  const [publishDate, setPublishDate] = useState("");

  const mainImage = images && images.length > 0 ? images[0] : null;
  const name = productData.name?.trim() || "Untitled Product";
  const price = productData.price || 0;
  const compareAtPrice = productData.compareAtPrice || 0;
  const category = productData.category || "General";
  const stock = productData.stock ?? 0;

  // Real-time Requirements checklist validation
  const hasName = Boolean(productData.name && productData.name.trim().length > 0);
  const hasImage = Boolean(images && images.length > 0);
  const hasPrice = Boolean(productData.price && productData.price > 0);
  const hasCategory = Boolean(productData.category && productData.category.trim().length > 0);

  const isReadyToPublish = hasName && hasPrice;

  return (
    <div className="space-y-4 lg:sticky lg:top-24">
      {/* Product Preview Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <Eye className="h-4 w-4 text-emerald-600" />
            Storefront Live Preview
          </h3>
          <Badge variant="outline" className="text-xs font-semibold text-emerald-700 bg-emerald-50 border-emerald-200">
            Card Preview
          </Badge>
        </div>

        <div className="border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="aspect-square bg-gray-100 relative overflow-hidden flex items-center justify-center">
            {mainImage ? (
              <img
                src={mainImage}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                <span className="text-xs font-medium">No image uploaded</span>
              </div>
            )}
            {category && (
              <span className="absolute top-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
                {category}
              </span>
            )}
          </div>
          <div className="p-4 space-y-2">
            <p className="font-bold text-gray-900 text-base line-clamp-2 leading-tight">
              {name}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-emerald-600">
                ${price.toFixed(2)}
              </span>
              {compareAtPrice > price && (
                <span className="text-xs text-gray-400 line-through font-medium">
                  ${compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-gray-500 font-medium">
                Stock: <span className={stock > 0 ? "text-emerald-700 font-bold" : "text-red-600 font-bold"}>{stock > 0 ? `${stock} units` : "Out of Stock"}</span>
              </span>
              <Badge variant="secondary" className="text-[10px] font-bold uppercase">
                {productData.status || "Draft"}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Publishing Configuration */}
      <Card className="p-6">
        <h3 className="font-bold text-gray-900 mb-4 text-base">Publishing Settings</h3>

        <div className="space-y-4">
          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              Target Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            >
              <option value="published font-semibold">Published (Active)</option>
              <option value="draft font-semibold">Draft</option>
              <option value="scheduled font-semibold">Scheduled</option>
            </select>
          </div>

          {/* Scheduled Date */}
          {status === "scheduled" && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600" />
                Publish Date
              </label>
              <input
                type="datetime-local"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          )}

          {/* Visibility */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-600" />
              Visibility Scope
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            >
              <option value="public">Public (Storefront Catalog)</option>
              <option value="private">Private (Vendor Only)</option>
            </select>
          </div>

          {/* Featured Product Toggle */}
          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase text-gray-900 flex items-center gap-1.5 cursor-pointer">
                <span>Featured Product</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isFeatured ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                  {isFeatured ? "ON" : "OFF"}
                </span>
              </label>
              <button
                type="button"
                onClick={() => onIsFeaturedChange?.(!isFeatured)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isFeatured ? "bg-amber-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isFeatured ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-gray-600 leading-snug">
              When enabled, this product will appear in the Featured Products section of your storefront.
            </p>
          </div>

          {/* Store */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-2">
              <Store className="h-4 w-4 text-emerald-600" />
              Assigned Store
            </label>
            <p className="text-sm font-bold text-gray-900 bg-gray-50 p-2.5 rounded-xl border">
              {user?.storeName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "My Store"}
            </p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-6">
        <div className="space-y-3">
          <Button
            onClick={onPublish}
            disabled={saving || !isReadyToPublish}
            className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold py-6 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
            Publish Product
          </Button>
          <Button
            variant="outline"
            onClick={onSaveDraft}
            disabled={saving}
            className="w-full gap-2 border-gray-300 rounded-xl font-semibold py-5"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
        </div>
      </Card>

      {/* Real-time Requirements Checklist */}
      <Card className="p-6">
        <h3 className="font-bold text-gray-900 mb-4 text-base">Product Checklist</h3>
        <div className="space-y-2.5 text-sm">
          <div className={`flex items-center gap-2 font-medium ${hasName ? "text-emerald-700" : "text-gray-500"}`}>
            {hasName ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-gray-400" />}
            Product name provided
          </div>
          <div className={`flex items-center gap-2 font-medium ${hasPrice ? "text-emerald-700" : "text-gray-500"}`}>
            {hasPrice ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-gray-400" />}
            Selling price configured
          </div>
          <div className={`flex items-center gap-2 font-medium ${hasImage ? "text-emerald-700" : "text-gray-500"}`}>
            {hasImage ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-gray-400" />}
            Product media uploaded ({images.length})
          </div>
          <div className={`flex items-center gap-2 font-medium ${hasCategory ? "text-emerald-700" : "text-gray-500"}`}>
            {hasCategory ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertCircle className="h-4 w-4 text-gray-400" />}
            Category assigned
          </div>
        </div>
      </Card>
    </div>
  );
}

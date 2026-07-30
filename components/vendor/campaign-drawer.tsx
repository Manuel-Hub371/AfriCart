"use client";

import { useEffect, useState } from "react";
import { X, Calendar, ShoppingCart, Percent, TrendingUp, Package, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Campaign } from "./campaign-card";

interface CampaignDrawerProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
}

interface CampaignProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  stock: number;
  soldCount: number;
}

export function CampaignDrawer({ campaign, isOpen, onClose }: CampaignDrawerProps) {
  const [products, setProducts] = useState<CampaignProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Fetch real products from the API whenever the campaign changes
  useEffect(() => {
    if (!isOpen || !campaign?.id) {
      setProducts([]);
      return;
    }

    setLoadingProducts(true);
    fetch(`/api/vendor/campaigns/${campaign.id}`)
      .then((res) => res.json())
      .then((data) => {
        const rawProducts = data?.campaign?.campaignProducts ?? [];
        setProducts(
          rawProducts.map((cp: any) => ({
            id: cp.product?.id || cp.productId,
            name: cp.product?.name || "Unknown Product",
            slug: cp.product?.slug || "",
            price: Number(cp.product?.price || 0),
            images: Array.isArray(cp.product?.images) ? cp.product.images : [],
            stock: cp.product?.stock ?? 0,
            soldCount: cp.product?.soldCount ?? 0,
          }))
        );
      })
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, [campaign?.id, isOpen]);

  if (!isOpen || !campaign) return null;

  const now = new Date();
  const startDate = campaign.startDate ? new Date(campaign.startDate) : null;
  const endDate = campaign.endDate ? new Date(campaign.endDate) : null;

  const isActive = campaign.isActive && startDate && endDate && startDate <= now && endDate >= now;
  const isScheduled = campaign.isActive && startDate && startDate > now;
  const isExpired = endDate && endDate < now;

  const statusLabel = isActive ? "Active" : isScheduled ? "Scheduled" : isExpired ? "Ended" : "Paused";
  const statusClass = isActive
    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : isScheduled
    ? "bg-blue-100 text-blue-700 border-blue-200"
    : isExpired
    ? "bg-gray-100 text-gray-700 border-gray-200"
    : "bg-yellow-100 text-yellow-700 border-yellow-200";

  const discountLabel =
    campaign.discountType === "PERCENTAGE" && campaign.discountValue != null
      ? `${campaign.discountValue}% OFF`
      : campaign.discountType === "FIXED" && campaign.discountValue != null
      ? `GH₵${campaign.discountValue} OFF`
      : "No Direct Price Discount";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">Campaign Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Campaign Info */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{campaign.name}</h3>
            {campaign.description && (
              <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
            )}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`font-medium ${statusClass}`}>
                {statusLabel}
              </Badge>
              {campaign.badge && (
                <span
                  className="text-[11px] font-extrabold uppercase tracking-wide text-white px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: campaign.color || "#EF4444" }}
                >
                  {campaign.badge}
                </span>
              )}
            </div>
          </div>

          {/* Date Range */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Campaign Period</p>
                <p className="text-sm text-gray-600">
                  {startDate ? startDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  {" → "}
                  {endDate ? endDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Discount Info */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Percent className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-900 mb-1">Discount Applied</p>
                <p className="text-lg font-bold text-emerald-700">{discountLabel}</p>
                <p className="text-xs text-emerald-700 mt-0.5">Type: {campaign.discountType || "NONE"}</p>
              </div>
            </div>
          </div>

          {/* Real Performance Metrics */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Performance Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Revenue Generated</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  GH₵{Number(campaign.revenueGenerated || 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Units Sold</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{campaign.salesCount || 0}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Campaign Views</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{campaign.viewsCount || 0}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Products Enrolled</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{campaign.productsCount || products.length}</p>
              </div>
            </div>
          </div>

          {/* Real Enrolled Products */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Enrolled Products</h4>
            {loadingProducts ? (
              <div className="text-sm text-gray-500 text-center py-6 animate-pulse">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-6 bg-gray-50 rounded-lg">
                No products enrolled in this campaign yet.
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => {
                  const img = product.images?.[0];
                  return (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {img ? (
                          <img
                            src={img}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover flex-shrink-0 border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-xs text-gray-500">GH₵{Number(product.price).toFixed(2)} · Stock: {product.stock}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-900">{product.soldCount}</p>
                        <p className="text-xs text-gray-500">sold</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

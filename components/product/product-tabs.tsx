"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, List, Star, Truck, HelpCircle, ShieldCheck, MapPin } from "lucide-react";
import { ReviewSection } from "./review-section";
import { ProductQuestions } from "./product-questions";

interface ShippingPolicyItem {
  id: string;
  name: string;
  shippingMethod: string;
  deliveryTime: string;
  shippingCost: number;
  freeShippingThreshold?: number | null;
  processingTime?: string | null;
  deliveryRegions?: string | null;
  localPickup?: boolean;
  cashOnDelivery?: boolean;
  trackingSupported?: boolean;
  description?: string | null;
}

interface ProductTabsProps {
  productId?: string;
  description: string;
  specifications: Record<string, any> | null;
  storeName?: string;
  shippingPolicies?: ShippingPolicyItem[];
  refundPolicy?: any;
  returnPolicy?: any;
  warrantyPolicy?: any;
}

export function ProductTabs({
  productId,
  description,
  specifications,
  storeName,
  shippingPolicies = [],
  refundPolicy,
  returnPolicy,
  warrantyPolicy,
}: ProductTabsProps) {
  // Filter out null/undefined/empty string specifications dynamically
  const filteredSpecs = Object.entries(specifications || {}).filter(([_, value]) => {
    if (value === null || value === undefined) return false;
    const strVal = String(value).trim();
    return strVal.length > 0 && strVal !== "null" && strVal !== "undefined";
  });

  return (
    <Tabs defaultValue="description" className="w-full">
      {/* Exactly 4 Navigation Tabs */}
      <TabsList className="w-full justify-start border-b border-gray-200 rounded-none h-auto p-0 bg-transparent gap-1 sm:gap-2 flex overflow-x-auto no-scrollbar">
        <TabsTrigger
          value="description"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 data-[state=active]:font-black px-2.5 sm:px-6 py-2 sm:py-3.5 gap-1 text-xs sm:text-sm font-bold text-gray-600 whitespace-nowrap"
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Overview</span>
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 data-[state=active]:font-black px-2.5 sm:px-6 py-2 sm:py-3.5 gap-1 text-xs sm:text-sm font-bold text-gray-600 whitespace-nowrap"
        >
          <Star className="h-3.5 w-3.5" />
          <span>Reviews</span>
        </TabsTrigger>
        <TabsTrigger
          value="questions"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 data-[state=active]:font-black px-2.5 sm:px-6 py-2 sm:py-3.5 gap-1 text-xs sm:text-sm font-bold text-gray-600 whitespace-nowrap"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Q &amp; A</span>
        </TabsTrigger>
        <TabsTrigger
          value="shipping"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 data-[state=active]:font-black px-2.5 sm:px-6 py-2 sm:py-3.5 gap-1 text-xs sm:text-sm font-bold text-gray-600 whitespace-nowrap"
        >
          <Truck className="h-3.5 w-3.5" />
          <span>Policies</span>
        </TabsTrigger>
      </TabsList>

      {/* TAB 1: Description + Specifications Merged */}
      <TabsContent value="description" className="mt-8 space-y-10">
        {/* Product Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" /> Product Overview
          </h3>
          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line text-sm bg-gray-50/50 p-6 rounded-3xl border border-gray-200">
            {description}
          </div>
        </div>

        {/* Dynamic Product Specifications */}
        {filteredSpecs.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <List className="h-5 w-5 text-emerald-600" /> Specifications &amp; Features
            </h3>
            <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full">
                <tbody>
                  {filteredSpecs.map(([key, value], index) => (
                    <tr
                      key={key}
                      className={index % 2 === 0 ? "bg-gray-50/70" : "bg-white"}
                    >
                      <td className="px-6 py-4 font-bold text-gray-900 w-1/3 text-xs uppercase tracking-wider border-r border-gray-100">
                        {key}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm font-medium">
                        {String(value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </TabsContent>

      {/* TAB 2: Customer Reviews */}
      <TabsContent value="reviews" className="mt-8">
        <ReviewSection productId={productId} />
      </TabsContent>

      {/* TAB 3: Q & A */}
      <TabsContent value="questions" className="mt-8">
        <ProductQuestions productId={productId || ""} storeName={storeName} />
      </TabsContent>

      {/* TAB 4: Shipping Policy */}
      <TabsContent value="shipping" className="mt-8 space-y-8">
        {/* 1. SHIPPING POLICY */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-600" /> Shipping Policy
          </h2>
          {shippingPolicies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shippingPolicies.map((sp) => (
                <div key={sp.id} className="bg-gray-50/70 p-6 rounded-3xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-gray-900 text-base">{sp.name}</h4>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs font-bold">
                      {sp.shippingMethod}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 border-t border-b border-gray-200 py-3">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Estimated Delivery</span>
                      <strong className="text-gray-900">{sp.deliveryTime}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Shipping Fee</span>
                      <strong className="text-emerald-700">{sp.shippingCost === 0 ? "FREE" : `GH₵${sp.shippingCost.toFixed(2)}`}</strong>
                    </div>
                    {sp.processingTime && (
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Processing Time</span>
                        <strong className="text-gray-900">{sp.processingTime}</strong>
                      </div>
                    )}
                    {sp.freeShippingThreshold && (
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Free Minimum</span>
                        <strong className="text-gray-900">GH₵{sp.freeShippingThreshold}</strong>
                      </div>
                    )}
                  </div>

                  {sp.deliveryRegions && (
                    <p className="text-xs text-gray-600 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                      <span>Coverage: <strong>{sp.deliveryRegions}</strong></span>
                    </p>
                  )}

                  {sp.description && (
                    <p className="text-xs text-gray-500 leading-relaxed pt-1">{sp.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">No specific shipping policy assigned to this product.</p>
          )}
        </div>

        {/* 2. REFUND POLICY */}
        <div className="space-y-3 border-t pt-6">
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" /> Refund Policy
          </h2>
          {refundPolicy ? (
            <div className="bg-gray-50/70 p-6 rounded-3xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-gray-900 text-base">{refundPolicy.name}</h4>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs font-bold">
                  {refundPolicy.refundType}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 border-t border-b border-gray-200 py-3">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Eligibility Period</span>
                  <strong className="text-gray-900">{refundPolicy.eligibilityPeriod}</strong>
                </div>
                {refundPolicy.processingTime && (
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Processing Time</span>
                    <strong className="text-emerald-700">{refundPolicy.processingTime}</strong>
                  </div>
                )}
              </div>
              {refundPolicy.description && (
                <p className="text-xs text-gray-600 leading-relaxed">{refundPolicy.description}</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">No refund policy assigned to this product.</p>
          )}
        </div>

        {/* 3. RETURN POLICY */}
        <div className="space-y-3 border-t pt-6">
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" /> Return Policy
          </h2>
          {returnPolicy ? (
            <div className="bg-gray-50/70 p-6 rounded-3xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-gray-900 text-base">{returnPolicy.name}</h4>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs font-bold">
                  Window: {returnPolicy.returnWindow}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 border-t border-b border-gray-200 py-3">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Return Window</span>
                  <strong className="text-gray-900">{returnPolicy.returnWindow}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Return Shipping</span>
                  <strong className="text-emerald-700">{returnPolicy.shippingResponsibility}</strong>
                </div>
              </div>
              {returnPolicy.description && (
                <p className="text-xs text-gray-600 leading-relaxed">{returnPolicy.description}</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">No return policy assigned to this product.</p>
          )}
        </div>

        {/* 4. WARRANTY POLICY */}
        <div className="space-y-3 border-t pt-6">
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" /> Warranty
          </h2>
          {warrantyPolicy ? (
            <div className="bg-gray-50/70 p-6 rounded-3xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-gray-900 text-base">{warrantyPolicy.name}</h4>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs font-bold">
                  {warrantyPolicy.warrantyType}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 border-t border-b border-gray-200 py-3">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Warranty Type</span>
                  <strong className="text-gray-900">{warrantyPolicy.warrantyType}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Duration</span>
                  <strong className="text-emerald-700">{warrantyPolicy.warrantyDuration}</strong>
                </div>
              </div>
              {warrantyPolicy.coverage && (
                <p className="text-xs text-gray-600 leading-relaxed">{warrantyPolicy.coverage}</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">No warranty policy assigned to this product.</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}

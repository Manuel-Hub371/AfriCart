"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, RefreshCw, Shield, MapPin, CheckCircle } from "lucide-react";

export interface ShippingPolicyDisplay {
  id: string;
  name: string;
  shippingMethod: string;
  deliveryTime: string;
  shippingCost: number;
  freeShippingThreshold?: number | null;
  processingTime?: string | null;
  deliveryRegions?: string | null;
  localPickup?: boolean;
  trackingSupported?: boolean;
}

interface ShippingCardProps {
  policies?: ShippingPolicyDisplay[];
  storeLocation?: string;
  returnDays?: number;
  weight?: number | null;
}

export function ShippingCard({
  policies = [],
  storeLocation = "Ghana",
  returnDays = 30,
}: ShippingCardProps) {
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>(policies[0]?.id || "");

  const activePolicies = policies.length > 0 ? policies : [
    {
      id: "default-1",
      name: "Standard Shipping",
      shippingMethod: "STANDARD",
      deliveryTime: "2 - 4 Business Days",
      shippingCost: 5.00,
      freeShippingThreshold: 100,
      trackingSupported: true,
    },
  ];

  return (
    <Card className="p-3 sm:p-6 border border-gray-200 rounded-xl sm:rounded-3xl bg-white shadow-2xs space-y-3 sm:space-y-5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="text-xs sm:text-base font-black text-gray-900 flex items-center gap-1.5">
          <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Delivery &amp; Shipping</span>
        </h3>
        <span className="text-[9px] sm:text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-100">
          Dispatched from {storeLocation}
        </span>
      </div>

      {/* Available Store Shipping Policies */}
      <div className="space-y-2">
        <label className="block text-[10px] sm:text-xs font-extrabold text-gray-400 uppercase tracking-wider">
          Available Methods ({activePolicies.length})
        </label>
        
        <div className="space-y-1.5">
          {activePolicies.map((p) => {
            const isSelected = selectedPolicyId === p.id || activePolicies.length === 1;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPolicyId(p.id)}
                className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50/40 shadow-2xs"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-gray-900 text-xs sm:text-sm">{p.name}</span>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] px-1.5 py-0 font-extrabold rounded-full">
                      {p.shippingMethod}
                    </Badge>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-emerald-700">
                    {p.shippingCost === 0 ? "FREE" : `GH₵${p.shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 mt-1">
                  <span>Delivery: <strong>{p.deliveryTime}</strong></span>
                  {p.freeShippingThreshold && (
                    <span className="text-gray-500 font-semibold">Free over GH₵{p.freeShippingThreshold}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guarantee Badges */}
      <div className="space-y-3 pt-2 border-t text-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-50 rounded-xl flex-shrink-0">
            <RefreshCw className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{returnDays}-Day Buyer Guarantee &amp; Returns</h4>
            <p className="text-[11px] text-gray-500">Free return pickup if item is defective or does not match description.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 rounded-xl flex-shrink-0">
            <Shield className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">AfriCart Buyer Protection</h4>
            <p className="text-[11px] text-gray-500">Full refund if product is not delivered as scheduled.</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

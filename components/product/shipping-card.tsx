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
    <Card className="p-6 border border-gray-200 rounded-3xl bg-white shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
          <Truck className="h-5 w-5 text-emerald-600" />
          Delivery &amp; Shipping Policies
        </h3>
        <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
          Dispatched from {storeLocation}
        </span>
      </div>

      {/* Available Store Shipping Policies */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          Available Shipping Methods ({activePolicies.length})
        </label>
        
        <div className="space-y-2">
          {activePolicies.map((p) => {
            const isSelected = selectedPolicyId === p.id || activePolicies.length === 1;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPolicyId(p.id)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50/40 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{p.name}</span>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] py-0">
                      {p.shippingMethod}
                    </Badge>
                  </div>
                  <span className="text-sm font-black text-emerald-700">
                    {p.shippingCost === 0 ? "FREE" : `GH₵${p.shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                  <span>Delivery: <strong>{p.deliveryTime}</strong></span>
                  {p.freeShippingThreshold && (
                    <span className="text-gray-600 text-[11px]">Free over GH₵{p.freeShippingThreshold}</span>
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

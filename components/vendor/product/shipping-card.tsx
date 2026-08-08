"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Truck, Check, AlertCircle, Plus, ShieldCheck, Clock } from "lucide-react";
import Link from "next/link";

export interface ShippingPolicyOption {
  id: string;
  name: string;
  shippingMethod: string;
  deliveryTime: string;
  shippingCost: number;
  freeShippingThreshold?: number | null;
  trackingSupported?: boolean;
  localPickup?: boolean;
  isActive?: boolean;
}

interface ShippingCardProps {
  availablePolicies?: ShippingPolicyOption[];
  selectedPolicyIds?: string[];
  onChangePolicyIds?: (ids: string[]) => void;
  weight?: number;
  onChangeWeight?: (weight: number) => void;
  length?: number;
  width?: number;
  height?: number;
  onChangeDimensions?: (dims: { length?: number; width?: number; height?: number }) => void;
}

export default function ShippingCard({
  availablePolicies = [],
  selectedPolicyIds = [],
  onChangePolicyIds,
  weight = 0,
  onChangeWeight,
  length = 0,
  width = 0,
  height = 0,
  onChangeDimensions,
}: ShippingCardProps) {
  const activePolicies = availablePolicies.filter((p) => p.isActive !== false);

  const togglePolicy = (policyId: string) => {
    if (!onChangePolicyIds) return;
    if (selectedPolicyIds.includes(policyId)) {
      onChangePolicyIds(selectedPolicyIds.filter((id) => id !== policyId));
    } else {
      onChangePolicyIds([...selectedPolicyIds, policyId]);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-600" /> Store Shipping Policies
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Select central store shipping policies assigned to this product. No manual shipping rates retyping required.
          </p>
        </div>
        <Link href="/vendor/store?section=shipping">
          <span className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1">
            <Plus className="h-3.5 w-3.5" /> Manage Policies
          </span>
        </Link>
      </div>

      {/* Policy Selector */}
      <div className="space-y-3 pt-2">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          Assign Shipping Policies <span className="text-red-500">*</span>
        </label>

        {activePolicies.length > 0 ? (
          <div className="space-y-2">
            {activePolicies.map((policy) => {
              const isSelected = selectedPolicyIds.includes(policy.id);
              return (
                <div
                  key={policy.id}
                  onClick={() => togglePolicy(policy.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 text-sm">{policy.name}</h4>
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] py-0">
                          {policy.shippingMethod}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" /> {policy.deliveryTime}
                        </span>
                        <span>•</span>
                        <span>
                          Cost: <strong>${policy.shippingCost.toFixed(2)}</strong>
                        </span>
                        {policy.freeShippingThreshold && (
                          <>
                            <span>•</span>
                            <span>Free over ${policy.freeShippingThreshold}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex-shrink-0">
                      Assigned
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 bg-amber-50/80 rounded-2xl border border-amber-200 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-amber-600 mx-auto" />
            <div className="space-y-1">
              <p className="font-extrabold text-amber-900 text-sm">No Active Shipping Policies Found</p>
              <p className="text-xs text-amber-700 max-w-sm mx-auto">
                You must configure at least one active shipping policy in your Store Settings before assigning shipping methods to products.
              </p>
            </div>
            <Link href="/vendor/store?section=shipping">
              <span className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm">
                Configure Shipping Policies in Settings
              </span>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}

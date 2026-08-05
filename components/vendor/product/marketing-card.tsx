"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, Check } from "lucide-react";

export interface CampaignOption {
  id: string;
  name: string;
  badge?: string | null;
  color?: string | null;
  discountType: string;
  discountValue?: number | null;
  isActive: boolean;
}

interface MarketingCardProps {
  availableCampaigns?: CampaignOption[];
  selectedCampaignIds: string[];
  onChangeCampaignIds: (ids: string[]) => void;
}

export default function MarketingCard({
  availableCampaigns = [],
  selectedCampaignIds = [],
  onChangeCampaignIds,
}: MarketingCardProps) {
  const toggleCampaign = (id: string) => {
    if (selectedCampaignIds.includes(id)) {
      onChangeCampaignIds(selectedCampaignIds.filter((item) => item !== id));
    } else {
      onChangeCampaignIds([...selectedCampaignIds, id]);
    }
  };

  return (
    <Card className="rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-white border-b border-gray-100 p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-600" />
          <CardTitle className="text-lg font-extrabold text-gray-900">
            Marketing Campaigns
          </CardTitle>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Assign active marketing deals to display campaign badges on storefront cards and product pages.
        </p>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-extrabold uppercase tracking-wider text-gray-700 block flex items-center justify-between">
            <span>Marketing Campaigns</span>
            <span className="text-emerald-700 font-bold normal-case">
              {selectedCampaignIds.length} Selected
            </span>
          </label>

          {availableCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableCampaigns.map((c) => {
                const isSelected = selectedCampaignIds.includes(c.id);
                return (
                  <div
                    key={c.id}
                    onClick={() => toggleCampaign(c.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/60 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: c.color || "#EF4444" }}
                        />
                        <span className="font-extrabold text-sm text-gray-900">{c.name}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-emerald-700">
                        {c.discountType === "PERCENTAGE"
                          ? `${c.discountValue}% OFF`
                          : c.discountType === "FIXED"
                          ? `$${c.discountValue} OFF`
                          : "No Direct Discount"}
                      </p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isSelected
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-500">
              No store campaigns configured. Create campaigns under <strong>Vendor Dashboard &gt; Marketing &gt; Campaigns</strong>.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

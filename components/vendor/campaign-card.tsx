"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Pause, Play, Copy, Trash2, Calendar, DollarSign, ShoppingCart, Percent } from "lucide-react";

export type CampaignType = 
  | "percentage-discount"
  | "fixed-discount"
  | "bogo"
  | "bundle"
  | "free-shipping"
  | "category-discount"
  | "product-discount"
  | "minimum-spend";

export type CampaignStatus = "active" | "scheduled" | "paused" | "ended";

export interface Campaign {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  badge?: string | null;
  color?: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  discountType: string;
  discountValue?: number | null;
  productsCount: number;
  // Real performance stats from DB
  revenueGenerated: number;
  salesCount: number;
  viewsCount: number;
  usedCount: number;
}

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (campaign: Campaign) => void;
}

// Compute status from real API fields
function getCampaignStatus(c: Campaign): { label: string; className: string } {
  const now = new Date();
  const start = new Date(c.startDate);
  const end = new Date(c.endDate);
  if (!c.isActive) return { label: "Paused", className: "bg-yellow-100 text-yellow-700 border-yellow-200" };
  if (end < now) return { label: "Ended", className: "bg-gray-100 text-gray-700 border-gray-200" };
  if (start > now) return { label: "Scheduled", className: "bg-blue-100 text-blue-700 border-blue-200" };
  return { label: "Active", className: "bg-emerald-100 text-emerald-700 border-emerald-200" };
}

export function CampaignCard({
  campaign,
  onEdit,
  onPause,
  onResume,
  onDuplicate,
  onDelete,
  onViewDetails,
}: CampaignCardProps) {
  const status = getCampaignStatus(campaign);
  const discountLabel =
    campaign.discountType === "PERCENTAGE" && campaign.discountValue != null
      ? `${campaign.discountValue}% OFF`
      : campaign.discountType === "FIXED" && campaign.discountValue != null
      ? `GH₵${campaign.discountValue} OFF`
      : "No Direct Discount";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onViewDetails(campaign)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{campaign.name}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {campaign.type?.replace(/_/g, " ") || "Campaign"}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs font-medium ${status.className}`}
            >
              {status.label}
            </Badge>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger 
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
          >
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(campaign.id); }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Campaign
            </DropdownMenuItem>
          {campaign.isActive ? (
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onPause(campaign.id); }}>
              <Pause className="h-4 w-4 mr-2" />
              Pause Campaign
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onResume(campaign.id); }}>
              <Play className="h-4 w-4 mr-2" />
              Resume Campaign
            </DropdownMenuItem>
          )}
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(campaign.id); }}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete(campaign.id); }}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(campaign.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            {" → "}
            {new Date(campaign.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Percent className="h-4 w-4" />
          <span>Discount: {discountLabel}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <DollarSign className="h-3 w-3" />
            Revenue
          </div>
          <div className="text-lg font-semibold text-gray-900">
            GH₵{Number(campaign.revenueGenerated || 0).toFixed(0)}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <ShoppingCart className="h-3 w-3" />
            Sales
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {campaign.salesCount || 0}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <Percent className="h-3 w-3" />
            Products
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {campaign.productsCount || 0}
          </div>
        </div>
      </div>
    </div>
  );
}

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
  type: CampaignType;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  revenue: number;
  orders: number;
  conversionRate: number;
  discount: string;
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

const campaignTypeLabels: Record<CampaignType, string> = {
  "percentage-discount": "Percentage Off",
  "fixed-discount": "Fixed Amount",
  "bogo": "Buy One Get One",
  "bundle": "Bundle Discount",
  "free-shipping": "Free Shipping",
  "category-discount": "Category Sale",
  "product-discount": "Product Sale",
  "minimum-spend": "Minimum Spend",
};

const statusConfig = {
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-700 border-blue-200" },
  paused: { label: "Paused", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  ended: { label: "Ended", className: "bg-gray-100 text-gray-700 border-gray-200" },
};

export function CampaignCard({
  campaign,
  onEdit,
  onPause,
  onResume,
  onDuplicate,
  onDelete,
  onViewDetails,
}: CampaignCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onViewDetails(campaign)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{campaign.name}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {campaignTypeLabels[campaign.type]}
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-xs font-medium ${statusConfig[campaign.status].className}`}
            >
              {statusConfig[campaign.status].label}
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
            {campaign.status === "active" ? (
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onPause(campaign.id); }}>
                <Pause className="h-4 w-4 mr-2" />
                Pause Campaign
              </DropdownMenuItem>
            ) : campaign.status === "paused" ? (
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onResume(campaign.id); }}>
                <Play className="h-4 w-4 mr-2" />
                Resume Campaign
              </DropdownMenuItem>
            ) : null}
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
          <span>{campaign.startDate} - {campaign.endDate}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Percent className="h-4 w-4" />
          <span>Discount: {campaign.discount}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <DollarSign className="h-3 w-3" />
            Revenue
          </div>
          <div className="text-lg font-semibold text-gray-900">
            ${campaign.revenue.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <ShoppingCart className="h-3 w-3" />
            Orders
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {campaign.orders}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <Percent className="h-3 w-3" />
            Conversion
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {campaign.conversionRate}%
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { X, Calendar, DollarSign, ShoppingCart, Percent, Users, TrendingUp, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Campaign } from "./campaign-card";

interface CampaignDrawerProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CampaignDrawer({ campaign, isOpen, onClose }: CampaignDrawerProps) {
  if (!isOpen || !campaign) return null;

  const statusConfig = {
    active: { label: "Active", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-700 border-blue-200" },
    paused: { label: "Paused", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    ended: { label: "Ended", className: "bg-gray-100 text-gray-700 border-gray-200" },
  };

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
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Campaign Info */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{campaign.name}</h3>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`font-medium ${statusConfig[campaign.status].className}`}
              >
                {statusConfig[campaign.status].label}
              </Badge>
            </div>
          </div>

          {/* Date Range */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Campaign Period</p>
                <p className="text-sm text-gray-600">
                  {campaign.startDate} - {campaign.endDate}
                </p>
              </div>
            </div>
          </div>

          {/* Discount Info */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Percent className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-900 mb-1">Discount</p>
                <p className="text-lg font-bold text-emerald-700">{campaign.discount}</p>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Performance Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Revenue</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  ${campaign.revenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Orders</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{campaign.orders}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Conversion</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{campaign.conversionRate}%</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Customers</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{Math.floor(campaign.orders * 0.87)}</p>
              </div>
            </div>
          </div>

          {/* Eligible Products */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Eligible Products</h4>
            <div className="space-y-3">
              {[
                { name: "Premium Headphones", sku: "HD-2024-01", sales: 45 },
                { name: "Wireless Mouse", sku: "MS-2024-12", sales: 32 },
                { name: "Laptop Stand", sku: "LS-2024-08", sales: 28 },
                { name: "USB-C Cable", sku: "CB-2024-15", sales: 19 },
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{product.sales}</p>
                    <p className="text-xs text-gray-500">sales</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Campaign Timeline */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Timeline</h4>
            <div className="space-y-4">
              {[
                { date: "July 15, 2026", event: "Campaign Created", time: "10:30 AM" },
                { date: "July 15, 2026", event: "Campaign Activated", time: "11:00 AM" },
                { date: "July 15, 2026", event: "First Order Received", time: "2:15 PM" },
              ].map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-600" />
                    {index < 2 && <div className="w-0.5 h-full bg-gray-200 mt-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium text-gray-900">{item.event}</p>
                    <p className="text-xs text-gray-500">{item.date} at {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
              Edit Campaign
            </Button>
            <Button variant="outline" className="flex-1 border-gray-200">
              Duplicate
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

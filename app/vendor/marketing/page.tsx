"use client";

import { useState } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Tag, Percent, Gift, Zap } from "lucide-react";

const campaigns = [
  {
    id: "1",
    name: "Summer Sale 2026",
    type: "Discount",
    discount: "20%",
    status: "Active",
    startDate: "July 1, 2026",
    endDate: "July 31, 2026",
    orders: 45,
  },
  {
    id: "2",
    name: "Free Shipping Campaign",
    type: "Shipping",
    discount: "Free",
    status: "Active",
    startDate: "July 1, 2026",
    endDate: "August 31, 2026",
    orders: 128,
  },
  {
    id: "3",
    name: "Flash Sale - Electronics",
    type: "Flash Sale",
    discount: "30%",
    status: "Scheduled",
    startDate: "July 15, 2026",
    endDate: "July 17, 2026",
    orders: 0,
  },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Scheduled: "bg-blue-100 text-blue-700",
  Expired: "bg-gray-100 text-gray-700",
};

export default function VendorMarketingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <VendorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <VendorTopbar
          onMenuClick={() => setSidebarOpen(true)}
          breadcrumbs={[
            { label: "Dashboard", href: "/vendor" },
            { label: "Marketing" },
          ]}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Marketing
                </h1>
                <p className="text-gray-600">
                  Manage promotions and campaigns
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-5 w-5" />
                Create Campaign
              </Button>
            </div>
          </div>

          {/* Campaign Types */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button className="bg-white rounded-lg border p-6 hover:border-emerald-500 transition-colors text-left">
              <Tag className="h-8 w-8 text-emerald-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Coupons</h3>
              <p className="text-sm text-gray-600">Create discount codes</p>
            </button>
            <button className="bg-white rounded-lg border p-6 hover:border-blue-500 transition-colors text-left">
              <Percent className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Discounts</h3>
              <p className="text-sm text-gray-600">Product discounts</p>
            </button>
            <button className="bg-white rounded-lg border p-6 hover:border-purple-500 transition-colors text-left">
              <Zap className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Flash Sales</h3>
              <p className="text-sm text-gray-600">Limited time offers</p>
            </button>
            <button className="bg-white rounded-lg border p-6 hover:border-orange-500 transition-colors text-left">
              <Gift className="h-8 w-8 text-orange-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Bundles</h3>
              <p className="text-sm text-gray-600">Product bundles</p>
            </button>
          </div>

          {/* Active Campaigns */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Active Campaigns</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Campaign Name
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Type
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Discount
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Duration
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Orders
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="py-4 px-6 font-medium text-gray-900">
                        {campaign.name}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {campaign.type}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-emerald-600">
                        {campaign.discount}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        <div>{campaign.startDate}</div>
                        <div className="text-xs text-gray-500">
                          to {campaign.endDate}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {campaign.orders}
                      </td>
                      <td className="py-4 px-6">
                        <Badge className={statusColors[campaign.status]}>
                          {campaign.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

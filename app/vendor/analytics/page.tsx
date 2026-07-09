"use client";

import { useState } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import DashboardCard from "@/components/vendor/dashboard-card";
import { DollarSign, ShoppingBag, Users, TrendingUp, Eye } from "lucide-react";

export default function VendorAnalyticsPage() {
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
            { label: "Analytics" },
          ]}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Track your store performance</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              icon={DollarSign}
              label="Total Revenue"
              value="$45,230"
              change={{ value: 12.5, type: "increase" }}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-100"
            />
            <DashboardCard
              icon={ShoppingBag}
              label="Total Orders"
              value={342}
              change={{ value: 8.2, type: "increase" }}
              iconColor="text-blue-600"
              iconBg="bg-blue-100"
            />
            <DashboardCard
              icon={Users}
              label="Total Customers"
              value={842}
              change={{ value: 3.1, type: "increase" }}
              iconColor="text-purple-600"
              iconBg="bg-purple-100"
            />
            <DashboardCard
              icon={Eye}
              label="Store Visits"
              value="12.5K"
              change={{ value: 15.8, type: "increase" }}
              iconColor="text-orange-600"
              iconBg="bg-orange-100"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart Placeholder */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-6">Revenue Overview</h2>
              <div className="h-64 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">Chart will be displayed here</p>
              </div>
            </div>

            {/* Orders Chart Placeholder */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-6">Orders by Day</h2>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">Chart will be displayed here</p>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-6">Top Products</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded" />
                      <div>
                        <p className="font-medium text-gray-900">Product {i}</p>
                        <p className="text-sm text-gray-600">{45 - i * 5} sales</p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600">
                      ${(120 - i * 10).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-6">Traffic Sources</h2>
              <div className="space-y-4">
                {[
                  { name: "Direct", percentage: 45, color: "bg-blue-600" },
                  { name: "Search", percentage: 30, color: "bg-emerald-600" },
                  { name: "Social", percentage: 15, color: "bg-purple-600" },
                  { name: "Referral", percentage: 10, color: "bg-orange-600" },
                ].map((source) => (
                  <div key={source.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">{source.name}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {source.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${source.color} h-2 rounded-full`}
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

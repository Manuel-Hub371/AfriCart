"use client";

import { useState } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { DateRangePicker, DateRange } from "@/components/vendor/date-range-picker";
import { AnalyticsKpiCard } from "@/components/vendor/analytics-kpi-card";
import { RevenueChart } from "@/components/vendor/revenue-chart";
import { SalesChart } from "@/components/vendor/sales-chart";
import { CustomerChart } from "@/components/vendor/customer-chart";
import { TrafficChart } from "@/components/vendor/traffic-chart";
import { TopProductsTable } from "@/components/vendor/top-products-table";
import { FinancialSummary } from "@/components/vendor/financial-summary";
import { 
  Download, 
  RefreshCw, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  TrendingUp,
  Users,
  Percent
} from "lucide-react";

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>("last-30-days");

  // Mock sparkline data
  const sparklineData = Array.from({ length: 30 }, (_, i) => ({
    value: ((i * 13 + 45) % 100) + 50,
  }));

  const handleExport = () => {
    console.log("Export analytics...");
  };

  const handleRefresh = () => {
    console.log("Refresh data...");
  };

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

        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600">
                  Track business performance, monitor trends, and make data-driven decisions
                </p>
              </div>
              <div className="flex items-center gap-3">
                <DateRangePicker value={dateRange} onChange={setDateRange} />
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  className="h-10 w-10 p-0 border-gray-200 hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="h-10 px-4 border-gray-200 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <AnalyticsKpiCard
                title="Total Revenue"
                value="148K"
                prefix="$"
                previousValue={132000}
                change={12.1}
                icon={DollarSign}
                trend="up"
                sparklineData={sparklineData}
              />
              <AnalyticsKpiCard
                title="Orders"
                value={1847}
                previousValue={1654}
                change={11.7}
                icon={ShoppingCart}
                trend="up"
                sparklineData={sparklineData}
              />
              <AnalyticsKpiCard
                title="Units Sold"
                value={8234}
                previousValue={7456}
                change={10.4}
                icon={Package}
                trend="up"
                sparklineData={sparklineData}
              />
              <AnalyticsKpiCard
                title="Avg Order Value"
                value="80"
                prefix="$"
                previousValue={75}
                change={6.7}
                icon={TrendingUp}
                trend="up"
                sparklineData={sparklineData}
              />
              <AnalyticsKpiCard
                title="Conversion Rate"
                value="4.2"
                suffix="%"
                previousValue={3.8}
                change={10.5}
                icon={Percent}
                trend="up"
                sparklineData={sparklineData}
              />
              <AnalyticsKpiCard
                title="Returning Customers"
                value={2234}
                previousValue={1998}
                change={11.8}
                icon={Users}
                trend="up"
                sparklineData={sparklineData}
              />
              <AnalyticsKpiCard
                title="New Customers"
                value={156}
                previousValue={134}
                change={16.4}
                icon={Users}
                trend="up"
                sparklineData={sparklineData}
              />
              <AnalyticsKpiCard
                title="Refund Rate"
                value="2.3"
                suffix="%"
                previousValue={2.8}
                change={-17.9}
                icon={Percent}
                trend="down"
                sparklineData={sparklineData}
              />
            </div>

            {/* Revenue Chart */}
            <div className="mb-8">
              <RevenueChart />
            </div>

            {/* Sales & Customer Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <SalesChart />
              <CustomerChart />
            </div>

            {/* Traffic & Financial */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <TrafficChart />
              <FinancialSummary />
            </div>

            {/* Top Products Table */}
            <TopProductsTable />
          </div>
        </main>
      </div>
    </div>
  );
}

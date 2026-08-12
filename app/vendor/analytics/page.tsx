"use client";

import { useState, useEffect } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { RevenueChart } from "@/components/vendor/revenue-chart";
import { SalesChart } from "@/components/vendor/sales-chart";
import { CustomerChart } from "@/components/vendor/customer-chart";
import { TrafficChart } from "@/components/vendor/traffic-chart";
import { TopProductsTable } from "@/components/vendor/top-products-table";
import { 
  Download, 
  RefreshCw, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  TrendingUp,
  Loader2
} from "lucide-react";

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const [analyticsRes, productsRes] = await Promise.all([
        fetch("/api/vendor/analytics"),
        fetch("/api/vendor/products"),
      ]);

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalyticsData(data);
      }
      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to load vendor analytics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleExport = () => {
    if (!analyticsData) return;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Metric,Value"]
        .concat([
          `"Gross Revenue",${analyticsData.totalRevenue || 0}`,
          `"Total Orders",${analyticsData.totalOrders || 0}`,
          `"Units Sold",${analyticsData.unitsSold || 0}`,
          `"Average Order Value",${analyticsData.averageOrderValue || 0}`,
        ])
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vendor_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const revenue = analyticsData?.totalRevenue ?? 0;
  const orders = analyticsData?.totalOrders ?? 0;
  const unitsSold = analyticsData?.unitsSold ?? 0;
  const aov = analyticsData?.averageOrderValue ?? 0;

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
                <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
                  Analytics &amp; Performance
                </h1>
                <p className="text-gray-600 text-sm">
                  Real-time sales velocity, order volumes, revenue metrics, and best-selling product performance.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={fetchAnalytics}
                  className="h-10 w-10 p-0 border-gray-200 hover:bg-gray-50 rounded-xl"
                >
                  <RefreshCw className="h-4 w-4 text-gray-600" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={!analyticsData}
                  className="h-10 px-4 border-gray-200 hover:bg-gray-50 rounded-xl"
                >
                  <Download className="h-4 w-4 mr-2 text-gray-600" />
                  Export CSV
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="py-24 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
                <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mx-auto mb-3" />
                <p className="text-gray-500 font-medium text-sm">Loading analytics parameters...</p>
              </div>
            ) : (
              <>
                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">Gross Sales Revenue</span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <DollarSign className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-gray-900">GH₵{revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                    <p className="text-xs text-gray-400 mt-1">Total completed checkout sales</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">Total Customer Orders</span>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <ShoppingCart className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-blue-600">{orders}</h3>
                    <p className="text-xs text-gray-400 mt-1">Processed orders count</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">Total Merchandise Units Sold</span>
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <Package className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-amber-600">{unitsSold}</h3>
                    <p className="text-xs text-gray-400 mt-1">Individual items fulfilled</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">Average Order Value (AOV)</span>
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-purple-600">GH₵{aov.toFixed(2)}</h3>
                    <p className="text-xs text-gray-400 mt-1">Revenue per completed order</p>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <RevenueChart />
                  <SalesChart />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <CustomerChart />
                  <TrafficChart />
                </div>

                {/* Best Selling Products Table */}
                <TopProductsTable products={products} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

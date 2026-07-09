"use client";

import { useState } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";

const shippingRates = [
  {
    id: "1",
    zone: "Greater Accra",
    method: "Standard Delivery",
    rate: 10,
    deliveryTime: "3-5 days",
    status: "Active",
  },
  {
    id: "2",
    zone: "Greater Accra",
    method: "Express Delivery",
    rate: 25,
    deliveryTime: "1-2 days",
    status: "Active",
  },
  {
    id: "3",
    zone: "Rest of Ghana",
    method: "Standard Delivery",
    rate: 15,
    deliveryTime: "5-7 days",
    status: "Active",
  },
  {
    id: "4",
    zone: "International",
    method: "International Shipping",
    rate: 50,
    deliveryTime: "10-15 days",
    status: "Inactive",
  },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-700",
};

export default function VendorShippingPage() {
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
            { label: "Shipping" },
          ]}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Shipping
                </h1>
                <p className="text-gray-600">
                  Manage shipping zones and rates
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-5 w-5" />
                Add Shipping Rate
              </Button>
            </div>
          </div>

          {/* Shipping Rates */}
          <div className="bg-white rounded-lg border overflow-hidden mb-6">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Shipping Rates</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Zone
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Shipping Method
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Rate
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Delivery Time
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
                  {shippingRates.map((rate) => (
                    <tr
                      key={rate.id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="py-4 px-6 font-medium text-gray-900">
                        {rate.zone}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {rate.method}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">
                        ${rate.rate}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {rate.deliveryTime}
                      </td>
                      <td className="py-4 px-6">
                        <Badge className={statusColors[rate.status]}>
                          {rate.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded">
                            <Edit className="h-4 w-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shipping Settings */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-6">Shipping Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Free Shipping</h3>
                  <p className="text-sm text-gray-600">
                    Offer free shipping on orders over a certain amount
                  </p>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Local Pickup</h3>
                  <p className="text-sm text-gray-600">
                    Allow customers to pick up orders from your location
                  </p>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">
                    International Shipping
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ship products to international destinations
                  </p>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Eye } from "lucide-react";

const customers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    orders: 12,
    totalSpent: 2450,
    lastPurchase: "July 8, 2026",
    location: "Accra, Ghana",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    orders: 8,
    totalSpent: 1680,
    lastPurchase: "July 5, 2026",
    location: "Kumasi, Ghana",
    status: "Active",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.j@example.com",
    orders: 15,
    totalSpent: 3200,
    lastPurchase: "July 9, 2026",
    location: "Lagos, Nigeria",
    status: "VIP",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.w@example.com",
    orders: 5,
    totalSpent: 890,
    lastPurchase: "June 28, 2026",
    location: "Nairobi, Kenya",
    status: "Active",
  },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  VIP: "bg-purple-100 text-purple-700",
  Inactive: "bg-gray-100 text-gray-700",
};

export default function VendorCustomersPage() {
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
            { label: "Customers" },
          ]}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
            <p className="text-gray-600">
              Manage customers who purchased from your store
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">842</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">798</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">VIP</p>
              <p className="text-2xl font-bold text-purple-600">44</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-sm text-gray-600">Avg. Order Value</p>
              <p className="text-2xl font-bold text-emerald-600">$186</p>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input placeholder="Search customers..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Orders
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Total Spent
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Last Purchase
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Location
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {customer.name}
                          </p>
                          <p className="text-sm text-gray-600">{customer.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {customer.orders}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        ${customer.totalSpent}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {customer.lastPurchase}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {customer.location}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[customer.status]}>
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-gray-600">
                Showing 1 to {customers.length} of 842 customers
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

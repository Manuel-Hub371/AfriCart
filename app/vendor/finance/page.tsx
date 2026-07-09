"use client";

import { useState } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import DashboardCard from "@/components/vendor/dashboard-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Clock,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";

const transactions = [
  {
    id: "TXN-001",
    type: "Sale",
    orderId: "ORD-245",
    amount: 320,
    commission: 32,
    net: 288,
    status: "Completed",
    date: "July 9, 2026",
  },
  {
    id: "TXN-002",
    type: "Sale",
    orderId: "ORD-244",
    amount: 200,
    commission: 20,
    net: 180,
    status: "Completed",
    date: "July 9, 2026",
  },
  {
    id: "TXN-003",
    type: "Refund",
    orderId: "ORD-240",
    amount: -150,
    commission: 15,
    net: -135,
    status: "Refunded",
    date: "July 8, 2026",
  },
  {
    id: "TXN-004",
    type: "Payout",
    orderId: "-",
    amount: -5000,
    commission: 0,
    net: -5000,
    status: "Completed",
    date: "July 7, 2026",
  },
];

const payouts = [
  {
    id: "PAY-001",
    amount: 5000,
    status: "Completed",
    date: "July 7, 2026",
    method: "Bank Transfer",
  },
  {
    id: "PAY-002",
    amount: 4800,
    status: "Processing",
    date: "July 9, 2026",
    method: "Bank Transfer",
  },
];

const statusColors: Record<string, string> = {
  Completed: "bg-green-100 text-green-700",
  Processing: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Refunded: "bg-gray-100 text-gray-700",
  Failed: "bg-red-100 text-red-700",
};

export default function VendorFinancePage() {
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
            { label: "Finance" },
          ]}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Finance
                </h1>
                <p className="text-gray-600">
                  Track your revenue and payouts
                </p>
              </div>
              <Button className="gap-2">
                Request Payout
              </Button>
            </div>
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
              icon={Clock}
              label="Pending Balance"
              value="$8,450"
              iconColor="text-blue-600"
              iconBg="bg-blue-100"
            />
            <DashboardCard
              icon={CreditCard}
              label="Available Balance"
              value="$12,680"
              iconColor="text-purple-600"
              iconBg="bg-purple-100"
            />
            <DashboardCard
              icon={TrendingUp}
              label="This Month"
              value="$18,920"
              change={{ value: 8.3, type: "increase" }}
              iconColor="text-orange-600"
              iconBg="bg-orange-100"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <div className="lg:col-span-2 bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Transactions
                </h2>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                        Transaction ID
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                        Type
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                        Amount
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                        Net
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                        Status
                      </th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn) => (
                      <tr key={txn.id} className="border-b last:border-0">
                        <td className="py-3 px-2 text-sm font-medium text-gray-900">
                          {txn.id}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">
                          {txn.type}
                        </td>
                        <td
                          className={`py-3 px-2 text-sm font-medium ${
                            txn.amount >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          ${Math.abs(txn.amount)}
                        </td>
                        <td
                          className={`py-3 px-2 text-sm font-medium ${
                            txn.net >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          ${Math.abs(txn.net)}
                        </td>
                        <td className="py-3 px-2">
                          <Badge className={statusColors[txn.status]}>
                            {txn.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">
                          {txn.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payout History */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payout History
                </h3>
                <div className="space-y-3">
                  {payouts.map((payout) => (
                    <div
                      key={payout.id}
                      className="p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            ${payout.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">
                            {payout.method}
                          </p>
                        </div>
                        {payout.status === "Completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className={statusColors[payout.status]}>
                          {payout.status}
                        </Badge>
                        <p className="text-xs text-gray-500">{payout.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bank Account */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Bank Account
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Bank Name</span>
                    <span className="text-sm font-medium text-gray-900">
                      Ghana Commercial Bank
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Account</span>
                    <span className="text-sm font-medium text-gray-900">
                      •••• 4521
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className="bg-green-100 text-green-700">
                      Verified
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Update Account
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

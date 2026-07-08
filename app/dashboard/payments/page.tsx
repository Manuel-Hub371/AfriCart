"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Trash2, Plus } from "lucide-react";

const paymentMethods = [
  {
    id: "1",
    type: "card",
    name: "Visa",
    last4: "4521",
    expiry: "12/26",
    isDefault: true,
  },
  {
    id: "2",
    type: "card",
    name: "Mastercard",
    last4: "8765",
    expiry: "08/27",
    isDefault: false,
  },
  {
    id: "3",
    type: "mobile",
    name: "MTN Mobile Money",
    phone: "+233 XX XXX XXXX",
    isDefault: false,
  },
];

export default function PaymentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [methods, setMethods] = useState(paymentMethods);

  const handleRemove = (id: string) => {
    setMethods(methods.filter((method) => method.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Payment Methods
              </h1>
              <Button className="gap-2">
                <Plus className="h-5 w-5" />
                Add Payment Method
              </Button>
            </div>
            <p className="text-gray-600">
              Manage your saved payment methods
            </p>
          </div>

          <div className="max-w-3xl space-y-4">
            {methods.map((method) => (
              <div key={method.id} className="bg-white rounded-lg border p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      method.type === "card"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {method.type === "card" ? (
                      <CreditCard className="h-6 w-6" />
                    ) : (
                      <Smartphone className="h-6 w-6" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {method.name}
                        {method.type === "card" &&
                          ` •••• ${method.last4}`}
                      </h3>
                      {method.isDefault && (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-700"
                        >
                          Default
                        </Badge>
                      )}
                    </div>

                    {method.type === "card" ? (
                      <p className="text-sm text-gray-600">
                        Expires {method.expiry}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600">{method.phone}</p>
                    )}

                    <div className="flex gap-2 mt-4">
                      {!method.isDefault && (
                        <Button variant="outline" size="sm">
                          Set as Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemove(method.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

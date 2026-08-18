"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
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

        <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto w-full space-y-3.5">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-xl border border-gray-200/80 shadow-2xs">
            <div>
              <h1 className="text-base sm:text-xl font-extrabold text-gray-900 tracking-tight">
                Payment Methods
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Manage your saved debit cards and mobile money payment profiles
              </p>
            </div>
            <Button className="gap-1.5 font-bold text-xs h-8 px-3 rounded-lg gradient-primary text-white shadow-2xs">
              <Plus className="h-4 w-4" />
              <span>Add Method</span>
            </Button>
          </div>

          <div className="space-y-3">
            {methods.map((method) => (
              <div key={method.id} className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-2xs hover:border-gray-300 transition-all">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg shrink-0 flex items-center justify-center border ${
                      method.type === "card"
                        ? "bg-blue-50 text-blue-600 border-blue-100"
                        : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    }`}
                  >
                    {method.type === "card" ? (
                      <CreditCard className="h-4 w-4" />
                    ) : (
                      <Smartphone className="h-4 w-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-xs sm:text-sm">
                        {method.name}
                        {method.type === "card" && ` •••• ${method.last4}`}
                      </h3>
                      {method.isDefault && (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-[10px] px-2 py-0.5 rounded-md"
                        >
                          Default
                        </Badge>
                      )}
                    </div>
                    {method.type === "card" ? (
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                        Expires {method.expiry}
                      </p>
                    ) : (
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                        {method.phone}
                      </p>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(method.id)}
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-lg shrink-0"
                    title="Remove method"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

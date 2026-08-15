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

        <main className="flex-1 p-3 sm:p-6 lg:p-8 space-y-3 sm:space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Payment Methods
              </h1>
              <Button className="gap-1 font-bold text-xs h-8 sm:h-9 px-2.5 rounded-xl gradient-primary text-white shadow-2xs">
                <Plus className="h-4 w-4" />
                <span>Add Method</span>
              </Button>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Manage your saved cards and mobile money payment options
            </p>
          </div>

          <div className="max-w-3xl space-y-2.5 sm:space-y-4">
            {methods.map((method) => (
              <div key={method.id} className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-5 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      method.type === "card"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {method.type === "card" ? (
                      <CreditCard className="h-4 w-4 sm:h-6 sm:w-6" />
                    ) : (
                      <Smartphone className="h-4 w-4 sm:h-6 sm:w-6" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-extrabold text-gray-900 text-xs sm:text-base">
                        {method.name}
                        {method.type === "card" && ` •••• ${method.last4}`}
                      </h3>
                      {method.isDefault && (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-[9px] px-2 py-0.2 rounded-full"
                        >
                          Default
                        </Badge>
                      )}
                    </div>
                    {method.type === "card" ? (
                      <p className="text-[10px] sm:text-xs text-gray-400 font-medium mt-0.5">
                        Expires {method.expiry}
                      </p>
                    ) : (
                      <p className="text-[10px] sm:text-xs text-gray-400 font-medium mt-0.5">
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

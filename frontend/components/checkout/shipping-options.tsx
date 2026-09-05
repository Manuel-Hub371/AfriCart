"use client";

import { Truck, Zap } from "lucide-react";

interface ShippingOption {
  id: string;
  name: string;
  duration: string;
  price: number;
}

interface ShippingOptionsProps {
  vendor: {
    vendorId: string;
    vendorName: string;
    shippingOptions: ShippingOption[];
    selectedShipping: string;
  };
  onShippingChange: (vendorId: string, shippingId: string) => void;
}

export default function ShippingOptions({
  vendor,
  onShippingChange,
}: ShippingOptionsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="font-semibold text-gray-900 mb-4">
        Shipping Method for {vendor.vendorName}
      </h3>

      <div className="space-y-3">
        {vendor.shippingOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => onShippingChange(vendor.vendorId, option.id)}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              vendor.selectedShipping === option.id
                ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600"
                : "border-gray-200 hover:border-emerald-300"
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Radio Button */}
              <div className="mt-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    vendor.selectedShipping === option.id
                      ? "border-emerald-600 bg-emerald-600"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {vendor.selectedShipping === option.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </div>

              {/* Icon */}
              <div
                className={`p-2 rounded-lg ${
                  option.id === "express"
                    ? "bg-orange-100 text-orange-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {option.id === "express" ? (
                  <Zap className="h-5 w-5" />
                ) : (
                  <Truck className="h-5 w-5" />
                )}
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-900">
                    {option.name}
                  </h4>
                  <span className="font-semibold text-gray-900">
                    {option.price === 0 ? "FREE" : `$${option.price}`}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Arrives: {option.duration}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

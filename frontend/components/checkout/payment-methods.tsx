"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Building, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PaymentMethodsProps {
  selectedPayment: string;
  onPaymentChange: (method: string) => void;
}

export default function PaymentMethods({
  selectedPayment,
  onPaymentChange,
}: PaymentMethodsProps) {
  const [saveCard, setSaveCard] = useState(false);

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Pay with Visa, Mastercard, or Verve",
    },
    {
      id: "mobile",
      name: "Mobile Money",
      icon: Smartphone,
      description: "MTN, Vodafone, AirtelTigo",
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: Building,
      description: "Direct bank payment",
    },
    {
      id: "wallet",
      name: "Digital Wallet",
      icon: Wallet,
      description: "PayPal, Stripe, others",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => onPaymentChange(method.id)}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedPayment === method.id
                ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600"
                : "border-gray-200 hover:border-emerald-300"
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Radio Button */}
              <div className="mt-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPayment === method.id
                      ? "border-emerald-600 bg-emerald-600"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {selectedPayment === method.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </div>

              {/* Icon & Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <method.icon className="h-5 w-5 text-gray-700" />
                  <h4 className="font-semibold text-gray-900">{method.name}</h4>
                </div>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Form - Card */}
      {selectedPayment === "card" && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <Input placeholder="1234 5678 9012 3456" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <Input placeholder="MM/YY" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <Input placeholder="123" type="password" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Holder Name
            </label>
            <Input placeholder="e.g. Manuel Darko" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">
              Save this card for future purchases
            </span>
          </label>
        </div>
      )}

      {/* Payment Form - Mobile Money */}
      {selectedPayment === "mobile" && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Money Provider
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>MTN Mobile Money</option>
              <option>Vodafone Cash</option>
              <option>AirtelTigo Money</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <Input placeholder="+233 XX XXX XXXX" />
          </div>
          <p className="text-sm text-gray-600">
            You will receive a prompt on your phone to authorize the payment
          </p>
        </div>
      )}

      {/* Payment Form - Bank Transfer */}
      {selectedPayment === "bank" && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            After placing your order, you will receive bank details to complete
            the transfer. Your order will be processed once payment is confirmed.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Note:</span> Bank transfers may take
              1-3 business days to process
            </p>
          </div>
        </div>
      )}

      {/* Payment Form - Digital Wallet */}
      {selectedPayment === "wallet" && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Wallet Provider
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>PayPal</option>
              <option>Stripe</option>
              <option>Apple Pay</option>
              <option>Google Pay</option>
            </select>
          </div>
          <p className="text-sm text-gray-600">
            You will be redirected to complete the payment securely
          </p>
        </div>
      )}
    </div>
  );
}

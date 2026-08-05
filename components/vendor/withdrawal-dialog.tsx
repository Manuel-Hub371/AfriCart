"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, DollarSign, CreditCard, AlertCircle } from "lucide-react";
import { PaymentMethod } from "./payment-method-card";

interface WithdrawalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  minimumAmount: number;
  paymentMethods: PaymentMethod[];
  onSubmit: (amount: number, methodId: string) => void;
}

export function WithdrawalDialog({
  isOpen,
  onClose,
  availableBalance,
  minimumAmount,
  paymentMethods,
  onSubmit,
}: WithdrawalDialogProps) {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(
    paymentMethods.find((m) => m.isDefault)?.id || ""
  );
  const [errors, setErrors] = useState<{ amount?: string; method?: string }>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { amount?: string; method?: string } = {};
    const numAmount = parseFloat(amount);

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (numAmount < minimumAmount) {
      newErrors.amount = `Minimum withdrawal is $${minimumAmount}`;
    } else if (numAmount > availableBalance) {
      newErrors.amount = "Amount exceeds available balance";
    }

    if (!selectedMethod) {
      newErrors.method = "Please select a payment method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(parseFloat(amount), selectedMethod);
      onClose();
      setAmount("");
      setErrors({});
    }
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
    setErrors({ ...errors, amount: undefined });
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl z-50 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Withdraw Funds</h2>
            <p className="text-sm text-gray-600 mt-1">
              Available: ${availableBalance.toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors({ ...errors, amount: undefined });
                }}
                placeholder="0.00"
                step="0.01"
                className={`w-full h-12 pl-10 pr-4 rounded-lg border ${
                  errors.amount ? "border-red-500" : "border-gray-200"
                } bg-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <p className="text-xs text-gray-600 mb-2">Quick amounts:</p>
            <div className="grid grid-cols-4 gap-2">
              {[50, 100, 500, availableBalance].map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(value)}
                  className="border-gray-200 hover:border-emerald-500 hover:text-emerald-700"
                >
                  ${value === availableBalance ? "All" : value}
                </Button>
              ))}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={(e) => {
                      setSelectedMethod(e.target.value);
                      setErrors({ ...errors, method: undefined });
                    }}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{method.name}</p>
                    <p className="text-xs text-gray-500">****{method.accountNumber.slice(-4)}</p>
                  </div>
                  {method.isDefault && (
                    <span className="text-xs font-medium text-emerald-600">Default</span>
                  )}
                </label>
              ))}
            </div>
            {errors.method && (
              <p className="text-sm text-red-600 mt-1">{errors.method}</p>
            )}
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-900">
              <p className="font-medium mb-1">Processing Time</p>
              <p>Withdrawals typically process within 1-3 business days. Minimum withdrawal: ${minimumAmount}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Withdraw ${amount || "0"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

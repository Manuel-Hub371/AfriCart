"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Building2, Smartphone, Check, Edit, Trash2 } from "lucide-react";

export type PaymentMethodType = "bank" | "mobile" | "paypal";

interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  name: string;
  accountNumber: string;
  isDefault: boolean;
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const typeConfig = {
  bank: { label: "Bank Account", icon: Building2, color: "text-blue-600", bgColor: "bg-blue-100" },
  mobile: { label: "Mobile Money", icon: Smartphone, color: "text-emerald-600", bgColor: "bg-emerald-100" },
  paypal: { label: "PayPal", icon: CreditCard, color: "text-purple-600", bgColor: "bg-purple-100" },
};

export function PaymentMethodCard({ method, onEdit, onDelete, onSetDefault }: PaymentMethodCardProps) {
  const config = typeConfig[method.type];
  const Icon = config.icon;

  // Mask account number (show last 4 digits)
  const maskedNumber = `****${method.accountNumber.slice(-4)}`;

  return (
    <div className={`relative rounded-xl border-2 p-6 hover:shadow-md transition-all ${
      method.isDefault 
        ? "border-emerald-500 bg-emerald-50/50" 
        : "border-gray-200 bg-white"
    }`}>
      {/* Default Badge */}
      {method.isDefault && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-emerald-600 text-white border-emerald-600">
            <Check className="h-3 w-3 mr-1" />
            Default
          </Badge>
        </div>
      )}

      {/* Icon and Type */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${config.color}`} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase mb-1">{config.label}</p>
          <h4 className="text-lg font-semibold text-gray-900">{method.name}</h4>
        </div>
      </div>

      {/* Account Number */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-1">Account Number</p>
        <p className="text-xl font-mono font-bold text-gray-900 tracking-wider">{maskedNumber}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {!method.isDefault && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetDefault(method.id)}
            className="flex-1 border-gray-200"
          >
            Set as Default
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(method.id)}
          className="w-10 h-10 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(method.id)}
          className="w-10 h-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

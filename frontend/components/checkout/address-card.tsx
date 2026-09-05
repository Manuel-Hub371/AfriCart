"use client";

import { MapPin, Phone, Mail, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AddressCardProps {
  address: {
    id: string;
    name: string;
    phone: string;
    email: string;
    country: string;
    region: string;
    city: string;
    address: string;
    postalCode: string;
    isDefault: boolean;
  };
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

export default function AddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
}: AddressCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected
          ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600"
          : "border-gray-200 hover:border-emerald-300"
      }`}
    >
      {/* Radio Button */}
      <div className="absolute top-4 right-4">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            isSelected
              ? "border-emerald-600 bg-emerald-600"
              : "border-gray-300 bg-white"
          }`}
        >
          {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
        </div>
      </div>

      <div className="pr-8">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-gray-900">{address.name}</h3>
          {address.isDefault && (
            <Badge variant="secondary" className="text-xs">
              Default
            </Badge>
          )}
        </div>

        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              {address.address}, {address.city}, {address.region},{" "}
              {address.country}
              {address.postalCode && ` - ${address.postalCode}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 flex-shrink-0" />
            <span>{address.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 flex-shrink-0" />
            <span>{address.email}</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1"
        >
          <Edit2 className="h-3 w-3" />
          Edit Address
        </button>
      </div>
    </div>
  );
}

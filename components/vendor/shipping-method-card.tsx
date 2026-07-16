"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Power, Trash2, Truck, Clock, DollarSign } from "lucide-react";

export interface ShippingMethod {
  id: string;
  name: string;
  deliveryTime: string;
  cost: number;
  costType: "flat" | "free" | "calculated";
  isActive: boolean;
  description?: string;
}

interface ShippingMethodCardProps {
  method: ShippingMethod;
  onEdit: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ShippingMethodCard({ method, onEdit, onToggle, onDelete }: ShippingMethodCardProps) {
  return (
    <div className={`rounded-xl border-2 p-6 transition-all ${
      method.isActive 
        ? "border-emerald-200 bg-white" 
        : "border-gray-200 bg-gray-50 opacity-75"
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{method.name}</h3>
            <Badge 
              variant="outline" 
              className={`font-medium ${
                method.isActive 
                  ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {method.isActive ? "Active" : "Disabled"}
            </Badge>
          </div>
          {method.description && (
            <p className="text-sm text-gray-600">{method.description}</p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onEdit(method.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Method
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggle(method.id)}>
              <Power className="h-4 w-4 mr-2" />
              {method.isActive ? "Disable" : "Enable"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(method.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Clock className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Delivery Time</p>
            <p className="text-sm font-medium text-gray-900">{method.deliveryTime}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <DollarSign className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Shipping Cost</p>
            <p className="text-sm font-medium text-gray-900">
              {method.costType === "free" 
                ? "Free" 
                : method.costType === "calculated"
                ? "Calculated at checkout"
                : `$${method.cost.toFixed(2)}`
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Truck className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Type</p>
            <p className="text-sm font-medium text-gray-900 capitalize">{method.costType}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(method.id)}
          className="w-full border-gray-200"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Details
        </Button>
      </div>
    </div>
  );
}

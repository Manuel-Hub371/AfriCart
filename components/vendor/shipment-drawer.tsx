"use client";

import { X, Package, User, MapPin, Truck, Calendar, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shipment, ShipmentStatus } from "./shipment-table";

interface ShipmentDrawerProps {
  shipment: Shipment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTracking: (id: string) => void;
}

const statusConfig = {
  "pending": { label: "Pending", className: "bg-gray-100 text-gray-700 border-gray-200" },
  "processing": { label: "Processing", className: "bg-blue-100 text-blue-700 border-blue-200" },
  "packed": { label: "Packed", className: "bg-purple-100 text-purple-700 border-purple-200" },
  "ready-for-pickup": { label: "Ready for Pickup", className: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  "shipped": { label: "Shipped", className: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  "in-transit": { label: "In Transit", className: "bg-blue-100 text-blue-700 border-blue-200" },
  "delivered": { label: "Delivered", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  "failed": { label: "Failed", className: "bg-red-100 text-red-700 border-red-200" },
  "returned": { label: "Returned", className: "bg-orange-100 text-orange-700 border-orange-200" },
};

const timelineSteps = [
  { key: "pending", label: "Order Received", icon: Package },
  { key: "packed", label: "Packed", icon: Package },
  { key: "ready-for-pickup", label: "Ready for Pickup", icon: CheckCircle },
  { key: "shipped", label: "Picked Up", icon: Truck },
  { key: "in-transit", label: "In Transit", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

export function ShipmentDrawer({ shipment, isOpen, onClose, onUpdateTracking }: ShipmentDrawerProps) {
  if (!isOpen || !shipment) return null;

  const statusOrder: ShipmentStatus[] = ["pending", "processing", "packed", "ready-for-pickup", "shipped", "in-transit", "delivered"];
  const currentStatusIndex = statusOrder.indexOf(shipment.status);

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">Shipment Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div>
            <Badge 
              variant="outline" 
              className={`text-sm font-medium px-3 py-1 ${statusConfig[shipment.status].className}`}
            >
              {statusConfig[shipment.status].label}
            </Badge>
          </div>

          {/* Order Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Order Number</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{shipment.orderNumber}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Product</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{shipment.product}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Customer</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{shipment.customer}</span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Delivery Information</h3>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Shipping Address</p>
                    <p className="text-sm text-gray-900">{shipment.shippingAddress}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Courier</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{shipment.courier}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Tracking Number</span>
                </div>
                <span className="text-sm font-mono font-medium text-gray-900">{shipment.trackingNumber}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Expected Delivery</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{shipment.deliveryDate}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Shipment Timeline</h3>
            <div className="space-y-4">
              {timelineSteps.map((step, index) => {
                const stepIndex = statusOrder.indexOf(step.key as ShipmentStatus);
                const isCompleted = currentStatusIndex >= stepIndex && stepIndex !== -1;
                const isCurrent = currentStatusIndex === stepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? "bg-emerald-600 text-white" 
                          : "bg-gray-200 text-gray-400"
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {index < timelineSteps.length - 1 && (
                        <div className={`w-0.5 h-full mt-1 ${
                          isCompleted ? "bg-emerald-600" : "bg-gray-200"
                        }`} style={{ minHeight: "24px" }} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className={`text-sm font-medium ${
                        isCurrent ? "text-emerald-600" : isCompleted ? "text-gray-900" : "text-gray-500"
                      }`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-emerald-600 mt-0.5">Current Status</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button 
              onClick={() => onUpdateTracking(shipment.id)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Update Tracking
            </Button>
            <Button variant="outline" className="flex-1 border-gray-200">
              Notify Customer
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

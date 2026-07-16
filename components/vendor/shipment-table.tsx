"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ExternalLink, Package } from "lucide-react";

export type ShipmentStatus = 
  | "pending"
  | "processing"
  | "packed"
  | "ready-for-pickup"
  | "shipped"
  | "in-transit"
  | "delivered"
  | "failed"
  | "returned";

export interface Shipment {
  id: string;
  orderNumber: string;
  customer: string;
  product: string;
  courier: string;
  trackingNumber: string;
  status: ShipmentStatus;
  deliveryDate: string;
  shippingAddress: string;
}

interface ShipmentTableProps {
  shipments: Shipment[];
  onViewDetails: (id: string) => void;
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

const ITEMS_PER_PAGE = 10;

export function ShipmentTable({ shipments, onViewDetails }: ShipmentTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(shipments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentShipments = shipments.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Active Shipments</h3>
        <p className="text-sm text-gray-600 mt-1">Track and manage current deliveries</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Order Number
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Customer
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Product
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Courier
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Tracking Number
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Delivery Date
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentShipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <span className="text-sm font-medium text-gray-900">{shipment.orderNumber}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-700">{shipment.customer}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-700">{shipment.product}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{shipment.courier}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-mono text-gray-900">{shipment.trackingNumber}</span>
                </td>
                <td className="py-4 px-6">
                  <Badge 
                    variant="outline" 
                    className={`font-medium ${statusConfig[shipment.status].className}`}
                  >
                    {statusConfig[shipment.status].label}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-700">{shipment.deliveryDate}</span>
                </td>
                <td className="py-4 px-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(shipment.id)}
                    className="h-8 px-3"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, shipments.length)} of {shipments.length} shipments
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-gray-200"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-gray-600 px-3">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-gray-200"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {shipments.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No active shipments</h3>
          <p className="text-gray-600">Your shipments will appear here once orders are placed</p>
        </div>
      )}
    </div>
  );
}

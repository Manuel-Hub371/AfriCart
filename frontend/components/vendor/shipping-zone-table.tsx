"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MapPin } from "lucide-react";

export interface ShippingZone {
  id: string;
  name: string;
  country: string;
  regions: string[];
  shippingFee: number;
  deliveryTime: string;
  isActive: boolean;
}

interface ShippingZoneTableProps {
  zones: ShippingZone[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ShippingZoneTable({ zones, onEdit, onDelete }: ShippingZoneTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Delivery Zones</h3>
        <p className="text-sm text-gray-600 mt-1">Configure shipping zones and regional delivery settings</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Zone Name
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Country
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Regions
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Shipping Fee
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Delivery Time
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {zones.map((zone) => (
              <tr key={zone.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{zone.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-700">{zone.country}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-1">
                    {zone.regions.slice(0, 2).map((region, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {region}
                      </Badge>
                    ))}
                    {zone.regions.length > 2 && (
                      <Badge variant="outline" className="text-xs bg-gray-100">
                        +{zone.regions.length - 2}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-semibold text-gray-900">
                    ${zone.shippingFee.toFixed(2)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-700">{zone.deliveryTime}</span>
                </td>
                <td className="py-4 px-6">
                  <Badge 
                    variant="outline" 
                    className={`font-medium ${
                      zone.isActive 
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {zone.isActive ? "Active" : "Disabled"}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(zone.id)}
                      className="h-8 px-3"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(zone.id)}
                      className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {zones.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No shipping zones</h3>
          <p className="text-gray-600">Add your first delivery zone to get started</p>
        </div>
      )}
    </div>
  );
}

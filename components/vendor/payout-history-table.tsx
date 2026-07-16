"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, DollarSign } from "lucide-react";

export type PayoutStatus = "completed" | "processing" | "pending" | "failed";

interface Payout {
  id: string;
  date: string;
  amount: number;
  paymentMethod: string;
  status: PayoutStatus;
  transactionId?: string;
}

interface PayoutHistoryTableProps {
  payouts: Payout[];
  onViewDetails: (id: string) => void;
}

const statusConfig = {
  completed: { label: "Completed", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-700 border-blue-200" },
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  failed: { label: "Failed", className: "bg-red-100 text-red-700 border-red-200" },
};

export function PayoutHistoryTable({ payouts, onViewDetails }: PayoutHistoryTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Payout History</h3>
        <p className="text-sm text-gray-600 mt-1">Track all your completed and pending payouts</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Payout ID
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Date
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Amount
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Payment Method
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
            {payouts.map((payout) => (
              <tr key={payout.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{payout.id}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-700">{payout.date}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-semibold text-gray-900">
                    ${payout.amount.toLocaleString()}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <p className="text-sm text-gray-900">{payout.paymentMethod}</p>
                    {payout.transactionId && (
                      <p className="text-xs text-gray-500">{payout.transactionId}</p>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <Badge 
                    variant="outline" 
                    className={`font-medium ${statusConfig[payout.status].className}`}
                  >
                    {statusConfig[payout.status].label}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(payout.id)}
                      className="h-8 px-3"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {payout.status === "completed" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payouts.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No payout history</h3>
          <p className="text-gray-600">Your completed payouts will appear here</p>
        </div>
      )}
    </div>
  );
}

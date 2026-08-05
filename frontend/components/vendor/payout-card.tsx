"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface PayoutCardProps {
  availableBalance: number;
  pendingAmount: number;
  nextPayoutDate: string;
  minimumPayout: number;
  onWithdraw: () => void;
}

export function PayoutCard({
  availableBalance,
  pendingAmount,
  nextPayoutDate,
  minimumPayout,
  onWithdraw,
}: PayoutCardProps) {
  const canWithdraw = availableBalance >= minimumPayout;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Payout Management</h3>
        <p className="text-sm text-gray-600">Manage your earnings and withdrawals</p>
      </div>

      {/* Available Balance */}
      <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-emerald-700 mb-1">Available Balance</p>
            <h2 className="text-4xl font-bold text-emerald-900">
              ${availableBalance.toLocaleString()}
            </h2>
            <p className="text-xs text-emerald-600 mt-1">Ready for withdrawal</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        </div>
        
        <Button
          onClick={onWithdraw}
          disabled={!canWithdraw}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
        >
          {canWithdraw ? "Withdraw Funds" : `Minimum $${minimumPayout} required`}
        </Button>
      </div>

      {/* Pending Payout */}
      <div className="mb-6 p-5 rounded-lg border border-yellow-200 bg-yellow-50">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-900 mb-1">Pending Payout</p>
            <p className="text-2xl font-bold text-yellow-900">
              ${pendingAmount.toLocaleString()}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Calendar className="h-4 w-4 text-yellow-600" />
              <p className="text-xs text-yellow-700">
                Expected: {nextPayoutDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Info */}
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
          <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Automatic Payouts</p>
            <p className="text-xs text-gray-600">Every 7 days to your default account</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Minimum Payout</p>
            <p className="text-xs text-gray-600">${minimumPayout} required for withdrawal</p>
          </div>
        </div>
      </div>
    </div>
  );
}

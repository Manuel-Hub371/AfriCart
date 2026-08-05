"use client";

import { X, Calendar, DollarSign, ShoppingCart, User, CreditCard, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Transaction, TransactionType, TransactionStatus } from "./transaction-table";

interface TransactionDrawerProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

const typeConfig = {
  sale: { label: "Sale", className: "bg-emerald-100 text-emerald-700" },
  refund: { label: "Refund", className: "bg-red-100 text-red-700" },
  commission: { label: "Commission", className: "bg-orange-100 text-orange-700" },
  withdrawal: { label: "Withdrawal", className: "bg-blue-100 text-blue-700" },
  adjustment: { label: "Adjustment", className: "bg-purple-100 text-purple-700" },
  bonus: { label: "Bonus", className: "bg-yellow-100 text-yellow-700" },
};

const statusConfig = {
  completed: { label: "Completed", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  failed: { label: "Failed", className: "bg-red-100 text-red-700 border-red-200" },
};

export function TransactionDrawer({ transaction, isOpen, onClose }: TransactionDrawerProps) {
  if (!isOpen || !transaction) return null;

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
          <h2 className="text-xl font-semibold text-gray-900">Transaction Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Transaction Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge className={typeConfig[transaction.type].className}>
                {typeConfig[transaction.type].label}
              </Badge>
              <Badge 
                variant="outline" 
                className={`font-medium ${statusConfig[transaction.status].className}`}
              >
                {statusConfig[transaction.status].label}
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{transaction.id}</h3>
            <p className="text-sm text-gray-600">Transaction Reference</p>
          </div>

          {/* Date */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Transaction Date</p>
                <p className="text-sm text-gray-600">{transaction.date}</p>
              </div>
            </div>
          </div>

          {/* Order Information */}
          {(transaction.orderNumber || transaction.customer) && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Information</h4>
              <div className="space-y-3">
                {transaction.orderNumber && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-700">Order Number</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{transaction.orderNumber}</span>
                  </div>
                )}
                {transaction.customer && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-700">Customer</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{transaction.customer}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Financial Breakdown */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Financial Breakdown</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Gross Amount</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  ${transaction.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-red-400" />
                  <span className="text-sm text-red-700">Fees & Commission</span>
                </div>
                <span className="text-lg font-semibold text-red-700">
                  -${transaction.fees.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-900">Net Earnings</span>
                </div>
                <span className="text-xl font-bold text-emerald-900">
                  ${transaction.netAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Transaction Timeline</h4>
            <div className="space-y-4">
              {[
                { date: transaction.date, event: "Transaction Initiated", time: "10:30 AM" },
                { date: transaction.date, event: "Payment Processed", time: "10:31 AM" },
                { date: transaction.date, event: "Commission Calculated", time: "10:31 AM" },
                { date: transaction.date, event: "Amount Credited", time: "10:32 AM" },
              ].map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full ${
                      index === 3 ? "bg-emerald-600" : "bg-gray-300"
                    }`} />
                    {index < 3 && <div className="w-0.5 h-full bg-gray-200 mt-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium text-gray-900">{item.event}</p>
                    <p className="text-xs text-gray-500">{item.date} at {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" className="flex-1 border-gray-200">
              <FileText className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            <Button variant="outline" className="flex-1 border-gray-200">
              Report Issue
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

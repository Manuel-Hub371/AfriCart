"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

export type TransactionType = "sale" | "refund" | "commission" | "withdrawal" | "adjustment" | "bonus";
export type TransactionStatus = "completed" | "pending" | "failed";

interface Transaction {
  id: string;
  type: TransactionType;
  orderNumber?: string;
  customer?: string;
  amount: number;
  fees: number;
  netAmount: number;
  status: TransactionStatus;
  date: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  onViewDetails: (id: string) => void;
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

const ITEMS_PER_PAGE = 10;

export function TransactionTable({ transactions, onViewDetails }: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
        <p className="text-sm text-gray-600 mt-1">All financial activities and transactions</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Transaction ID
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Type
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Order / Customer
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Amount
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Fees
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Net Amount
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Date
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <span className="text-sm font-medium text-gray-900">{transaction.id}</span>
                </td>
                <td className="py-4 px-6">
                  <Badge className={typeConfig[transaction.type].className}>
                    {typeConfig[transaction.type].label}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <div>
                    {transaction.orderNumber && (
                      <p className="text-sm font-medium text-gray-900">{transaction.orderNumber}</p>
                    )}
                    {transaction.customer && (
                      <p className="text-xs text-gray-500">{transaction.customer}</p>
                    )}
                    {!transaction.orderNumber && !transaction.customer && (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-semibold text-gray-900">
                    ${transaction.amount.toLocaleString()}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-red-600">
                    -${transaction.fees.toLocaleString()}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-bold text-emerald-600">
                    ${transaction.netAmount.toLocaleString()}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <Badge 
                    variant="outline" 
                    className={`font-medium ${statusConfig[transaction.status].className}`}
                  >
                    {statusConfig[transaction.status].label}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-700">{transaction.date}</span>
                </td>
                <td className="py-4 px-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(transaction.id)}
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
            Showing {startIndex + 1} to {Math.min(endIndex, transactions.length)} of {transactions.length} transactions
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

      {transactions.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
          <p className="text-gray-600">Your transaction history will appear here</p>
        </div>
      )}
    </div>
  );
}

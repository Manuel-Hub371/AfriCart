"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

export type TicketStatus = "open" | "pending" | "awaiting-reply" | "in-progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  lastUpdate: string;
  createdDate: string;
}

interface TicketTableProps {
  tickets: Ticket[];
  onViewDetails: (id: string) => void;
}

const statusConfig = {
  "open": { label: "Open", className: "bg-blue-100 text-blue-700 border-blue-200" },
  "pending": { label: "Pending", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  "awaiting-reply": { label: "Awaiting Reply", className: "bg-orange-100 text-orange-700 border-orange-200" },
  "in-progress": { label: "In Progress", className: "bg-purple-100 text-purple-700 border-purple-200" },
  "resolved": { label: "Resolved", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  "closed": { label: "Closed", className: "bg-gray-100 text-gray-700 border-gray-200" },
};

const priorityConfig = {
  "low": { label: "Low", className: "bg-gray-100 text-gray-700" },
  "medium": { label: "Medium", className: "bg-blue-100 text-blue-700" },
  "high": { label: "High", className: "bg-orange-100 text-orange-700" },
  "urgent": { label: "Urgent", className: "bg-red-100 text-red-700" },
};

const ITEMS_PER_PAGE = 10;

export function TicketTable({ tickets, onViewDetails }: TicketTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(tickets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTickets = tickets.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Your Support Tickets</h3>
        <p className="text-sm text-gray-600 mt-1">Track and manage all your support requests</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Ticket ID
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Subject
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Category
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Priority
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Last Update
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Created
              </th>
              <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <span className="text-sm font-medium text-gray-900">{ticket.id}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-900 font-medium">{ticket.subject}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-700">{ticket.category}</span>
                </td>
                <td className="py-4 px-6">
                  <Badge className={priorityConfig[ticket.priority].className}>
                    {priorityConfig[ticket.priority].label}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <Badge 
                    variant="outline" 
                    className={`font-medium ${statusConfig[ticket.status].className}`}
                  >
                    {statusConfig[ticket.status].label}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-700">{ticket.lastUpdate}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-700">{ticket.createdDate}</span>
                </td>
                <td className="py-4 px-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(ticket.id)}
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
            Showing {startIndex + 1} to {Math.min(endIndex, tickets.length)} of {tickets.length} tickets
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

      {tickets.length === 0 && (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No support tickets</h3>
          <p className="text-gray-600">Your support tickets will appear here once you create them</p>
        </div>
      )}
    </div>
  );
}

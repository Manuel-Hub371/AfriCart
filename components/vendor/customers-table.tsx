"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomerStatusBadge, CustomerStatus } from "./customer-status-badge";
import { Eye, ArrowUpDown, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  totalOrders: number;
  lifetimeSpend: number;
  averageOrderValue: number;
  lastPurchase: string;
  status: CustomerStatus;
  registrationDate: string;
}

interface CustomersTableProps {
  customers: Customer[];
  onViewCustomer: (customer: Customer) => void;
  onSort: (column: string) => void;
}

export function CustomersTable({
  customers,
  onViewCustomer,
  onSort,
}: CustomersTableProps) {
  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b-2 border-gray-200">
            <TableHead className="font-semibold text-gray-900">
              <button
                onClick={() => onSort("name")}
                className="flex items-center gap-1 hover:text-emerald-600"
              >
                Customer
                <ArrowUpDown className="h-3.5 w-3.5" />
              </button>
            </TableHead>
            <TableHead className="font-semibold text-gray-900">Email</TableHead>
            <TableHead className="font-semibold text-gray-900">Phone</TableHead>
            <TableHead className="font-semibold text-gray-900">Location</TableHead>
            <TableHead className="font-semibold text-gray-900">
              <button
                onClick={() => onSort("orders")}
                className="flex items-center gap-1 hover:text-emerald-600"
              >
                Total Orders
                <ArrowUpDown className="h-3.5 w-3.5" />
              </button>
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              <button
                onClick={() => onSort("spend")}
                className="flex items-center gap-1 hover:text-emerald-600"
              >
                Lifetime Spend
                <ArrowUpDown className="h-3.5 w-3.5" />
              </button>
            </TableHead>
            <TableHead className="font-semibold text-gray-900">Avg Order Value</TableHead>
            <TableHead className="font-semibold text-gray-900">
              <button
                onClick={() => onSort("last-purchase")}
                className="flex items-center gap-1 hover:text-emerald-600"
              >
                Last Purchase
                <ArrowUpDown className="h-3.5 w-3.5" />
              </button>
            </TableHead>
            <TableHead className="font-semibold text-gray-900">Status</TableHead>
            <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow
              key={customer.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                    {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{customer.name}</div>
                    <div className="text-xs text-gray-500">
                      Since {customer.registrationDate}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{customer.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-gray-700">
                  <div className="text-sm font-medium">{customer.city}</div>
                  <div className="text-xs text-gray-500">{customer.country}</div>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center justify-center min-w-[60px] px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium text-sm">
                  {customer.totalOrders}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-semibold text-gray-900">
                  ${customer.lifetimeSpend.toFixed(2)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-gray-700">
                  ${customer.averageOrderValue.toFixed(2)}
                </span>
              </TableCell>
              <TableCell className="text-gray-700 text-sm">
                {customer.lastPurchase}
              </TableCell>
              <TableCell>
                <CustomerStatusBadge status={customer.status} />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewCustomer(customer)}
                  className="h-8 w-8 p-0 hover:bg-emerald-50 hover:text-emerald-600"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

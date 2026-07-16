"use client";

import { useState } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { OrderStatistics } from "@/components/vendor/order-statistics";
import { OrderToolbar } from "@/components/vendor/order-toolbar";
import { OrdersTable, Order } from "@/components/vendor/orders-table";
import { OrderPagination } from "@/components/vendor/order-pagination";
import { BulkOrderActions } from "@/components/vendor/bulk-order-actions";
import { OrderDetailsDrawer } from "@/components/vendor/order-details-drawer";
import { Download, Printer } from "lucide-react";
import type { OrderStatus } from "@/components/vendor/order-status-badge";

export default function OrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState("newest");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mock data - replace with actual API call
  const mockOrders: Order[] = Array.from({ length: 100 }, (_, i) => ({
    id: `order-${i + 1}`,
    orderNumber: `ORD-${String(10000 + i).padStart(5, "0")}`,
    customer: {
      name: [
        "John Smith",
        "Sarah Johnson",
        "Michael Brown",
        "Emily Davis",
        "David Wilson",
        "Jessica Martinez",
        "Daniel Garcia",
        "Ashley Rodriguez",
        "Christopher Lee",
        "Amanda Taylor",
      ][i % 10],
      email: [
        "john.smith@email.com",
        "sarah.j@email.com",
        "michael.b@email.com",
        "emily.d@email.com",
        "david.w@email.com",
        "jessica.m@email.com",
        "daniel.g@email.com",
        "ashley.r@email.com",
        "chris.l@email.com",
        "amanda.t@email.com",
      ][i % 10],
    },
    products: Array.from({ length: ((i % 3) + 1) }, (_, j) => ({
      name: [
        "Wireless Headphones",
        "Smart Watch",
        "Laptop Bag",
        "USB-C Cable",
        "Power Bank",
      ][j % 5],
      image: `https://images.unsplash.com/photo-${1500000000000 + i * 1000 + j * 100}?w=100&h=100&fit=crop`,
      quantity: ((i + j) % 3) + 1,
    })),
    totalAmount: ((i * 37 + 123) % 500) + 50,
    paymentStatus: (["paid", "pending", "failed", "refunded"] as const)[i % 4],
    orderStatus: (
      [
        "pending",
        "confirmed",
        "processing",
        "packed",
        "ready-to-ship",
        "shipped",
        "delivered",
        "cancelled",
      ] as const
    )[i % 8] as OrderStatus,
    shippingStatus: (["not-shipped", "in-transit", "delivered"] as const)[i % 3],
    orderDate: new Date(Date.now() - i * 86400000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    expectedDelivery: new Date(Date.now() + (7 - i) * 86400000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }));

  const totalOrders = mockOrders.length;
  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  const currentOrders = mockOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(currentOrders.map((o) => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on ${selectedIds.length} orders`);
    setTimeout(() => {
      setSelectedIds([]);
    }, 1000);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleExport = () => {
    console.log("Exporting orders...");
  };

  const handlePrint = () => {
    console.log("Printing orders...");
  };

  const handleRefresh = () => {
    console.log("Refreshing orders...");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <VendorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <VendorTopbar
          onMenuClick={() => setSidebarOpen(true)}
          breadcrumbs={[
            { label: "Dashboard", href: "/vendor" },
            { label: "Orders" },
          ]}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Orders Management
                </h1>
                <p className="text-gray-600">
                  Manage customer orders, fulfillment, shipping, returns, and refunds
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="h-10 px-4 border-gray-200 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  className="h-10 px-4 border-gray-200 hover:bg-gray-50"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>

            {/* Statistics */}
            <OrderStatistics />

            {/* Toolbar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
              <OrderToolbar
                onSearch={setSearchQuery}
                onFilterChange={setFilters}
                onExport={handleExport}
                onPrint={handlePrint}
                onRefresh={handleRefresh}
                onSort={setSortBy}
              />
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
              <OrdersTable
                orders={currentOrders}
                selectedIds={selectedIds}
                onSelectAll={handleSelectAll}
                onSelect={handleSelect}
                onViewOrder={handleViewOrder}
                onSort={(column) => console.log("Sort by:", column)}
              />
            </div>

            {/* Pagination */}
            <div className="bg-white rounded-xl border border-gray-200 px-6 py-4">
              <OrderPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalOrders}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(items) => {
                  setItemsPerPage(items);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Bulk Action Bar */}
      <BulkOrderActions
        selectedCount={selectedIds.length}
        onClearSelection={handleClearSelection}
        onAction={handleBulkAction}
      />

      {/* Order Details Drawer */}
      <OrderDetailsDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}

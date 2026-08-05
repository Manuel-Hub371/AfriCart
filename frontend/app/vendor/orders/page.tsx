"use client";

import { useState, useEffect, useCallback } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { OrderToolbar } from "@/components/vendor/order-toolbar";
import { OrdersTable, Order } from "@/components/vendor/orders-table";
import { OrderPagination } from "@/components/vendor/order-pagination";
import { BulkOrderActions } from "@/components/vendor/bulk-order-actions";
import { OrderDetailsDrawer } from "@/components/vendor/order-details-drawer";
import { Loader2 } from "lucide-react";
import type { OrderStatus } from "@/components/vendor/order-status-badge";

// Map API OrderDTO -> Vendor Order UI shape
function toVendorUIOrder(order: any): Order {
  const customerName = order.customerName || "Customer";
  const customerEmail = order.customerEmail || "customer@example.com";

  let orderStatus: OrderStatus = "processing";
  if (order.status === "SHIPPED") orderStatus = "shipped";
  else if (order.status === "DELIVERED") orderStatus = "delivered";
  else if (order.status === "CANCELLED") orderStatus = "cancelled";
  else orderStatus = "processing";

  let shippingStatus: Order["shippingStatus"] = "not-shipped";
  if (orderStatus === "shipped") shippingStatus = "in-transit";
  else if (orderStatus === "delivered") shippingStatus = "delivered";

  return {
    id: order.id,
    orderNumber: `ORD-${order.id.slice(0, 8).toUpperCase()}`,
    customer: {
      name: customerName,
      email: customerEmail,
    },
    products: (order.orderItems || []).map((item: any) => ({
      name: item.productName || item.product?.name || "Product",
      sku: (item.productId || "").slice(0, 8).toUpperCase(),
      price: item.price,
      quantity: item.quantity,
      image: item.productImage || item.product?.images?.[0] || "",
    })),
    totalAmount: order.totalAmount,
    orderStatus,
    shippingStatus,
    paymentStatus: order.paymentStatus === "PAID" ? "paid" : "pending",
    orderDate: new Date(order.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    expectedDelivery: "3 - 5 business days",
  };
}

export default function OrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState("newest");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Real API state
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendorOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/vendor/orders");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to load orders");
      }
      const data = await res.json();
      setAllOrders((data.orders || []).map(toVendorUIOrder));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendorOrders();
  }, [fetchVendorOrders]);

  // Client-side search and status filter
  const filteredOrders = allOrders.filter((order) => {
    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(q) ||
        order.customer.name.toLowerCase().includes(q) ||
        order.customer.email.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // 2. Status Filter
    if (filters.status && filters.status.length > 0) {
      const matchesStatus = filters.status.includes(order.orderStatus);
      if (!matchesStatus) return false;
    }

    // 3. Payment Filter
    if (filters.payment && filters.payment.length > 0) {
      const matchesPayment = filters.payment.includes(order.paymentStatus);
      if (!matchesPayment) return false;
    }

    return true;
  });

  // Client-side Sort
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "amount-high") return b.totalAmount - a.totalAmount;
    if (sortBy === "amount-low") return a.totalAmount - b.totalAmount;
    return 0; // default newest
  });

  const totalOrders = sortedOrders.length;
  const totalPages = Math.ceil(totalOrders / itemsPerPage) || 1;
  const currentOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? currentOrders.map((o) => o.id) : []);
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleClearSelection = () => setSelectedIds([]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    let apiStatus = "PROCESSING";
    if (newStatus === "shipped") apiStatus = "SHIPPED";
    else if (newStatus === "delivered") apiStatus = "DELIVERED";
    else if (newStatus === "cancelled") apiStatus = "CANCELLED";

    try {
      const res = await fetch(`/api/vendor/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: apiStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to update status");
      }
      await fetchVendorOrders();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleExportOrders = () => {
    if (allOrders.length === 0) return;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Order Number,Customer,Email,Total Amount,Status,Payment Status,Order Date"]
        .concat(
          allOrders.map(
            (o) =>
              `"${o.orderNumber}","${o.customer.name}","${o.customer.email}",${o.totalAmount},"${o.orderStatus}","${o.paymentStatus}","${o.orderDate}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vendor_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
                  Order Management
                </h1>
                <p className="text-gray-600 text-sm">
                  Track, process, and fulfill customer order line items in real time.
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mr-3" />
                <span className="text-gray-600 text-sm font-medium">Loading vendor orders...</span>
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="text-center py-16">
                <p className="text-red-600 mb-4 text-sm">{error}</p>
                <Button onClick={fetchVendorOrders} variant="outline" className="rounded-xl">
                  Try Again
                </Button>
              </div>
            )}

            {/* Orders Display (No Summary Cards as per Part 1) */}
            {!loading && !error && (
              <div className="space-y-6">
                {/* Toolbar */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                  <OrderToolbar
                    orders={allOrders}
                    onSearch={setSearchQuery}
                    onFilterChange={setFilters}
                    onExport={handleExportOrders}
                    onPrint={() => window.print()}
                    onRefresh={fetchVendorOrders}
                    onSort={setSortBy}
                  />
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <OrdersTable
                    orders={currentOrders}
                    selectedIds={selectedIds}
                    onSelectAll={handleSelectAll}
                    onSelect={handleSelect}
                    onViewOrder={(order) => setSelectedOrder(order)}
                    onSort={(column) => console.log("Sort by:", column)}
                  />
                </div>

                {/* Pagination */}
                <div className="bg-white rounded-2xl border border-gray-200 px-6 py-4 shadow-sm">
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
            )}
          </div>
        </main>
      </div>

      {/* Bulk Action Bar */}
      <BulkOrderActions
        selectedCount={selectedIds.length}
        onClearSelection={handleClearSelection}
        onAction={(action) => console.log("Bulk action:", action)}
      />

      {/* Order Details Drawer */}
      {selectedOrder && (
        <OrderDetailsDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={(newStatus) => {
            handleStatusChange(selectedOrder.id, newStatus);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}

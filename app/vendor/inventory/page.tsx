"use client";

import { useState } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { InventoryStatistics } from "@/components/vendor/inventory-statistics";
import { InventoryToolbar } from "@/components/vendor/inventory-toolbar";
import { InventoryTable, InventoryItem } from "@/components/vendor/inventory-table";
import { InventoryPagination } from "@/components/vendor/inventory-pagination";
import { BulkInventoryActions } from "@/components/vendor/bulk-inventory-actions";
import { InventoryEmptyState } from "@/components/vendor/inventory-empty-state";
import { Plus } from "lucide-react";
import type { InventoryStatus } from "@/components/vendor/inventory-status-badge";

export default function InventoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState("name-asc");

  // Mock data - replace with actual API call
  const mockInventory: InventoryItem[] = Array.from({ length: 100 }, (_, i) => {
    const products = [
      "Wireless Headphones",
      "Smart Watch",
      "Laptop Bag",
      "USB-C Cable",
      "Power Bank",
      "Ceramic Mug",
      "Yoga Mat",
      "LED Lamp",
      "Water Bottle",
      "Phone Case",
    ];
    
    const categories = ["Electronics", "Fashion", "Home", "Beauty", "Sports"];
    const warehouses = ["Main Warehouse", "East Warehouse", "West Warehouse"];
    const variants = ["Black", "White", "Blue", "Red", ""];
    
    const availableStock = ((i * 13 + 7) % 200);
    const reservedStock = ((i * 5 + 3) % 30);
    const incomingStock = ((i * 7 + 11) % 100);
    const reorderLevel = 20;
    const unitPrice = ((i * 17 + 23) % 200) + 20;
    
    const getStatus = (): InventoryStatus => {
      if (availableStock === 0) return "out-of-stock";
      if (availableStock <= reorderLevel) return "low-stock";
      if (availableStock > 150) return "overstocked";
      if (incomingStock > 50) return "incoming";
      return "in-stock";
    };

    return {
      id: `inv-${i + 1}`,
      productName: products[i % 10],
      sku: `SKU-${String(10000 + i).padStart(5, "0")}`,
      variant: variants[i % 5],
      category: categories[i % 5],
      warehouse: warehouses[i % 3],
      availableStock,
      reservedStock,
      incomingStock,
      reorderLevel,
      inventoryValue: availableStock * unitPrice,
      status: getStatus(),
      lastUpdated: new Date(Date.now() - (i * 2 * 86400000)).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      image: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?w=100&h=100&fit=crop`,
    };
  });

  const totalItems = mockInventory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = mockInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(currentItems.map((i) => i.id));
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
    console.log(`Bulk action: ${action} on ${selectedIds.length} items`);
    setTimeout(() => {
      setSelectedIds([]);
    }, 1000);
  };

  const handleViewItem = (item: InventoryItem) => {
    console.log("View item:", item);
    // Open drawer with item details
  };

  const handleAddStock = () => {
    console.log("Add stock...");
  };

  const handleExport = () => {
    console.log("Exporting inventory...");
  };

  const handleImport = () => {
    console.log("Import inventory...");
  };

  const handleAdjustment = () => {
    console.log("Stock adjustment...");
  };

  const handleRefresh = () => {
    console.log("Refreshing inventory...");
  };

  const handleAddProduct = () => {
    console.log("Add product...");
  };

  const showEmptyState = false; // Change based on actual filter results

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
            { label: "Inventory" },
          ]}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Inventory Management
                </h1>
                <p className="text-gray-600">
                  Monitor stock levels, manage inventory, track movements, and prevent shortages
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleAddStock}
                  className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stock
                </Button>
              </div>
            </div>

            {/* Statistics */}
            <InventoryStatistics />

            {/* Toolbar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
              <InventoryToolbar
                onSearch={setSearchQuery}
                onFilterChange={setFilters}
                onAddStock={handleAddStock}
                onExport={handleExport}
                onImport={handleImport}
                onAdjustment={handleAdjustment}
                onRefresh={handleRefresh}
                onSort={setSortBy}
              />
            </div>

            {showEmptyState ? (
              <InventoryEmptyState
                onRefresh={handleRefresh}
                onAddProduct={handleAddProduct}
                onImport={handleImport}
              />
            ) : (
              <>
                {/* Inventory Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                  <InventoryTable
                    items={currentItems}
                    selectedIds={selectedIds}
                    onSelectAll={handleSelectAll}
                    onSelect={handleSelect}
                    onViewItem={handleViewItem}
                    onSort={(column) => console.log("Sort by:", column)}
                  />
                </div>

                {/* Pagination */}
                <div className="bg-white rounded-xl border border-gray-200 px-6 py-4">
                  <InventoryPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(items) => {
                      setItemsPerPage(items);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Bulk Action Bar */}
      <BulkInventoryActions
        selectedCount={selectedIds.length}
        onClearSelection={handleClearSelection}
        onAction={handleBulkAction}
      />
    </div>
  );
}

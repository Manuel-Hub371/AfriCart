"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { InventoryStatistics } from "@/components/vendor/inventory-statistics";
import { InventoryToolbar } from "@/components/vendor/inventory-toolbar";
import { InventoryTable, InventoryItem } from "@/components/vendor/inventory-table";
import { InventoryPagination } from "@/components/vendor/inventory-pagination";
import { BulkInventoryActions } from "@/components/vendor/bulk-inventory-actions";
import { InventoryEmptyState } from "@/components/vendor/inventory-empty-state";
import { Plus, Loader2 } from "lucide-react";
import type { InventoryStatus } from "@/components/vendor/inventory-status-badge";
import { useRouter } from "next/navigation";

// Map API product → InventoryItem UI shape
function toInventoryItem(p: any): InventoryItem {
  const stock: number = p.stock ?? 0;

  const getStatus = (): InventoryStatus => {
    if (stock === 0) return "out-of-stock";
    if (stock <= 10) return "low-stock";
    if (stock > 150) return "overstocked";
    return "in-stock";
  };

  return {
    id: p.id,
    productName: p.name,
    sku: p.id.slice(0, 8).toUpperCase(),
    variant: "",
    category: p.categoryName ?? "Uncategorized",
    warehouse: "Main Warehouse",
    availableStock: stock,
    reservedStock: 0,
    incomingStock: 0,
    reorderLevel: 10,
    inventoryValue: stock * Number(p.price ?? 0),
    status: getStatus(),
    lastUpdated: p.updatedAt
      ? new Date(p.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "—",
    image: p.images?.[0] ?? "",
  };
}

export default function InventoryPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState("name-asc");

  // Real data state
  const [allItems, setAllItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/vendor/inventory");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to load inventory");
      }
      const data = await res.json();
      setAllItems((data.inventory ?? []).map(toInventoryItem));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Calculated inventory metrics
  const inventoryStats = useMemo(() => {
    let totalStock = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let totalVal = 0;

    allItems.forEach((item) => {
      totalStock += item.availableStock;
      if (item.availableStock === 0) outOfStock += 1;
      else if (item.availableStock <= 10) lowStock += 1;
      totalVal += item.inventoryValue;
    });

    return {
      totalProducts: allItems.length,
      totalStockUnits: totalStock,
      lowStockCount: lowStock,
      outOfStockCount: outOfStock,
      totalValue: totalVal,
    };
  }, [allItems]);

  // Client-side search
  const filteredItems = allItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.productName.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  // Client-side sort
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "name-asc") return a.productName.localeCompare(b.productName);
    if (sortBy === "name-desc") return b.productName.localeCompare(a.productName);
    if (sortBy === "stock-asc") return a.availableStock - b.availableStock;
    if (sortBy === "stock-desc") return b.availableStock - a.availableStock;
    return 0;
  });

  const totalItems = sortedItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const currentItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? currentItems.map((i) => i.id) : []);
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleClearSelection = () => setSelectedIds([]);

  const handleViewItem = (item: InventoryItem) => {
    router.push(`/vendor/products/${item.id}/edit`);
  };

  const handleAddStock = () => router.push("/vendor/products/new");
  const handleExport = () => {
    if (allItems.length === 0) return;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Product Name,SKU,Category,Available Stock,Inventory Value"]
        .concat(
          allItems.map(
            (i) => `"${i.productName}","${i.sku}","${i.category}",${i.availableStock},${i.inventoryValue}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vendor_inventory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefresh = () => fetchInventory();
  const handleAddProduct = () => router.push("/vendor/products/new");

  const showEmptyState = !loading && !error && totalItems === 0;

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
                <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
                  Inventory Management
                </h1>
                <p className="text-gray-600 text-sm">
                  Monitor stock levels, manage inventory, and prevent shortages across your storefront.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleAddStock}
                  className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stock
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mr-3" />
                <span className="text-gray-600 font-medium text-sm">Loading inventory...</span>
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="text-center py-16">
                <p className="text-red-600 mb-4 text-sm">{error}</p>
                <Button onClick={handleRefresh} variant="outline" className="rounded-xl">
                  Try Again
                </Button>
              </div>
            )}

            {/* Real Statistics */}
            {!loading && !error && (
              <InventoryStatistics
                totalProducts={inventoryStats.totalProducts}
                totalStockUnits={inventoryStats.totalStockUnits}
                lowStockCount={inventoryStats.lowStockCount}
                outOfStockCount={inventoryStats.outOfStockCount}
                totalValue={inventoryStats.totalValue}
              />
            )}

            {/* Toolbar */}
            {!loading && !error && (
              <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
                <InventoryToolbar
                  onSearch={setSearchQuery}
                  onFilterChange={setFilters}
                  onAddStock={handleAddStock}
                  onExport={handleExport}
                  onImport={() => {}}
                  onAdjustment={() => {}}
                  onRefresh={handleRefresh}
                  onSort={setSortBy}
                />
              </div>
            )}

            {showEmptyState ? (
              <InventoryEmptyState
                onRefresh={handleRefresh}
                onAddProduct={handleAddProduct}
                onImport={() => {}}
              />
            ) : !loading && !error && totalItems > 0 ? (
              <>
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
                  <InventoryTable
                    items={currentItems}
                    selectedIds={selectedIds}
                    onSelectAll={handleSelectAll}
                    onSelect={handleSelect}
                    onViewItem={handleViewItem}
                    onSort={(column) => console.log("Sort by:", column)}
                  />
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 px-6 py-4 shadow-sm">
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
            ) : null}
          </div>
        </main>
      </div>

      <BulkInventoryActions
        selectedCount={selectedIds.length}
        onClearSelection={handleClearSelection}
        onAction={() => setSelectedIds([])}
      />
    </div>
  );
}

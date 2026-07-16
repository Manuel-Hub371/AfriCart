"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { StatisticsCards } from "@/components/vendor/statistics-cards";
import { ProductToolbar } from "@/components/vendor/product-toolbar";
import { ProductTable } from "@/components/vendor/product-table";
import { ProductGrid } from "@/components/vendor/product-grid";
import { ProductPagination } from "@/components/vendor/product-pagination";
import { BulkActionBar } from "@/components/vendor/bulk-action-bar";
import { ProductEmptyState } from "@/components/vendor/product-empty-state";
import { Plus } from "lucide-react";
import type { Product } from "@/components/vendor/product-card";

export default function ProductsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState("newest");

  // Mock data - replace with actual API call
  const mockProducts: Product[] = Array.from({ length: 100 }, (_, i) => ({
    id: `product-${i + 1}`,
    name: [
      "Wireless Bluetooth Headphones",
      "Premium Cotton T-Shirt",
      "Smart Watch Series 5",
      "Leather Laptop Bag",
      "USB-C Charging Cable",
      "Portable Power Bank",
      "Ceramic Coffee Mug",
      "Yoga Exercise Mat",
      "LED Desk Lamp",
      "Stainless Steel Water Bottle",
    ][i % 10],
    sku: `SKU-${10000 + i}`,
    category: ["Electronics", "Fashion", "Home", "Beauty", "Sports"][i % 5],
    brand: ["Sony", "Nike", "Apple", "Samsung", "Adidas"][i % 5],
    price: Math.floor(Math.random() * 500) + 20,
    stock: Math.floor(Math.random() * 200),
    status: (
      ["published", "draft", "archived", "low-stock", "out-of-stock"] as const
    )[i % 5],
    rating: Math.floor(Math.random() * 2) + 3.5,
    sales: Math.floor(Math.random() * 1000),
    views: Math.floor(Math.random() * 5000),
    revenue: Math.floor(Math.random() * 50000),
    image: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?w=400&h=400&fit=crop`,
    lastUpdated: ["Today", "Yesterday", "2 days ago", "1 week ago"][i % 4],
  }));

  const totalProducts = mockProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const currentProducts = mockProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(currentProducts.map((p) => p.id));
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
    console.log(`Bulk action: ${action} on ${selectedIds.length} products`);
    // Implement bulk action logic
    setTimeout(() => {
      setSelectedIds([]);
    }, 1000);
  };

  const handleProductAction = (action: string, productId: string) => {
    console.log(`Action: ${action} on product ${productId}`);
    switch (action) {
      case "edit":
        router.push(`/vendor/products/${productId}/edit`);
        break;
      case "view":
        router.push(`/product/${productId}`);
        break;
      case "duplicate":
        console.log("Duplicating product...");
        break;
      case "delete":
        console.log("Deleting product...");
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  };

  const handleAddProduct = () => {
    router.push("/vendor/products/new");
  };

  const handleImportProducts = () => {
    console.log("Opening import dialog...");
  };

  const handleExportProducts = () => {
    console.log("Exporting products...");
  };

  const handleRefresh = () => {
    console.log("Refreshing products...");
  };

  const showEmptyState = totalProducts === 0;

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
            { label: "Products" },
          ]}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
            {/* Page Header with Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Product Catalog
                </h1>
                <p className="text-gray-600">
                  Manage inventory, pricing, and publishing across your store
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleExportProducts}
                  className="h-10 px-4 border-gray-200 hover:bg-gray-50"
                >
                  Export
                </Button>
                <Button
                  variant="outline"
                  onClick={handleImportProducts}
                  className="h-10 px-4 border-gray-200 hover:bg-gray-50"
                >
                  Import
                </Button>
                <Button
                  onClick={handleAddProduct}
                  className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>

            {showEmptyState ? (
              <ProductEmptyState
                onAddProduct={handleAddProduct}
                onImportProducts={handleImportProducts}
              />
            ) : (
              <div className="space-y-6">
                {/* Statistics Cards */}
                <StatisticsCards />

                {/* Toolbar Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <ProductToolbar
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onSearch={setSearchQuery}
                    onFilterChange={setFilters}
                    onAddProduct={handleAddProduct}
                    onImportProducts={handleImportProducts}
                    onExportProducts={handleExportProducts}
                    onRefresh={handleRefresh}
                    onSort={setSortBy}
                  />
                </div>

                {/* Products Display */}
                {viewMode === "table" ? (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <ProductTable
                      products={currentProducts}
                      selectedIds={selectedIds}
                      onSelectAll={handleSelectAll}
                      onSelect={handleSelect}
                      onAction={handleProductAction}
                      onSort={(column) => console.log("Sort by:", column)}
                    />
                  </div>
                ) : (
                  <ProductGrid
                    products={currentProducts}
                    selectedIds={selectedIds}
                    onSelect={handleSelect}
                    onAction={handleProductAction}
                  />
                )}

                {/* Pagination */}
                <div className="bg-white rounded-xl border border-gray-200 px-6 py-4">
                  <ProductPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalProducts}
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
      <BulkActionBar
        selectedCount={selectedIds.length}
        onClearSelection={handleClearSelection}
        onAction={handleBulkAction}
      />
    </div>
  );
}

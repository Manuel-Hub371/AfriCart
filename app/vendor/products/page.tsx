"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { ProductToolbar } from "@/components/vendor/product-toolbar";
import { ProductTable } from "@/components/vendor/product-table";
import { ProductGrid } from "@/components/vendor/product-grid";
import { ProductPagination } from "@/components/vendor/product-pagination";
import { BulkActionBar } from "@/components/vendor/bulk-action-bar";
import { ProductEmptyState } from "@/components/vendor/product-empty-state";
import { Plus, Loader2 } from "lucide-react";
import { extractCoverImage } from "@/lib/image-utils";
import type { Product } from "@/components/vendor/product-card";

// Map API product → UI Product shape
function toUIProduct(p: any): Product {
  const stock: number = p.stock ?? 0;
  let status: Product["status"] = "published";
  if (p.status === "DRAFT") status = "draft";
  else if (p.status === "OUT_OF_STOCK" || stock === 0) status = "out-of-stock";
  else if (stock > 0 && stock <= 10) status = "low-stock";
  else if (p.status === "ACTIVE") status = "published";

  return {
    id: p.id,
    name: p.name,
    sku: p.id.slice(0, 8).toUpperCase(),
    category: p.categoryName ?? "Uncategorized",
    price: p.price,
    stock,
    status,
    rating: p.rating ?? 5.0,
    sales: p.orderCount ?? 0,
    views: p.views ?? 0,
    revenue: p.totalRevenue ?? 0,
    image: extractCoverImage(p.images, p.name, p.categoryName),
    isFeatured: Boolean(p.isFeatured),
    isBestSeller: Boolean(p.soldCount > 0 || (p.bestSellerScore && p.bestSellerScore >= 15)),
    bestSellerScore: p.bestSellerScore || 0,
    lastUpdated: p.updatedAt
      ? new Date(p.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "—",
  };
}

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

  // Real data state
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [storeCategories, setStoreCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/vendor/products");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to load products");
      }
      const data = await res.json();
      setAllProducts((data.products ?? []).map(toUIProduct));
      setStoreCategories(data.storeCategories ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Client-side search and status/featured/category filter
  const filteredProducts = allProducts.filter((p) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // 2. Featured Filter
    if (filters.featured && filters.featured.length > 0) {
      const wantFeatured = filters.featured.includes("featured");
      const wantNotFeatured = filters.featured.includes("not-featured");
      if (wantFeatured && !wantNotFeatured && !p.isFeatured) return false;
      if (wantNotFeatured && !wantFeatured && p.isFeatured) return false;
    }

    // 3. Status Filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(p.status)) return false;
    }

    // 4. Category Filter (Matches vendor's assigned store categories)
    if (filters.category && filters.category.length > 0) {
      const selectedCats = filters.category.map((c) => c.toLowerCase());
      if (!selectedCats.includes(p.category.toLowerCase())) return false;
    }

    return true;
  });

  // Client-side sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    return 0; // newest = default API order
  });

  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage) || 1;
  const currentProducts = sortedProducts.slice(
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

  const handleClearSelection = () => setSelectedIds([]);

  const handleBulkAction = async (action: string) => {
    if (action === "delete") {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/vendor/products/${id}`, { method: "DELETE" })
        )
      );
      await fetchProducts();
    }
    setSelectedIds([]);
  };

  const handleProductAction = async (action: string, productId: string) => {
    switch (action) {
      case "toggle-featured": {
        const target = allProducts.find((p) => p.id === productId);
        if (!target) break;
        const newStatus = !target.isFeatured;
        setAllProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, isFeatured: newStatus } : p))
        );
        try {
          await fetch(`/api/vendor/products/${productId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isFeatured: newStatus }),
          });
        } catch {
          fetchProducts();
        }
        break;
      }
      case "edit":
        router.push(`/vendor/products/${productId}/edit`);
        break;
      case "view":
      case "inventory":
      case "analytics":
      case "promote":
        // Open dedicated Vendor Product Management Workspace
        router.push(`/vendor/products/${productId}`);
        break;
      case "delete":
        await fetch(`/api/vendor/products/${productId}`, { method: "DELETE" });
        await fetchProducts();
        break;
    }
  };

  const handleAddProduct = () => router.push("/vendor/products/new");
  const handleExportProducts = () => {
    if (allProducts.length === 0) return;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Product ID,Name,SKU,Category,Price,Stock,Status"]
        .concat(
          allProducts.map(
            (p) => `"${p.id}","${p.name}","${p.sku}","${p.category}",${p.price},${p.stock},"${p.status}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vendor_products_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleRefresh = () => fetchProducts();

  const showEmptyState = !loading && !error && totalProducts === 0;

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
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
                  Product Catalog
                </h1>
                <p className="text-gray-600 text-sm">
                  Manage store inventory, edit listings, and access product management workspaces.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleExportProducts}
                  className="h-10 px-4 border-gray-200 hover:bg-gray-50 rounded-xl"
                >
                  Export CSV
                </Button>
                <Button
                  onClick={handleAddProduct}
                  className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm rounded-xl font-semibold"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mr-3" />
                <span className="text-gray-600 text-sm font-medium">Loading catalog products...</span>
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

            {/* Empty State */}
            {showEmptyState && (
              <ProductEmptyState
                onAddProduct={handleAddProduct}
                onImportProducts={() => {}}
              />
            )}

            {/* Products Display (No Top Summary Cards as per Part 1) */}
            {!loading && !error && totalProducts > 0 && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                  <ProductToolbar
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onSearch={setSearchQuery}
                    onFilterChange={setFilters}
                    onAddProduct={handleAddProduct}
                    onImportProducts={() => {}}
                    onExportProducts={handleExportProducts}
                    onRefresh={handleRefresh}
                    onSort={setSortBy}
                    assignedCategories={storeCategories}
                  />
                </div>

                {viewMode === "table" ? (
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
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

                <div className="bg-white rounded-2xl border border-gray-200 px-6 py-4 shadow-sm">
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

      <BulkActionBar
        selectedCount={selectedIds.length}
        onClearSelection={handleClearSelection}
        onAction={handleBulkAction}
      />
    </div>
  );
}

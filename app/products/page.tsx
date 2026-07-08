"use client";

import { useState } from "react";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { Breadcrumb } from "@/components/products/breadcrumb";
import { CategoryMenu } from "@/components/products/category-menu";
import { FilterSidebar } from "@/components/products/filter-sidebar";
import { SortDropdown } from "@/components/products/sort-dropdown";
import { ProductGrid } from "@/components/products/product-grid";
import { Pagination } from "@/components/products/pagination";
import { MobileFilterSheet } from "@/components/products/mobile-filter-sheet";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  const breadcrumbItems = [
    { label: "Products", href: "/products" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            All Products
          </h1>
          <p className="text-lg text-gray-600">
            Explore thousands of products from trusted sellers
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">10,542</span> Products Found
            <span className="text-gray-400">•</span>
            <span className="font-semibold text-gray-900">3</span> Filters Active
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <CategoryMenu />

      {/* Mobile Filter & Sort Bar */}
      <div className="lg:hidden sticky top-16 z-40 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => setMobileFilterOpen(true)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => setMobileSortOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Sort
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1 min-w-0">
            {/* Desktop Sort */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">1-8</span> of{" "}
                <span className="font-semibold text-gray-900">10,542</span> products
              </div>
              <SortDropdown />
            </div>

            {/* Products */}
            <ProductGrid showCount={false} />

            {/* Pagination */}
            <Pagination currentPage={1} totalPages={1318} />
          </main>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <MobileFilterSheet
        open={mobileFilterOpen}
        onOpenChange={setMobileFilterOpen}
      />

      <Footer />
    </div>
  );
}

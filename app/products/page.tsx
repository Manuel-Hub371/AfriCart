"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { Breadcrumb } from "@/components/products/breadcrumb";
import { ProductCard } from "@/components/products/product-card";
import { MobileFilterSheet } from "@/components/products/mobile-filter-sheet";
import { Button } from "@/components/ui/button";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "newest";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [productsData, setProductsData] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        if (category) params.set("category", category);
        if (sortBy) params.set("sortBy", sortBy);
        params.set("page", page.toString());
        params.set("limit", "12");

        const [prodRes, catRes] = await Promise.all([
          fetch(`/api/products?${params.toString()}`),
          fetch("/api/categories"),
        ]);

        if (prodRes.ok) {
          const pData = await prodRes.json();
          setProductsData(pData);
        }
        if (catRes.ok) {
          const cData = await catRes.json();
          setCategories(cData);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [query, category, sortBy, page]);

  const handleCategorySelect = (catSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catSlug) {
      params.set("category", catSlug);
    } else {
      params.delete("category");
    }
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", newSort);
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/products?${params.toString()}`);
  };

  const breadcrumbItems = [
    { label: "Products", href: "/products" },
    ...(category ? [{ label: category, href: `/products?category=${category}` }] : []),
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
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : "All Products"}
          </h1>
          <p className="text-lg text-gray-600">
            Explore quality items directly from verified regional sellers
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{productsData?.total || 0}</span> Products Found
          </div>
        </div>
      </div>

      {/* Category Horizontal Navigation */}
      {categories.length > 0 && (
        <div className="bg-white border-b py-3 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2">
            <button
              onClick={() => handleCategorySelect("")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !category ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug || cat.name.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  category.toLowerCase() === (cat.slug || cat.name.toLowerCase())
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.name} ({cat.productCount || 0})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            Showing Page <span className="font-semibold text-gray-900">{productsData?.page || 1}</span> of{" "}
            <span className="font-semibold text-gray-900">{productsData?.totalPages || 1}</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 font-medium">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="h-10 px-3 rounded-lg border border-gray-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid / Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-xl border p-4 space-y-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : productsData?.products?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsData.products.map((product: any) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.brand}
                storeName={product.store?.name || "AfriCart Store"}
                verified={true}
                rating={product.rating}
                reviews={product.numReviews}
                price={product.price}
                originalPrice={product.originalPrice}
                isDiscounted={product.isDiscounted}
                discountPercent={product.discountPercent}
                amountSaved={product.amountSaved}
                campaignBadge={product.campaignBadge}
                campaignColor={product.campaignColor}
                campaignName={product.campaignName}
                image={product.images}
                inStock={product.stock > 0}
                imagesCount={Array.isArray(product.images) ? product.images.length : 1}
                isBestSeller={product.isBestSeller}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border p-12 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try clearing your search or selecting a different category.</p>
            <Button
              onClick={() => router.push("/products")}
              className="gradient-primary text-white"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Pagination Controls */}
        {productsData?.totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm font-medium text-gray-700">
              Page {page} of {productsData.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= productsData.totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

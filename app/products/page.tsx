"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Store } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { Breadcrumb } from "@/components/products/breadcrumb";
import { ProductCard } from "@/components/products/product-card";
import { FilterSidebar } from "@/components/products/filter-sidebar";
import { MobileFilterSheet } from "@/components/products/mobile-filter-sheet";
import { ActiveFilters } from "@/components/products/active-filters";
import { Pagination } from "@/components/products/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL state extraction
  const query = searchParams.get("query") || searchParams.get("q") || "";
  const rawCategoryParam = searchParams.get("category") || "";
  const selectedCategories = useMemo(() => {
    return rawCategoryParam ? rawCategoryParam.split(",").map((c) => c.trim()).filter(Boolean) : [];
  }, [rawCategoryParam]);

  const ratingParam = searchParams.get("rating");
  const selectedRating = ratingParam ? parseFloat(ratingParam) : undefined;

  const minPriceParam = searchParams.get("minPrice");
  const minPrice = minPriceParam !== null && minPriceParam !== "" ? parseFloat(minPriceParam) : undefined;

  const maxPriceParam = searchParams.get("maxPrice");
  const maxPrice = maxPriceParam !== null && maxPriceParam !== "" ? parseFloat(maxPriceParam) : undefined;

  const sortBy = searchParams.get("sortBy") || "newest";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Local states
  const [searchInput, setSearchInput] = useState(query);
  const [productsData, setProductsData] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // Fetch products & categories when parameters change
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        if (rawCategoryParam) params.set("category", rawCategoryParam);
        if (selectedRating !== undefined) params.set("rating", selectedRating.toString());
        if (minPrice !== undefined) params.set("minPrice", minPrice.toString());
        if (maxPrice !== undefined) params.set("maxPrice", maxPrice.toString());
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
        console.error("Failed to load products marketplace data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [query, rawCategoryParam, selectedRating, minPrice, maxPrice, sortBy, page]);

  // Map category slug to human-readable name
  const categoryNamesMap = useMemo(() => {
    const map: Record<string, string> = {
      "electronics-gadget": "Electronics & Gadget",
      "home-living": "Home & Living",
      "fashion-appeal": "Fashion & Appeal",
      "beauty-personal-care": "Beauty & Personal Care",
      "food-gorrices": "Food & Gorrices",
      "pharmacy-health": "Pharmacy & Health",
      "automotive-automobile": "Automotive & Automobile",
      "sorts-fitness": "Sorts & Fitness",
      "books-stationery": "Books & Stationery",
    };
    categories.forEach((cat) => {
      const slug = cat.slug || cat.id || cat.name.toLowerCase();
      map[slug] = cat.name;
    });
    return map;
  }, [categories]);

  // Helper to push URL param changes
  const updateQueryParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === undefined || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    // Reset to page 1 whenever filters change (unless page itself is updated)
    if (!("page" in updates)) {
      params.set("page", "1");
    }
    router.push(`/products?${params.toString()}`);
  };

  // Filter Action Handlers
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({ query: searchInput.trim() || null });
  };

  const handleCategoryToggle = (catSlug: string) => {
    let nextCategories: string[];
    if (selectedCategories.includes(catSlug)) {
      nextCategories = selectedCategories.filter((c) => c !== catSlug);
    } else {
      nextCategories = [...selectedCategories, catSlug];
    }
    updateQueryParams({ category: nextCategories.length > 0 ? nextCategories.join(",") : null });
  };

  const handlePillCategorySelect = (catSlug: string) => {
    updateQueryParams({ category: catSlug || null });
  };

  const handleRatingSelect = (r?: number) => {
    updateQueryParams({ rating: r !== undefined ? r.toString() : null });
  };

  const handlePriceChange = (min?: number, max?: number) => {
    updateQueryParams({
      minPrice: min !== undefined ? min.toString() : null,
      maxPrice: max !== undefined ? max.toString() : null,
    });
  };

  const handleSortChange = (newSort: string) => {
    updateQueryParams({ sortBy: newSort });
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage.toString() });
  };

  const handleClearAll = () => {
    setSearchInput("");
    router.push("/products");
  };

  const activeFiltersCount =
    (query ? 1 : 0) +
    selectedCategories.length +
    (selectedRating ? 1 : 0) +
    (minPrice !== undefined || maxPrice !== undefined ? 1 : 0) +
    (sortBy !== "newest" ? 1 : 0);

  const breadcrumbItems = [
    { label: "Products Marketplace", href: "/products" },
    ...(selectedCategories.length === 1
      ? [{ label: categoryNamesMap[selectedCategories[0]] || selectedCategories[0], href: `/products?category=${selectedCategories[0]}` }]
      : selectedCategories.length > 1
      ? [{ label: `${selectedCategories.length} Categories Selected`, href: `/products?category=${rawCategoryParam}` }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Marketplace Hero & Search Banner */}
      <div className="bg-gradient-to-b from-white via-emerald-50/20 to-gray-50 border-b border-gray-200 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-6">
            <div>
              <h1 className="text-xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {selectedCategories.length === 1
                  ? categoryNamesMap[selectedCategories[0]] || "Products"
                  : query
                  ? `Search Results for "${query}"`
                  : "Explore Products"}
              </h1>
              <p className="text-xs sm:text-base text-gray-600 mt-0.5 max-w-2xl">
                Discover quality products directly from verified African vendors and local creators.
              </p>
            </div>

            {/* In-Page Product Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 z-10 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search products by name, brand, or tag..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-8 sm:pl-10 pr-20 sm:pr-24 h-9 sm:h-12 text-xs sm:text-sm rounded-xl sm:rounded-2xl bg-white border-gray-200 shadow-2xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    updateQueryParams({ query: null });
                  }}
                  className="absolute right-16 sm:right-20 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 z-10"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] sm:text-xs rounded-lg sm:rounded-xl px-2.5 sm:px-3.5 h-7 sm:h-10 z-10"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Category Pills Navigation (Mobile/Tablet Only) */}
      {categories.length > 0 && (
        <div className="lg:hidden bg-white border-b border-gray-200 sticky top-14 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            <button
              onClick={() => handlePillCategorySelect("")}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                selectedCategories.length === 0
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Categories
            </button>

            {categories.map((cat) => {
              const catSlug = cat.slug || cat.id || cat.name.toLowerCase();
              const isSelected = selectedCategories.includes(catSlug);
              return (
                <button
                  key={cat.id || catSlug}
                  onClick={() => handlePillCategorySelect(catSlug)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[9px] font-mono px-1 py-0.2 rounded-full ${isSelected ? "bg-emerald-700/50 text-white" : "bg-gray-200 text-gray-600"}`}>
                    {cat.productCount || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Active Filters Summary Bar */}
        <ActiveFilters
          query={query}
          selectedCategories={selectedCategories}
          categoryNamesMap={categoryNamesMap}
          rating={selectedRating}
          minPrice={minPrice}
          maxPrice={maxPrice}
          sortBy={sortBy}
          onRemoveCategory={handleCategoryToggle}
          onRemoveRating={() => handleRatingSelect(undefined)}
          onRemovePrice={() => handlePriceChange(undefined, undefined)}
          onRemoveQuery={() => {
            setSearchInput("");
            updateQueryParams({ query: null });
          }}
          onRemoveSort={() => handleSortChange("newest")}
          onClearAll={handleClearAll}
        />

        {/* Toolbar & Sort Controls */}
        <div className="flex items-center justify-between gap-2 mb-4 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-2">
            {/* Mobile Filter Toggle Button */}
            <Button
              variant="outline"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden gap-1 rounded-lg text-xs font-bold border-gray-200 h-8 px-2.5"
            >
              <Filter className="h-3.5 w-3.5 text-emerald-600" />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <span className="ml-0.5 bg-emerald-600 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            <div className="text-xs text-gray-600 font-medium">
              <span className="font-bold text-gray-900">{productsData?.products?.length || 0}</span> /{" "}
              <span className="font-bold text-gray-900">{productsData?.total || 0}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="hidden sm:flex items-center gap-1">
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
              <label htmlFor="sortBySelect" className="text-xs text-gray-600 font-bold whitespace-nowrap">
                Sort:
              </label>
            </div>
            <select
              id="sortBySelect"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-800 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shadow-2xs"
            >
              <option value="newest">Newest</option>
              <option value="best_sellers">Best Sellers</option>
              <option value="rating">Top Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              {query && <option value="relevance">Relevance</option>}
            </select>
          </div>
        </div>

        {/* Desktop & Mobile Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar (1/4 column) */}
          <div className="hidden lg:block lg:col-span-1">
            <FilterSidebar
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              selectedRating={selectedRating}
              onRatingSelect={handleRatingSelect}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
              onClearAll={handleClearAll}
            />
          </div>

          {/* Product Results Grid (3/4 column) */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-2.5 sm:p-4 space-y-2 sm:space-y-4 animate-pulse">
                    <div className="h-36 sm:h-52 bg-gray-200 rounded-lg sm:rounded-xl"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 sm:h-10 bg-gray-200 rounded-lg sm:rounded-xl mt-2"></div>
                  </div>
                ))}
              </div>
            ) : productsData?.products?.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
                  {productsData.products.map((product: any) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      brand={product.brand}
                      storeName={product.store?.name || "Verified Store"}
                      verified={true}
                      rating={product.rating || 5.0}
                      reviews={product.numReviews || 0}
                      price={product.price}
                      originalPrice={product.originalPrice ?? undefined}
                      isDiscounted={product.isDiscounted ?? false}
                      discountPercent={product.discountPercent ?? 0}
                      amountSaved={product.amountSaved ?? 0}
                      campaignBadge={product.campaignBadge}
                      campaignColor={product.campaignColor}
                      campaignName={product.campaignName}
                      image={product.images}
                      inStock={product.stock > 0}
                      imagesCount={Array.isArray(product.images) ? product.images.length : 1}
                      isBestSeller={product.isBestSeller ?? false}
                    />
                  ))}
                </div>

                {/* Server-Side Pagination Controls */}
                <Pagination
                  currentPage={productsData.page || page}
                  totalPages={productsData.totalPages || 1}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              /* Clean Empty State */
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-xl mx-auto my-8 shadow-sm">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No matching products found</h3>
                <p className="text-sm text-gray-600 mb-6">
                  We couldn&apos;t find any items matching your selected filters or search parameters.
                </p>
                <Button
                  onClick={handleClearAll}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl px-6 h-11 shadow-xs"
                >
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      <MobileFilterSheet
        open={mobileFilterOpen}
        onOpenChange={setMobileFilterOpen}
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        selectedRating={selectedRating}
        onRatingSelect={handleRatingSelect}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceChange={handlePriceChange}
        onClearAll={handleClearAll}
        resultsCount={productsData?.total || 0}
      />

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
          Loading AfriCart Products Marketplace...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

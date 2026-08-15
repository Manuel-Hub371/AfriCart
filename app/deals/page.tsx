"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tag,
  Zap,
  Flame,
  Clock,
  Filter,
  Search,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PackageX,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function computeTimeLeft(endDateIso?: string | null): TimeLeft {
  if (!endDateIso) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const diff = new Date(endDateIso).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, expired: false };
}

export default function DealsPage() {
  // Deals Data State
  const [products, setProducts] = useState<any[]>([]);
  const [featuredCampaign, setFeaturedCampaign] = useState<any | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [minDiscount, setMinDiscount] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("discount_desc");

  // Hero Countdown State
  const [spotlightTime, setSpotlightTime] = useState<TimeLeft>(() => computeTimeLeft(null));
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch Categories list
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          const cats = (data.categories || data || []).map((c: any) => typeof c === "string" ? c : c.name);
          setCategories(cats);
        }
      } catch {
        // Fallback categories
        setCategories(["Electronics", "Fashion", "Home & Living", "Beauty & Health", "Grocery", "Automotive", "Sports"]);
      }
    }
    loadCategories();
  }, []);

  // Fetch Deals from Backend
  const fetchDeals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "12");
      params.set("sortBy", sortBy);

      if (searchQuery.trim()) params.set("query", searchQuery.trim());
      if (selectedCategory) params.set("category", selectedCategory);
      if (minDiscount) params.set("minDiscount", minDiscount);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);

      const res = await fetch(`/api/deals?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load marketplace deals");
      }

      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setFeaturedCampaign(data.featuredCampaign || null);

      if (data.featuredCampaign?.endDate) {
        setSpotlightTime(computeTimeLeft(data.featuredCampaign.endDate));
      }
    } catch (err: any) {
      console.error("Deals load error:", err);
      setError(err.message || "Unable to fetch deals right now");
    } finally {
      setIsLoading(false);
    }
  }, [page, sortBy, searchQuery, selectedCategory, minDiscount, minPrice, maxPrice]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // Real-time ticker for featured campaign spotlight
  useEffect(() => {
    if (!featuredCampaign?.endDate) return;

    timerRef.current = setInterval(() => {
      setSpotlightTime(computeTimeLeft(featuredCampaign.endDate));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [featuredCampaign?.endDate]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setMinDiscount("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("discount_desc");
    setPage(1);
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 text-white overflow-hidden py-4 sm:py-12 px-3 sm:px-6 lg:px-8 border-b">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8">
              <div className="space-y-2 sm:space-y-4 max-w-2xl text-center md:text-left">
                <div className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 text-orange-300 font-extrabold text-[9px] sm:text-xs px-2 py-0.5 rounded-full backdrop-blur-md">
                  <Flame className="h-3 w-3 text-orange-400 animate-pulse" />
                  <span>Exclusive Marketplace Promotions</span>
                </div>

                <h1 className="text-xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                  Today's <span className="text-gradient">Hot Deals</span> & Discounts
                </h1>

                <p className="text-gray-300 text-xs sm:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
                  Discover verified promotional prices, percentage discounts, and flash sales direct from top vendors across Africa.
                </p>
              </div>

              {/* Dynamic Flash Sale Spotlight Widget */}
              {featuredCampaign && !spotlightTime.expired && (
                <div className="w-full md:w-auto bg-white/10 backdrop-blur-xl border border-white/15 rounded-xl sm:rounded-3xl p-2.5 sm:p-6 shadow-xl flex flex-col items-center md:items-end text-center md:text-right space-y-1.5 sm:space-y-3">
                  <div className="flex items-center gap-1 text-[9px] sm:text-xs font-extrabold uppercase tracking-wide text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded-full border border-orange-500/30">
                    <Zap className="h-3 w-3" />
                    <span>{featuredCampaign.badge || featuredCampaign.name}</span>
                  </div>

                  <p className="text-[10px] sm:text-xs text-gray-300 font-medium">Limited-Time Offer Ending In</p>

                  <div className="flex items-center gap-1 font-mono font-black text-xs sm:text-2xl text-white">
                    {spotlightTime.days > 0 && (
                      <div className="bg-black/50 px-1.5 sm:px-3 py-0.5 rounded-md sm:rounded-xl border border-white/10">
                        <span>{spotlightTime.days}</span>
                        <span className="text-[7px] sm:text-[10px] block font-sans text-gray-400 font-semibold uppercase">Days</span>
                      </div>
                    )}
                    <div className="bg-black/50 px-1.5 sm:px-3 py-0.5 rounded-md sm:rounded-xl border border-white/10">
                      <span>{pad(spotlightTime.hours)}</span>
                      <span className="text-[7px] sm:text-[10px] block font-sans text-gray-400 font-semibold uppercase">Hrs</span>
                    </div>
                    <span className="text-emerald-400 font-bold text-xs sm:text-base">:</span>
                    <div className="bg-black/50 px-1.5 sm:px-3 py-0.5 rounded-md sm:rounded-xl border border-white/10">
                      <span>{pad(spotlightTime.minutes)}</span>
                      <span className="text-[7px] sm:text-[10px] block font-sans text-gray-400 font-semibold uppercase">Min</span>
                    </div>
                    <span className="text-emerald-400 font-bold text-xs sm:text-base">:</span>
                    <div className="bg-black/50 px-1.5 sm:px-3 py-0.5 rounded-md sm:rounded-xl border border-white/10">
                      <span>{pad(spotlightTime.seconds)}</span>
                      <span className="text-[7px] sm:text-[10px] block font-sans text-gray-400 font-semibold uppercase">Sec</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
          {/* Toolbar: Search, Filters & Sorting */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-6 shadow-2xs space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              {/* Search within Deals */}
              <div className="relative col-span-2 sm:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search active deals..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-8 h-9 sm:h-10 rounded-xl text-xs"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full h-9 sm:h-10 px-2 sm:px-3 rounded-xl border border-gray-200 text-xs focus:border-emerald-600 focus:outline-none bg-white font-medium text-gray-700"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Discount Percentage Tier */}
              <div>
                <select
                  value={minDiscount}
                  onChange={(e) => {
                    setMinDiscount(e.target.value);
                    setPage(1);
                  }}
                  className="w-full h-9 sm:h-10 px-2 sm:px-3 rounded-xl border border-gray-200 text-xs focus:border-emerald-600 focus:outline-none bg-white font-medium text-gray-700"
                >
                  <option value="">Any Discount</option>
                  <option value="10">10%+ OFF</option>
                  <option value="20">20%+ OFF</option>
                  <option value="30">30%+ OFF</option>
                  <option value="50">50%+ OFF (Mega)</option>
                </select>
              </div>

              {/* Sorting Engine */}
              <div className="col-span-2 sm:col-span-1">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="w-full h-9 sm:h-10 px-2 sm:px-3 rounded-xl border border-gray-200 text-xs focus:border-emerald-600 focus:outline-none bg-white font-bold text-emerald-800"
                >
                  <option value="discount_desc">🔥 Highest Discount</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="ending_soon">Ending Soonest</option>
                  <option value="newest">Newest Deals</option>
                </select>
              </div>
            </div>

            {/* Price Range & Reset Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-[11px] sm:text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-gray-600">Price (GH₵):</span>
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-16 sm:w-24 h-7 sm:h-8 text-[11px] sm:text-xs rounded-lg px-2"
                />
                <span className="text-gray-400">—</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-16 sm:w-24 h-7 sm:h-8 text-[11px] sm:text-xs rounded-lg px-2"
                />
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-gray-500 font-semibold text-[10px] sm:text-xs">
                  <strong className="text-gray-900">{total}</strong> deal{total === 1 ? "" : "s"}
                </span>
                {(searchQuery || selectedCategory || minDiscount || minPrice || maxPrice || sortBy !== "discount_desc") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                    className="h-7 sm:h-8 px-2 gap-1 text-[10px] sm:text-xs text-red-600 border-red-200 hover:bg-red-50 rounded-lg"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Deals Grid / Loading / Error / Empty States */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-2xl border p-4 space-y-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-xl" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded-xl" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-white rounded-3xl border border-red-200 p-12 text-center space-y-4 max-w-lg mx-auto">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
              <h3 className="text-2xl font-bold text-gray-900">Unable to Load Deals</h3>
              <p className="text-gray-600 text-sm">{error}</p>
              <Button onClick={fetchDeals} className="gradient-primary text-white px-6 font-bold rounded-xl">
                Retry Loading
              </Button>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3 md:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    brand={product.brand}
                    storeName={product.store?.name || "AfriCart Store"}
                    verified={true}
                    rating={product.rating || 5}
                    reviews={product.numReviews || 0}
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
                    isBestSeller={Boolean(product.isBestSeller)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="gap-1 rounded-xl"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                          p === page
                            ? "gradient-primary text-white shadow-md"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="gap-1 rounded-xl"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center space-y-4 max-w-lg mx-auto shadow-sm">
              <PackageX className="h-20 w-20 text-gray-300 mx-auto mb-2" />
              <h3 className="text-2xl font-extrabold text-gray-900">No Active Deals Found</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                There are currently no active promotional deals matching your selected criteria. Try adjusting your filters or check back soon for fresh vendor campaigns.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  onClick={handleResetFilters}
                  variant="outline"
                  className="w-full sm:w-auto rounded-xl font-bold"
                >
                  Clear All Filters
                </Button>
                <Link href="/products" className="w-full sm:w-auto">
                  <Button className="w-full gradient-primary text-white rounded-xl font-bold shadow-md">
                    Explore Marketplace Catalog
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { StoreDirectoryHeader } from "@/components/stores/store-directory-header";
import { StoreGrid } from "@/components/stores/store-grid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Building2, 
  Store as StoreIcon, 
  RotateCcw,
  SlidersHorizontal,
  ArrowUpDown
} from "lucide-react";
import { OFFICIAL_STORE_CATEGORIES } from "@/lib/constants/store-categories";
import { OFFICIAL_BUSINESS_TYPES } from "@/lib/constants/business-types";

export default function StoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedBusinessType, setSelectedBusinessType] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const loadStores = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("query", searchQuery.trim());
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (selectedLocation !== "all") params.set("location", selectedLocation);
      if (selectedBusinessType !== "all") params.set("businessType", selectedBusinessType);
      if (sortBy) params.set("sortBy", sortBy);

      const res = await fetch(`/api/stores?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setStores(Array.isArray(data) ? data : []);
      } else {
        setStores([]);
      }
    } catch (err) {
      console.error("Failed to load stores:", err);
      setStores([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedLocation, selectedBusinessType, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStores();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadStores]);

  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "all" || selectedLocation !== "all" || selectedBusinessType !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLocation("all");
    setSelectedBusinessType("all");
    setSortBy("rating");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />
      <div>
        <StoreDirectoryHeader />

        {/* Multi-Attribute Store Search & Filtering Section */}
        <section className="py-3 sm:py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 space-y-3">
            
            {/* Quick Category Touch Pills Bar (Mobile Only) */}
            <div className="overflow-x-auto no-scrollbar flex items-center gap-1.5 py-1 md:hidden">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                  selectedCategory === "all"
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Categories
              </button>
              {OFFICIAL_STORE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-2xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Filter Controls Card — Hidden on Mobile Devices */}
            <div className="hidden md:block bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-200/60 space-y-6">
              
              {/* Header Title & Reset */}
              <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-2xs border border-emerald-100">
                    <SlidersHorizontal className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                      Store Search &amp; Filters
                    </h2>
                    <p className="text-gray-500 text-xs font-medium mt-0.5">
                      Find verified regional sellers by business type, location, and category
                    </p>
                  </div>
                </div>

                {hasActiveFilters && (
                  <Button
                    onClick={handleResetFilters}
                    variant="outline"
                    className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold text-xs rounded-xl px-3.5 h-9 flex-shrink-0 gap-1.5 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset Filters</span>
                  </Button>
                )}
              </div>

              {/* Filter Controls Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. Keyword / Name Search */}
                <div className="col-span-2 lg:col-span-1">
                  <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Search className="h-3 w-3 text-emerald-600" /> Store Keyword
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Search store name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-gray-50/80 border-gray-200 hover:border-emerald-300 focus:border-emerald-500 focus:bg-white text-gray-900 placeholder:text-gray-400 rounded-xl h-11 text-xs font-semibold transition-all focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
                    />
                  </div>
                </div>

                {/* 2. Store Category */}
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <StoreIcon className="h-3 w-3 text-emerald-600" /> Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-11 px-3 bg-gray-50/80 border border-gray-200 hover:border-emerald-300 focus:border-emerald-500 focus:bg-white text-gray-900 rounded-xl text-xs font-semibold focus:outline-none transition-all cursor-pointer shadow-2xs"
                  >
                    <option value="all">All Categories</option>
                    {OFFICIAL_STORE_CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Business Location */}
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-emerald-600" /> Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full h-11 px-3 bg-gray-50/80 border border-gray-200 hover:border-emerald-300 focus:border-emerald-500 focus:bg-white text-gray-900 rounded-xl text-xs font-semibold focus:outline-none transition-all cursor-pointer shadow-2xs"
                  >
                    <option value="all">All Locations</option>
                    <option value="Accra">Accra (Greater Accra)</option>
                    <option value="Kumasi">Kumasi (Ashanti)</option>
                    <option value="Tamale">Tamale (Northern)</option>
                    <option value="Takoradi">Takoradi (Western)</option>
                    <option value="Tema">Tema (Greater Accra)</option>
                    <option value="Cape Coast">Cape Coast (Central)</option>
                    <option value="Sunyani">Sunyani (Bono)</option>
                    <option value="Lagos">Lagos (Nigeria)</option>
                  </select>
                </div>

                {/* 4. Business Type */}
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-emerald-600" /> Business Type
                  </label>
                  <select
                    value={selectedBusinessType}
                    onChange={(e) => setSelectedBusinessType(e.target.value)}
                    className="w-full h-11 px-3 bg-gray-50/80 border border-gray-200 hover:border-emerald-300 focus:border-emerald-500 focus:bg-white text-gray-900 rounded-xl text-xs font-semibold focus:outline-none transition-all cursor-pointer shadow-2xs"
                  >
                    <option value="all">All Types</option>
                    {OFFICIAL_BUSINESS_TYPES.map((bt) => (
                      <option key={bt.value} value={bt.value}>
                        {bt.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Sort By */}
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <ArrowUpDown className="h-3 w-3 text-emerald-600" /> Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full h-11 px-3 bg-gray-50/80 border border-gray-200 hover:border-emerald-300 focus:border-emerald-500 focus:bg-white text-gray-900 rounded-xl text-xs font-semibold focus:outline-none transition-all cursor-pointer shadow-2xs"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="products">Most Products</option>
                    <option value="newest">Newest Stores</option>
                    <option value="name">Store Name (A-Z)</option>
                  </select>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Stores Results Grid Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b pb-4">
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  Verified Marketplace Stores
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Showing {stores.length} store{stores.length === 1 ? "" : "s"} matching your criteria
                </p>
              </div>

              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2">
                  {selectedCategory !== "all" && (
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                      Category: {selectedCategory}
                    </Badge>
                  )}
                  {selectedLocation !== "all" && (
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                      Location: {selectedLocation}
                    </Badge>
                  )}
                  {selectedBusinessType !== "all" && (
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                      Type: {selectedBusinessType}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-3xl p-6 h-72 animate-pulse border border-gray-200"></div>
                ))}
              </div>
            ) : stores.length > 0 ? (
              <StoreGrid stores={stores} />
            ) : (
              <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center space-y-4 max-w-lg mx-auto shadow-sm">
                <StoreIcon className="h-16 w-16 text-gray-300 mx-auto" />
                <h3 className="text-2xl font-extrabold text-gray-900">No Stores Found</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  No marketplace stores matched your specific filter criteria. Try adjusting your search query, location, or business type.
                </p>
                <Button
                  onClick={handleResetFilters}
                  className="gradient-primary text-white font-bold rounded-xl px-6 py-2.5 shadow-md mt-2"
                >
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

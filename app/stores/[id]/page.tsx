"use client";

import { useEffect, useState, use, useMemo } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Store as StoreIcon, 
  Package, 
  MapPin, 
  Building2, 
  CheckCircle, 
  Star, 
  Users, 
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  Loader2,
  Search,
  SlidersHorizontal,
  Mail,
  Phone,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  Info,
  ChevronRight,
  Filter,
  Sparkles,
  Award,
  FileText,
  ExternalLink,
  Tag
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function StoreDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const storeId = resolvedParams.id;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [store, setStore] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    "products" | "featured" | "deals" | "about" | "policies" | "shipping" | "privacy" | "reviews"
  >("products");

  // Follow & Share States
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Product Filtering & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    async function fetchStore() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/stores/${storeId}`);
        if (!res.ok) throw new Error("Store not found");
        const data = await res.json();
        setStore(data);
        setFollowersCount(data.followerCount ?? 0);
        setIsFollowing(Boolean(data.isFollowing));
      } catch (err: any) {
        setError(err.message || "Failed to load store details");
      } finally {
        setIsLoading(false);
      }
    }
    fetchStore();
  }, [storeId]);

  const handleMessageStore = async () => {
    if (!store?.id) return;
    try {
      setIsStartingChat(true);
      const res = await fetch("/api/messaging/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId: store.id }),
      });

      if (res.ok) {
        const conv = await res.json();
        router.push(`/profile/messages?conversationId=${conv.id}`);
      } else {
        router.push("/auth/login");
      }
    } catch (err) {
      console.error("Failed to message store:", err);
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!store?.id) return;
    try {
      const res = await fetch(`/api/stores/${store.id}/follow`, {
        method: "POST",
      });

      if (res.status === 401) {
        router.push("/auth/login");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.isFollowing);
        setFollowersCount(data.followerCount);
      }
    } catch (err) {
      console.error("Failed to toggle store follow:", err);
    }
  };

  const handleShareStore = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  // Extract unique categories from store products and assigned store categories
  const availableCategories = useMemo(() => {
    if (!store) return [];
    const cats = new Set<string>();
    if (Array.isArray(store.products)) {
      store.products.forEach((p: any) => {
        const catName = p.category || p.categoryName;
        if (catName) cats.add(catName);
      });
    }
    if (Array.isArray(store.categories)) {
      store.categories.forEach((c: any) => {
        const catName = typeof c === "string" ? c : c.name || c.storeCategory?.name;
        if (catName) cats.add(catName);
      });
    } else if (store.category) {
      cats.add(store.category);
    }
    return Array.from(cats);
  }, [store]);

  // Filtered & Sorted Store Products
  const filteredProducts = useMemo(() => {
    if (!store?.products) return [];
    return store.products.filter((p: any) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = p.name?.toLowerCase().includes(query);
        const matchDesc = p.description?.toLowerCase().includes(query);
        if (!matchName && !matchDesc) return false;
      }
      // Category
      if (
        availableCategories.length > 1 &&
        selectedCategory !== "all" &&
        p.category !== selectedCategory &&
        p.categoryName !== selectedCategory
      ) {
        return false;
      }
      // Min Price
      if (minPrice && p.price < parseFloat(minPrice)) {
        return false;
      }
      // Max Price
      if (maxPrice && p.price > parseFloat(maxPrice)) {
        return false;
      }
      // Rating
      if (minRating > 0 && (p.rating || 5) < minRating) {
        return false;
      }
      // Stock
      if (inStockOnly && p.stock <= 0) {
        return false;
      }
      return true;
    }).sort((a: any, b: any) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [store, searchQuery, selectedCategory, minPrice, maxPrice, minRating, inStockOnly, sortBy]);

  // Paginated Products
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    const tabParam = searchParams?.get("tab");
    if (tabParam === "deals") {
      setActiveTab("deals");
    } else if (tabParam === "featured") {
      setActiveTab("featured");
    } else if (tabParam === "about") {
      setActiveTab("about");
    } else if (tabParam === "reviews") {
      setActiveTab("reviews");
    }
  }, [searchParams]);

  // Featured Products
  const featuredProducts = useMemo(() => {
    if (!store?.products) return [];
    return store.products.filter((p: any) => p.isFeatured && (p.status === "ACTIVE" || p.status === "published"));
  }, [store]);

  // Best Sellers — calculated from actual store sales
  const bestSellers = useMemo(() => {
    if (!store?.products) return [];
    return store.products
      .filter((p: any) => (p.status === "ACTIVE" || p.status === "published") && p.stock > 0 && (p.soldCount || 0) > 0)
      .sort((a: any, b: any) => (b.bestSellerScore || 0) - (a.bestSellerScore || 0) || (b.soldCount || 0) - (a.soldCount || 0));
  }, [store]);

  // Vendor-Specific Active Deals — single source of truth promotional offers
  const storeDeals = useMemo(() => {
    if (!store?.products) return [];
    return store.products
      .filter(
        (p: any) =>
          (p.status === "ACTIVE" || p.status === "published") &&
          p.stock > 0 &&
          p.isDiscounted &&
          (p.amountSaved || 0) > 0
      )
      .sort((a: any, b: any) => (b.discountPercent || 0) - (a.discountPercent || 0) || (b.amountSaved || 0) - (a.amountSaved || 0));
  }, [store]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Loading Storefront...</h2>
          <p className="text-gray-500 text-sm mt-1">Fetching products and vendor details</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <StoreIcon className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Store Not Found</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The requested store profile does not exist or has been removed from the marketplace.
          </p>
          <Link href="/products">
            <Button className="gradient-primary text-white px-8 h-12 rounded-xl">
              Browse Marketplace
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isBannerUrl = Boolean(store.banner && (store.banner.startsWith("http") || store.banner.startsWith("/") || store.banner.startsWith("data:image/")));
  const isLogoUrl = Boolean(store.logo && (store.logo.startsWith("http") || store.logo.startsWith("/") || store.logo.startsWith("data:image/")));

  const joinedYear = store.createdAt ? new Date(store.createdAt).getFullYear() : new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* 1. STORE HERO SECTION */}
        <div className="bg-white border-b shadow-sm relative">
          {/* Banner */}
          <div className="h-28 sm:h-56 md:h-72 w-full relative bg-slate-900 overflow-hidden">
            {isBannerUrl ? (
              <img
                src={store.banner}
                alt={`${store.name} Banner`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full gradient-primary opacity-95 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-black/10" />
              </div>
            )}
          </div>

          {/* Hero Header Content */}
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-3 sm:pb-8">
            <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6">
              
              {/* Store Logo & Details */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-2.5 sm:gap-6 -mt-9 sm:-mt-20 md:-mt-24 z-10">
                <div className="w-18 h-18 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl sm:rounded-3xl bg-white p-1 sm:p-2 shadow-xl border border-gray-100 flex-shrink-0">
                  {isLogoUrl ? (
                    <img
                      src={store.logo}
                      alt={`${store.name} Logo`}
                      className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-4xl md:text-5xl font-extrabold shadow-inner">
                      {store.name?.[0] || "S"}
                    </div>
                  )}
                </div>

                <div className="text-center sm:text-left space-y-1 pt-0.5 sm:pt-2">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                    <h1 className="text-lg sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                      {store.name}
                    </h1>
                    {store.verified && (
                      <Badge className="bg-emerald-600 text-white gap-0.5 px-2 py-0.5 text-[9px] sm:text-xs font-bold shadow-2xs">
                        <CheckCircle className="h-3 w-3" /> Verified
                      </Badge>
                    )}
                  </div>

                  <p className="text-[11px] sm:text-sm text-gray-600 font-medium flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {store.rating}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>{store.numReviews} Reviews</span>
                    <span className="text-gray-400">•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600" /> {store.location}
                    </span>
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[10px] sm:text-xs text-gray-500 pt-0.5">
                    <span className="bg-gray-100 px-2 py-0.5 rounded-full font-medium text-gray-700">
                      {store.productCount || 0} Products
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                      {store.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-2 pt-2 md:pt-0 z-10 flex-wrap w-full md:w-auto">
                <Button
                  onClick={handleFollowToggle}
                  className={`h-9 sm:h-11 px-4 sm:px-6 rounded-xl font-bold text-xs sm:text-sm gap-1.5 transition-all flex-1 sm:flex-none ${
                    isFollowing 
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300" 
                      : "gradient-primary text-white shadow-sm hover:shadow-md"
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${isFollowing ? "fill-red-500 text-red-500" : ""}`} />
                  {isFollowing ? "Following" : "Follow"} ({followersCount})
                </Button>

                <Button
                  variant="outline"
                  onClick={handleMessageStore}
                  disabled={isStartingChat}
                  className="h-9 sm:h-11 px-3 sm:px-5 rounded-xl border-gray-300 hover:border-emerald-600 hover:bg-emerald-50 text-gray-700 gap-1.5 font-bold text-xs sm:text-sm"
                >
                  {isStartingChat ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                  ) : (
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                  )}
                  Message
                </Button>

                <Button
                  variant="outline"
                  onClick={handleShareStore}
                  className="h-9 sm:h-11 w-9 sm:w-11 p-0 rounded-xl border-gray-300 hover:bg-gray-50 flex items-center justify-center relative"
                  title="Share Store"
                >
                  <Share2 className="h-3.5 w-3.5 text-gray-600" />
                  {shareSuccess && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                      Copied!
                    </span>
                  )}
                </Button>
              </div>

            </div>
          </div>
        </div>

        {/* 2. STICKY NAVIGATION TABS */}
        <div className="sticky top-14 z-30 bg-white border-b border-gray-200 shadow-2xs">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex gap-1.5 sm:gap-4 overflow-x-auto no-scrollbar py-2">
              {[
                { id: "products", label: `Products (${store.products?.length || 0})` },
                { id: "featured", label: "Featured & Best Sellers" },
                { id: "deals", label: `Deals (${storeDeals.length})` },
                { id: "about", label: "About Store" },
                { id: "reviews", label: `Reviews (${store.numReviews || 0})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN TAB CONTENT CONTAINER */}
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8">

          {/* 3. PRODUCTS TAB (Primary Shopping Area) */}
          {activeTab === "products" && (
            <div className="grid lg:grid-cols-4 gap-4 sm:gap-8">
              {/* Left Filters Sidebar */}
              <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3.5 sm:p-6 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <h3 className="font-black text-gray-900 flex items-center gap-1.5 text-xs sm:text-base">
                      <Filter className="h-4 w-4 text-emerald-600" /> Store Filters
                    </h3>
                    {(searchQuery || selectedCategory !== "all" || minPrice || maxPrice || minRating > 0 || inStockOnly) && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("all");
                          setMinPrice("");
                          setMaxPrice("");
                          setMinRating(0);
                          setInStockOnly(false);
                          setCurrentPage(1);
                        }}
                        className="text-[11px] text-red-600 font-extrabold hover:underline"
                      >
                        Reset All
                      </button>
                    )}
                  </div>

                  {/* Search Input */}
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Search Products
                    </label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search keywords..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="pl-8 h-8 sm:h-10 rounded-xl text-xs bg-white border-gray-200 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Horizontal Category Touch Pills Bar on Mobile */}
                  {availableCategories.length > 1 && (
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Category
                      </label>
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:hidden">
                        <button
                          onClick={() => { setSelectedCategory("all"); setCurrentPage(1); }}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                            selectedCategory === "all" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          All ({store.products?.length || 0})
                        </button>
                        {availableCategories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${
                              selectedCategory === cat ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Select Dropdown for Desktop */}
                      <select
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="hidden lg:block w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-500 focus:outline-none cursor-pointer bg-white"
                      >
                        <option value="all">All Categories ({store.products?.length || 0})</option>
                        {availableCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Price Range & Availability in 2 columns on Mobile */}
                  <div className="grid grid-cols-2 gap-2 sm:block sm:space-y-4">
                    {/* Price Range */}
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Price (GH₵)
                      </label>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) => {
                            setMinPrice(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="h-8 sm:h-10 rounded-xl text-xs"
                        />
                        <span className="text-gray-400 text-xs">-</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) => {
                            setMaxPrice(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="h-8 sm:h-10 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    {/* Stock Filter */}
                    <div className="flex items-center pt-5 sm:pt-2">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inStockOnly}
                          onChange={(e) => {
                            setInStockOnly(e.target.checked);
                            setCurrentPage(1);
                          }}
                          className="h-3.5 w-3.5 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span className="text-xs font-bold text-gray-800">
                          In Stock Only
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Product Grid & Sorting */}
              <div className="lg:col-span-3 space-y-3 sm:space-y-6">
                {/* Header Control Bar */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-2.5 sm:p-4 flex items-center justify-between gap-2 shadow-2xs">
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    Showing <span className="font-black text-gray-900">{filteredProducts.length}</span> products
                  </p>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] sm:text-xs font-bold text-gray-400 whitespace-nowrap">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-8 sm:h-10 px-2 text-xs sm:text-sm font-bold bg-white border border-gray-200 rounded-xl focus:outline-none"
                    >
                      <option value="newest">Newest</option>
                      <option value="price_asc">Price: Low</option>
                      <option value="price_desc">Price: High</option>
                      <option value="rating">Top Rated</option>
                    </select>
                  </div>
                </div>

                {/* Product Cards Grid - 2 Columns on Mobile */}
                {paginatedProducts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
                    {paginatedProducts.map((product: any) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        brand={product.brand}
                        storeName={store.name}
                        verified={store.verified}
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
                        isBestSeller={product.isBestSeller}
                      />
                    ))}
                  </div>
                ) : (
                  /* Professional Empty State */
                  <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 sm:p-16 text-center">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base sm:text-xl font-black text-gray-900 mb-1">No Products Found</h3>
                    <p className="text-gray-500 text-xs mb-4">
                      No products match your search or filter options.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setMinPrice("");
                        setMaxPrice("");
                        setMinRating(0);
                        setInStockOnly(false);
                      }}
                      className="gradient-primary text-white rounded-xl h-8 text-xs font-bold px-4"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-6">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="rounded-xl h-10 px-4"
                    >
                      Previous
                    </Button>
                    <span className="text-sm font-semibold text-gray-700 px-3">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="rounded-xl h-10 px-4"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. FEATURED & BEST SELLERS TAB */}
          {activeTab === "featured" && (
            <div className="space-y-12">
              {/* Featured Section */}
              {featuredProducts.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-4">
                    <Sparkles className="h-6 w-6 text-amber-500" />
                    <h2 className="text-2xl font-extrabold text-gray-900">Featured Store Products</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
                    {featuredProducts.map((product: any) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        brand={product.brand}
                        storeName={store.name}
                        verified={store.verified}
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
                        isBestSeller={product.isBestSeller}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Best Sellers Section */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Award className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-lg sm:text-2xl font-black text-gray-900">Best Sellers</h2>
                </div>
                {bestSellers.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
                    {bestSellers.slice(0, 4).map((product: any) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        brand={product.brand}
                        storeName={store.name}
                        verified={store.verified}
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
                        isBestSeller={product.isBestSeller}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-xs font-semibold">
                    No best sellers available yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. VENDOR DEALS TAB (Vendor Specific Promotional Offers) */}
          {activeTab === "deals" && (
            <div className="space-y-4 sm:space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-lg sm:text-2xl font-black text-gray-900 flex items-center gap-2">
                    <Tag className="h-5 w-5 text-orange-500" />
                    Special Store Deals &amp; Promotions
                  </h2>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Exclusive limited-time discounts and active promotional offers from <strong className="text-gray-900">{store.name}</strong>.
                  </p>
                </div>

                {storeDeals.length > 0 && (
                  <Badge className="bg-orange-500 text-white font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full self-start md:self-auto shadow-2xs">
                    🔥 {storeDeals.length} Active Deal{storeDeals.length === 1 ? "" : "s"}
                  </Badge>
                )}
              </div>

              {storeDeals.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
                  {storeDeals.map((product: any) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      brand={product.brand}
                      storeName={store.name}
                      verified={store.verified}
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
                      isBestSeller={product.isBestSeller}
                    />
                  ))}
                </div>
              ) : (
                /* Store Deals Empty State */
                <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center space-y-4 max-w-lg mx-auto shadow-sm">
                  <Tag className="h-16 w-16 text-gray-300 mx-auto" />
                  <h3 className="text-2xl font-extrabold text-gray-900">No Active Deals Right Now</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    This store doesn't have any active deals or promotional offers right now. Check back later for new offers, or browse all available products from <strong>{store.name}</strong>.
                  </p>
                  <Button
                    onClick={() => setActiveTab("products")}
                    className="gradient-primary text-white font-bold rounded-xl px-6 py-2.5 shadow-md mt-2"
                  >
                    Browse All Store Products
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* 6. ABOUT TAB (Single Source of Truth) */}
          {activeTab === "about" && (
            <div className="space-y-4 sm:space-y-8">
              {/* About Store & Business Overview */}
              <div className="bg-white rounded-xl sm:rounded-3xl border border-gray-200 p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-2xs">
                <div>
                  <h2 className="text-base sm:text-2xl font-black text-gray-900 mb-2">About {store.name}</h2>
                  <p className="text-gray-700 leading-relaxed text-xs sm:text-base whitespace-pre-line">
                    {store.description || "Welcome to our storefront on AfriCart. We offer high-quality products and reliable delivery across all major regions."}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-gray-100">
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-gray-900 text-xs sm:text-lg flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-emerald-600" /> Business Overview
                    </h3>
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex justify-between border-b border-gray-100 pb-1.5">
                        <span className="font-medium text-gray-400">Business Name</span>
                        <span className="font-bold text-gray-900">{store.businessName || store.name}</span>
                      </div>
                      {store.businessType && (
                        <div className="flex justify-between border-b border-gray-100 pb-1.5">
                          <span className="font-medium text-gray-400">Business Type</span>
                          <span className="font-bold text-gray-900">{store.businessType}</span>
                        </div>
                      )}
                      {store.registrationNumber && (
                        <div className="flex justify-between border-b border-gray-100 pb-1.5">
                          <span className="font-medium text-gray-400">Reg. Number</span>
                          <span className="font-bold text-gray-900">{store.registrationNumber}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-b border-gray-100 pb-1.5">
                        <span className="font-medium text-gray-400">Primary Category</span>
                        <span className="font-bold text-gray-900">{store.category || "General Marketplace"}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-1.5">
                        <span className="font-medium text-gray-400">Member Since</span>
                        <span className="font-bold text-gray-900">{joinedYear}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-extrabold text-gray-900 text-xs sm:text-lg flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-emerald-600" /> Contact &amp; Hours
                    </h3>
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex justify-between border-b border-gray-100 pb-1.5">
                        <span className="font-medium text-gray-400">Location</span>
                        <span className="font-bold text-gray-900">{store.location || "Accra, Ghana"}</span>
                      </div>
                      {(store.supportEmail || store.contactEmail) && (
                        <div className="flex justify-between border-b border-gray-100 pb-1.5">
                          <span className="font-medium text-gray-400">Support Email</span>
                          <span className="font-bold text-gray-900 flex items-center gap-1">
                            <Mail className="h-3 w-3 text-gray-400" /> {store.supportEmail || store.contactEmail}
                          </span>
                        </div>
                      )}
                      {(store.supportPhone || store.contactPhone) && (
                        <div className="flex justify-between border-b border-gray-100 pb-1.5">
                          <span className="font-medium text-gray-400">Support Phone</span>
                          <span className="font-bold text-gray-900 flex items-center gap-1">
                            <Phone className="h-3 w-3 text-gray-400" /> {store.supportPhone || store.contactPhone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. STORE REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="space-y-4 sm:space-y-8">
              {/* Review Summary */}
              <div className="bg-white rounded-xl sm:rounded-3xl border border-gray-200 p-4 sm:p-8 shadow-2xs grid md:grid-cols-3 gap-4 sm:gap-8 items-center">
                <div className="text-center md:border-r border-gray-200 pr-0 sm:pr-4">
                  <div className="text-3xl sm:text-5xl font-black text-gray-900">{store.rating}</div>
                  <div className="flex items-center justify-center gap-1 my-1 sm:my-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Based on {store.numReviews} reviews</p>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm mb-2">Rating Breakdown</h3>
                  {[5, 4, 3, 2, 1].map((ratingVal) => (
                    <div key={ratingVal} className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-600">
                      <span className="w-8 font-semibold">{ratingVal} Star</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{
                            width: ratingVal === 5 ? "85%" : ratingVal === 4 ? "12%" : "3%",
                          }}
                        />
                      </div>
                      <span className="w-8 text-right font-medium">
                        {ratingVal === 5 ? "85%" : ratingVal === 4 ? "12%" : "3%"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review List */}
              {store.reviews && store.reviews.length > 0 ? (
                <div className="space-y-2.5 sm:space-y-4">
                  {store.reviews.map((rev: any) => (
                    <div key={rev.id} className="bg-white rounded-xl border border-gray-200 p-3.5 sm:p-6 space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                            {rev.customerName?.[0] || "C"}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-xs sm:text-sm">{rev.customerName}</p>
                            <p className="text-[10px] text-gray-400">Purchased: {rev.productName || "Product"}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < rev.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl sm:rounded-3xl border border-gray-200 p-8 sm:p-16 text-center shadow-2xs">
                  <Star className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1">No Reviews Yet</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Be the first customer to purchase and leave a review for {store.name}!
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

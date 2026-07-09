"use client";

import { useState } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { StoreDirectoryHeader } from "@/components/stores/store-directory-header";
import { FeaturedStoreCard } from "@/components/stores/featured-store-card";
import { StoreCategoryCard } from "@/components/stores/store-category-card";
import { StoreFilter } from "@/components/stores/store-filter";
import { StoreSort } from "@/components/stores/store-sort";
import { StoreGrid } from "@/components/stores/store-grid";
import { MobileStoreFilter } from "@/components/stores/mobile-store-filter";
import { Pagination } from "@/components/products/pagination";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal } from "lucide-react";
import {
  Smartphone,
  Shirt,
  Sparkles,
  Home,
  Dumbbell,
  ShoppingBasket,
  Car,
  BookOpen,
} from "lucide-react";

export default function StoresPage() {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const featuredStores = [
    {
      id: "1",
      name: "EMG Virus Tech",
      banner: "bg-gradient-to-r from-blue-100 to-blue-200",
      logo: "bg-gradient-to-br from-blue-500 to-blue-600",
      verified: true,
      rating: 4.9,
      products: 500,
      followers: 25000,
      category: "Electronics",
    },
    {
      id: "2",
      name: "Fashion Week",
      banner: "bg-gradient-to-r from-pink-100 to-pink-200",
      logo: "bg-gradient-to-br from-pink-500 to-pink-600",
      verified: true,
      rating: 4.8,
      products: 1200,
      followers: 32000,
      category: "Fashion",
    },
    {
      id: "3",
      name: "SM Biggie Phones",
      banner: "bg-gradient-to-r from-purple-100 to-purple-200",
      logo: "bg-gradient-to-br from-purple-500 to-purple-600",
      verified: true,
      rating: 4.9,
      products: 890,
      followers: 28500,
      category: "Electronics",
    },
    {
      id: "4",
      name: "Home Sweet Home",
      banner: "bg-gradient-to-r from-orange-100 to-orange-200",
      logo: "bg-gradient-to-br from-orange-500 to-orange-600",
      verified: true,
      rating: 4.7,
      products: 670,
      followers: 19800,
      category: "Home & Living",
    },
  ];

  const categories = [
    {
      name: "Electronics Stores",
      icon: Smartphone,
      storeCount: 450,
      color: "text-blue-600",
      href: "/stores?category=electronics",
    },
    {
      name: "Fashion Stores",
      icon: Shirt,
      storeCount: 680,
      color: "text-pink-600",
      href: "/stores?category=fashion",
    },
    {
      name: "Beauty Stores",
      icon: Sparkles,
      storeCount: 320,
      color: "text-purple-600",
      href: "/stores?category=beauty",
    },
    {
      name: "Home & Furniture",
      icon: Home,
      storeCount: 290,
      color: "text-orange-600",
      href: "/stores?category=home",
    },
    {
      name: "Sports Stores",
      icon: Dumbbell,
      storeCount: 180,
      color: "text-green-600",
      href: "/stores?category=sports",
    },
    {
      name: "Food Stores",
      icon: ShoppingBasket,
      storeCount: 240,
      color: "text-red-600",
      href: "/stores?category=food",
    },
    {
      name: "Automotive Stores",
      icon: Car,
      storeCount: 150,
      color: "text-gray-600",
      href: "/stores?category=automotive",
    },
    {
      name: "Books & Education",
      icon: BookOpen,
      storeCount: 190,
      color: "text-indigo-600",
      href: "/stores?category=books",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <StoreDirectoryHeader />

      {/* Featured Stores */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Featured Stores
            </h2>
            <p className="text-gray-600">
              Top-rated sellers with exceptional products and service
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredStores.map((store) => (
              <FeaturedStoreCard key={store.id} {...store} />
            ))}
          </div>
        </div>
      </section>

      {/* Store Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Browse by Category
            </h2>
            <p className="text-gray-600">
              Discover stores by product type and industry
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <StoreCategoryCard key={index} {...category} />
            ))}
          </div>
        </div>
      </section>

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
          <Button variant="outline" className="flex-1 gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Sort
          </Button>
        </div>
      </div>

      {/* All Stores */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">All Stores</h2>
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">2,500</span> stores available
            </p>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <StoreFilter />
              </div>
            </aside>

            {/* Store Grid */}
            <main className="flex-1 min-w-0">
              {/* Desktop Sort */}
              <div className="hidden lg:flex items-center justify-between mb-6">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">1-8</span> of{" "}
                  <span className="font-semibold text-gray-900">2,500</span> stores
                </div>
                <StoreSort />
              </div>

              {/* Stores */}
              <StoreGrid />

              {/* Pagination */}
              <Pagination currentPage={1} totalPages={313} />
            </main>
          </div>
        </div>
      </section>

      {/* Mobile Filter Sheet */}
      <MobileStoreFilter
        open={mobileFilterOpen}
        onOpenChange={setMobileFilterOpen}
      />

      <Footer />
    </div>
  );
}

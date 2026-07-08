"use client";

import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { StoreHeader } from "@/components/store/store-header";
import { StoreTabs } from "@/components/store/store-tabs";
import { TabsContent } from "@/components/ui/tabs";
import { StoreStats } from "@/components/store/store-stats";
import { StoreAbout } from "@/components/store/store-about";
import { StoreReviews } from "@/components/store/store-reviews";
import { SimilarStores } from "@/components/store/similar-stores";
import { ProductGrid } from "@/components/products/product-grid";
import { FilterSidebar } from "@/components/products/filter-sidebar";
import { SortDropdown } from "@/components/products/sort-dropdown";
import { Pagination } from "@/components/products/pagination";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useState } from "react";
import { MobileFilterSheet } from "@/components/products/mobile-filter-sheet";

export default function StorePage() {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Mock store data
  const storeData = {
    storeName: "Tech World",
    verified: true,
    rating: 4.8,
    followers: 12500,
    products: 340,
    joinDate: "January 2020",
    bannerImage: "bg-gradient-to-r from-blue-100 to-blue-200",
    logoColor: "bg-gradient-to-br from-blue-500 to-blue-600",
    description:
      "Tech World provides premium electronics and accessories from trusted brands. We specialize in the latest smartphones, laptops, cameras, and smart home devices. Our commitment is to deliver authentic products with exceptional customer service and competitive prices.",
    location: "New York, USA",
    businessType: "Authorized Retailer",
    yearsActive: 4,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <StoreHeader {...storeData} />
      
      <StoreTabs>
        {/* Home Tab */}
        <TabsContent value="home">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Store Stats */}
            <StoreStats
              customers="10K+"
              products="500+"
              rating="4.8"
              positiveReviews="98%"
            />

            {/* About Preview */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Featured Products */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Featured Products
                  </h2>
                  <ProductGrid showCount={false} />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <StoreAbout
                  description={storeData.description}
                  location={storeData.location}
                  businessType={storeData.businessType}
                  yearsActive={storeData.yearsActive}
                />
              </div>
            </div>

            {/* Similar Stores */}
            <SimilarStores />
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => setMobileFilterOpen(true)}
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            <div className="flex gap-8">
              {/* Desktop Filter Sidebar */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-32">
                  <FilterSidebar />
                </div>
              </aside>

              {/* Product Grid */}
              <main className="flex-1 min-w-0 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">340</span> products in this store
                  </div>
                  <SortDropdown />
                </div>

                <ProductGrid showCount={false} />
                <Pagination currentPage={1} totalPages={43} />
              </main>
            </div>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Product Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: "Smartphones", count: 89 },
                { name: "Laptops", count: 65 },
                { name: "Cameras", count: 43 },
                { name: "Accessories", count: 120 },
                { name: "Smart Home", count: 23 },
              ].map((category, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.count} products
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <StoreReviews />
          </div>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <StoreAbout
              description={storeData.description}
              location={storeData.location}
              businessType={storeData.businessType}
              yearsActive={storeData.yearsActive}
            />
          </div>
        </TabsContent>
      </StoreTabs>

      {/* Mobile Filter Sheet */}
      <MobileFilterSheet
        open={mobileFilterOpen}
        onOpenChange={setMobileFilterOpen}
      />

      <Footer />
    </div>
  );
}

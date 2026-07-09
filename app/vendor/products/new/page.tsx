"use client";

import { useState } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import ProductBasicInfo from "@/components/vendor/product/product-basic-info";
import MediaUploader from "@/components/vendor/product/media-uploader";
import CategorySelector from "@/components/vendor/product/category-selector";
import PricingCard from "@/components/vendor/product/pricing-card";
import InventoryCard from "@/components/vendor/product/inventory-card";
import VariantManager from "@/components/vendor/product/variant-manager";
import ShippingCard from "@/components/vendor/product/shipping-card";
import SeoCard from "@/components/vendor/product/seo-card";
import PublishPanel from "@/components/vendor/product/publish-panel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    price: 0,
    stock: 0,
    status: "draft",
  });

  const sections = [
    "Basic Information",
    "Media",
    "Category",
    "Pricing",
    "Inventory",
    "Variants",
    "Shipping",
    "SEO",
  ];

  const handleSaveDraft = () => {
    alert("Product saved as draft!");
  };

  const handlePublish = () => {
    alert("Product published successfully!");
  };

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
            { label: "Products", href: "/vendor/products" },
            { label: "Add New Product" },
          ]}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <Link href="/vendor/products">
              <Button variant="ghost" className="gap-2 mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Products
              </Button>
            </Link>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Add New Product
                </h1>
                <p className="text-gray-600">
                  Create and publish a new product for your store
                </p>
              </div>
              <div className="hidden md:flex gap-3">
                <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button variant="outline" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
              </div>
            </div>
          </div>

          {/* Section Navigation */}
          <div className="sticky top-16 z-20 bg-white border rounded-lg p-2 mb-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {sections.map((section) => (
                <button
                  key={section}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  {section}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <ProductBasicInfo />
              <MediaUploader />
              <CategorySelector />
              <PricingCard />
              <InventoryCard />
              <VariantManager />
              <ShippingCard />
              <SeoCard />
            </div>

            {/* Publish Panel */}
            <div className="lg:col-span-1">
              <PublishPanel onPublish={handlePublish} onSaveDraft={handleSaveDraft} />
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-30">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                className="flex-1"
              >
                Save Draft
              </Button>
              <Button onClick={handlePublish} className="flex-1">
                Publish
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

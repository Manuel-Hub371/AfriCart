"use client";

import { useEffect, useState, use } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { Breadcrumb } from "@/components/products/breadcrumb";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductPricing } from "@/components/product/product-pricing";
import { ProductVariants, VariantItem } from "@/components/product/product-variants";
import { PurchaseActions } from "@/components/product/purchase-actions";
import { SellerCard } from "@/components/product/seller-card";
import { ShippingCard } from "@/components/product/shipping-card";
import { ProductTabs } from "@/components/product/product-tabs";
import { RelatedProducts } from "@/components/product/related-products";
import { Button } from "@/components/ui/button";
import { Package, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Variant State
  const [selectedVariant, setSelectedVariant] = useState<VariantItem | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Product not found or currently unavailable");
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message || "Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-extrabold text-gray-900">Loading Product Details...</h2>
          <p className="text-gray-500 text-sm mt-1">Retrieving product variants, store info, and reviews</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The requested product does not exist or has been removed from the marketplace.
          </p>
          <Link href="/products">
            <Button className="gradient-primary text-white px-8 h-12 rounded-xl font-bold">
              Explore Marketplace Catalog
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Security Check: Hidden / Archived Products cannot be viewed publicly
  if (["ARCHIVED", "HIDDEN"].includes(product.status)) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <Package className="h-20 w-20 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Listing Unavailable</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            This product listing has been hidden or archived by the merchant.
          </p>
          <Link href="/products">
            <Button className="gradient-primary text-white px-8 h-12 rounded-xl font-bold">
              Browse Active Products
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: product.category || "General", href: `/products?category=${encodeURIComponent(product.category || "")}` },
    { label: product.name, href: `/product/${product.id}` },
  ];

  // Dynamic overrides based on selected variant
  // When a variant is selected, use variant pricing (no campaign adjustment for variants)
  // Dynamic overrides based on selected variant
  const activePrice = selectedVariant?.price ?? product.price;
  const activeStock = selectedVariant?.stock ?? product.stock;
  const activeSku = selectedVariant?.sku || product.slug || product.id.slice(0, 8).toUpperCase();
  const activeVariantImage = selectedVariant?.images && selectedVariant.images.length > 0 ? selectedVariant.images[0] : null;

  const inStock = Boolean(activeStock > 0);

  // Use API-provided campaign pricing
  const isDiscounted = product.isDiscounted ?? false;
  const discountPercent = product.discountPercent ?? 0;
  const amountSaved = product.amountSaved ?? 0;
  const originalPriceForDisplay = product.originalPrice;

  const galleryImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [];

  const storeInfo = product.store || {};

  // Build Dynamic Specifications Map
  const specificationsData: Record<string, string> = {
    ...(product.brand && { "Brand": product.brand }),
    ...(product.category && { "Category": product.category }),
    ...(activeSku && { "SKU": activeSku }),
    ...(product.weight && { "Weight": `${product.weight} kg` }),
    ...(product.dimensions && (product.dimensions.length || product.dimensions.width || product.dimensions.height) && {
      "Dimensions": `${product.dimensions.length || 0} x ${product.dimensions.width || 0} x ${product.dimensions.height || 0} cm`
    }),
    "Dispatched By": storeInfo.name || "AfriCart Merchant",
    "Warranty": "30-Day Money-Back Guarantee",
    ...(product.specifications || {}),
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Breadcrumb Header */}
        <div className="bg-white border-b border-gray-200 shadow-2xs">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        {/* Main Product Showcase Section */}
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-3 sm:py-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-3.5 sm:p-8 shadow-2xs mb-4 sm:mb-8">
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-10">
              {/* Left: Product Gallery */}
              <ProductGallery
                images={product.images}
                activeVariantImage={activeVariantImage}
                productName={product.name}
                category={product.category}
              />

              {/* Right: Product Details & Purchase Actions */}
              <div className="space-y-4 sm:space-y-6 flex flex-col justify-between pt-2 lg:pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {/* Title, Brand & Badges */}
                  <ProductInfo
                    name={product.name}
                    brand={product.brand}
                    category={product.category}
                    sku={activeSku}
                    rating={product.rating || 5.0}
                    reviews={product.numReviews || 0}
                    soldCount={product.soldCount || 0}
                    status={product.status}
                    badges={product.badges}
                    campaigns={product.campaigns}
                    verified={true}
                    isBestSeller={product.isBestSeller}
                    bestSellerRank={product.bestSellerRank}
                  />

                  {/* Pricing, Discounts & Stock Warning */}
                  <ProductPricing
                    price={activePrice}
                    originalPrice={originalPriceForDisplay || undefined}
                    amountSaved={amountSaved}
                    discountPercent={discountPercent}
                    isDiscounted={isDiscounted}
                    campaignName={product.campaignName}
                    campaignEndDate={product.campaignEndDate}
                    stock={activeStock}
                    inStock={inStock}
                  />

                  {/* Product Variants Selection System */}
                  <ProductVariants
                    variants={product.variants || []}
                    onVariantSelect={(v) => setSelectedVariant(v)}
                  />
                </div>

                {/* Purchase Controls */}
                <PurchaseActions
                  productId={product.id}
                  inStock={inStock}
                  maxQuantity={Math.max(1, activeStock)}
                  selectedVariantId={selectedVariant?.id}
                  selectedVariantPrice={selectedVariant?.price}
                  productName={product.name}
                  storeId={storeInfo.id}
                />
              </div>
            </div>
          </div>

          {/* Store Info & Shipping Cards */}
          <div className="grid lg:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-8">
            <SellerCard
              storeId={storeInfo.id || storeInfo.slug}
              storeName={storeInfo.name || "Marketplace Vendor"}
              storeRating={4.9}
              products={storeInfo.productCount || 0}
              totalSales={storeInfo.totalSales || 0}
              followers={storeInfo.followersCount || 0}
              responseRate={storeInfo.responseRate || 99}
              responseTime={storeInfo.responseTime || "< 2 hours"}
              verified={Boolean(storeInfo.verified)}
              logo={storeInfo.logo || undefined}
              banner={storeInfo.banner || undefined}
              location={storeInfo.location || "Accra, Ghana"}
              joinedDate={storeInfo.joinedDate || "Jul 2024"}
            />

            <ShippingCard
              policies={product.shippingPolicies || []}
              storeLocation={storeInfo.location || "Accra, Ghana"}
              weight={product.weight}
            />
          </div>

          {/* Product Tabs (Description, Specifications, Customer Reviews, Q&A, Shipping) */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-3.5 sm:p-8 shadow-2xs mb-6 sm:mb-12">
            <ProductTabs
              productId={product.id}
              description={product.description || "No detailed description provided for this product."}
              specifications={specificationsData}
              storeName={storeInfo.name}
              shippingPolicies={product.shippingPolicies || []}
              refundPolicy={product.refundPolicy}
              returnPolicy={product.returnPolicy}
              warrantyPolicy={product.warrantyPolicy}
            />
          </div>

          {/* Related Products & Recommendations */}
          <RelatedProducts
            currentProductId={product.id}
            category={product.category}
            storeId={storeInfo.id}
            storeName={storeInfo.name}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

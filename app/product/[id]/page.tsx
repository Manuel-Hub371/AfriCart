"use client";

import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { Breadcrumb } from "@/components/products/breadcrumb";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductPricing } from "@/components/product/product-pricing";
import { ProductVariants } from "@/components/product/product-variants";
import { PurchaseActions } from "@/components/product/purchase-actions";
import { SellerCard } from "@/components/product/seller-card";
import { ShippingCard } from "@/components/product/shipping-card";
import { ProductTabs } from "@/components/product/product-tabs";
import { RelatedProducts } from "@/components/product/related-products";

export default function ProductDetailsPage() {
  // Mock product data
  const product = {
    id: "1",
    name: "Premium Wireless Bluetooth Headphones with Active Noise Cancellation",
    rating: 4.8,
    reviews: 2450,
    verified: true,
    price: 89.99,
    originalPrice: 129.99,
    discount: 31,
    stock: 15,
    inStock: true,
    images: [
      "bg-gradient-to-br from-blue-100 to-blue-200",
      "bg-gradient-to-br from-blue-200 to-blue-300",
      "bg-gradient-to-br from-blue-300 to-blue-400",
      "bg-gradient-to-br from-blue-100 to-purple-200",
      "bg-gradient-to-br from-purple-100 to-blue-200",
    ],
    variants: [
      {
        name: "Color",
        options: ["Black", "White", "Blue", "Red"],
      },
      {
        name: "Model",
        options: ["Standard", "Pro", "Max"],
      },
    ],
    description: `Experience premium audio quality with our Advanced Wireless Bluetooth Headphones. Featuring state-of-the-art active noise cancellation technology, these headphones deliver crystal-clear sound while blocking out unwanted ambient noise.

Key Features:
• Active Noise Cancellation (ANC) technology
• 40-hour battery life with ANC off, 30 hours with ANC on
• Premium memory foam ear cushions for all-day comfort
• Bluetooth 5.0 for stable wireless connectivity
• Built-in microphone for hands-free calls
• Foldable design with premium carrying case included
• Quick charge: 5 minutes for 3 hours of playback

Perfect for:
- Commuting and travel
- Working from home
- Gaming and entertainment
- Conference calls and meetings

What's in the box:
- Wireless Headphones
- USB-C charging cable
- 3.5mm audio cable
- Premium carrying case
- User manual`,
    specifications: {
      Brand: "AudioTech",
      Model: "AT-WH1000",
      "Driver Size": "40mm",
      "Frequency Response": "20Hz - 20kHz",
      Impedance: "32 Ohms",
      "Battery Life": "40 hours",
      "Charging Time": "2.5 hours",
      "Bluetooth Version": "5.0",
      Weight: "250g",
      Color: "Black",
      Warranty: "2 Years",
    },
    seller: {
      id: "1",
      name: "Tech World",
      rating: 4.9,
      products: 340,
      followers: 12500,
      responseRate: 98,
      verified: true,
      logo: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    shipping: {
      estimatedDelivery: "July 12 - July 15",
      shippingCost: 0,
      returnDays: 30,
    },
  };

  const breadcrumbItems = [
    { label: "Products", href: "/products" },
    { label: "Electronics", href: "/products?category=electronics" },
    { label: "Headphones", href: "/products?category=headphones" },
    { label: product.name, href: `/product/${product.id}` },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Product Gallery */}
          <ProductGallery images={product.images} />

          {/* Right: Product Information */}
          <div className="space-y-6">
            <ProductInfo
              name={product.name}
              rating={product.rating}
              reviews={product.reviews}
              verified={product.verified}
            />

            <ProductPricing
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              stock={product.stock}
              inStock={product.inStock}
            />

            <ProductVariants variants={product.variants} />

            <PurchaseActions
              inStock={product.inStock}
              maxQuantity={product.stock}
            />
          </div>
        </div>

        {/* Seller & Shipping Cards */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          <SellerCard
            storeId={product.seller.id}
            storeName={product.seller.name}
            storeRating={product.seller.rating}
            products={product.seller.products}
            followers={product.seller.followers}
            responseRate={product.seller.responseRate}
            verified={product.seller.verified}
            logo={product.seller.logo}
          />
          <ShippingCard {...product.shipping} />
        </div>

        {/* Product Tabs */}
        <div className="mb-12">
          <ProductTabs
            description={product.description}
            specifications={product.specifications}
          />
        </div>

        {/* Related Products */}
        <RelatedProducts />
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
        <div className="flex gap-3">
          <button className="flex-1 py-3 border-2 border-primary text-primary font-semibold rounded-lg">
            Add to Cart
          </button>
          <button className="flex-1 py-3 bg-primary text-white font-semibold rounded-lg">
            Buy Now
          </button>
        </div>
      </div>

      {/* Add padding for mobile sticky bar */}
      <div className="lg:hidden h-20"></div>

      <Footer />
    </div>
  );
}

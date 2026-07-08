"use client";

import { BadgeCheck, Star } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  image: string;
  variant: string;
  quantity: number;
  price: number;
  originalPrice: number;
}

interface VendorOrderReviewProps {
  vendor: {
    vendorId: string;
    vendorName: string;
    vendorLogo: string;
    verified: boolean;
    rating: number;
    products: Product[];
  };
  index: number;
}

export default function VendorOrderReview({
  vendor,
  index,
}: VendorOrderReviewProps) {
  const vendorTotal = vendor.products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Vendor Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 ${vendor.vendorLogo} rounded-lg flex items-center justify-center text-white text-xl font-bold`}
          >
            {vendor.vendorName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">
                {vendor.vendorName}
              </h3>
              {vendor.verified && (
                <BadgeCheck className="h-4 w-4 text-emerald-600" />
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-sm text-gray-600">{vendor.rating}</span>
            </div>
          </div>
        </div>
        <Link
          href={`/store/${vendor.vendorId}`}
          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
        >
          Visit Store
        </Link>
      </div>

      {/* Products */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 text-sm">
          Delivery {index + 1} - {vendor.products.length} item
          {vendor.products.length > 1 ? "s" : ""}
        </h4>
        {vendor.products.map((product) => (
          <div key={product.id} className="flex gap-4">
            {/* Product Image */}
            <div
              className={`w-20 h-20 ${product.image} rounded-lg flex-shrink-0`}
            />

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-gray-900 truncate">
                {product.name}
              </h5>
              <p className="text-sm text-gray-500 mt-1">{product.variant}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-600">
                  Qty: {product.quantity}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    ${product.price}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Item Total */}
            <div className="text-right">
              <span className="font-semibold text-gray-900">
                ${product.price * product.quantity}
              </span>
            </div>
          </div>
        ))}

        {/* Vendor Total */}
        <div className="pt-4 border-t flex items-center justify-between">
          <span className="font-medium text-gray-700">Vendor Subtotal</span>
          <span className="font-semibold text-gray-900">${vendorTotal}</span>
        </div>
      </div>
    </div>
  );
}

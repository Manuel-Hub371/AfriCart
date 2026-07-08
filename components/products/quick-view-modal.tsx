"use client";

import { X, Star, ShoppingCart, Heart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QuickViewModalProps {
  open: boolean;
  onClose: () => void;
  product?: {
    name: string;
    storeName: string;
    verified: boolean;
    rating: number;
    reviews: number;
    price: number;
    originalPrice?: number;
    discount?: number;
    image: string;
    description: string;
    inStock: boolean;
  };
}

export function QuickViewModal({ open, onClose, product }: QuickViewModalProps) {
  if (!open || !product) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Quick View</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <div className={`w-full h-full ${product.image}`}></div>
              {product.discount && (
                <Badge className="absolute top-4 left-4 bg-orange-500">
                  -{product.discount}%
                </Badge>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>{product.storeName}</span>
                  {product.verified && (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">
                    {product.rating}
                  </span>
                </div>
                <span className="text-gray-600">
                  ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div>
                {product.inStock ? (
                  <Badge className="bg-green-100 text-green-800">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Description
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                {product.inStock ? (
                  <>
                    <Button className="w-full gap-2" size="lg">
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      size="lg"
                    >
                      <Heart className="h-5 w-5" />
                      Add to Wishlist
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" className="w-full" size="lg" disabled>
                    Out of Stock
                  </Button>
                )}
              </div>

              {/* View Full Details */}
              <Button
                variant="link"
                className="w-full"
                onClick={onClose}
              >
                View Full Product Details →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

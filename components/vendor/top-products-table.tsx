"use client";

import { Star, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  images?: string[];
  price: number;
  stock: number;
  rating: number;
  numReviews: number;
  status: string;
}

interface TopProductsTableProps {
  products?: Product[];
}

export function TopProductsTable({ products = [] }: TopProductsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Top Store Products</h3>
          <p className="text-xs text-gray-500 font-medium">Real-time product inventory & rating performance</p>
        </div>
        <Link
          href="/vendor/products"
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
        >
          View All Products →
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed text-gray-500 text-sm">
          No products listed yet in your store catalog.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="text-xs font-bold text-gray-600 uppercase py-3 px-4">
                  Product
                </th>
                <th className="text-right text-xs font-bold text-gray-600 uppercase py-3 px-4">
                  Price
                </th>
                <th className="text-right text-xs font-bold text-gray-600 uppercase py-3 px-4">
                  Stock
                </th>
                <th className="text-center text-xs font-bold text-gray-600 uppercase py-3 px-4">
                  Rating
                </th>
                <th className="text-center text-xs font-bold text-gray-600 uppercase py-3 px-4">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map((product, index) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center border">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <Link href={`/vendor/products/${product.id}`} className="font-bold text-gray-900 text-sm hover:text-emerald-600">
                          {product.name}
                        </Link>
                        {index === 0 && (
                          <Badge className="ml-2 bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Top Product
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-gray-900 text-sm">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-sm">
                    <span className={`font-bold ${product.stock <= 5 ? "text-red-600" : "text-gray-700"}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                      <span className="text-xs text-gray-500">({product.numReviews})</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant="outline" className={`text-xs font-bold uppercase ${product.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                      {product.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

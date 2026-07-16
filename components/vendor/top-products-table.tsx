"use client";

import { Star, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  image: string;
  revenue: number;
  unitsSold: number;
  conversionRate: number;
  rating: number;
  stockRemaining: number;
  returnRate: number;
  trend: "up" | "down";
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
    revenue: 45678,
    unitsSold: 382,
    conversionRate: 4.2,
    rating: 4.8,
    stockRemaining: 145,
    returnRate: 2.1,
    trend: "up",
  },
  {
    id: "2",
    name: "Smart Watch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
    revenue: 38920,
    unitsSold: 134,
    conversionRate: 3.8,
    rating: 4.6,
    stockRemaining: 67,
    returnRate: 3.5,
    trend: "up",
  },
  {
    id: "3",
    name: "Laptop Bag",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop",
    revenue: 29450,
    unitsSold: 456,
    conversionRate: 5.1,
    rating: 4.9,
    stockRemaining: 234,
    returnRate: 1.8,
    trend: "up",
  },
  {
    id: "4",
    name: "USB-C Cable",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100&h=100&fit=crop",
    revenue: 18765,
    unitsSold: 892,
    conversionRate: 6.3,
    rating: 4.5,
    stockRemaining: 567,
    returnRate: 4.2,
    trend: "down",
  },
  {
    id: "5",
    name: "Power Bank",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=100&h=100&fit=crop",
    revenue: 15432,
    unitsSold: 289,
    conversionRate: 3.9,
    rating: 4.4,
    stockRemaining: 123,
    returnRate: 2.9,
    trend: "up",
  },
];

export function TopProductsTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Top Products</h3>
        <p className="text-sm text-gray-600">Best performing products by revenue</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-4">
                Product
              </th>
              <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-4">
                Revenue
              </th>
              <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-4">
                Units Sold
              </th>
              <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-4">
                Conversion
              </th>
              <th className="text-center text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-4">
                Rating
              </th>
              <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-4">
                Stock
              </th>
              <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-4">
                Returns
              </th>
              <th className="text-center text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-4">
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map((product, index) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      {index === 0 && (
                        <Badge className="mt-1 bg-emerald-100 text-emerald-700 text-xs">
                          Best Seller
                        </Badge>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right font-semibold text-gray-900">
                  ${product.revenue.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right text-gray-700">
                  {product.unitsSold.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right text-gray-700">
                  {product.conversionRate}%
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className={`text-sm ${
                    product.stockRemaining < 100 ? "text-yellow-700" : "text-gray-700"
                  }`}>
                    {product.stockRemaining}
                  </span>
                </td>
                <td className="py-4 px-4 text-right text-gray-700">
                  {product.returnRate}%
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-center">
                    {product.trend === "up" ? (
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

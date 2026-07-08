"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, List, Star, Truck } from "lucide-react";
import { ReviewSection } from "./review-section";

interface ProductTabsProps {
  description: string;
  specifications: Record<string, string>;
}

export function ProductTabs({ description, specifications }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
        <TabsTrigger
          value="description"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2"
        >
          <FileText className="h-4 w-4" />
          Description
        </TabsTrigger>
        <TabsTrigger
          value="specifications"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2"
        >
          <List className="h-4 w-4" />
          Specifications
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2"
        >
          <Star className="h-4 w-4" />
          Reviews
        </TabsTrigger>
        <TabsTrigger
          value="shipping"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4 gap-2"
        >
          <Truck className="h-4 w-4" />
          Shipping
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div className="prose max-w-none">
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
      </TabsContent>

      <TabsContent value="specifications" className="mt-6">
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody>
              {Object.entries(specifications).map(([key, value], index) => (
                <tr
                  key={key}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 font-semibold text-gray-900 w-1/3">
                    {key}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <ReviewSection />
      </TabsContent>

      <TabsContent value="shipping" className="mt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Shipping Information
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Standard shipping: 3-5 business days</li>
              <li>• Express shipping: 1-2 business days</li>
              <li>• Free shipping on orders over $50</li>
              <li>• International shipping available</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Return Policy
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We offer a 30-day return policy for all items. Products must be
              unused and in original packaging. Return shipping costs may apply
              unless the item is defective or damaged.
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SeoCard() {
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [urlSlug, setUrlSlug] = useState("");

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        Search Engine Optimization (SEO)
      </h2>

      <div className="space-y-6">
        {/* SEO Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SEO Title
          </label>
          <Input
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="Enter SEO title"
            maxLength={60}
          />
          <p className="text-xs text-gray-500 mt-1">
            {seoTitle.length}/60 characters (optimal: 50-60)
          </p>
        </div>

        {/* Meta Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description
          </label>
          <textarea
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            placeholder="Brief description for search engines"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            rows={3}
            maxLength={160}
          />
          <p className="text-xs text-gray-500 mt-1">
            {metaDesc.length}/160 characters (optimal: 150-160)
          </p>
        </div>

        {/* URL Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Slug
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
              afriCart.com/product/
            </span>
            <Input
              value={urlSlug}
              onChange={(e) =>
                setUrlSlug(
                  e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")
                )
              }
              placeholder="product-name"
              className="rounded-l-none"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Auto-generated from product name if left blank
          </p>
        </div>

        {/* Search Preview */}
        <div className="mt-6 border rounded-lg p-4 bg-gray-50">
          <p className="text-xs font-medium text-gray-600 mb-3">
            Search Engine Preview
          </p>
          <div className="space-y-1">
            <div className="text-blue-600 text-lg hover:underline cursor-pointer">
              {seoTitle || "Product Title - AfriCart"}
            </div>
            <div className="text-green-700 text-sm">
              https://afriCart.com/product/{urlSlug || "product-name"}
            </div>
            <div className="text-gray-600 text-sm">
              {metaDesc ||
                "This is how your product will appear in search engine results. Add a meta description to improve click-through rates."}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-600">
          Good SEO helps customers find your product on Google and other search
          engines
        </p>
      </div>
    </Card>
  );
}

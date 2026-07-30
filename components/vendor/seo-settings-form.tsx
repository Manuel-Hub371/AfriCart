"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Search, Globe, Share2 } from "lucide-react";

interface SeoSettingsFormProps {
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

export function SeoSettingsForm({ onSave, initialData }: SeoSettingsFormProps) {
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
  const [metaKeywords, setMetaKeywords] = useState(initialData?.metaKeywords || "");
  const [ogImage, setOgImage] = useState(initialData?.ogImage || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setSeoTitle(initialData.seoTitle || "");
      setMetaDescription(initialData.metaDescription || "");
      setMetaKeywords(initialData.metaKeywords || "");
      setOgImage(initialData.ogImage || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        seoTitle,
        metaDescription,
        metaKeywords,
        ogImage,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">SEO &amp; Search Engine Optimization</h2>
        <p className="text-gray-600 text-sm">
          Optimize your store title, meta descriptions, and keywords for Google search indexing and social sharing.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="font-bold text-gray-900 flex items-center gap-2 text-sm">
            <Search className="h-4 w-4 text-emerald-600" /> SEO Page Title
          </label>
          <Input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="Official Store Name | Verified Seller on AfriCart"
            className="rounded-xl border-gray-200 text-sm h-11"
          />
          <p className="text-xs text-gray-400">Recommended length: 50–60 characters</p>
        </div>

        <div className="space-y-2">
          <label className="font-bold text-gray-900 flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-emerald-600" /> Meta Description
          </label>
          <textarea
            rows={3}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="A compelling description of your store and merchandise for search engines..."
            className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <p className="text-xs text-gray-400">Recommended length: 120–160 characters</p>
        </div>

        <div className="space-y-2">
          <label className="font-bold text-gray-900 text-sm">SEO Meta Keywords (Comma Separated)</label>
          <Input
            type="text"
            value={metaKeywords}
            onChange={(e) => setMetaKeywords(e.target.value)}
            placeholder="africart, electronics, ghana shopping, verified seller"
            className="rounded-xl border-gray-200 text-sm h-11"
          />
        </div>

        <div className="space-y-2 pt-4 border-t">
          <label className="font-bold text-gray-900 flex items-center gap-2 text-sm">
            <Share2 className="h-4 w-4 text-emerald-600" /> Open Graph Social Image URL
          </label>
          <Input
            type="url"
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
            placeholder="https://example.com/og-banner.jpg"
            className="rounded-xl border-gray-200 text-sm h-11"
          />
          <p className="text-xs text-gray-400">Image displayed when sharing your store link on WhatsApp, Twitter, Facebook</p>
        </div>
      </div>

      <div className="pt-4 border-t flex justify-end">
        <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 font-bold">
          <Save className="h-4 w-4 mr-2" /> {saving ? "Saving..." : "Save SEO Settings"}
        </Button>
      </div>
    </form>
  );
}

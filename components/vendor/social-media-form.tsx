"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Share2, Globe } from "lucide-react";

interface SocialMediaFormProps {
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

export function SocialMediaForm({ onSave, initialData }: SocialMediaFormProps) {
  const [facebook, setFacebook] = useState(initialData?.facebook || "https://facebook.com/africartstore");
  const [instagram, setInstagram] = useState(initialData?.instagram || "https://instagram.com/africartstore");
  const [twitter, setTwitter] = useState(initialData?.twitter || "https://x.com/africartstore");
  const [tiktok, setTiktok] = useState(initialData?.tiktok || "https://tiktok.com/@africartstore");
  const [linkedin, setLinkedin] = useState(initialData?.linkedin || "https://linkedin.com/company/africart");
  const [website, setWebsite] = useState(initialData?.website || "https://africart.com");

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        facebook,
        instagram,
        twitter,
        tiktok,
        linkedin,
        website,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Social Media &amp; Web Links</h2>
        <p className="text-gray-600 text-sm">
          Connect your official social media channels to showcase your brand to marketplace customers.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Globe className="h-4 w-4 text-emerald-600" /> Official Website
          </label>
          <Input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="rounded-xl border-gray-200 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Share2 className="h-4 w-4 text-blue-600" /> Facebook Page
          </label>
          <Input
            type="url"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            className="rounded-xl border-gray-200 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Share2 className="h-4 w-4 text-pink-600" /> Instagram Profile
          </label>
          <Input
            type="url"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className="rounded-xl border-gray-200 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Share2 className="h-4 w-4 text-slate-900" /> X (Twitter) Handle / Link
          </label>
          <Input
            type="url"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            className="rounded-xl border-gray-200 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Share2 className="h-4 w-4 text-slate-800" /> TikTok Channel
          </label>
          <Input
            type="url"
            value={tiktok}
            onChange={(e) => setTiktok(e.target.value)}
            className="rounded-xl border-gray-200 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Share2 className="h-4 w-4 text-blue-700" /> LinkedIn Company Page
          </label>
          <Input
            type="url"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            className="rounded-xl border-gray-200 text-sm"
          />
        </div>
      </div>

      <div className="pt-4 border-t flex justify-end">
        <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
          <Save className="h-4 w-4 mr-2" /> {saving ? "Saving..." : "Save Social Links"}
        </Button>
      </div>
    </form>
  );
}

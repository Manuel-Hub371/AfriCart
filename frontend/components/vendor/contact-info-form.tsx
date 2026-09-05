"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Facebook, Instagram, Twitter, Globe, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactInfoFormProps {
  onSave: (data: any) => void;
  initialData?: any;
}

export function ContactInfoForm({ onSave, initialData }: ContactInfoFormProps) {
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [supportEmail, setSupportEmail] = useState(initialData?.supportEmail || "");
  const [supportPhone, setSupportPhone] = useState(initialData?.supportPhone || "");
  const [businessHours, setBusinessHours] = useState(initialData?.businessHours || "Mon - Sat: 8:00 AM - 6:00 PM");
  const [website, setWebsite] = useState(initialData?.website || "");

  const [facebook, setFacebook] = useState(initialData?.socialLinks?.facebook || "");
  const [instagram, setInstagram] = useState(initialData?.socialLinks?.instagram || "");
  const [twitter, setTwitter] = useState(initialData?.socialLinks?.twitter || initialData?.socialLinks?.x || "");
  const [tiktok, setTiktok] = useState(initialData?.socialLinks?.tiktok || "");
  const [linkedin, setLinkedin] = useState(initialData?.socialLinks?.linkedin || "");
  const [youtube, setYoutube] = useState(initialData?.socialLinks?.youtube || "");
  const [whatsapp, setWhatsapp] = useState(initialData?.socialLinks?.whatsapp || "");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setSupportEmail(initialData.supportEmail || "");
      setSupportPhone(initialData.supportPhone || "");
      setBusinessHours(initialData.businessHours || "Mon - Sat: 8:00 AM - 6:00 PM");
      setWebsite(initialData.website || "");
      setFacebook(initialData.socialLinks?.facebook || "");
      setInstagram(initialData.socialLinks?.instagram || "");
      setTwitter(initialData.socialLinks?.twitter || initialData.socialLinks?.x || "");
      setTiktok(initialData.socialLinks?.tiktok || "");
      setLinkedin(initialData.socialLinks?.linkedin || "");
      setYoutube(initialData.socialLinks?.youtube || "");
      setWhatsapp(initialData.socialLinks?.whatsapp || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave({
      email,
      phone,
      supportEmail,
      supportPhone,
      businessHours,
      website,
      socialLinks: {
        facebook,
        instagram,
        twitter,
        x: twitter,
        tiktok,
        linkedin,
        youtube,
        whatsapp,
      },
    });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Contact &amp; Support Settings</h2>
          <p className="text-gray-600 text-sm">Manage primary business contact details and social media channels</p>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 h-11 rounded-xl"
        >
          {isSubmitting ? "Saving..." : "Save Contact Info"}
        </Button>
      </div>

      {/* Business Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Store Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="store@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Store Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="+233 XX XXX XXXX"
            />
          </div>
        </div>
      </div>

      {/* Support Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Support Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="support@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Support Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="+233 XX XXX XXXX"
            />
          </div>
        </div>
      </div>

      {/* Website & Hours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store Website</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="https://yourstore.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
          <input
            type="text"
            value={businessHours}
            onChange={(e) => setBusinessHours(e.target.value)}
            className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="Mon - Sat: 8:00 AM - 6:00 PM"
          />
        </div>
      </div>

      {/* Social Media Channels */}
      <div className="border-t border-gray-200 pt-6">
        <label className="block text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Share2 className="h-5 w-5 text-emerald-600" /> Social Media &amp; Messaging Profiles
        </label>
        <p className="text-xs text-gray-500 mb-4">
          Configured links will automatically render on your public Storefront About page
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Facebook URL</label>
            <div className="relative">
              <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full h-11 pl-9 pr-4 rounded-lg border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="https://facebook.com/yourstore"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Instagram URL</label>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-600" />
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full h-11 pl-9 pr-4 rounded-lg border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="https://instagram.com/yourstore"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">X (Twitter) URL</label>
            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-500" />
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full h-11 pl-9 pr-4 rounded-lg border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="https://x.com/yourstore"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">TikTok URL</label>
            <input
              type="url"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="https://tiktok.com/@yourstore"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="https://linkedin.com/company/yourstore"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">YouTube Channel URL</label>
            <input
              type="url"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="https://youtube.com/@yourstore"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp Direct Business Link / Number</label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="https://wa.me/233XXXXXXXXX or +233XXXXXXXXX"
            />
          </div>
        </div>
      </div>
    </form>
  );
}

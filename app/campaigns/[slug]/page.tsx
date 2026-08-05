"use client";

import { useEffect, useState, use } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, Clock, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface CampaignDetail {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string | null;
  banner?: string | null;
  badge?: string | null;
  color?: string | null;
  startDate: string;
  endDate: string;
  discountType: string;
  discountValue?: number | null;
  store: { id: string; name: string; logo?: string | null; slug: string; verified?: boolean };
}

export default function CampaignDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    async function loadCampaign() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/campaigns/${slug}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to load campaign");
        }
        const data = await res.json();
        setCampaign(data.campaign);
        setProducts(data.products || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCampaign();
  }, [slug]);

  // Live Countdown Timer
  useEffect(() => {
    if (!campaign?.endDate) return;

    const timer = setInterval(() => {
      const target = new Date(campaign.endDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [campaign?.endDate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Navbar />
        <div className="py-24 text-center">
          <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-gray-600">Loading campaign event deals...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Navbar />
        <div className="py-20 max-w-md mx-auto text-center px-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Campaign Not Found</h2>
          <p className="text-sm text-gray-600 mb-6">{error || "The requested campaign is unavailable or has ended."}</p>
          <Link href="/campaigns">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Browse Active Campaigns</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Campaign Banner Header */}
        <div
          className="text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
          style={{ backgroundColor: campaign.color || "#047857" }}
        >
          <div className="max-w-7xl mx-auto space-y-6 relative z-10">
            <Link href="/campaigns">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 gap-2 mb-2">
                <ArrowLeft className="h-4 w-4" /> Back to All Events
              </Button>
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <Badge className="bg-white/20 text-white border-white/30 text-xs uppercase font-extrabold px-3.5 py-1 rounded-full">
                  {campaign.badge || campaign.type}
                </Badge>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  {campaign.name}
                </h1>
                {campaign.description && (
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                    {campaign.description}
                  </p>
                )}
                <p className="text-xs text-white/70 font-semibold pt-1">
                  Hosted by <strong>{campaign.store.name}</strong>
                </p>
              </div>

              {/* Countdown Timer */}
              <div className="bg-black/30 backdrop-blur-md border border-white/20 p-5 rounded-3xl text-center space-y-2 min-w-[280px]">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/80 block flex items-center justify-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-amber-400" /> Offer Ends In
                </span>
                <div className="grid grid-cols-4 gap-2 text-white">
                  <div className="bg-white/10 p-2 rounded-2xl">
                    <span className="text-2xl font-extrabold block">{timeLeft.days}</span>
                    <span className="text-[9px] uppercase font-bold text-white/70">Days</span>
                  </div>
                  <div className="bg-white/10 p-2 rounded-2xl">
                    <span className="text-2xl font-extrabold block">{timeLeft.hours}</span>
                    <span className="text-[9px] uppercase font-bold text-white/70">Hrs</span>
                  </div>
                  <div className="bg-white/10 p-2 rounded-2xl">
                    <span className="text-2xl font-extrabold block">{timeLeft.minutes}</span>
                    <span className="text-[9px] uppercase font-bold text-white/70">Mins</span>
                  </div>
                  <div className="bg-white/10 p-2 rounded-2xl">
                    <span className="text-2xl font-extrabold block">{timeLeft.seconds}</span>
                    <span className="text-[9px] uppercase font-bold text-white/70">Secs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Showcase */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-8 border-b pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Campaign Deals</h2>
              <p className="text-xs text-gray-500">{products.length} discounted products available</p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center text-gray-500 text-sm">
              No active products assigned to this campaign.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  brand={p.brand}
                  storeName={p.storeName}
                  verified={p.verified}
                  rating={p.rating || 5}
                  reviews={p.numReviews || 0}
                  price={p.price}
                  originalPrice={p.originalPrice}
                  isDiscounted={p.isDiscounted}
                  discountPercent={p.discountPercent}
                  amountSaved={p.amountSaved}
                  campaignBadge={p.campaignBadge}
                  campaignColor={p.campaignColor}
                  campaignName={p.campaignName}
                  image={p.images}
                  inStock={p.stock > 0}
                  imagesCount={Array.isArray(p.images) ? p.images.length : 1}
                  isBestSeller={p.isBestSeller}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, ArrowRight, Loader2, Tag, Flame } from "lucide-react";
import Link from "next/link";

interface PublicCampaign {
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
  store: { id: string; name: string; logo?: string | null; slug: string };
  productsCount: number;
}

export default function CampaignsDirectoryPage() {
  const [campaigns, setCampaigns] = useState<PublicCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("ALL");

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        setLoading(true);
        const res = await fetch("/api/campaigns");
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data.campaigns || []);
        }
      } catch (err) {
        console.error("Failed to load campaigns directory:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  const types = ["ALL", "FLASH_SALE", "BLACK_FRIDAY", "CLEARANCE", "SEASONAL", "NEW_ARRIVAL"];

  const filteredCampaigns = selectedType === "ALL"
    ? campaigns
    : campaigns.filter((c) => c.type === selectedType);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-emerald-400" /> AfriCart Special Deals &amp; Events
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Active Marketing Campaigns
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto font-medium">
              Discover exclusive flash sales, seasonal discounts, and merchant promotions curated across the marketplace.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-gray-200">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                  selectedType === t
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {t === "ALL" ? "All Events" : t.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mx-auto mb-4" />
              <p className="text-sm font-bold text-gray-600">Loading active campaigns...</p>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3 shadow-sm">
              <Flame className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="text-lg font-extrabold text-gray-900">No Active Campaigns</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Check back soon for new flash sales, seasonal events, and merchant promotions!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCampaigns.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4 p-6">
                    {/* Badge & Store */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider text-white"
                        style={{ backgroundColor: c.color || "#EF4444" }}
                      >
                        {c.badge || c.name}
                      </span>
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        By {c.store.name}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-extrabold text-gray-900 mb-1">{c.name}</h3>
                      {c.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{c.description}</p>
                      )}
                    </div>

                    <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <span className="text-gray-400 font-bold uppercase text-[10px] block">Deal Offer</span>
                        <strong className="text-emerald-700 font-extrabold text-base">
                          {c.discountType === "PERCENTAGE"
                            ? `${c.discountValue}% OFF`
                            : c.discountType === "FIXED"
                            ? `$${c.discountValue} OFF`
                            : "Special Promotion"}
                        </strong>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold uppercase text-[10px] block">Items</span>
                        <strong className="text-gray-900 font-extrabold text-sm">{c.productsCount} Products</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link href={`/campaigns/${c.slug}`}>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-2">
                        Explore Event Deals <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

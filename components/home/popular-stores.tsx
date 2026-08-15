"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Package, CheckCircle, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export function PopularStores() {
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStores() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/stores");
        if (res.ok) {
          const data = await res.json();
          setStores(data.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to load popular stores:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStores();
  }, []);

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Popular Stores
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Shop directly from trusted and verified sellers on AfriCart
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 bg-gray-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : stores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stores.map((store) => {
              const isLogoUrl = Boolean(
                store.logo && (store.logo.startsWith("http") || store.logo.startsWith("/") || store.logo.startsWith("data:image/"))
              );
              const isBannerUrl = Boolean(
                store.banner && (store.banner.startsWith("http") || store.banner.startsWith("/") || store.banner.startsWith("data:image/"))
              );
              const storeHref = `/stores/${store.slug || store.id}`;

              return (
                <Card
                  key={store.id}
                  className="overflow-hidden border border-gray-200 rounded-3xl hover:shadow-xl transition-all group bg-white flex flex-col justify-between"
                >
                  {/* Store Banner */}
                  <div className="h-28 relative bg-gradient-to-r from-emerald-500 via-teal-600 to-green-600 overflow-hidden">
                    {isBannerUrl ? (
                      <img
                        src={store.banner}
                        alt={`${store.name} Banner`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-emerald-600 to-teal-700 opacity-90"></div>
                    )}
                  </div>

                  <div className="p-6 relative">
                    <div className="flex items-start gap-4">
                      {/* Store Logo Avatar */}
                      <div className="w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden -mt-12 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-black text-2xl z-10">
                        {isLogoUrl ? (
                          <img
                            src={store.logo}
                            alt={`${store.name} Logo`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{store.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link href={storeHref}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                              {store.name}
                            </h3>
                            <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                          </div>
                        </Link>

                        <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap">
                          <div className="flex items-center gap-1 font-bold text-gray-900">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>4.9</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Package className="h-3.5 w-3.5 text-gray-400" />
                            <span className="font-semibold text-gray-700">{store.productCount || 0} products</span>
                          </div>
                          {store.category && (
                            <>
                              <span>•</span>
                              <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                                {store.category}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-3 pb-3 sm:px-6 sm:pb-6 flex items-center justify-between border-t pt-3 gap-2">
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 truncate">
                      <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{store.location || "Ghana"}</span>
                    </div>

                    <Link href={storeHref} className="flex-shrink-0">
                      <Button
                        size="sm"
                        className="h-8 sm:h-10 text-xs font-bold gap-1 bg-emerald-600 text-white rounded-xl shadow-xs hover:shadow transition-all px-3"
                      >
                        Visit Store
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No stores found.</div>
        )}
      </div>
    </section>
  );
}

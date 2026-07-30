"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { StoreDirectoryHeader } from "@/components/stores/store-directory-header";
import { StoreGrid } from "@/components/stores/store-grid";

export default function StoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStores() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/stores");
        if (res.ok) {
          const data = await res.json();
          setStores(Array.isArray(data) ? data : []);
        } else {
          setStores([]);
        }
      } catch (err) {
        console.error("Failed to load stores:", err);
        setStores([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadStores();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />
      <div>
        <StoreDirectoryHeader />

        {/* Stores Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                Verified Marketplace Stores
              </h2>
              <p className="text-gray-600">
                Browse top regional sellers on AfriCart
              </p>
              <p className="text-sm text-gray-500 mt-2 font-medium">
                {stores.length} Stores Available
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-3xl p-6 h-64 animate-pulse border border-gray-200"></div>
                ))}
              </div>
            ) : (
              <StoreGrid stores={stores} />
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

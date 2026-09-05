// Server-side catalog data access (frontend app).
//
// Server Components use these adapters to read data over HTTP from the backend
// API instead of importing backend modules directly (non-negotiable boundary
// after the frontend/API split).
//
// The frontend is a separate deployable: it MUST reach the backend over HTTP,
// so there is no in-process fallback here. API_INTERNAL_URL / NEXT_PUBLIC_API_URL
// must be configured to point at the backend origin.

import { serverApiFetchJson } from "@/lib/api/server";

export interface HomepageData {
  categories: any[];
  featuredProducts: any[];
  popularStores: any[];
  bestSellers: any[];
  newArrivals: any[];
}

export async function getHomepageData(): Promise<HomepageData> {
  const [categories, featuredRes, storesRes, bestSellersRes, newArrivalsRes] = await Promise.all([
    serverApiFetchJson("/api/categories", { revalidate: 60 }).catch(() => []),
    serverApiFetchJson("/api/products?limit=8&isFeatured=true", { revalidate: 60 }).catch(() => ({ products: [] })),
    serverApiFetchJson("/api/stores", { revalidate: 60 }).catch(() => []),
    serverApiFetchJson("/api/products?limit=4&sortBy=best_sellers", { revalidate: 60 }).catch(() => ({ products: [] })),
    serverApiFetchJson("/api/products?limit=8&sortBy=newest", { revalidate: 60 }).catch(() => ({ products: [] })),
  ]);
  return {
    categories: Array.isArray(categories) ? categories : [],
    featuredProducts: Array.isArray(featuredRes?.products) ? featuredRes.products : [],
    popularStores: Array.isArray(storesRes) ? (storesRes as any[]).slice(0, 4) : [],
    bestSellers: Array.isArray(bestSellersRes?.products) ? bestSellersRes.products : [],
    newArrivals: Array.isArray(newArrivalsRes?.products) ? newArrivalsRes.products : [],
  };
}

export async function getProductDetails(idOrSlug: string): Promise<any> {
  return serverApiFetchJson(`/api/products/${encodeURIComponent(idOrSlug)}`, { revalidate: 60 }).catch(() => null);
}

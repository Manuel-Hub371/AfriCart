import { catalogService } from "@/modules/catalog/service";
import { Navbar } from "@/components/navigation/navbar";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { PopularStores } from "@/components/home/popular-stores";
import { BestSellers } from "@/components/home/best-sellers";
import { NewArrivals } from "@/components/home/new-arrivals";
import { SpecialDeals } from "@/components/home/special-deals";
import { Newsletter } from "@/components/home/newsletter";
import { Footer } from "@/components/footer/footer";

export const revalidate = 60; // Revalidate homepage data every 60s for speed & DB connection stability

export default async function Home() {
  // Execute all homepage data queries concurrently on the server
  const [
    rawCategories,
    featuredRes,
    rawStores,
    bestSellersRes,
    newArrivalsRes,
  ] = await Promise.all([
    catalogService.getCategories().catch(() => []),
    catalogService.getProducts({ limit: 8, isFeatured: "true" as any }).catch(() => ({ products: [] })),
    catalogService.getStores().catch(() => []),
    catalogService.getProducts({ limit: 4, sortBy: "best_sellers" as any }).catch(() => ({ products: [] })),
    catalogService.getProducts({ limit: 8, sortBy: "newest" as any }).catch(() => ({ products: [] })),
  ]);

  const categories = Array.isArray(rawCategories) ? rawCategories : [];
  const featuredProducts = Array.isArray(featuredRes?.products) ? featuredRes.products : [];
  const popularStores = Array.isArray(rawStores) ? rawStores.slice(0, 4) : [];
  const bestSellers = Array.isArray(bestSellersRes?.products) ? bestSellersRes.products : [];
  const newArrivals = Array.isArray(newArrivalsRes?.products) ? newArrivalsRes.products : [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-green-50/20 to-white">
      <Navbar />
      <HeroSection />
      <FeaturedCategories initialCategories={categories} />
      <FeaturedProducts initialProducts={featuredProducts} />
      <PopularStores initialStores={popularStores} />
      <BestSellers initialProducts={bestSellers} />
      <NewArrivals initialProducts={newArrivals} />
      <SpecialDeals />
      <Newsletter />
      <Footer />
    </main>
  );
}

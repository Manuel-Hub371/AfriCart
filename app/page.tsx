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

export default async function Home() {
  // Execute all homepage data queries concurrently on the server
  const [
    categories,
    featuredRes,
    stores,
    bestSellersRes,
    newArrivalsRes,
  ] = await Promise.all([
    catalogService.getCategories().catch(() => []),
    catalogService.getProducts({ limit: 8, isFeatured: "true" as any }).catch(() => ({ products: [] })),
    catalogService.getStores().catch(() => []),
    catalogService.getProducts({ limit: 4, sortBy: "best_sellers" as any }).catch(() => ({ products: [] })),
    catalogService.getProducts({ limit: 8, sortBy: "newest" as any }).catch(() => ({ products: [] })),
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-green-50/20 to-white">
      <Navbar />
      <HeroSection />
      <FeaturedCategories initialCategories={categories} />
      <FeaturedProducts initialProducts={featuredRes.products} />
      <PopularStores initialStores={stores.slice(0, 4)} />
      <BestSellers initialProducts={bestSellersRes.products} />
      <NewArrivals initialProducts={newArrivalsRes.products} />
      <SpecialDeals />
      <Newsletter />
      <Footer />
    </main>
  );
}

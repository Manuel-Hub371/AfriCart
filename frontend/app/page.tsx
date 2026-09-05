import { getHomepageData } from "@/lib/data/catalog";
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
  const data = await getHomepageData();

  const categories = data.categories;
  const featuredProducts = data.featuredProducts;
  const popularStores = data.popularStores;
  const bestSellers = data.bestSellers;
  const newArrivals = data.newArrivals;

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

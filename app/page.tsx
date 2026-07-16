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

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-green-50/20 to-white">
      <Navbar />
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <PopularStores />
      <BestSellers />
      <NewArrivals />
      <SpecialDeals />
      <Newsletter />
      <Footer />
    </main>
  );
}

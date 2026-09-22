import { getHomepageData } from "@/lib/data/catalog";
import { Navbar } from "@/components/navigation/navbar";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { WhyChooseAfriCart } from "@/components/home/why-choose-africart";
import { PopularStores } from "@/components/home/popular-stores";
import { BestSellers } from "@/components/home/best-sellers";
import { VendorCTA } from "@/components/home/vendor-cta";
import { NewArrivals } from "@/components/home/new-arrivals";
import { SpecialDeals } from "@/components/home/special-deals";
import { HowAfriCartWorks } from "@/components/home/how-africart-works";
import { MarketplaceStats } from "@/components/home/marketplace-stats";
import { CustomerReviews } from "@/components/home/customer-reviews";
import { BusinessCTA } from "@/components/home/business-cta";
import { AppDownloadCTA } from "@/components/home/app-download-cta";
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
  const statistics = data.statistics;
  const recentReviews = data.recentReviews;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-green-50/20 to-white">
      <Navbar />
      <HeroSection initialStats={statistics} />
      <FeaturedCategories initialCategories={categories} />
      <FeaturedProducts initialProducts={featuredProducts} />
      <WhyChooseAfriCart />
      <PopularStores initialStores={popularStores} />
      <BestSellers initialProducts={bestSellers} />
      <VendorCTA />
      <NewArrivals initialProducts={newArrivals} />
      <SpecialDeals />
      <HowAfriCartWorks />
      <MarketplaceStats statistics={statistics} />
      <CustomerReviews initialReviews={recentReviews} />
      <BusinessCTA />
      <AppDownloadCTA />
      <Newsletter />
      <Footer />
    </main>
  );
}
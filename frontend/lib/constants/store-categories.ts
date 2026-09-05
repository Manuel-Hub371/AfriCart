// Official AfriCart Store Categories - Single Source of Truth

export interface OfficialStoreCategory {
  name: string;
  slug: string;
  description: string;
}

export const OFFICIAL_STORE_CATEGORIES: OfficialStoreCategory[] = [
  {
    name: "Electronics & Gadget",
    slug: "electronics-gadget",
    description: "Consumer electronics, smartphones, accessories, computing, and home entertainment.",
  },
  {
    name: "Home & Living",
    slug: "home-living",
    description: "Furniture, home decor, kitchenware, bedding, lighting, and home improvement.",
  },
  {
    name: "Fashion & Appeal",
    slug: "fashion-appeal",
    description: "Clothing, footwear, jewelry, watches, bags, and fashion accessories.",
  },
  {
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    description: "Cosmetics, skincare, haircare, fragrances, and personal grooming products.",
  },
  {
    name: "Food & Gorrices",
    slug: "food-gorrices",
    description: "Fresh produce, packaged foods, beverages, snacks, and daily household essentials.",
  },
  {
    name: "Pharmacy & Health",
    slug: "pharmacy-health",
    description: "Over-the-counter health products, vitamins, supplements, and medical wellness supplies.",
  },
  {
    name: "Automotive & Automobile",
    slug: "automotive-automobile",
    description: "Vehicle parts, auto accessories, car care, tools, and automotive electronics.",
  },
  {
    name: "Sorts & Fitness",
    slug: "sorts-fitness",
    description: "Sports gear, outdoor equipment, athletic wear, fitness instruments, and activewear.",
  },
  {
    name: "Books & Stationery",
    slug: "books-stationery",
    description: "Educational books, literature, office supplies, art materials, and stationery items.",
  },
];

export const OFFICIAL_STORE_CATEGORY_SLUGS = OFFICIAL_STORE_CATEGORIES.map((c) => c.slug);

export function isValidStoreCategorySlug(slug: string): boolean {
  if (!slug || typeof slug !== "string") return false;
  const clean = slug.trim().toLowerCase();
  return OFFICIAL_STORE_CATEGORY_SLUGS.includes(clean);
}

export function getStoreCategoryBySlug(slug: string): OfficialStoreCategory | undefined {
  if (!slug) return undefined;
  const clean = slug.trim().toLowerCase();
  return OFFICIAL_STORE_CATEGORIES.find((c) => c.slug === clean);
}

export function mapLegacyCategoryToOfficialSlug(legacyCategory?: string | null): string {
  if (!legacyCategory) return "electronics-gadget";
  const lower = legacyCategory.toLowerCase();
  if (lower.includes("electr") || lower.includes("gadget") || lower.includes("phone")) return "electronics-gadget";
  if (lower.includes("home") || lower.includes("furnit") || lower.includes("living")) return "home-living";
  if (lower.includes("fashion") || lower.includes("clot") || lower.includes("appeal") || lower.includes("apparel")) return "fashion-appeal";
  if (lower.includes("beaut") || lower.includes("care") || lower.includes("cosmetic")) return "beauty-personal-care";
  if (lower.includes("food") || lower.includes("groc") || lower.includes("gorric")) return "food-gorrices";
  if (lower.includes("pharm") || lower.includes("health") || lower.includes("medic")) return "pharmacy-health";
  if (lower.includes("auto") || lower.includes("car") || lower.includes("motor")) return "automotive-automobile";
  if (lower.includes("sport") || lower.includes("sort") || lower.includes("fit")) return "sorts-fitness";
  if (lower.includes("book") || lower.includes("stat") || lower.includes("paper")) return "books-stationery";
  return "electronics-gadget";
}

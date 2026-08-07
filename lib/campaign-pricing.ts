/**
 * Enterprise Campaign Pricing Engine
 *
 * Single source of truth for all campaign discount calculations.
 * Used by catalog service, order repository, and API routes.
 *
 * Deterministic Resolution Rules:
 * 1. Scope Eligibility: PRODUCT, CATEGORY, BRAND, STORE, MARKETPLACE.
 * 2. Priority Sorting: Highest `priority` first → Greatest discount amount second → Newest (`createdAt`) third.
 * 3. Discount Caps: Enforces `maximumDiscount` cap and `minimumOrderValue`.
 * 4. Automatic Reversion: If a campaign expires, is paused, or is cancelled, product immediately reverts to base pricing.
 */

export interface CampaignPricingResult {
  /** Base stored product price */
  originalPrice: number;
  /** Final selling price after active campaign discount */
  effectivePrice: number;
  /** Alias for effectivePrice for API compliance */
  campaignPrice: number | null;
  /** GH₵ saved */
  amountSaved: number;
  /** Percentage saved (0–100) */
  discountPercent: number;
  /** True when a price reduction campaign is active */
  isDiscounted: boolean;

  // Metadata for display & order historical records
  campaignId: string | null;
  campaignName: string | null;
  campaignType: string | null;
  campaignStatus: string; // "ACTIVE" | "SCHEDULED" | "EXPIRED" | "DRAFT" | "PAUSED" | "CANCELLED" | "NONE"
  discountType: string | null;
  discountValue: number | null;
  campaignBadge: string | null;
  campaignColor: string | null;
  campaignEndDate: string | null;

  /** Full active campaign object or null */
  campaign: any | null;
}

/** In-memory pricing resolution cache with TTL & invalidation */
const pricingCache = new Map<string, { result: CampaignPricingResult; expiresAt: number }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute default cache TTL

export function invalidateCampaignCache(): void {
  pricingCache.clear();
}

/** Null result (no active campaign) */
function noPricing(basePrice: number): CampaignPricingResult {
  return {
    originalPrice: basePrice,
    effectivePrice: basePrice,
    campaignPrice: null,
    amountSaved: 0,
    discountPercent: 0,
    isDiscounted: false,
    campaignId: null,
    campaignName: null,
    campaignType: null,
    campaignStatus: "NONE",
    discountType: null,
    discountValue: null,
    campaignBadge: null,
    campaignColor: null,
    campaignEndDate: null,
    campaign: null,
  };
}

/**
 * Validates whether a campaign is live and active.
 */
export function isCampaignLive(c: any): boolean {
  if (!c || c.deletedAt) return false;
  
  // Status check: must not be DRAFT, PAUSED, CANCELLED, or EXPIRED
  if (c.status && ["DRAFT", "PAUSED", "CANCELLED", "EXPIRED"].includes(c.status)) {
    return false;
  }

  if (c.isActive === false) return false;

  const now = Date.now();
  const start = new Date(c.startDate).getTime();
  const end = new Date(c.endDate).getTime();

  return start <= now && now <= end;
}

/**
 * Computes discount amount in GH₵ considering `discountType`, `discountValue`, and `maximumDiscount` cap.
 */
export function computeDiscountAmount(basePrice: number, c: any): number {
  if (!c.discountValue || c.discountValue <= 0) return 0;
  if (c.minimumOrderValue && basePrice < c.minimumOrderValue) return 0;

  let rawDiscount = 0;
  if (c.discountType === "PERCENTAGE") {
    const pct = Math.min(100, Math.max(0, c.discountValue));
    rawDiscount = basePrice * (pct / 100);
  } else if (c.discountType === "FIXED" || c.discountType === "FIXED_AMOUNT") {
    rawDiscount = Math.min(basePrice, Math.max(0, c.discountValue));
  }

  // Apply maximum discount cap if specified
  if (c.maximumDiscount && c.maximumDiscount > 0) {
    rawDiscount = Math.min(rawDiscount, c.maximumDiscount);
  }

  return Math.max(0, rawDiscount);
}

/**
 * Check whether a campaign applies to a target product by scope.
 */
export function isCampaignEligibleForProduct(c: any, product: {
  id?: string;
  categoryName?: string | null;
  brand?: string | null;
  storeId?: string | null;
}): boolean {
  if (!c || !isCampaignLive(c)) return false;

  const scope = c.targetScope || "PRODUCT";

  if (scope === "MARKETPLACE") return true;

  if (scope === "STORE") {
    return Boolean(c.storeId && product.storeId && c.storeId === product.storeId);
  }

  if (scope === "BRAND") {
    if (!product.brand) return false;
    const brands: string[] = Array.isArray(c.targetBrands) ? c.targetBrands : [];
    return brands.some((b) => b.toLowerCase() === product.brand?.toLowerCase());
  }

  if (scope === "CATEGORY") {
    if (!product.categoryName) return false;
    const categories: string[] = Array.isArray(c.targetCategories) ? c.targetCategories : [];
    return categories.some((cat) => cat.toLowerCase() === product.categoryName?.toLowerCase());
  }

  // Scope === "PRODUCT" (default: checked via CampaignProduct relationship or product ID list)
  return true;
}

/**
 * Format discount badge label.
 */
export function formatDiscountBadge(c: any): string {
  if (c.badge && c.badge.trim()) return c.badge;
  if (c.discountType === "PERCENTAGE" && c.discountValue) {
    return `${Math.round(c.discountValue)}% OFF`;
  }
  if ((c.discountType === "FIXED" || c.discountType === "FIXED_AMOUNT") && c.discountValue) {
    return `GH₵${c.discountValue} OFF`;
  }
  return c.name || "PROMO";
}

/**
 * Single source of truth campaign pricing resolution.
 * Deterministic selection: Highest `priority` → Greatest discount amount → Newest `createdAt`.
 */
export function resolveCampaignPricing(
  basePrice: number,
  campaigns: any[],
  productMeta?: { id?: string; categoryName?: string | null; brand?: string | null; storeId?: string | null }
): CampaignPricingResult {
  if (!campaigns || campaigns.length === 0) return noPricing(basePrice);

  // 1. Filter live campaigns
  let live = campaigns.filter(isCampaignLive);
  if (live.length === 0) return noPricing(basePrice);

  // 2. Filter by scope eligibility if metadata provided
  if (productMeta) {
    live = live.filter((c) => isCampaignEligibleForProduct(c, productMeta));
    if (live.length === 0) return noPricing(basePrice);
  }

  // 3. Sort deterministically: priority DESC → discount DESC → createdAt DESC
  const sorted = [...live].sort((a, b) => {
    const prioA = Number(a.priority ?? 0);
    const prioB = Number(b.priority ?? 0);
    if (prioB !== prioA) return prioB - prioA;

    const discA = computeDiscountAmount(basePrice, a);
    const discB = computeDiscountAmount(basePrice, b);
    if (discB !== discA) return discB - discA;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const best = sorted[0];
  const discountAmount = computeDiscountAmount(basePrice, best);
  const effectivePrice = Math.max(0, basePrice - discountAmount);
  const discountPercent =
    basePrice > 0 ? parseFloat(((discountAmount / basePrice) * 100).toFixed(1)) : 0;

  const campaignBadge = formatDiscountBadge(best);

  return {
    originalPrice: basePrice,
    effectivePrice,
    campaignPrice: discountAmount > 0 ? effectivePrice : null,
    amountSaved: parseFloat(discountAmount.toFixed(2)),
    discountPercent,
    isDiscounted: discountAmount > 0,

    campaignId: best.id,
    campaignName: best.name,
    campaignType: best.type ?? null,
    campaignStatus: best.status || "ACTIVE",
    discountType: best.discountType ?? null,
    discountValue: best.discountValue ?? null,
    campaignBadge,
    campaignColor: best.color ?? "#EF4444",
    campaignEndDate: best.endDate ? new Date(best.endDate).toISOString() : null,
    campaign: best,
  };
}

/**
 * Extract raw campaign objects from Prisma `campaignProducts` include.
 */
export function extractCampaigns(campaignProducts: any[]): any[] {
  if (!Array.isArray(campaignProducts)) return [];
  return campaignProducts
    .map((cp: any) => cp?.campaign ?? cp)
    .filter(Boolean);
}

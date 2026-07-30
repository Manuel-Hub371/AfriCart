/**
 * Campaign Pricing Engine
 *
 * Single source of truth for all campaign discount calculations.
 * Used by: catalog service, order repository, and any API route that
 * needs to compute effective pricing from assigned campaigns.
 *
 * Multi-campaign resolution rule:
 *   Among all currently active campaigns, select the one that produces
 *   the GREATEST discount amount. Tie-break by highest priority, then
 *   newest (latest createdAt). This is deterministic and vendor-friendly.
 */

export interface CampaignPricingResult {
  /** The original base price (never modified) */
  originalPrice: number;
  /** The price after the best active campaign is applied */
  effectivePrice: number;
  /** GH₵ saved: originalPrice − effectivePrice */
  amountSaved: number;
  /** Percentage saved (0–100), rounded to 1 decimal */
  discountPercent: number;
  /** True when a discount-bearing campaign is active */
  isDiscounted: boolean;

  // Campaign metadata for display & historical recording
  campaignId: string | null;
  campaignName: string | null;
  campaignType: string | null;
  discountType: string | null;
  discountValue: number | null;
  campaignBadge: string | null;
  campaignColor: string | null;
  /** ISO string of campaign end date for countdown timers */
  campaignEndDate: string | null;
}

/** Null result (no campaign active) */
function noPricing(basePrice: number): CampaignPricingResult {
  return {
    originalPrice: basePrice,
    effectivePrice: basePrice,
    amountSaved: 0,
    discountPercent: 0,
    isDiscounted: false,
    campaignId: null,
    campaignName: null,
    campaignType: null,
    discountType: null,
    discountValue: null,
    campaignBadge: null,
    campaignColor: null,
    campaignEndDate: null,
  };
}

/**
 * Returns true if a campaign is currently live.
 */
function isCampaignLive(c: any): boolean {
  if (!c || !c.isActive || c.deletedAt) return false;
  const now = Date.now();
  const start = new Date(c.startDate).getTime();
  const end = new Date(c.endDate).getTime();
  return start <= now && now <= end;
}

/**
 * Compute how much GH₵ a campaign saves on a given base price.
 * Returns 0 for non-monetary discount types (FREE_SHIPPING, BUY_X_GET_Y, etc.).
 */
function computeDiscountAmount(basePrice: number, c: any): number {
  if (!c.discountValue || c.discountValue <= 0) return 0;

  if (c.discountType === "PERCENTAGE") {
    const pct = Math.min(100, Math.max(0, c.discountValue));
    return basePrice * (pct / 100);
  }

  if (c.discountType === "FIXED") {
    return Math.min(basePrice, Math.max(0, c.discountValue));
  }

  // BUY_X_GET_Y, FREE_SHIPPING, BUNDLE, NONE — no direct price reduction
  return 0;
}

/**
 * Core pricing resolution function.
 *
 * @param basePrice  The product's stored base price from the database.
 * @param campaigns  Array of campaign objects fetched via `campaignProducts.campaign`.
 *                   Each campaign must have: id, name, type, isActive, deletedAt,
 *                   startDate, endDate, discountType, discountValue, priority,
 *                   createdAt, badge, color.
 * @returns          CampaignPricingResult with effective price and full metadata.
 */
export function resolveCampaignPricing(
  basePrice: number,
  campaigns: any[]
): CampaignPricingResult {
  if (!campaigns || campaigns.length === 0) return noPricing(basePrice);

  // Filter to currently live campaigns
  const live = campaigns.filter(isCampaignLive);
  if (live.length === 0) return noPricing(basePrice);

  // Sort by: greatest discount → highest priority → newest createdAt
  const sorted = [...live].sort((a, b) => {
    const discA = computeDiscountAmount(basePrice, a);
    const discB = computeDiscountAmount(basePrice, b);
    if (discB !== discA) return discB - discA;
    if ((b.priority ?? 0) !== (a.priority ?? 0)) return (b.priority ?? 0) - (a.priority ?? 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const best = sorted[0];
  const discountAmount = computeDiscountAmount(basePrice, best);
  const effectivePrice = Math.max(0, basePrice - discountAmount);
  const discountPercent =
    basePrice > 0 ? parseFloat(((discountAmount / basePrice) * 100).toFixed(1)) : 0;

  return {
    originalPrice: basePrice,
    effectivePrice,
    amountSaved: parseFloat(discountAmount.toFixed(2)),
    discountPercent,
    isDiscounted: discountAmount > 0,

    campaignId: best.id,
    campaignName: best.name,
    campaignType: best.type ?? null,
    discountType: best.discountType ?? null,
    discountValue: best.discountValue ?? null,
    campaignBadge: best.badge ?? best.name,
    campaignColor: best.color ?? "#EF4444",
    campaignEndDate: best.endDate
      ? new Date(best.endDate).toISOString()
      : null,
  };
}

/**
 * Extract raw campaign objects from Prisma `campaignProducts` include.
 * Handles both the nested and flat forms returned by different queries.
 */
export function extractCampaigns(campaignProducts: any[]): any[] {
  if (!Array.isArray(campaignProducts)) return [];
  return campaignProducts
    .map((cp: any) => cp?.campaign ?? cp)
    .filter(Boolean);
}

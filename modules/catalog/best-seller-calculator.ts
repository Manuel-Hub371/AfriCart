import { db } from "@/lib/db";

/**
 * Best Seller Ranking Algorithm
 * Calculates score based on:
 * 1. Total Units Sold (highest priority: 10 pts per unit)
 * 2. Average Product Rating (rating * 5)
 * 3. Customer Reviews (2 pts per review)
 * 4. Product Views (0.1 pt per view, max 50 pts)
 */
export function calculateBestSellerScore(params: {
  soldCount: number;
  rating: number;
  numReviews: number;
  views?: number;
}): number {
  const sold = Math.max(0, params.soldCount || 0);
  const rating = Math.max(0, params.rating || 0);
  const reviews = Math.max(0, params.numReviews || 0);
  const views = Math.max(0, params.views || 0);

  const salesScore = sold * 10;
  const ratingScore = (rating * 5) + (reviews * 2);
  const viewsBonus = Math.min(views * 0.1, 50);

  const totalScore = salesScore + ratingScore + viewsBonus;
  return Math.max(0, Math.round(totalScore * 100) / 100);
}

/**
 * Determines whether a product qualifies for the Best Seller badge.
 * Criteria:
 * - Active product status
 * - Stock > 0
 * - bestSellerScore >= 15 or soldCount > 0
 */
export function isBestSellerProduct(product: {
  status?: string;
  stock?: number;
  bestSellerScore?: number;
  soldCount?: number;
}): boolean {
  if (product.status !== "ACTIVE" && product.status !== "published") return false;
  if ((product.stock ?? 0) <= 0) return false;
  
  const score = product.bestSellerScore ?? 0;
  const sold = product.soldCount ?? 0;
  
  return score >= 15 || sold > 0;
}

/**
 * Automatically recalculate and save Best Seller score for a specific product in PostgreSQL
 */
export async function recalculateProductBestSellerScore(productId: string): Promise<number> {
  try {
    const product = await db.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        soldCount: true,
        rating: true,
        numReviews: true,
        views: true,
      },
    });

    if (!product) return 0;

    const score = calculateBestSellerScore({
      soldCount: product.soldCount || 0,
      rating: product.rating || 0,
      numReviews: product.numReviews || 0,
      views: product.views || 0,
    });

    await db.product.update({
      where: { id: productId },
      data: { bestSellerScore: score },
    });

    return score;
  } catch (error) {
    console.error(`Failed to recalculate best seller score for product ${productId}:`, error);
    return 0;
  }
}

/**
 * Automatically recalculate Best Seller scores across all products in store/marketplace
 */
export async function updateAllBestSellerScores(): Promise<void> {
  try {
    const products = await db.product.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        soldCount: true,
        rating: true,
        numReviews: true,
        views: true,
      },
    });

    for (const p of products) {
      const score = calculateBestSellerScore({
        soldCount: p.soldCount || 0,
        rating: p.rating || 0,
        numReviews: p.numReviews || 0,
        views: p.views || 0,
      });

      await db.product.update({
        where: { id: p.id },
        data: { bestSellerScore: score },
      });
    }
  } catch (error) {
    console.error("Failed to update best seller scores across marketplace:", error);
  }
}

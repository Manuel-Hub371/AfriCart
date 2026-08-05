import { db } from "@/lib/db";

/**
 * Enterprise Best Seller Ranking Engine
 *
 * System-controlled automated ranking engine.
 * Decoupled from checkout transactions; statistics are updated in real-time on `Product`,
 * while composite rankings & scores are calculated by an asynchronous background worker.
 *
 * Ranking Factors:
 * 1. Total Units Sold (soldCount × 10)
 * 2. Completed Orders (delivered order items × 5)
 * 3. Sales Velocity (recent 30-day units sold × 8)
 * 4. Average Rating (rating × 6)
 * 5. Number of Customer Reviews (numReviews × 3)
 * 6. Refund/Cancellation Penalty (refunded/cancelled items × -15)
 * 7. Product Availability (stock > 0 and status === 'ACTIVE')
 */

export interface BestSellerScoreParams {
  soldCount: number;
  completedOrders?: number;
  recent30DaysUnits?: number;
  rating: number;
  numReviews: number;
  refundCount?: number;
  stock?: number;
  status?: string;
}

export function calculateBestSellerScore(params: BestSellerScoreParams): number {
  if (params.status !== "ACTIVE" && params.status !== "published") return 0;
  if ((params.stock ?? 1) <= 0) return 0;

  const sold = Math.max(0, params.soldCount || 0);
  const completed = Math.max(0, params.completedOrders || 0);
  const velocity = Math.max(0, params.recent30DaysUnits || 0);
  const rating = Math.max(0, params.rating || 0);
  const reviews = Math.max(0, params.numReviews || 0);
  const refunds = Math.max(0, params.refundCount || 0);

  const unitsScore = sold * 10;
  const ordersScore = completed * 5;
  const velocityScore = velocity * 8;
  const ratingScore = rating * 6;
  const reviewScore = reviews * 3;
  const refundPenalty = refunds * 15;

  const rawScore = unitsScore + ordersScore + velocityScore + ratingScore + reviewScore - refundPenalty;
  return Math.max(0, Math.round(rawScore * 100) / 100);
}

/**
 * Evaluates whether a product qualifies for the Best Seller badge.
 * Fully system-controlled based on calculated bestSellerScore and active availability.
 */
export function isBestSellerProduct(product: {
  status?: string;
  stock?: number;
  bestSellerScore?: number;
  soldCount?: number;
  bestSellerRank?: number | null;
}): boolean {
  if (product.status !== "ACTIVE" && product.status !== "published") return false;
  if ((product.stock ?? 0) <= 0) return false;

  const score = product.bestSellerScore ?? 0;
  const sold = product.soldCount ?? 0;
  const rank = product.bestSellerRank;

  if (rank && rank <= 10) return true;
  return score >= 15 || sold > 0;
}

/**
 * Background worker task: Recalculates Best Seller scores and ranks for all products in PostgreSQL.
 * Designed for asynchronous cron / worker execution.
 */
export async function updateAllBestSellerScores(): Promise<void> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Batch query active products with order item metrics
    const products = await db.product.findMany({
      where: { deletedAt: null, status: "ACTIVE" },
      select: {
        id: true,
        soldCount: true,
        rating: true,
        numReviews: true,
        stock: true,
        status: true,
        orderItems: {
          select: {
            quantity: true,
            order: { select: { status: true, createdAt: true } },
          },
        },
      },
    });

    const scoredProducts = products.map((p) => {
      let completedOrders = 0;
      let recent30DaysUnits = 0;
      let refundCount = 0;

      for (const item of p.orderItems) {
        const orderStatus = item.order?.status;
        if (orderStatus === "DELIVERED" || orderStatus === "COMPLETED") {
          completedOrders += 1;
        } else if (orderStatus === "CANCELLED" || orderStatus === "REFUNDED") {
          refundCount += 1;
        }

        if (item.order?.createdAt && new Date(item.order.createdAt) >= thirtyDaysAgo) {
          recent30DaysUnits += item.quantity;
        }
      }

      const score = calculateBestSellerScore({
        soldCount: p.soldCount || 0,
        completedOrders,
        recent30DaysUnits,
        rating: p.rating || 0,
        numReviews: p.numReviews || 0,
        refundCount,
        stock: p.stock,
        status: p.status,
      });

      return { id: p.id, score };
    });

    // Sort products by score descending
    scoredProducts.sort((a, b) => b.score - a.score);

    // Batch update scores in PostgreSQL
    for (let index = 0; index < scoredProducts.length; index++) {
      const p = scoredProducts[index];
      await db.product.update({
        where: { id: p.id },
        data: { bestSellerScore: p.score },
      });
    }
  } catch (error) {
    console.error("Failed to run background Best Seller score worker:", error);
  }
}

/**
 * Helper to trigger score update for a single product without blocking transactions.
 */
export function queueProductBestSellerRecalculation(productId: string): void {
  setTimeout(async () => {
    try {
      const product = await db.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          soldCount: true,
          rating: true,
          numReviews: true,
          stock: true,
          status: true,
        },
      });
      if (!product) return;

      const score = calculateBestSellerScore({
        soldCount: product.soldCount || 0,
        rating: product.rating || 0,
        numReviews: product.numReviews || 0,
        stock: product.stock,
        status: product.status,
      });

      await db.product.update({
        where: { id: productId },
        data: { bestSellerScore: score },
      });
    } catch {
      // Non-fatal background calculation error
    }
  }, 0);
}

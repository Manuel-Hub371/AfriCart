import { db } from "@/lib/db";

/**
 * Enterprise Best Seller Ranking Engine
 *
 * System-controlled automated ranking engine.
 * Decoupled from checkout transactions; statistics are updated on `Product`,
 * while composite rankings & scores are calculated automatically.
 *
 * Ranking Rules:
 * 1. ZERO SALES MANDATORY RULE: If soldCount <= 0, product can NEVER be a Best Seller.
 * 2. Units Sold (soldCount × 100) — Primary signal
 * 3. Sales Velocity (30-day units sold × 50) — Recency signal
 * 4. Completed Orders (order count × 20) — Order frequency
 * 5. Average Rating (rating × 5) — Quality supporting signal
 * 6. Customer Reviews (numReviews × 2) — Review volume supporting signal
 * 7. Refund/Cancellation Penalty (refunds/cancellations × -30) — Negative signal
 * 8. Product Availability (stock > 0 and status === 'ACTIVE') — Mandatory eligibility
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
  // Eligibility: Must be ACTIVE and in stock
  if (params.status !== "ACTIVE" && params.status !== "published") return 0;
  if ((params.stock ?? 0) <= 0) return 0;

  // ZERO SALES MANDATORY RULE: A product with zero completed sales must NEVER be classified as a Best Seller
  const sold = Math.max(0, params.soldCount || 0);
  if (sold <= 0) return 0;

  const completed = Math.max(0, params.completedOrders || 0);
  const velocity = Math.max(0, params.recent30DaysUnits || 0);
  const rating = Math.max(0, params.rating || 0);
  const reviews = Math.max(0, params.numReviews || 0);
  const refunds = Math.max(0, params.refundCount || 0);

  // Primary: Units Sold + Sales Velocity + Completed Orders
  const salesScore = (sold * 100) + (velocity * 50) + (completed * 20);

  // Secondary supporting signals: Quality rating & review volume
  const qualityScore = (rating * 5) + (reviews * 2);

  // Negative signal: Refund / cancellation penalty
  const refundPenalty = refunds * 30;

  const rawScore = salesScore + qualityScore - refundPenalty;
  return Math.max(0, Math.round(rawScore * 100) / 100);
}

/**
 * Evaluates whether a product qualifies for the Best Seller badge.
 * Fully system-controlled based on calculated bestSellerScore, sales, and active availability.
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

  // ZERO SALES RULE
  const sold = product.soldCount ?? 0;
  if (sold <= 0) return false;

  const score = product.bestSellerScore ?? 0;
  const rank = product.bestSellerRank;

  if (rank && rank <= 20) return true;
  return score >= 100;
}

/**
 * Background worker task: Recalculates Best Seller scores for all active products in PostgreSQL.
 */
export async function updateAllBestSellerScores(): Promise<void> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

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
            order: { select: { status: true, paymentStatus: true, createdAt: true } },
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
        const paymentStatus = item.order?.paymentStatus;

        if ((orderStatus === "DELIVERED" || orderStatus === "SHIPPED" || orderStatus === "PROCESSING" || orderStatus === "COMPLETED") && paymentStatus === "PAID") {
          completedOrders += 1;
          if (item.order?.createdAt && new Date(item.order.createdAt) >= thirtyDaysAgo) {
            recent30DaysUnits += item.quantity;
          }
        } else if (orderStatus === "CANCELLED" || orderStatus === "REFUNDED") {
          refundCount += 1;
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

    for (const p of scoredProducts) {
      await db.product.update({
        where: { id: p.id },
        data: { bestSellerScore: p.score },
      });
    }
  } catch (error) {
    console.error("Failed to update Best Seller scores:", error);
  }
}

/**
 * Helper to trigger score update for a single product without blocking transactions.
 */
export function queueProductBestSellerRecalculation(productId: string): void {
  setTimeout(async () => {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const product = await db.product.findUnique({
        where: { id: productId },
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
              order: { select: { status: true, paymentStatus: true, createdAt: true } },
            },
          },
        },
      });
      if (!product) return;

      let completedOrders = 0;
      let recent30DaysUnits = 0;
      let refundCount = 0;

      for (const item of product.orderItems) {
        const orderStatus = item.order?.status;
        const paymentStatus = item.order?.paymentStatus;

        if ((orderStatus === "DELIVERED" || orderStatus === "SHIPPED" || orderStatus === "PROCESSING" || orderStatus === "COMPLETED") && paymentStatus === "PAID") {
          completedOrders += 1;
          if (item.order?.createdAt && new Date(item.order.createdAt) >= thirtyDaysAgo) {
            recent30DaysUnits += item.quantity;
          }
        } else if (orderStatus === "CANCELLED" || orderStatus === "REFUNDED") {
          refundCount += 1;
        }
      }

      const score = calculateBestSellerScore({
        soldCount: product.soldCount || 0,
        completedOrders,
        recent30DaysUnits,
        rating: product.rating || 0,
        numReviews: product.numReviews || 0,
        refundCount,
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

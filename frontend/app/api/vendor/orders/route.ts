import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { orderService } from "@/modules/orders/service";

// GET /api/vendor/orders
export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await orderService.getVendorOrders(userId);
    return NextResponse.json({ orders, total: orders.length });
  } catch (err: any) {
    const status = err?.status ?? 500;
    const message = err?.message ?? "Failed to fetch vendor orders";
    return NextResponse.json({ error: message }, { status });
  }
}

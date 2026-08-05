import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { orderService } from "@/modules/orders/service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/orders/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const order = await orderService.getCustomerOrderDetails(userId, id);
    return NextResponse.json({ order });
  } catch (err: any) {
    const status = err?.status ?? 500;
    const message = err?.message ?? "Order not found";
    return NextResponse.json({ error: message }, { status });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { orderService } from "@/modules/orders/service";
import { UpdateOrderStatusSchema } from "@/modules/orders/dto";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/vendor/orders/[id]
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = UpdateOrderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const order = await orderService.updateVendorOrderStatus(userId, id, parsed.data);
    return NextResponse.json({ order });
  } catch (err: any) {
    const status = err?.status ?? 500;
    const message = err?.message ?? "Failed to update order status";
    return NextResponse.json({ error: message }, { status });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { orderService } from "@/modules/orders/service";
import { CreateOrderSchema } from "@/modules/orders/dto";

// POST /api/checkout
export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = CreateOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const order = await orderService.processCheckout(userId, parsed.data);
    return NextResponse.json({ order }, { status: 201 });
  } catch (err: any) {
    const status = err?.status ?? 500;
    const message = err?.message ?? "Failed to process checkout";
    return NextResponse.json({ error: message }, { status });
  }
}

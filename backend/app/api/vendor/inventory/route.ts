import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { vendorService } from "@/modules/vendor/service";
import { UpdateStockSchema } from "@/modules/vendor/dto";

// GET /api/vendor/inventory
export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const inventory = await vendorService.getVendorInventory(userId);
    return NextResponse.json({ inventory, total: inventory.length });
  } catch (err: any) {
    const status = err?.status ?? 500;
    const message = err?.message ?? "Internal server error";
    return NextResponse.json({ error: message }, { status });
  }
}

// PATCH /api/vendor/inventory
export async function PATCH(req: NextRequest) {
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

  const parsed = UpdateStockSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const product = await vendorService.updateStock(userId, parsed.data);
    return NextResponse.json({ product });
  } catch (err: any) {
    const status = err?.status ?? 500;
    const message = err?.message ?? "Internal server error";
    return NextResponse.json({ error: message }, { status });
  }
}

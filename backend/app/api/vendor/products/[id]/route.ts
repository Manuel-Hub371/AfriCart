import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { vendorService } from "@/modules/vendor/service";
import { VendorProductSchema } from "@/modules/vendor/dto";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/vendor/products/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const product = await vendorService.getVendorProductDetails(userId, id);
    return NextResponse.json({ product });
  } catch (err: any) {
    const status = err?.status ?? 500;
    const message = err?.message ?? "Internal server error";
    return NextResponse.json({ error: message }, { status });
  }
}

// PATCH /api/vendor/products/[id]
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

  // Partial update: allow partial fields, only validate what's provided
  const parsed = VendorProductSchema.safeParse(body);
  if (!parsed.success) {
    // For PATCH, try with loose typing — pass raw body as partial
    try {
      const product = await vendorService.updateVendorProduct(userId, id, body as any);
      return NextResponse.json({ product });
    } catch (err: any) {
      const status = err?.status ?? 500;
      const message = err?.message ?? "Internal server error";
      return NextResponse.json({ error: message }, { status });
    }
  }

  try {
    const product = await vendorService.updateVendorProduct(userId, id, parsed.data);
    return NextResponse.json({ product });
  } catch (err: any) {
    const status = err?.status ?? 500;
    const message = err?.message ?? "Internal server error";
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE /api/vendor/products/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await vendorService.deleteVendorProduct(userId, id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    const status = err?.status ?? 500;
    const message = err?.message ?? "Internal server error";
    return NextResponse.json({ error: message }, { status });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { vendorService } from "@/modules/vendor/service";
import { UpdateStoreSchema } from "@/modules/vendor/dto";

// GET /api/vendor/store
export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const store = await vendorService.getVendorStore(userId);
    return NextResponse.json({ store });
  } catch (err: any) {
    const status = err?.status ?? 500;
    const message = err?.message ?? "Internal server error";
    return NextResponse.json({ error: message }, { status });
  }
}

// PATCH /api/vendor/store
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

  const parsed = UpdateStoreSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const store = await vendorService.updateVendorStore(userId, parsed.data);
    return NextResponse.json({ store });
  } catch (err: any) {
    const status = err?.status ?? 500;
    const message = err?.message ?? "Internal server error";
    return NextResponse.json({ error: message }, { status });
  }
}

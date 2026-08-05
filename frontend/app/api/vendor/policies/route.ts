import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { vendorService } from "@/modules/vendor/service";
import { vendorRepository } from "@/modules/vendor/repository";

// GET /api/vendor/policies
export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const store = await vendorService.getVendorStore(userId);
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const policies = await vendorRepository.getStorePolicies(store.id);
    return NextResponse.json({ policies });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to fetch store policies" }, { status: 500 });
  }
}

// POST /api/vendor/policies - assign current store policy and/or privacy policy
export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const store = await vendorService.getVendorStore(userId);
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const body = await req.json();
    const updated = await vendorRepository.assignCurrentPolicies(
      store.id,
      body.currentStorePolicyId !== undefined ? body.currentStorePolicyId : undefined,
      body.currentPrivacyPolicyId !== undefined ? body.currentPrivacyPolicyId : undefined
    );

    return NextResponse.json({ success: true, store: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

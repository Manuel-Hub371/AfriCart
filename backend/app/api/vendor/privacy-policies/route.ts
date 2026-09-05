import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { vendorService } from "@/modules/vendor/service";
import { vendorRepository } from "@/modules/vendor/repository";

// GET /api/vendor/privacy-policies
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
    return NextResponse.json({ privacyPolicies: policies.privacy });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

// POST /api/vendor/privacy-policies
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
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: "Policy name is required" }, { status: 400 });
    }

    const policy = await vendorRepository.createPrivacyPolicy(store.id, body);
    return NextResponse.json({ policy }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

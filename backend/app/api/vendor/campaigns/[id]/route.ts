import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { vendorService } from "@/modules/vendor/service";
import { vendorRepository } from "@/modules/vendor/repository";

// GET /api/vendor/campaigns/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resolvedParams = await params;
  const campaignId = resolvedParams.id;

  try {
    const store = await vendorService.getVendorStore(userId);
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const campaign = await vendorRepository.getCampaignById(campaignId);
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Security Ownership Check
    if (campaign.storeId !== store.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this campaign" }, { status: 403 });
    }

    return NextResponse.json({ campaign });
  } catch (err: any) {
    const status = err?.status ?? 500;
    return NextResponse.json({ error: err?.message || "Failed to fetch campaign" }, { status });
  }
}

// PATCH /api/vendor/campaigns/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resolvedParams = await params;
  const campaignId = resolvedParams.id;

  try {
    const store = await vendorService.getVendorStore(userId);
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const existing = await vendorRepository.getCampaignById(campaignId);
    if (!existing) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Security Ownership Check
    if (existing.storeId !== store.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this campaign" }, { status: 403 });
    }

    const body = await req.json();
    const updated = await vendorRepository.updateCampaign(campaignId, store.id, body, userId);

    return NextResponse.json({ campaign: updated });
  } catch (err: any) {
    const status = err?.status ?? 500;
    return NextResponse.json({ error: err?.message || "Failed to update campaign" }, { status });
  }
}

// DELETE /api/vendor/campaigns/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resolvedParams = await params;
  const campaignId = resolvedParams.id;

  try {
    const store = await vendorService.getVendorStore(userId);
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const existing = await vendorRepository.getCampaignById(campaignId);
    if (!existing) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Security Ownership Check
    if (existing.storeId !== store.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this campaign" }, { status: 403 });
    }

    await vendorRepository.deleteCampaign(campaignId, store.id, userId);

    return NextResponse.json({ success: true, message: "Campaign deleted successfully" });
  } catch (err: any) {
    const status = err?.status ?? 500;
    return NextResponse.json({ error: err?.message || "Failed to delete campaign" }, { status });
  }
}

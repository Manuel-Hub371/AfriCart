import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { vendorService } from "@/modules/vendor/service";
import { vendorRepository } from "@/modules/vendor/repository";

// GET /api/vendor/shipping-policies
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

    const policies = await vendorRepository.getStoreShippingPolicies(store.id);

    const totalPolicies = policies.length;
    const activePolicies = policies.filter((p) => p.isActive).length;
    const inactivePolicies = totalPolicies - activePolicies;
    const productsAssigned = policies.reduce((sum, p) => sum + (p._count?.productShipping || 0), 0);

    return NextResponse.json({
      policies: policies.map((p) => ({
        id: p.id,
        storeId: p.storeId,
        name: p.name,
        shippingMethod: p.shippingMethod,
        deliveryTime: p.deliveryTime,
        shippingCost: Number(p.shippingCost),
        freeShippingThreshold: p.freeShippingThreshold ? Number(p.freeShippingThreshold) : null,
        processingTime: p.processingTime,
        deliveryRegions: p.deliveryRegions,
        supportedCountries: p.supportedCountries,
        localPickup: p.localPickup,
        cashOnDelivery: p.cashOnDelivery,
        trackingSupported: p.trackingSupported,
        description: p.description,
        isActive: p.isActive,
        productsCount: p._count?.productShipping || 0,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
      stats: {
        totalPolicies,
        activePolicies,
        inactivePolicies,
        productsAssigned,
      },
    });
  } catch (err: any) {
    const status = err?.status ?? 500;
    return NextResponse.json({ error: err?.message || "Failed to fetch shipping policies" }, { status });
  }
}

// POST /api/vendor/shipping-policies
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
    if (!body.name) {
      return NextResponse.json({ error: "Policy name is required" }, { status: 400 });
    }

    const policy = await vendorRepository.createShippingPolicy(store.id, body);

    return NextResponse.json({ policy }, { status: 201 });
  } catch (err: any) {
    const status = err?.status ?? 500;
    return NextResponse.json({ error: err?.message || "Failed to create shipping policy" }, { status });
  }
}

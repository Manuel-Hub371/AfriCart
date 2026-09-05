import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/stores/[id]/shipping-policies
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Find store by id or slug
    const store = await db.store.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const policies = await db.shippingPolicy.findMany({
      where: {
        storeId: store.id,
        isActive: true,
        deletedAt: null,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ policies });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch shipping policies" },
      { status: 500 }
    );
  }
}

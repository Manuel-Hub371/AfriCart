import { NextRequest, NextResponse } from "next/server";
import { catalogService } from "@/modules/catalog/service";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId().catch(() => undefined);
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || undefined;
    const stores = await catalogService.getStores(query, userId || undefined);
    return NextResponse.json(stores);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch stores" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { catalogService } from "@/modules/catalog/service";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId().catch(() => undefined);
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const location = searchParams.get("location") || searchParams.get("city") || undefined;
    const businessType = searchParams.get("businessType") || undefined;
    const sortBy = (searchParams.get("sortBy") as any) || undefined;

    const filters = {
      search: query,
      category,
      location,
      businessType,
      sortBy,
      userId: userId || undefined,
    };

    const stores = await catalogService.getStores(filters, userId || undefined);
    return NextResponse.json(stores);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch stores" },
      { status: 500 }
    );
  }
}

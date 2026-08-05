import { NextRequest, NextResponse } from "next/server";
import { catalogService } from "@/modules/catalog/service";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId().catch(() => undefined);
    const { id } = await params;
    const store = await catalogService.getStoreDetails(id, userId || undefined);
    return NextResponse.json(store);
  } catch (error: any) {
    const status = error.message === "Store not found" ? 404 : 500;
    return NextResponse.json(
      { message: error.message || "Failed to fetch store details" },
      { status }
    );
  }
}

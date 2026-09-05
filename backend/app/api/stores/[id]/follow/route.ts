import { NextRequest, NextResponse } from "next/server";
import { catalogService } from "@/modules/catalog/service";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/stores/[id]/follow - Toggle follow status
export async function POST(req: NextRequest, { params }: RouteParams) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: storeId } = await params;

  try {
    const result = await catalogService.toggleFollowStore(storeId, userId);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to toggle follow status" },
      { status: 500 }
    );
  }
}

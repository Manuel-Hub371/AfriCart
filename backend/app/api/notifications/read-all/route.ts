import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { notificationService } from "@/modules/notifications/service";

/**
 * POST /api/notifications/read-all
 * Mark all notifications as read for current user
 */
export async function POST() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await notificationService.markAllAsRead(userId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST /api/notifications/read-all error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to mark all notifications as read" },
      { status: 500 }
    );
  }
}

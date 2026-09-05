import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { notificationService } from "@/modules/notifications/service";

/**
 * PATCH /api/notifications/[id]
 * Mark a single notification as read
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: notificationId } = await params;
    await notificationService.markAsRead(userId, notificationId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PATCH /api/notifications/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update notification" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications/[id]
 * Delete a notification
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: notificationId } = await params;
    await notificationService.deleteNotification(userId, notificationId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/notifications/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete notification" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { validateCreateNotificationInput } from "@/modules/notifications/dto";
import { notificationService } from "@/modules/notifications/service";

/**
 * GET /api/notifications
 * Fetch authenticated user's notifications
 */
export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await notificationService.getUserNotifications(userId);
    return NextResponse.json(notifications);
  } catch (error: any) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications
 * Create a new notification
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = validateCreateNotificationInput(body);

    const notification = await notificationService.createNotification(validatedData);
    return NextResponse.json(notification, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/notifications error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create notification" },
      { status: 400 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { validateCreateConversationInput } from "@/modules/messaging/dto";
import { messagingService } from "@/modules/messaging/service";

/**
 * GET /api/messaging/conversations
 * Fetch user conversations (auto-detects customer or vendor role)
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role"); // "vendor" | "customer"

    if (role === "vendor") {
      const conversations = await messagingService.getVendorConversations(userId);
      return NextResponse.json(conversations);
    } else {
      const conversations = await messagingService.getCustomerConversations(userId);
      return NextResponse.json(conversations);
    }
  } catch (error: any) {
    console.error("GET /api/messaging/conversations error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch conversations" },
      { status: error.status || 500 }
    );
  }
}

/**
 * POST /api/messaging/conversations
 * Customer initiates a new conversation with a vendor store
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = validateCreateConversationInput(body);

    const conversation = await messagingService.startConversation(userId, validatedData);
    return NextResponse.json(conversation, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/messaging/conversations error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to start conversation" },
      { status: error.status || 400 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth/authentication";
import { validateSendMessageInput } from "@/modules/messaging/dto";
import { messagingService } from "@/modules/messaging/service";

/**
 * GET /api/messaging/conversations/[id]/messages
 * Fetch messages for a specific conversation
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = await params;
    const messages = await messagingService.getConversationMessages(userId, conversationId);
    return NextResponse.json(messages);
  } catch (error: any) {
    console.error("GET /api/messaging/conversations/[id]/messages error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch messages" },
      { status: error.status || 500 }
    );
  }
}

/**
 * POST /api/messaging/conversations/[id]/messages
 * Send a message inside a conversation
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = await params;
    const body = await request.json();
    const validatedData = validateSendMessageInput(body);

    const message = await messagingService.sendMessage(userId, conversationId, validatedData);
    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/messaging/conversations/[id]/messages error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send message" },
      { status: error.status || 400 }
    );
  }
}

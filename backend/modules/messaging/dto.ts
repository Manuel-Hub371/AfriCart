// --- DTO INTERFACES ---

export interface MessageDTO {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: "CUSTOMER" | "VENDOR";
  text: string;
  isRead: boolean;
  createdAt: Date;
}

export interface ConversationDTO {
  id: string;
  customerProfileId: string;
  customerName?: string;
  storeId: string;
  storeName?: string;
  storeLogo?: string;
  lastMessageText?: string | null;
  lastMessageAt: Date;
  unreadCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SendMessageInput {
  text: string;
}

export interface CreateConversationInput {
  storeId: string;
  initialMessage?: string;
}

// --- VALIDATION HELPERS ---

export function validateSendMessageInput(body: any): SendMessageInput {
  if (typeof body !== "object" || body === null) {
    throw new Error("Payload must be an object");
  }

  if (typeof body.text !== "string" || body.text.trim().length === 0) {
    throw new Error("Message text cannot be empty");
  }

  if (body.text.length > 2000) {
    throw new Error("Message text cannot exceed 2000 characters");
  }

  return { text: body.text.trim() };
}

export function validateCreateConversationInput(body: any): CreateConversationInput {
  if (typeof body !== "object" || body === null) {
    throw new Error("Payload must be an object");
  }

  if (typeof body.storeId !== "string" || body.storeId.trim().length === 0) {
    throw new Error("storeId is required");
  }

  let initialMessage: string | undefined = undefined;
  if (body.initialMessage && typeof body.initialMessage === "string") {
    initialMessage = body.initialMessage.trim();
  }

  return {
    storeId: body.storeId.trim(),
    initialMessage,
  };
}

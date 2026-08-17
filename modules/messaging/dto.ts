// --- DTO INTERFACES ---

export interface AttachmentDTO {
  type: "image" | "video" | "file";
  url: string;
  name: string;
  size?: string;
}

export interface MessageDTO {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: "CUSTOMER" | "VENDOR";
  text: string;
  attachments?: AttachmentDTO[] | null;
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
  text?: string;
  attachments?: AttachmentDTO[];
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

  const hasText = typeof body.text === "string" && body.text.trim().length > 0;
  const hasAttachments = Array.isArray(body.attachments) && body.attachments.length > 0;

  if (!hasText && !hasAttachments) {
    throw new Error("Message must contain text or at least one attachment");
  }

  if (body.text && body.text.length > 2000) {
    throw new Error("Message text cannot exceed 2000 characters");
  }

  const validatedAttachments: AttachmentDTO[] = hasAttachments
    ? body.attachments.map((att: any) => ({
        type: att.type === "video" ? "video" : att.type === "image" ? "image" : "file",
        url: String(att.url || ""),
        name: String(att.name || "Attachment"),
        size: att.size ? String(att.size) : undefined,
      }))
    : [];

  return {
    text: body.text ? body.text.trim() : "",
    attachments: validatedAttachments.length > 0 ? validatedAttachments : undefined,
  };
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

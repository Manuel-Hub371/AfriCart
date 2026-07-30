// --- DTO INTERFACES ---

export interface NotificationDTO {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "ORDER" | "PROMOTION" | "SYSTEM" | "INFO";
  isRead: boolean;
  link?: string | null;
  createdAt: Date;
}

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type?: "ORDER" | "PROMOTION" | "SYSTEM" | "INFO";
  link?: string;
}

// --- VALIDATION HELPERS ---

export function validateCreateNotificationInput(body: any): CreateNotificationInput {
  if (typeof body !== "object" || body === null) {
    throw new Error("Payload must be an object");
  }

  if (typeof body.userId !== "string" || body.userId.trim().length === 0) {
    throw new Error("userId is required");
  }

  if (typeof body.title !== "string" || body.title.trim().length === 0) {
    throw new Error("title is required");
  }

  if (typeof body.message !== "string" || body.message.trim().length === 0) {
    throw new Error("message is required");
  }

  const validTypes = ["ORDER", "PROMOTION", "SYSTEM", "INFO"];
  const type = validTypes.includes(body.type) ? body.type : "INFO";

  return {
    userId: body.userId.trim(),
    title: body.title.trim(),
    message: body.message.trim(),
    type,
    link: body.link ? String(body.link).trim() : undefined,
  };
}

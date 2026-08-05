import { db } from "@/lib/db";
import { SendMessageInput } from "./dto";

export class MessagingRepository {
  /**
   * Find or create conversation between customer profile and vendor store
   */
  async findOrCreateConversation(customerProfileId: string, storeId: string) {
    let conversation = await db.conversation.findUnique({
      where: {
        customerProfileId_storeId: {
          customerProfileId,
          storeId,
        },
      },
      include: {
        customerProfile: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        },
        store: {
          select: { id: true, name: true, logo: true, vendorProfileId: true },
        },
      },
    });

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          customerProfileId,
          storeId,
        },
        include: {
          customerProfile: {
            include: {
              user: { select: { firstName: true, lastName: true, email: true } },
            },
          },
          store: {
            select: { id: true, name: true, logo: true, vendorProfileId: true },
          },
        },
      });
    }

    return conversation;
  }

  /**
   * Find conversation by ID
   */
  async findConversationById(conversationId: string) {
    return db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        customerProfile: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        store: {
          include: {
            vendorProfile: { select: { userId: true } },
          },
        },
      },
    });
  }

  /**
   * List conversations for customer profile
   */
  async findCustomerConversations(customerProfileId: string) {
    return db.conversation.findMany({
      where: { customerProfileId },
      include: {
        store: { select: { id: true, name: true, logo: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  /**
   * List conversations for vendor store
   */
  async findVendorConversations(storeId: string) {
    return db.conversation.findMany({
      where: { storeId },
      include: {
        customerProfile: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  /**
   * Fetch messages in a conversation
   */
  async findConversationMessages(conversationId: string) {
    return db.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Create message inside conversation and update conversation metadata
   */
  async createMessage(
    conversationId: string,
    senderId: string,
    senderType: "CUSTOMER" | "VENDOR",
    input: SendMessageInput
  ) {
    return db.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          conversationId,
          senderId,
          senderType,
          text: input.text,
        },
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageText: input.text,
          lastMessageAt: message.createdAt,
        },
      });

      return message;
    });
  }

  /**
   * Mark messages as read for a recipient
   */
  async markMessagesAsRead(conversationId: string, currentUserId: string) {
    return db.message.updateMany({
      where: {
        conversationId,
        senderId: { not: currentUserId },
        isRead: false,
      },
      data: { isRead: true },
    });
  }
}

export const messagingRepository = new MessagingRepository();

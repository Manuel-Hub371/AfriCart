import { messagingRepository } from "./repository";
import { shoppingRepository } from "@/modules/shopping/repository";
import { vendorRepository } from "@/modules/vendor/repository";
import { notificationRepository } from "@/modules/notifications/repository";
import { ConversationDTO, CreateConversationInput, MessageDTO, SendMessageInput } from "./dto";
import { domainEvents, EVENT_TOPICS } from "@/lib/events";

export class MessagingService {
  /**
   * Start or fetch existing conversation (Customer starting conversation with vendor store)
   */
  async startConversation(userId: string, input: CreateConversationInput): Promise<ConversationDTO> {
    const customerProfile = await shoppingRepository.ensureCustomerProfile(userId);
    const conversation = await messagingRepository.findOrCreateConversation(customerProfile.id, input.storeId);

    if (input.initialMessage && input.initialMessage.trim().length > 0) {
      await messagingRepository.createMessage(
        conversation.id,
        userId,
        "CUSTOMER",
        { text: input.initialMessage }
      );
    }

    const u = conversation.customerProfile.user;
    const customerName = [u.firstName, u.lastName].filter(Boolean).join(" ") || "Customer";

    return {
      id: conversation.id,
      customerProfileId: conversation.customerProfileId,
      customerName,
      storeId: conversation.storeId,
      storeName: conversation.store.name,
      storeLogo: conversation.store.logo || undefined,
      lastMessageText: conversation.lastMessageText,
      lastMessageAt: conversation.lastMessageAt,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  /**
   * List customer conversations
   */
  async getCustomerConversations(userId: string): Promise<ConversationDTO[]> {
    const customerProfile = await shoppingRepository.ensureCustomerProfile(userId);
    const conversations = await messagingRepository.findCustomerConversations(customerProfile.id);

    return conversations.map((c) => ({
      id: c.id,
      customerProfileId: c.customerProfileId,
      storeId: c.storeId,
      storeName: c.store.name,
      storeLogo: c.store.logo || undefined,
      lastMessageText: c.lastMessageText || (c.messages.length > 0 ? c.messages[0].text : null),
      lastMessageAt: c.lastMessageAt,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  }

  /**
   * List vendor store conversations
   */
  async getVendorConversations(userId: string): Promise<ConversationDTO[]> {
    const vendorProfile = await vendorRepository.findVendorProfileByUserId(userId);
    if (!vendorProfile || !vendorProfile.stores || vendorProfile.stores.length === 0) {
      throw { code: "VENDOR_NOT_FOUND", message: "Vendor store not found", status: 404 };
    }

    const storeId = vendorProfile.stores[0].id;
    const conversations = await messagingRepository.findVendorConversations(storeId);

    return conversations.map((c) => {
      const u = c.customerProfile.user;
      const customerName = [u.firstName, u.lastName].filter(Boolean).join(" ") || "Customer";
      return {
        id: c.id,
        customerProfileId: c.customerProfileId,
        customerName,
        storeId: c.storeId,
        lastMessageText: c.lastMessageText || (c.messages.length > 0 ? c.messages[0].text : null),
        lastMessageAt: c.lastMessageAt,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      };
    });
  }

  /**
   * Get messages for a conversation
   */
  async getConversationMessages(userId: string, conversationId: string): Promise<MessageDTO[]> {
    const conversation = await messagingRepository.findConversationById(conversationId);
    if (!conversation) {
      throw { code: "CONVERSATION_NOT_FOUND", message: "Conversation not found", status: 404 };
    }

    // Verify access permission (must be customer user or vendor store user)
    const isCustomer = conversation.customerProfile.user.id === userId;
    const isVendor = conversation.store.vendorProfile.userId === userId;

    if (!isCustomer && !isVendor) {
      throw { code: "FORBIDDEN", message: "Not authorized to access this conversation", status: 403 };
    }

    // Mark unread messages as read
    await messagingRepository.markMessagesAsRead(conversationId, userId);

    const messages = await messagingRepository.findConversationMessages(conversationId);
    return messages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      senderType: m.senderType as "CUSTOMER" | "VENDOR",
      text: m.text,
      attachments: Array.isArray(m.attachments) ? (m.attachments as any) : null,
      isRead: m.isRead,
      createdAt: m.createdAt,
    }));
  }

  /**
   * Send a message inside a conversation
   */
  async sendMessage(userId: string, conversationId: string, input: SendMessageInput): Promise<MessageDTO> {
    const conversation = await messagingRepository.findConversationById(conversationId);
    if (!conversation) {
      throw { code: "CONVERSATION_NOT_FOUND", message: "Conversation not found", status: 404 };
    }

    const isCustomer = conversation.customerProfile.user.id === userId;
    const isVendor = conversation.store.vendorProfile.userId === userId;

    if (!isCustomer && !isVendor) {
      throw { code: "FORBIDDEN", message: "Not authorized to send messages in this conversation", status: 403 };
    }

    const senderType = isCustomer ? "CUSTOMER" : "VENDOR";

    const message = await messagingRepository.createMessage(conversationId, userId, senderType, input);

    // Create system notification for message recipient
    try {
      const recipientUserId = isCustomer
        ? conversation.store.vendorProfile.userId
        : conversation.customerProfile.user.id;

      const customerUser = conversation.customerProfile.user;
      const senderDisplayName = isCustomer
        ? [customerUser.firstName, customerUser.lastName].filter(Boolean).join(" ") || "Customer"
        : conversation.store.name;

      const previewText = input.text?.trim()
        || (input.attachments && input.attachments.length > 0 ? `[${input.attachments[0].type.toUpperCase()}] ${input.attachments[0].name}` : "Attachment");

      const link = isCustomer
        ? `/vendor/messages`
        : `/profile/messages?conversationId=${conversation.id}`;

      await notificationRepository.createNotification({
        userId: recipientUserId,
        title: isCustomer ? `New Message from ${senderDisplayName}` : `New Message from ${senderDisplayName}`,
        message: `"${previewText.length > 80 ? previewText.slice(0, 80) + '...' : previewText}"`,
        type: "INFO",
        link,
      });
    } catch (notifErr) {
      console.error("Failed to create message notification:", notifErr);
    }

    domainEvents.emit(EVENT_TOPICS.MESSAGE_SENT, {
      messageId: message.id,
      conversationId: message.conversationId,
      senderId: userId,
      senderType,
    });

    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderType,
      text: message.text,
      attachments: Array.isArray(message.attachments) ? (message.attachments as any) : null,
      isRead: message.isRead,
      createdAt: message.createdAt,
    };
  }
}

export const messagingService = new MessagingService();

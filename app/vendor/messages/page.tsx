"use client";

import { useState, useMemo } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { ConversationList } from "@/components/vendor/conversation-list";
import { ChatWindow } from "@/components/vendor/chat-window";
import { Conversation } from "@/components/vendor/conversation-card";
import { Message } from "@/components/vendor/message-bubble";

// Generate deterministic conversations
function generateConversations(): Conversation[] {
  const customers = [
    "John Smith",
    "Sarah Johnson",
    "Michael Brown",
    "Emily Davis",
    "David Wilson",
    "Jessica Martinez",
    "Robert Taylor",
    "Lisa Anderson",
  ];

  const messages = [
    "Is this available in black?",
    "When will my order ship?",
    "Can I get a discount on bulk orders?",
    "What's the return policy?",
    "Is this product still in stock?",
    "I have a question about sizing",
    "Can you ship internationally?",
    "How long is the warranty?",
  ];

  const products = [
    "Wireless Headphones",
    "Smart Watch",
    "Laptop Stand",
    "Mechanical Keyboard",
    "USB-C Cable",
    "Phone Case",
    "Tablet Cover",
    "Gaming Mouse",
  ];

  const conversations: Conversation[] = [];

  for (let i = 0; i < customers.length; i++) {
    const hasOrder = i % 3 === 0;
    const hasProduct = i % 2 === 0;
    const unreadCount = i === 0 ? 2 : i === 1 ? 1 : 0;
    const hoursAgo = i * 15;

    conversations.push({
      id: `conv-${i + 1}`,
      customerName: customers[i],
      customerAvatar: "",
      lastMessage: messages[i],
      timestamp:
        hoursAgo < 60
          ? `${hoursAgo}m ago`
          : hoursAgo < 1440
          ? `${Math.floor(hoursAgo / 60)}h ago`
          : `${Math.floor(hoursAgo / 1440)}d ago`,
      unreadCount,
      orderNumber: hasOrder ? `#${45890 + i}` : undefined,
      productName: hasProduct ? products[i] : undefined,
      type: hasOrder ? "order" : hasProduct ? "product" : "general",
    });
  }

  return conversations;
}

// Generate deterministic messages
function generateMessages(conversationId: string): Message[] {
  const baseMessages: Message[] = [
    {
      id: "msg-1",
      sender: "customer",
      text: "Hi, I'm interested in this product. Is it available in black color?",
      timestamp: "10:30 AM",
    },
    {
      id: "msg-2",
      sender: "vendor",
      text: "Hello! Thank you for your interest. Yes, this product is available in black. We currently have 15 units in stock.",
      timestamp: "10:32 AM",
      status: "read",
    },
    {
      id: "msg-3",
      sender: "customer",
      text: "Great! Can you tell me more about the warranty?",
      timestamp: "10:35 AM",
    },
    {
      id: "msg-4",
      sender: "vendor",
      text: "This product comes with a 2-year manufacturer warranty covering any defects. We also offer free returns within 30 days if you're not satisfied.",
      timestamp: "10:38 AM",
      status: "read",
    },
    {
      id: "msg-5",
      sender: "customer",
      text: "Perfect! I'll place an order shortly.",
      timestamp: "10:40 AM",
    },
    {
      id: "msg-6",
      sender: "vendor",
      text: "Wonderful! If you have any questions during checkout, feel free to reach out. We're here to help!",
      timestamp: "10:42 AM",
      status: "delivered",
    },
  ];

  return baseMessages;
}

export default function VendorMessagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<string | null>("conv-1");

  // Generate conversations
  const conversations = useMemo(() => generateConversations(), []);

  // Get active conversation
  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  // Generate messages for active conversation
  const messages = useMemo(
    () => (activeConversationId ? generateMessages(activeConversationId) : []),
    [activeConversationId]
  );

  const handleSendMessage = (text: string, attachments?: File[]) => {
    console.log("Send message:", text, attachments);
    // In a real app, this would send the message to the server
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <VendorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <VendorTopbar
          onMenuClick={() => setSidebarOpen(true)}
          breadcrumbs={[
            { label: "Dashboard", href: "/vendor" },
            { label: "Messages" },
          ]}
        />

        {/* Main Content - Fixed height layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Conversation List */}
          <div className="hidden lg:block flex-shrink-0">
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={handleSelectConversation}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Right: Chat Window - Full width */}
          {activeConversation ? (
            <ChatWindow
              customerName={activeConversation.customerName}
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center px-6">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg
                    className="h-12 w-12 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-sm text-gray-600 max-w-sm">
                  Choose a conversation from the list to start messaging with your customers
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

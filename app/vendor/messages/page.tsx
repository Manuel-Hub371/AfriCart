"use client";

import { useState, useEffect } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { ConversationList } from "@/components/vendor/conversation-list";
import { ChatWindow } from "@/components/vendor/chat-window";
import { Conversation } from "@/components/vendor/conversation-card";
import { Message } from "@/components/vendor/message-bubble";

export default function VendorMessagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch vendor conversations
  useEffect(() => {
    async function loadConversations() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/messaging/conversations?role=vendor");
        if (res.ok) {
          const data = await res.json();
          const mapped: Conversation[] = (data || []).map((c: any) => ({
            id: c.id,
            customerName: c.customerName || "Customer",
            customerAvatar: "",
            lastMessage: c.lastMessageText || "No messages yet",
            timestamp: new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unreadCount: c.unreadCount || 0,
            type: "general",
          }));
          setConversations(mapped);
          if (mapped.length > 0 && !activeConversationId) {
            setActiveConversationId(mapped[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load vendor conversations:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadConversations();
  }, []);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeConversationId) return;

    async function loadMessages() {
      try {
        const res = await fetch(`/api/messaging/conversations/${activeConversationId}/messages`);
        if (res.ok) {
          const data = await res.json();
          const mapped: Message[] = (data || []).map((m: any) => ({
            id: m.id,
            sender: m.senderType === "VENDOR" ? "vendor" : "customer",
            text: m.text,
            attachments: Array.isArray(m.attachments) ? m.attachments : undefined,
            timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: m.isRead ? "read" : "delivered",
          }));
          setMessages(mapped);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    }
    loadMessages();
  }, [activeConversationId]);

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );

  const handleSendMessage = async (text: string, files?: File[]) => {
    if (!activeConversationId || (!text.trim() && (!files || files.length === 0))) return;

    try {
      let uploadedAttachments: any[] = [];
      if (files && files.length > 0) {
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            const fileType = file.type.startsWith("image/")
              ? "image"
              : file.type.startsWith("video/")
              ? "video"
              : "file";
            uploadedAttachments.push({
              type: fileType,
              url: uploadData.url,
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            });
          }
        }
      }

      const res = await fetch(`/api/messaging/conversations/${activeConversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          attachments: uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
        }),
      });

      if (res.ok) {
        const newMsg = await res.json();
        const mappedMsg: Message = {
          id: newMsg.id,
          sender: "vendor",
          text: newMsg.text,
          attachments: Array.isArray(newMsg.attachments) ? newMsg.attachments : undefined,
          timestamp: new Date(newMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: "delivered",
        };
        setMessages((prev) => [...prev, mappedMsg]);

        const previewText = text.trim() || (uploadedAttachments.length > 0 ? `[${uploadedAttachments[0].type.toUpperCase()}]` : "Attachment");

        // Update last message in conversation list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversationId
              ? { ...c, lastMessage: previewText, timestamp: "Just now" }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
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

        {/* Main Content */}
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

          {/* Right: Chat Window */}
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
                  {isLoading ? "Loading Conversations..." : "No Conversations Found"}
                </h3>
                <p className="text-sm text-gray-600 max-w-sm">
                  {isLoading
                    ? "Please wait while we fetch your active messages..."
                    : "When customers send messages to your store, they will appear here."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

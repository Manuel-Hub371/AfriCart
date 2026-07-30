"use client";

import { useState, useEffect, useRef } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Store, Loader2, MessageSquare } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface CustomerConversation {
  id: string;
  storeId: string;
  storeName: string;
  storeLogo?: string;
  lastMessageText?: string;
  lastMessageAt?: string;
  createdAt: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: "CUSTOMER" | "VENDOR";
  text: string;
  isRead: boolean;
  createdAt: string;
}

export default function CustomerMessagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const initialConvId = searchParams.get("conversationId");

  const [conversations, setConversations] = useState<CustomerConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(initialConvId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch customer conversations
  useEffect(() => {
    async function loadConversations() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/messaging/conversations?role=customer");
        if (res.ok) {
          const data = await res.json();
          setConversations(data || []);
          if (data && data.length > 0 && !activeConversationId) {
            setActiveConversationId(data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
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
          setMessages(data || []);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    }
    loadMessages();
  }, [activeConversationId]);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversationId || !newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      const res = await fetch(`/api/messaging/conversations/${activeConversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newMessage.trim() }),
      });

      if (res.ok) {
        const sentMsg = await res.json();
        setMessages((prev) => [...prev, sentMsg]);
        setNewMessage("");

        // Update last message in conversation list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversationId
              ? { ...c, lastMessageText: sentMsg.text, lastMessageAt: sentMsg.createdAt }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 min-h-0 overflow-hidden">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Messages</h1>
            <p className="text-gray-600 text-sm">
              Communicate directly with store vendors about your inquiries and orders
            </p>
          </div>

          <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex overflow-hidden min-h-0">
            {/* Conversation List */}
            <div className="w-full sm:w-80 border-r border-gray-200 flex flex-col flex-shrink-0">
              <div className="p-4 border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                <span>Store Conversations</span>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {isLoading ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Loading conversations...
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    <Store className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    No active messages with stores.
                  </div>
                ) : (
                  conversations.map((conv) => {
                    const isActive = conv.id === activeConversationId;
                    return (
                      <button
                        key={conv.id}
                        onClick={() => setActiveConversationId(conv.id)}
                        className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                          isActive ? "bg-emerald-50/70 border-l-4 border-emerald-600" : ""
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold flex-shrink-0">
                          {conv.storeName?.[0] || "S"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">
                            {conv.storeName}
                          </h4>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {conv.lastMessageText || "No messages yet"}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
              {activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 bg-white border-b border-gray-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                      {activeConversation.storeName?.[0] || "S"}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{activeConversation.storeName}</h3>
                      <p className="text-xs text-emerald-600 font-medium">Store Vendor</p>
                    </div>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-12 text-gray-400 text-sm">
                        Start the conversation by sending a message below.
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isCustomer = msg.senderType === "CUSTOMER";
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isCustomer ? "items-end" : "items-start"}`}
                          >
                            <div
                              className={`max-w-md px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                isCustomer
                                  ? "bg-emerald-600 text-white rounded-br-none"
                                  : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                              }`}
                            >
                              {msg.text}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 px-1">
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex gap-2">
                    <Input
                      type="text"
                      placeholder="Type a message to the store..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isSending || !newMessage.trim()} className="gradient-primary text-white gap-2">
                      {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Send
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
                  <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="font-medium text-gray-700">Select a conversation to start chatting</p>
                  <p className="text-xs text-gray-400 mt-1">
                    You can contact any store from their store page or product details page.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

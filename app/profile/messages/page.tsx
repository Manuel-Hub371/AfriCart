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

        <main className="flex-1 flex flex-col p-3 sm:p-6 lg:p-8 min-h-0 overflow-hidden space-y-2 sm:space-y-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">Messages</h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Communicate directly with store vendors about your inquiries and orders
            </p>
          </div>

          <div className="flex-1 bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-2xs flex overflow-hidden min-h-0">
            {/* Conversation List - Hidden on mobile if active chat is open */}
            <div className={`w-full sm:w-80 border-r border-gray-200 flex flex-col flex-shrink-0 ${activeConversationId ? "hidden sm:flex" : "flex"}`}>
              <div className="p-3 border-b border-gray-100 bg-gray-50 font-bold text-gray-800 text-xs flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                <span>Store Conversations</span>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {isLoading ? (
                  <div className="p-6 text-center text-gray-400 text-xs font-semibold">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-emerald-600" />
                    Loading conversations...
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-xs font-medium">
                    <Store className="h-7 w-7 mx-auto mb-2 text-gray-300" />
                    No active messages with stores.
                  </div>
                ) : (
                  conversations.map((conv) => {
                    const isActive = conv.id === activeConversationId;
                    return (
                      <button
                        key={conv.id}
                        onClick={() => setActiveConversationId(conv.id)}
                        className={`w-full text-left p-3 hover:bg-gray-50 transition-colors flex items-center gap-2.5 ${
                          isActive ? "bg-emerald-50/70 border-l-4 border-emerald-600" : ""
                        }`}
                      >
                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-extrabold text-xs flex-shrink-0">
                          {conv.storeName?.[0] || "S"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-xs truncate">
                            {conv.storeName}
                          </h4>
                          <p className="text-[10px] text-gray-500 truncate mt-0.5 font-medium">
                            {conv.lastMessageText || "No messages yet"}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Area - Full screen on mobile if active chat is open */}
            <div className={`flex-1 flex-col min-w-0 bg-gray-50/60 ${activeConversationId ? "flex" : "hidden sm:flex"}`}>
              {activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-2.5 sm:p-4 bg-white border-b border-gray-200 flex items-center gap-2.5">
                    <button
                      onClick={() => setActiveConversationId(null)}
                      className="sm:hidden p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                      title="Back to conversations"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs sm:text-base">
                      {activeConversation.storeName?.[0] || "S"}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-xs sm:text-base">{activeConversation.storeName}</h3>
                      <p className="text-[10px] sm:text-xs text-emerald-600 font-bold">Store Vendor</p>
                    </div>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-xs font-medium">
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
                              className={`max-w-xs sm:max-w-md px-3 py-2 rounded-2xl text-xs sm:text-sm shadow-2xs font-medium ${
                                isCustomer
                                  ? "bg-emerald-600 text-white rounded-br-none"
                                  : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                              }`}
                            >
                              {msg.text}
                            </div>
                            <span className="text-[9px] text-gray-400 mt-0.5 px-1">
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
                  <form onSubmit={handleSendMessage} className="p-2.5 sm:p-4 bg-white border-t border-gray-200 flex gap-2">
                    <Input
                      type="text"
                      placeholder="Type a message to the store..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 h-8 sm:h-10 text-xs rounded-xl"
                    />
                    <Button type="submit" disabled={isSending || !newMessage.trim()} className="gradient-primary text-white gap-1 font-bold text-xs h-8 sm:h-10 px-3 rounded-xl">
                      {isSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      <span className="hidden sm:inline">Send</span>
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-500">
                  <MessageSquare className="h-10 w-10 text-gray-300 mb-2" />
                  <p className="font-bold text-gray-800 text-xs sm:text-sm">Select a conversation to start chatting</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1 max-w-xs">
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

"use client";

import { useState, useEffect, useRef } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Store, Loader2, MessageSquare, Paperclip, FileText, X } from "lucide-react";
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

interface MessageAttachment {
  type: "image" | "video" | "file";
  url: string;
  name: string;
  size?: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: "CUSTOMER" | "VENDOR";
  text: string;
  attachments?: MessageAttachment[];
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
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch customer conversations with live polling
  useEffect(() => {
    async function loadConversations(isInitial = false) {
      try {
        if (isInitial) setIsLoading(true);
        const res = await fetch("/api/messaging/conversations?role=customer");
        if (res.ok) {
          const data = await res.json();
          setConversations((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(data)) return data || [];
            return prev;
          });
          if (data && data.length > 0 && !activeConversationId) {
            setActiveConversationId(data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
      } finally {
        if (isInitial) setIsLoading(false);
      }
    }
    loadConversations(true);
    const interval = setInterval(() => loadConversations(false), 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch messages for active conversation with 3s live polling
  useEffect(() => {
    if (!activeConversationId) return;

    async function loadMessages(silent = false) {
      try {
        const res = await fetch(`/api/messaging/conversations/${activeConversationId}/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(data)) return data || [];
            return prev;
          });
        }
      } catch (err) {
        if (!silent) console.error("Failed to load messages:", err);
      }
    }
    loadMessages(false);
    const interval = setInterval(() => loadMessages(true), 3000);
    return () => clearInterval(interval);
  }, [activeConversationId]);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversationId || (!newMessage.trim() && attachments.length === 0) || isSending) return;

    try {
      setIsSending(true);

      let uploadedAttachments: any[] = [];
      if (attachments.length > 0) {
        for (const file of attachments) {
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
          text: newMessage.trim(),
          attachments: uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
        }),
      });

      if (res.ok) {
        const sentMsg = await res.json();
        setMessages((prev) => [...prev, sentMsg]);
        setNewMessage("");
        setAttachments([]);

        const previewText = sentMsg.text || (uploadedAttachments.length > 0 ? `[${uploadedAttachments[0].type.toUpperCase()}]` : "Attachment");

        // Update last message in conversation list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversationId
              ? { ...c, lastMessageText: previewText, lastMessageAt: sentMsg.createdAt }
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
                              {msg.text && <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>}

                              {/* Media Attachments */}
                              {msg.attachments && msg.attachments.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {msg.attachments.map((attachment, index) => {
                                    const isImage = attachment.type === "image" || (attachment.url && (attachment.url.startsWith("data:image/") || attachment.url.match(/\.(jpeg|jpg|png|webp|gif|svg)$/i)));
                                    const isVideo = attachment.type === "video" || (attachment.url && (attachment.url.startsWith("data:video/") || attachment.url.match(/\.(mp4|webm|ogg|mov)$/i)));

                                    if (isImage) {
                                      return (
                                        <div key={index} className="rounded-xl overflow-hidden shadow-md max-w-sm">
                                          <img
                                            src={attachment.url}
                                            alt={attachment.name}
                                            className="w-full h-auto max-h-72 object-cover rounded-xl"
                                          />
                                        </div>
                                      );
                                    }

                                    if (isVideo) {
                                      return (
                                        <div key={index} className="rounded-xl overflow-hidden shadow-md max-w-sm">
                                          <video
                                            src={attachment.url}
                                            controls
                                            className="w-full h-auto max-h-72 rounded-xl"
                                          />
                                        </div>
                                      );
                                    }

                                    return (
                                      <a
                                        key={index}
                                        href={attachment.url}
                                        download={attachment.name}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-2.5 p-2.5 rounded-xl shadow-xs transition-opacity hover:opacity-90 ${
                                          isCustomer ? "bg-emerald-700 text-white" : "bg-gray-100 text-gray-900"
                                        }`}
                                      >
                                        <FileText className="h-4 w-4 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-bold truncate">{attachment.name}</p>
                                          {attachment.size && <p className="text-[10px] opacity-80">{attachment.size}</p>}
                                        </div>
                                      </a>
                                    );
                                  })}
                                </div>
                              )}
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

                  {/* Attachment Preview Bar */}
                  {attachments.length > 0 && (
                    <div className="px-3 py-2 bg-emerald-50 border-t border-emerald-100 flex gap-2 flex-wrap">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-800 text-xs rounded-lg flex items-center gap-1.5 shadow-2xs font-bold"
                        >
                          <Paperclip className="h-3 w-3 text-emerald-600" />
                          <span className="truncate max-w-[120px]">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                            className="text-gray-400 hover:text-red-600 font-bold ml-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Chat Input */}
                  <form onSubmit={handleSendMessage} className="p-2.5 sm:p-4 bg-white border-t border-gray-200 flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      multiple
                      accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                      title="Attach Image, Video, or File"
                    >
                      <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <Input
                      type="text"
                      placeholder="Type a message or attach images/videos..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 h-8 sm:h-10 text-xs rounded-xl"
                    />
                    <Button type="submit" disabled={isSending || (!newMessage.trim() && attachments.length === 0)} className="gradient-primary text-white gap-1 font-bold text-xs h-8 sm:h-10 px-3 rounded-xl">
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

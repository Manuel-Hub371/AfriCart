"use client";

import { MoreVertical, Phone, Video } from "lucide-react";
import { MessageBubble, Message } from "./message-bubble";
import { MessageComposer } from "./message-composer";

interface ChatWindowProps {
  customerName: string;
  messages: Message[];
  onSendMessage: (text: string, attachments?: File[]) => void;
}

export function ChatWindow({ customerName, messages, onSendMessage }: ChatWindowProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 h-full">
      {/* Chat Header - Fixed at top */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold shadow-md">
            {customerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">{customerName}</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-gray-600">Online</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
            <Phone className="h-5 w-5 text-gray-600 group-hover:text-emerald-600 transition-colors" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
            <Video className="h-5 w-5 text-gray-600 group-hover:text-emerald-600 transition-colors" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
            <MoreVertical className="h-5 w-5 text-gray-600 group-hover:text-emerald-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* Messages - Scrollable area (takes remaining space) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100 min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">No messages yet</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
      </div>

      {/* Message Composer - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-gray-200">
        <MessageComposer onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}

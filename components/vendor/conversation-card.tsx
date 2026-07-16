"use client";

export interface Conversation {
  id: string;
  customerName: string;
  customerAvatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  orderNumber?: string;
  productName?: string;
  type: "order" | "product" | "general";
}

interface ConversationCardProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationCard({ conversation, isActive, onClick }: ConversationCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 text-left transition-all relative ${
        isActive
          ? "bg-gradient-to-r from-emerald-50 to-transparent border-l-4 border-emerald-600"
          : "hover:bg-gray-50/80 border-l-4 border-transparent hover:border-gray-200"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold">
            {conversation.customerName.charAt(0).toUpperCase()}
          </div>
          {conversation.unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-white">
                {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`text-sm font-semibold truncate ${
              conversation.unreadCount > 0 ? "text-gray-900" : "text-gray-700"
            }`}>
              {conversation.customerName}
            </h3>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {conversation.timestamp}
            </span>
          </div>

          <p className={`text-sm truncate ${
            conversation.unreadCount > 0 ? "font-medium text-gray-900" : "text-gray-600"
          }`}>
            {conversation.lastMessage}
          </p>
        </div>
      </div>
    </button>
  );
}

"use client";

import { Check, CheckCheck, Image as ImageIcon, FileText } from "lucide-react";
import Image from "next/image";

export type MessageStatus = "sent" | "delivered" | "read";
export type MessageSender = "vendor" | "customer";

export interface MessageAttachment {
  type: "image" | "file";
  url: string;
  name: string;
  size?: string;
}

export interface Message {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
  status?: MessageStatus;
  attachments?: MessageAttachment[];
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isVendor = message.sender === "vendor";

  return (
    <div className={`flex ${isVendor ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex gap-2.5 max-w-[70%] ${isVendor ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar for customer only */}
        {!isVendor && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-md">
            C
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          {/* Message bubble */}
          <div
            className={`rounded-2xl px-4 py-3 shadow-sm ${
              isVendor
                ? "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-tr-sm"
                : "bg-white border border-gray-200 text-gray-900 rounded-tl-sm"
            }`}
          >
            {/* Message text */}
            {message.text && (
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {message.text}
              </p>
            )}

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment, index) => (
                  <div key={index}>
                    {attachment.type === "image" ? (
                      <div className="rounded-xl overflow-hidden shadow-md">
                        <Image
                          src={attachment.url}
                          alt={attachment.name}
                          width={300}
                          height={200}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={`flex items-center gap-3 p-3 rounded-xl shadow-sm ${
                          isVendor ? "bg-emerald-500" : "bg-gray-50"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isVendor ? "bg-emerald-400" : "bg-gray-200"
                          }`}
                        >
                          <FileText
                            className={`h-5 w-5 ${
                              isVendor ? "text-white" : "text-gray-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              isVendor ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {attachment.name}
                          </p>
                          {attachment.size && (
                            <p
                              className={`text-xs ${
                                isVendor ? "text-emerald-100" : "text-gray-500"
                              }`}
                            >
                              {attachment.size}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Timestamp and status */}
          <div
            className={`flex items-center gap-1.5 px-2 ${
              isVendor ? "justify-end" : "justify-start"
            }`}
          >
            <span className="text-xs text-gray-500 font-medium">{message.timestamp}</span>
            {isVendor && message.status && (
              <div className="flex items-center">
                {message.status === "sent" && (
                  <Check className="h-3.5 w-3.5 text-gray-400" />
                )}
                {message.status === "delivered" && (
                  <CheckCheck className="h-3.5 w-3.5 text-gray-400" />
                )}
                {message.status === "read" && (
                  <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

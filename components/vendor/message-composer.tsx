"use client";

import { useState, useRef } from "react";
import { Send, Paperclip, Smile, Image as ImageIcon } from "lucide-react";

interface MessageComposerProps {
  onSendMessage: (text: string, attachments?: File[]) => void;
}

export function MessageComposer({ onSendMessage }: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments);
      setMessage("");
      setAttachments([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  return (
    <div className="bg-white p-3 sm:p-4 border-t border-gray-200/80">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        {/* Attachments Preview Bar */}
        {attachments.length > 0 && (
          <div className="flex gap-2 flex-wrap p-2 bg-emerald-50/60 border border-emerald-100 rounded-xl">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="px-2.5 py-1 bg-white border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-1.5 shadow-2xs font-bold"
              >
                <Paperclip className="h-3 w-3 text-emerald-600" />
                <span className="truncate max-w-[130px]">{file.name}</span>
                <button
                  type="button"
                  onClick={() =>
                    setAttachments(attachments.filter((_, i) => i !== index))
                  }
                  className="text-gray-400 hover:text-red-600 font-bold ml-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Floating Message Box Container */}
        <div className="bg-gray-50/70 border border-gray-200/90 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 rounded-2xl p-2 transition-all shadow-2xs">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your reply message..."
            rows={2}
            className="w-full px-2.5 py-1.5 bg-transparent resize-none focus:outline-none text-xs text-gray-900 placeholder:text-gray-400 max-h-32 font-medium"
          />

          {/* Action Bar Header */}
          <div className="flex items-center justify-between pt-1 border-t border-gray-100/80">
            <div className="flex items-center gap-1">
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
                className="p-1.5 hover:bg-emerald-50 text-gray-500 hover:text-emerald-600 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
                title="Attach Media / Files"
              >
                <Paperclip className="h-4 w-4" />
                <span className="hidden sm:inline">Attach</span>
              </button>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!message.trim() && attachments.length === 0}
              className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs flex-shrink-0"
            >
              <span>Send Message</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Template Chips (No Emojis) */}
        <div className="flex gap-1.5 flex-wrap pt-0.5">
          <button
            type="button"
            onClick={() =>
              setMessage("Hello, thank you for contacting our store! How may we assist you today?")
            }
            className="px-2.5 py-1 text-[11px] bg-white border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 text-gray-600 rounded-lg transition-all font-semibold"
          >
            Store Greeting
          </button>
          <button
            type="button"
            onClick={() => setMessage("Your package has been dispatched and is currently in transit.")}
            className="px-2.5 py-1 text-[11px] bg-white border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 text-gray-600 rounded-lg transition-all font-semibold"
          >
            Package Shipped
          </button>
          <button
            type="button"
            onClick={() =>
              setMessage("We apologize for the inconvenience. Let us check this immediately for you.")
            }
            className="px-2.5 py-1 text-[11px] bg-white border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 text-gray-600 rounded-lg transition-all font-semibold"
          >
            Support Apology
          </button>
        </div>
      </form>
    </div>
  );
}

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
    <div className="bg-white p-4 shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="flex gap-2 flex-wrap pb-2 border-b border-gray-100">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg flex items-center gap-2 shadow-sm"
              >
                <Paperclip className="h-3.5 w-3.5" />
                <span className="truncate max-w-[150px] font-medium">{file.name}</span>
                <button
                  type="button"
                  onClick={() =>
                    setAttachments(attachments.filter((_, i) => i !== index))
                  }
                  className="text-emerald-600 hover:text-emerald-800 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="flex items-end gap-3">
          {/* Text input */}
          <div className="flex-1 bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-emerald-500 focus-within:bg-white transition-all">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              className="w-full px-4 py-3 bg-transparent resize-none focus:outline-none text-sm text-gray-900 placeholder:text-gray-500 max-h-32"
              style={{
                minHeight: "44px",
                maxHeight: "128px",
              }}
            />

            {/* Action buttons */}
            <div className="flex items-center gap-1 px-3 pb-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                multiple
                accept="image/*,.pdf,.doc,.docx"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-emerald-50 rounded-lg transition-colors group"
                title="Attach file"
              >
                <Paperclip className="h-4 w-4 text-gray-600 group-hover:text-emerald-600 transition-colors" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-emerald-50 rounded-lg transition-colors group"
                title="Add emoji"
              >
                <Smile className="h-4 w-4 text-gray-600 group-hover:text-emerald-600 transition-colors" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-emerald-50 rounded-lg transition-colors group"
                title="Add image"
              >
                <ImageIcon className="h-4 w-4 text-gray-600 group-hover:text-emerald-600 transition-colors" />
              </button>
            </div>
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={!message.trim() && attachments.length === 0}
            className="h-12 w-12 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:shadow-none flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {/* Quick replies */}
        <div className="flex gap-2 flex-wrap pt-1">
          <button
            type="button"
            onClick={() =>
              setMessage("Hello, thank you for contacting us. How can I help you today?")
            }
            className="px-3 py-1.5 text-xs bg-white border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 rounded-lg transition-all font-medium"
          >
            👋 Greeting
          </button>
          <button
            type="button"
            onClick={() => setMessage("Your order has been shipped and is on its way!")}
            className="px-3 py-1.5 text-xs bg-white border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 rounded-lg transition-all font-medium"
          >
            📦 Order Shipped
          </button>
          <button
            type="button"
            onClick={() =>
              setMessage("I apologize for the inconvenience. Let me look into this for you.")
            }
            className="px-3 py-1.5 text-xs bg-white border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 rounded-lg transition-all font-medium"
          >
            🙏 Apology
          </button>
        </div>
      </form>
    </div>
  );
}

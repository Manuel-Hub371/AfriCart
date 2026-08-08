"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Quote,
  Eye,
  EyeOff,
  Minus,
} from "lucide-react";

interface ProductBasicInfoProps {
  name?: string;
  onNameChange?: (val: string) => void;
  brand?: string;
  onBrandChange?: (val: string) => void;
  description?: string;
  onDescriptionChange?: (val: string) => void;
}

/** Simple markdown-to-HTML converter for preview */
function renderMarkdown(text: string): string {
  if (!text) return "";
  return text
    // Headings
    .replace(/^### (.+)$/gm, "<h3 class='text-base font-bold mt-3 mb-1'>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2 class='text-lg font-bold mt-4 mb-1'>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1 class='text-xl font-bold mt-4 mb-2'>$1</h1>")
    // Bold + Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Underline (custom)
    .replace(/__(.+?)__/g, "<u>$1</u>")
    // Blockquote
    .replace(/^&gt; (.+)$/gm, "<blockquote class='border-l-4 border-emerald-400 pl-3 text-gray-600 italic my-2'>$1</blockquote>")
    .replace(/^> (.+)$/gm, "<blockquote class='border-l-4 border-emerald-400 pl-3 text-gray-600 italic my-2'>$1</blockquote>")
    // Horizontal rule
    .replace(/^---$/gm, "<hr class='border-gray-300 my-3' />")
    // Unordered list
    .replace(/^\s*[-*] (.+)$/gm, "<li class='ml-4 list-disc'>$1</li>")
    // Ordered list
    .replace(/^\s*\d+\. (.+)$/gm, "<li class='ml-4 list-decimal'>$1</li>")
    // Wrap consecutive <li> in <ul> or <ol>
    .replace(/((?:<li[^>]*>.*?<\/li>\n?)+)/g, "<ul class='my-2 space-y-0.5'>$1</ul>")
    // Paragraphs
    .replace(/\n\n+/g, "</p><p class='mb-2'>")
    // Line breaks
    .replace(/\n/g, "<br />");
}

export default function ProductBasicInfo({
  name = "",
  onNameChange,
  brand = "",
  onBrandChange,
  description = "",
  onDescriptionChange,
}: ProductBasicInfoProps) {
  const [shortDesc, setShortDesc] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  /** Insert markdown syntax around selection */
  const wrapSelection = (prefix: string, suffix: string = prefix) => {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const selected = description.slice(start, end);
    const before = description.slice(0, start);
    const after = description.slice(end);
    const newText = `${before}${prefix}${selected || "text"}${suffix}${after}`;
    onDescriptionChange?.(newText);
    // Restore focus and selection
    requestAnimationFrame(() => {
      el.focus();
      const newCursor = start + prefix.length + (selected || "text").length;
      el.setSelectionRange(start + prefix.length, newCursor);
    });
  };

  /** Insert a line prefix at the current line start */
  const insertLinePrefix = (linePrefix: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart: start } = el;
    const lineStart = description.lastIndexOf("\n", start - 1) + 1;
    const before = description.slice(0, lineStart);
    const after = description.slice(lineStart);
    const newText = `${before}${linePrefix}${after}`;
    onDescriptionChange?.(newText);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(lineStart + linePrefix.length, lineStart + linePrefix.length);
    });
  };

  const toolbarActions = [
    { icon: Heading2, label: "Heading", action: () => insertLinePrefix("## ") },
    { icon: Bold, label: "Bold", action: () => wrapSelection("**") },
    { icon: Italic, label: "Italic", action: () => wrapSelection("*") },
    { icon: Underline, label: "Underline", action: () => wrapSelection("__") },
    { type: "divider" },
    { icon: List, label: "Bullet List", action: () => insertLinePrefix("- ") },
    { icon: ListOrdered, label: "Numbered List", action: () => insertLinePrefix("1. ") },
    { icon: Quote, label: "Blockquote", action: () => insertLinePrefix("> ") },
    { icon: Minus, label: "Divider", action: () => onDescriptionChange?.(`${description}\n---\n`) },
  ] as const;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Basic Information</h2>

      <div className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name <span className="text-red-600">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => onNameChange?.(e.target.value)}
            placeholder="Enter product name"
            className="text-lg"
            required
          />
          <p className="text-xs text-gray-500 mt-1">{name.length}/100 characters</p>
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description
          </label>
          <textarea
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            placeholder="Brief product description (appears in listings)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-sm"
            rows={3}
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">{shortDesc.length}/200 characters</p>
        </div>

        {/* Full Description — Rich Markdown Editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Description <span className="text-red-600">*</span>
            </label>
            <button
              type="button"
              onClick={() => setIsPreview((p) => !p)}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 px-3 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-50 transition-colors"
            >
              {isPreview ? (
                <><EyeOff className="h-3.5 w-3.5" /> Edit</>
              ) : (
                <><Eye className="h-3.5 w-3.5" /> Preview</>
              )}
            </button>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Toolbar */}
            {!isPreview && (
              <div className="border-b border-gray-200 px-2 py-1.5 flex gap-0.5 flex-wrap bg-gray-50">
                {toolbarActions.map((item, i) => {
                  if ("type" in item && item.type === "divider") {
                    return <div key={i} className="w-px bg-gray-300 mx-1 my-1" />;
                  }
                  const { icon: Icon, label, action } = item as { icon: any; label: string; action: () => void };
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={action}
                      title={label}
                      className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  );
                })}
                <div className="ml-auto text-[10px] text-gray-400 self-center pr-2">
                  Markdown supported
                </div>
              </div>
            )}

            {/* Editor / Preview */}
            {isPreview ? (
              <div
                className="min-h-[180px] px-4 py-3 text-sm text-gray-800 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: description
                    ? `<p class='mb-2'>${renderMarkdown(description)}</p>`
                    : "<p class='text-gray-400 italic'>Nothing to preview yet...</p>",
                }}
              />
            ) : (
              <textarea
                ref={textareaRef}
                value={description}
                onChange={(e) => onDescriptionChange?.(e.target.value)}
                placeholder="Write a detailed description... Use **bold**, *italic*, ## headings, - bullet lists, etc."
                className="w-full px-4 py-3 focus:outline-none resize-none text-sm font-mono leading-relaxed bg-white"
                rows={8}
                required
              />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">{description.length} characters</p>
        </div>

        {/* Brand & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
            <Input
              value={brand}
              onChange={(e) => onBrandChange?.(e.target.value)}
              placeholder="e.g., Samsung, Nike"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
              <option>Physical Product</option>
              <option>Digital Product</option>
              <option>Service</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Type and press Enter to add tags"
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-gray-300"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

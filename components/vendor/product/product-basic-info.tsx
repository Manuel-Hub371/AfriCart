"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ProductBasicInfo() {
  const [name, setName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

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
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            className="text-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            {name.length}/100 characters
          </p>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            rows={3}
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">
            {shortDesc.length}/200 characters
          </p>
        </div>

        {/* Full Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Description <span className="text-red-600">*</span>
          </label>
          <div className="border rounded-lg">
            {/* Toolbar */}
            <div className="border-b p-2 flex gap-1 flex-wrap bg-gray-50">
              <button className="p-2 hover:bg-gray-200 rounded text-sm font-bold">
                B
              </button>
              <button className="p-2 hover:bg-gray-200 rounded text-sm italic">
                I
              </button>
              <button className="p-2 hover:bg-gray-200 rounded text-sm underline">
                U
              </button>
              <div className="w-px bg-gray-300 mx-1" />
              <button className="p-2 hover:bg-gray-200 rounded text-sm">
                • List
              </button>
              <button className="p-2 hover:bg-gray-200 rounded text-sm">
                1. List
              </button>
            </div>
            {/* Editor */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed product description with features, specifications, and benefits..."
              className="w-full px-4 py-3 focus:outline-none resize-none"
              rows={8}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {description.length} characters
          </p>
        </div>

        {/* Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <Input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g., Samsung, Nike"
            />
          </div>

          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Type
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Select type</option>
              <option>Physical Product</option>
              <option>Digital Product</option>
              <option>Service</option>
            </select>
          </div>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="condition" defaultChecked />
              <span className="text-sm">New</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="condition" />
              <span className="text-sm">Refurbished</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="condition" />
              <span className="text-sm">Used</span>
            </label>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
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

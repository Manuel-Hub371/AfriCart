"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Star } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  isCover: boolean;
}

export default function MediaUploader() {
  const [media, setMedia] = useState<MediaItem[]>([
    {
      id: "1",
      url: "bg-gradient-to-br from-blue-400 to-blue-500",
      isCover: true,
    },
    {
      id: "2",
      url: "bg-gradient-to-br from-purple-400 to-purple-500",
      isCover: false,
    },
  ]);

  const handleSetCover = (id: string) => {
    setMedia(
      media.map((item) => ({
        ...item,
        isCover: item.id === id,
      }))
    );
  };

  const handleRemove = (id: string) => {
    setMedia(media.filter((item) => item.id !== id));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Product Media</h2>
        <p className="text-sm text-gray-600">
          {media.length}/10 images
        </p>
      </div>

      <div className="space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
              <Upload className="h-6 w-6 text-gray-600" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-600">
              PNG, JPG, GIF up to 10MB (Recommended: 1000x1000px)
            </p>
          </div>
        </div>

        {/* Media Grid */}
        {media.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {media.map((item) => (
              <div
                key={item.id}
                className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-emerald-500 transition-all"
              >
                <div className={`w-full h-full ${item.url}`} />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleSetCover(item.id)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100"
                    title="Set as cover"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        item.isCover
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100"
                    title="Remove"
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </button>
                </div>

                {/* Cover Badge */}
                {item.isCover && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-medium rounded">
                    Cover
                  </div>
                )}
              </div>
            ))}

            {/* Add More */}
            {media.length < 10 && (
              <button className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-emerald-500 transition-colors">
                <Upload className="h-8 w-8 text-gray-400" />
              </button>
            )}
          </div>
        )}

        <p className="text-xs text-gray-600">
          Tip: First image will be the cover image. You can reorder by dragging.
        </p>
      </div>
    </Card>
  );
}

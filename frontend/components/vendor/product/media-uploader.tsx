"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Upload, X, Star, Loader2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { useUpload } from "@/lib/hooks/use-upload";

interface MediaItem {
  id: string;
  url: string;
  isCover: boolean;
  uploading?: boolean;
}

interface MediaUploaderProps {
  initialImages?: string[];
  onImagesChange?: (urls: string[]) => void;
}

export default function MediaUploader({ initialImages = [], onImagesChange }: MediaUploaderProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploading } = useUpload();

  // Populate media with initialImages on mount or initialImages change
  useEffect(() => {
    if (initialImages && initialImages.length > 0 && media.length === 0) {
      setMedia(
        initialImages.map((url, idx) => ({
          id: `initial-${idx}-${url}`,
          url,
          isCover: idx === 0,
        }))
      );
    }
  }, [initialImages]);

  // Safely notify parent component whenever uploaded media items change
  useEffect(() => {
    if (onImagesChange) {
      const urls = media
        .filter((m) => !m.uploading && Boolean(m.url))
        .sort((a, b) => (b.isCover ? 1 : 0) - (a.isCover ? 1 : 0))
        .map((m) => m.url);
      onImagesChange(urls);
    }
  }, [media]);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      setUploadError(null);
      const fileArray = Array.from(files);
      const remaining = 10 - media.filter((m) => !m.uploading).length;
      const toProcess = fileArray.slice(0, remaining);

      if (toProcess.length === 0) {
        setUploadError("Maximum 10 images allowed.");
        return;
      }

      // Optimistically add placeholders
      const placeholders: MediaItem[] = toProcess.map((_, i) => ({
        id: `uploading-${Date.now()}-${i}`,
        url: "",
        isCover: media.length === 0 && i === 0,
        uploading: true,
      }));

      setMedia((prev) => [...prev, ...placeholders]);

      // Upload each file
      for (let i = 0; i < toProcess.length; i++) {
        const file = toProcess[i];
        const placeholderId = placeholders[i].id;

        const url = await uploadFile(file);

        if (url) {
          setMedia((prev) =>
            prev.map((m) =>
              m.id === placeholderId
                ? { ...m, url, uploading: false }
                : m
            )
          );
        } else {
          // Remove placeholder on failure
          setMedia((prev) => prev.filter((m) => m.id !== placeholderId));
          setUploadError("One or more images failed to upload.");
        }
      }

      // Reset input so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [media, uploadFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleSetCover = (id: string) => {
    setMedia((prev) =>
      prev.map((item) => ({ ...item, isCover: item.id === id }))
    );
  };

  const handleRemove = (id: string) => {
    setMedia((prev) => {
      let next = prev.filter((item) => item.id !== id);
      if (next.length > 0 && !next.some((m) => m.isCover)) {
        next = next.map((m, i) => ({ ...m, isCover: i === 0 }));
      }
      return next;
    });
  };

  const openFilePicker = () => fileInputRef.current?.click();
  const confirmedCount = media.filter((m) => !m.uploading).length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Product Media</h2>
        <p className="text-sm text-gray-600">{confirmedCount}/10 images</p>
      </div>

      <div className="space-y-4">
        {/* Error */}
        {uploadError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {uploadError}
          </div>
        )}

        {/* Upload Drop Zone */}
        {confirmedCount < 10 && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFilePicker}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-300 hover:border-emerald-500 hover:bg-gray-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleFileInput}
              className="sr-only"
            />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                {uploading ? (
                  <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
                ) : (
                  <Upload className="h-6 w-6 text-gray-600" />
                )}
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                {uploading ? "Uploading..." : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, WEBP, GIF — up to 10 MB each (max 10 images)
              </p>
            </div>
          </div>
        )}

        {/* Media Grid */}
        {media.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {media.map((item) => (
              <div
                key={item.id}
                className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  item.isCover ? "border-yellow-400" : "border-gray-200 hover:border-emerald-500"
                }`}
              >
                {item.uploading ? (
                  <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
                    <span className="text-xs text-gray-500">Uploading...</span>
                  </div>
                ) : item.url ? (
                  <>
                    {/* Preview */}
                    <img
                      src={item.url}
                      alt="Product image"
                      className="w-full h-full object-cover"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSetCover(item.id)}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
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
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </button>
                    </div>

                    {/* Cover Badge */}
                    {item.isCover && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded shadow">
                        Cover
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-500">
          ★ Click the star icon on any image to set it as the cover. Drag &amp; drop multiple images at once.
        </p>
      </div>
    </Card>
  );
}

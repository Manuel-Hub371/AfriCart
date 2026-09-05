"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X, Play, Package } from "lucide-react";
import { extractCoverImage, getCategoryFallbackImage } from "@/lib/image-utils";

interface ProductGalleryProps {
  images: string | string[];
  activeVariantImage?: string | null;
  productName?: string;
  category?: string;
}

export function ProductGallery({ images, activeVariantImage, productName, category }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Clean image URLs list
  const validImages: string[] = Array.from(new Set((() => {
    let list: string[] = [];
    if (Array.isArray(images)) {
      list = images.map((img) => extractCoverImage(img, productName, category)).filter(Boolean);
    } else if (typeof images === "string" && images.trim()) {
      const extracted = extractCoverImage(images, productName, category);
      if (extracted) list = [extracted];
    }
    return list.length > 0 ? list : [getCategoryFallbackImage(productName, category)];
  })()));

  const activeMediaRaw = activeVariantImage || validImages[currentImageIndex] || getCategoryFallbackImage(productName, category);
  const [activeMedia, setActiveMedia] = useState<string>(activeMediaRaw);

  useEffect(() => {
    setActiveMedia(activeMediaRaw);
  }, [activeMediaRaw]);

  // If active variant has a specific image, ensure it is displayed
  useEffect(() => {
    if (activeVariantImage) {
      const foundIdx = validImages.indexOf(activeVariantImage);
      if (foundIdx !== -1) {
        setCurrentImageIndex(foundIdx);
      }
    }
  }, [activeVariantImage, validImages]);

  const isVideo = activeMedia.endsWith(".mp4") || activeMedia.includes("/video/");

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setIsZoomModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [validImages.length]);

  // Touch Swipe Support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextImage();
    else if (diff < -50) prevImage();
    touchStartX.current = null;
  };

  return (
    <div className="space-y-2.5 sm:space-y-4">
      {/* Main Image / Video Player */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative aspect-square bg-gray-50 border border-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden group shadow-2xs"
      >
        {isVideo ? (
          <video
            src={activeMedia}
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={activeMedia}
            alt={productName || "Product view"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => {
              setActiveMedia(getCategoryFallbackImage(productName, category));
            }}
          />
        )}

        {/* Zoom Button */}
        {!isVideo && (
          <button
            type="button"
            onClick={() => setIsZoomModalOpen(true)}
            className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-emerald-600 hover:text-white text-gray-700 transition-all z-10"
            title="Fullscreen Zoom"
          >
            <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        )}

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:bg-emerald-600 hover:text-white text-gray-700 z-10"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:bg-emerald-600 hover:text-white text-gray-700 z-10"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </>
        )}

        {/* Counter Badge */}
        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 bg-black/75 text-white text-[10px] sm:text-xs font-black rounded-full shadow backdrop-blur-sm z-10">
          {currentImageIndex + 1} / {validImages.length}
        </div>
      </div>

      {/* Thumbnail Bar */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {validImages.map((imgUrl, index) => {
            const isThumbVideo = imgUrl.endsWith(".mp4") || imgUrl.includes("/video/");
            const isSelected = currentImageIndex === index && !activeVariantImage;

            return (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentImageIndex(index)}
                className={`relative w-12 h-12 sm:w-20 sm:h-20 aspect-square flex-shrink-0 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all bg-gray-100 ${
                  isSelected
                    ? "border-emerald-600 ring-2 ring-emerald-200"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                {isThumbVideo ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                    <Play className="h-4 w-4 fill-white" />
                  </div>
                ) : (
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Zoom Modal */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setIsZoomModalOpen(false)}
            className="absolute top-6 right-6 p-3 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
          >
            <X className="h-6 w-6" />
          </button>

          <img
            src={activeMedia}
            alt="Expanded View"
            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
          />

          {validImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white z-20">
              <button
                type="button"
                onClick={prevImage}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <span className="text-sm font-bold">
                {currentImageIndex + 1} of {validImages.length}
              </span>
              <button
                type="button"
                onClick={nextImage}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

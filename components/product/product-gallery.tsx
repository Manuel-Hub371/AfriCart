"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X, Play, Package } from "lucide-react";

interface ProductGalleryProps {
  images: string | string[];
  activeVariantImage?: string | null;
  productName?: string;
  category?: string;
}

const getFallbackImage = (productName?: string, category?: string): string => {
  const text = `${productName || ""} ${category || ""}`.toLowerCase();
  if (text.includes("phone") || text.includes("smart") || text.includes("mobile") || text.includes("tech") || text.includes("electronic") || text.includes("gadget") || text.includes("laptop") || text.includes("camera")) {
    return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80";
  }
  if (text.includes("fashion") || text.includes("cloth") || text.includes("wear") || text.includes("apparel") || text.includes("shirt") || text.includes("shoe") || text.includes("dress")) {
    return "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80";
  }
  if (text.includes("home") || text.includes("living") || text.includes("chair") || text.includes("furniture") || text.includes("decor") || text.includes("lamp") || text.includes("bed")) {
    return "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80";
  }
  if (text.includes("beauty") || text.includes("care") || text.includes("skin") || text.includes("hair") || text.includes("cosmetic") || text.includes("perfume")) {
    return "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80";
  }
  if (text.includes("food") || text.includes("grocery") || text.includes("drink") || text.includes("snack") || text.includes("beverage")) {
    return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80";
  }
  return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
};

export function ProductGallery({ images, activeVariantImage, productName, category }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Clean image URLs list
  const validImages: string[] = Array.from(new Set((() => {
    let list: string[] = [];
    if (Array.isArray(images)) {
      list = images.flatMap((img) => {
        if (typeof img === "string" && img.startsWith("[") && img.endsWith("]")) {
          try { return JSON.parse(img); } catch { return img; }
        }
        return img;
      });
    } else if (typeof images === "string" && (images as string).trim()) {
      const str = (images as string).trim();
      if (str.startsWith("[") && str.endsWith("]")) {
        try { list = JSON.parse(str); } catch { list = [str]; }
      } else {
        list = [str];
      }
    }
    const filtered = list.filter((img) => typeof img === "string" && img.trim() && !img.includes("example.com") && (img.startsWith("http") || img.startsWith("/") || img.startsWith("data:")));
    return filtered.length > 0 ? filtered : [getFallbackImage(productName, category)];
  })()));

  const activeMediaRaw = activeVariantImage || validImages[currentImageIndex] || getFallbackImage(productName, category);
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
    <div className="space-y-4">
      {/* Main Image / Video Player */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative aspect-square bg-gray-50 border border-gray-200 rounded-3xl overflow-hidden group shadow-sm"
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
              setActiveMedia(getFallbackImage(productName, category));
            }}
          />
        )}

        {/* Zoom Button */}
        {!isVideo && (
          <button
            type="button"
            onClick={() => setIsZoomModalOpen(true)}
            className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-600 hover:text-white text-gray-700 z-10"
            title="Fullscreen Zoom"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
        )}

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-600 hover:text-white text-gray-700 z-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-600 hover:text-white text-gray-700 z-10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Counter Badge */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/75 text-white text-xs font-bold rounded-full shadow backdrop-blur-sm z-10">
          {currentImageIndex + 1} / {validImages.length}
        </div>
      </div>

      {/* Thumbnail Bar */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
          {validImages.map((imgUrl, index) => {
            const isThumbVideo = imgUrl.endsWith(".mp4") || imgUrl.includes("/video/");
            const isSelected = currentImageIndex === index && !activeVariantImage;

            return (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentImageIndex(index)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 aspect-square flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all bg-gray-100 ${
                  isSelected
                    ? "border-emerald-600 ring-2 ring-emerald-200"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                {isThumbVideo ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                    <Play className="h-5 w-5 fill-white" />
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

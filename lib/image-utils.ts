/**
 * Safely extracts the primary cover image URL from any product image field format
 * (Array of URLs, single URL, JSON-encoded array string, or comma-separated string).
 */
export function extractCoverImage(
  image: string | string[] | null | undefined,
  productName?: string,
  categoryOrBrand?: string
): string {
  if (!image) return "";

  let url = "";

  if (Array.isArray(image)) {
    for (const item of image) {
      if (typeof item === "string" && item.trim()) {
        const trimmed = item.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
              url = parsed[0].trim();
              break;
            }
          } catch {
            url = trimmed;
            break;
          }
        } else {
          url = trimmed;
          break;
        }
      }
    }
  } else if (typeof image === "string" && image.trim()) {
    const str = image.trim();
    if (str.startsWith("[") && str.endsWith("]")) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
          url = parsed[0].trim();
        }
      } catch {
        url = str;
      }
    } else if (str.includes(",")) {
      url = str.split(",")[0].trim();
    } else {
      url = str;
    }
  }

  if (!url) return "";

  // Strip wrapping quotes
  url = url.replace(/^['"]+|['"]+$/g, "").trim();

  // Normalize relative image paths missing a leading slash
  if (
    !url.startsWith("http://") &&
    !url.startsWith("https://") &&
    !url.startsWith("/") &&
    !url.startsWith("data:") &&
    !url.startsWith("blob:")
  ) {
    url = `/${url}`;
  }

  // Reject dummy placeholder domain strings
  if (url.includes("example.com") || url.includes("placeholder.com")) {
    return "";
  }

  return url;
}

/**
 * Returns a category-aware Unsplash fallback image URL if an uploaded image is unavailable or fails to load.
 */
export function getCategoryFallbackImage(productName?: string, categoryOrBrand?: string): string {
  const text = `${productName || ""} ${categoryOrBrand || ""}`.toLowerCase();
  if (
    text.includes("phone") ||
    text.includes("smart") ||
    text.includes("mobile") ||
    text.includes("tech") ||
    text.includes("electronic") ||
    text.includes("gadget") ||
    text.includes("laptop") ||
    text.includes("camera")
  ) {
    return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80";
  }
  if (
    text.includes("fashion") ||
    text.includes("cloth") ||
    text.includes("wear") ||
    text.includes("apparel") ||
    text.includes("shirt") ||
    text.includes("shoe") ||
    text.includes("dress")
  ) {
    return "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80";
  }
  if (
    text.includes("home") ||
    text.includes("living") ||
    text.includes("chair") ||
    text.includes("furniture") ||
    text.includes("decor") ||
    text.includes("lamp") ||
    text.includes("bed")
  ) {
    return "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80";
  }
  if (
    text.includes("beauty") ||
    text.includes("care") ||
    text.includes("skin") ||
    text.includes("hair") ||
    text.includes("cosmetic") ||
    text.includes("perfume")
  ) {
    return "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80";
  }
  if (
    text.includes("food") ||
    text.includes("grocery") ||
    text.includes("drink") ||
    text.includes("snack") ||
    text.includes("beverage")
  ) {
    return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80";
  }
  return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
}

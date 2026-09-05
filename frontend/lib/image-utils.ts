/**
 * Safely extracts the primary cover image URL from any product image field format
 * (Array of URLs, Array of image objects, single URL string, JSON string, or object).
 */
export function extractCoverImage(
  image: any,
  productName?: string,
  categoryOrBrand?: string
): string {
  if (!image) return "";

  const parseItem = (item: any): string => {
    if (!item) return "";
    if (typeof item === "string") {
      const trimmed = item.trim();
      if (!trimmed) return "";

      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parseItem(parsed[0]);
          }
        } catch {
          return trimmed;
        }
      } else if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        try {
          const parsed = JSON.parse(trimmed);
          return parseItem(parsed);
        } catch {
          return trimmed;
        }
      }
      return trimmed;
    }

    if (typeof item === "object") {
      return (
        item.url ||
        item.src ||
        item.path ||
        item.link ||
        item.secure_url ||
        item.image ||
        ""
      );
    }

    return "";
  };

  let url = "";

  if (Array.isArray(image)) {
    for (const item of image) {
      const candidate = parseItem(item);
      if (candidate) {
        url = candidate;
        break;
      }
    }
  } else {
    url = parseItem(image);
  }

  if (!url) return "";

  // Strip wrapping quotes
  url = url.replace(/^['"]+|['"]+$/g, "").trim();

  // If comma separated and NOT a base64 data URI, extract first item
  if (url.includes(",") && !url.startsWith("data:")) {
    url = url.split(",")[0].trim();
  }

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
 * Normalizes any image input (Array of URLs, Array of image objects, single URL string, JSON string, or object)
 * into a clean array of valid image URL strings.
 */
export function normalizeImages(imageInput: any): string[] {
  if (!imageInput) return [];

  const parseItem = (item: any): string => {
    if (!item) return "";
    if (typeof item === "string") {
      const trimmed = item.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parseItem(parsed[0]);
          }
        } catch {
          return trimmed;
        }
      } else if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        try {
          const parsed = JSON.parse(trimmed);
          return parseItem(parsed);
        } catch {
          return trimmed;
        }
      }
      return trimmed;
    }

    if (typeof item === "object") {
      return (
        item.url ||
        item.src ||
        item.path ||
        item.link ||
        item.secure_url ||
        item.image ||
        ""
      );
    }

    return "";
  };

  let list: string[] = [];

  if (Array.isArray(imageInput)) {
    for (const item of imageInput) {
      const candidate = parseItem(item);
      if (candidate) list.push(candidate);
    }
  } else if (typeof imageInput === "string" && imageInput.trim()) {
    const str = imageInput.trim();
    if (str.startsWith("[") && str.endsWith("]")) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            const candidate = parseItem(item);
            if (candidate) list.push(candidate);
          }
        }
      } catch {
        list.push(str);
      }
    } else if (str.includes(",") && !str.startsWith("data:")) {
      list = str.split(",").map((s) => s.trim()).filter(Boolean);
    } else {
      list.push(str);
    }
  } else if (typeof imageInput === "object") {
    const candidate = parseItem(imageInput);
    if (candidate) list.push(candidate);
  }

  return list
    .map((url) => {
      url = url.replace(/^['"]+|['"]+$/g, "").trim();
      if (
        !url.startsWith("http://") &&
        !url.startsWith("https://") &&
        !url.startsWith("/") &&
        !url.startsWith("data:") &&
        !url.startsWith("blob:")
      ) {
        url = `/${url}`;
      }
      if (url.includes("example.com") || url.includes("placeholder.com")) {
        return "";
      }
      return url;
    })
    .filter(Boolean);
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

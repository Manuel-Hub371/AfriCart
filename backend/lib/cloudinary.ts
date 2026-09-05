// Env-gated Cloudinary media upload.
//
// Active only when ALL of CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and
// CLOUDINARY_API_SECRET are set. Otherwise isCloudinaryConfigured() returns false
// and callers fall back to the existing base64/PostgreSQL storage.
//
// Uses Cloudinary's REST upload API over fetch to avoid a heavyweight SDK dependency.
// The request is signed with the API secret (HMAC-SHA1). No secrets are exposed to
// the browser — this module is server-side only.

import { createHmac } from "crypto";

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
  );
}

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
}

function signRequest(params: Record<string, string>, apiSecret: string): string {
  const canonical = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHmac("sha1", apiSecret).update(canonical).digest("hex");
}

/**
 * Upload a raw buffer to Cloudinary. Returns the secure URL.
 * @throws if Cloudinary is not configured or the upload fails.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  mimeType: string,
  folder = "africart",
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
  const apiKey = process.env.CLOUDINARY_API_KEY || "";
  const apiSecret = process.env.CLOUDINARY_API_SECRET || "";

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured");
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const paramsToSign: Record<string, string> = { timestamp };
  if (folder) paramsToSign.folder = folder;

  const signature = signRequest(paramsToSign, apiSecret);

  const dataUrl = `data:${mimeType || "application/octet-stream"};base64,${buffer.toString("base64")}`;

  const form = new FormData();
  form.append("file", dataUrl);
  form.append("timestamp", timestamp);
  form.append("api_key", apiKey);
  form.append("signature", signature);
  if (folder) form.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: form,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }

  return {
    secureUrl: data?.secure_url,
    publicId: data?.public_id,
  };
}

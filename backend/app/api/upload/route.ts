import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { isCloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";
import { logger } from "@/lib/logger";

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WEBP, GIF, SVG, and PDF are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50 MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Production must never fall back to Base64-in-PostgreSQL storage.
    if (isCloudinaryConfigured()) {
      try {
        const result = await uploadToCloudinary(buffer, file.type);
        logger.info("Uploaded file to Cloudinary", { publicId: result.publicId, size: buffer.length });
        return NextResponse.json({ url: result.secureUrl }, { status: 201 });
      } catch (cloudErr: any) {
        // No silent fallback in production — surface the failure.
        logger.error("Cloudinary upload failed; rejecting instead of falling back to base64", {
          error: cloudErr?.message,
        });
        return NextResponse.json(
          { error: "Media upload failed. Please try again." },
          { status: 500 }
        );
      }
    }

    if (IS_PRODUCTION) {
      logger.error("Media upload attempted in production but Cloudinary is not configured", {
        mimeType: file.type,
      });
      return NextResponse.json(
        { error: "Media uploads are disabled because Cloudinary is not configured on this server." },
        { status: 503 }
      );
    }

    // Development-only fallback: durable base64 Data-URI storage in PostgreSQL
    // so local uploads keep working without Cloudinary credentials.
    const mimeType = file.type || "image/png";
    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

    try {
      let ext = mimeType.split("/")[1] || "png";
      if (ext === "jpeg") ext = "jpg";
      const timestamp = Date.now();
      const random = Math.random().toString(36).slice(2, 8);
      const filename = `${timestamp}-${random}.${ext}`;
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }
      await writeFile(path.join(uploadsDir, filename), buffer);
    } catch (fsErr) {
      logger.warn("Local disk write skipped (dev only)", {
        error: fsErr instanceof Error ? fsErr.message : String(fsErr),
      });
    }

    return NextResponse.json({ url: dataUri }, { status: 201 });
  } catch (error: any) {
    logger.error("Upload API error", { error: error?.message });
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
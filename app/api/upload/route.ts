import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
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

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WEBP, GIF, SVG, and PDF are allowed." },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10 MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert file to persistent Data URI for database storage
    // Data URIs are stored inside PostgreSQL and survive all Render server redeploys and restarts.
    const mimeType = file.type || "image/png";
    const base64 = buffer.toString("base64");
    const dataUri = `data:${mimeType};base64,${base64}`;

    // Optionally write to local disk as fallback if disk is writable
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
      // Ephemeral disk on Render might be read-only or reset; ignore local write error
      console.warn("Local disk write skipped in cloud environment:", fsErr);
    }

    return NextResponse.json({ url: dataUri }, { status: 201 });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}

import { useState } from "react";
import { apiFetch, parseApiResponse, describeBadApiResponse } from "@/lib/api/client";

interface UploadResult {
  url: string;
}

interface UseUploadReturn {
  uploading: boolean;
  error: string | null;
  uploadFile: (file: File) => Promise<string | null>;
}

export function useUpload(): UseUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await apiFetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await parseApiResponse<any>(res);

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Upload failed");
      }

      if (data === null) {
        throw new Error(describeBadApiResponse("/api/upload", res));
      }

      return (data as UploadResult).url;
    } catch (err: any) {
      setError(err.message || "Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploading, error, uploadFile };
}

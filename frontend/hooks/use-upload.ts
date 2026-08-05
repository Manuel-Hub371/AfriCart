import { useState } from "react";

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

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
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

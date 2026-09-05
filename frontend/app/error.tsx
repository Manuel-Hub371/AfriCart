"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Something went wrong!</h2>
      <p className="text-sm text-gray-600 max-w-md mb-6">
        An unexpected error occurred while processing your request. Please try refreshing the page.
      </p>
      <Button
        onClick={() => reset()}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-2 h-11 px-6"
      >
        <RefreshCw className="h-4 w-4" /> Try Again
      </Button>
    </div>
  );
}

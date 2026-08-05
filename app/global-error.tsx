"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center font-sans">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600 text-2xl font-bold">
          ⚠️
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Error</h1>
        <p className="text-sm text-gray-600 max-w-md mb-6">
          A critical error occurred. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="bg-emerald-600 text-white font-bold rounded-xl px-6 py-2.5 text-sm"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}

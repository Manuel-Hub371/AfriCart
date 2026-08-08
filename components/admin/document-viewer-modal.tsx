"use client";

import { useState } from "react";
import { X, Download, FileText, ExternalLink, ShieldCheck, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  documentUrl: string | null;
  vendorName?: string;
}

export function DocumentViewerModal({
  isOpen,
  onClose,
  title,
  documentUrl,
  vendorName = "Vendor",
}: DocumentViewerModalProps) {
  const [zoom, setZoom] = useState(1);

  if (!isOpen) return null;

  const isImage =
    documentUrl &&
    (documentUrl.startsWith("data:image/") ||
      documentUrl.endsWith(".jpg") ||
      documentUrl.endsWith(".jpeg") ||
      documentUrl.endsWith(".png") ||
      documentUrl.endsWith(".webp"));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
                {title}
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Document Review
                </span>
              </h3>
              <p className="text-xs text-slate-400">Submitted by {vendorName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isImage && (
              <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1 mr-2">
                <button
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-700"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-1.5 text-slate-300">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-700"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            )}

            {documentUrl && (
              <a
                href={documentUrl}
                target="_blank"
                rel="noreferrer"
                download={`verification-doc-${title.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-3 py-2 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" /> Download / Open
              </a>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 p-6 overflow-auto bg-slate-950/60 flex items-center justify-center min-h-[400px]">
          {documentUrl ? (
            isImage ? (
              <div className="overflow-auto max-h-full max-w-full flex items-center justify-center p-4">
                <img
                  src={documentUrl}
                  alt={title}
                  style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
                  className="max-h-[65vh] object-contain rounded-xl border border-slate-800 shadow-xl transition-transform duration-200"
                />
              </div>
            ) : (
              <iframe
                src={documentUrl}
                title={title}
                className="w-full h-[60vh] rounded-xl border border-slate-800 bg-white"
              />
            )
          ) : (
            <div className="text-center p-12 text-slate-500 space-y-3">
              <FileText className="w-12 h-12 mx-auto opacity-40 text-slate-400" />
              <p className="text-sm font-semibold text-slate-400">No document was uploaded for this field.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold px-5"
          >
            Close Viewer
          </Button>
        </div>
      </div>
    </div>
  );
}

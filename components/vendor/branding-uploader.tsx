"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { useUpload } from "@/lib/hooks/use-upload";

interface ImageUploadProps {
  label: string;
  description: string;
  recommendedSize: string;
  aspectRatio: string;
  currentImage?: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
}

function ImageUpload({
  label,
  description,
  recommendedSize,
  aspectRatio,
  currentImage,
  onUpload,
  onRemove,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploading } = useUpload();

  const handleFile = async (file: File) => {
    setLocalError(null);
    const url = await uploadFile(file);
    if (url) {
      onUpload(url);
    } else {
      setLocalError("Upload failed. Please try again.");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const inputId = `upload-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <p className="text-xs text-gray-500 mb-3">{description}</p>

      {localError && (
        <div className="flex items-center gap-2 p-2 mb-2 rounded bg-red-50 text-red-700 text-xs border border-red-200">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          {localError}
        </div>
      )}

      {currentImage ? (
        <div className="relative group">
          <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={currentImage}
              alt={label}
              className="w-full h-48 object-cover"
            />
            {/* Uploading overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
              </div>
            )}
            {/* Hover actions */}
            {!uploading && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <label htmlFor={`${inputId}-replace`}>
                  <input
                    id={`${inputId}-replace`}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="sr-only"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="bg-white hover:bg-gray-100"
                    onClick={() =>
                      document.getElementById(`${inputId}-replace`)?.click()
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Replace
                  </Button>
                </label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="bg-white hover:bg-red-50 text-red-600"
                  onClick={onRemove}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Recommended: {recommendedSize}</span>
            <span>Ratio: {aspectRatio}</span>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
            isDragging
              ? "border-emerald-500 bg-emerald-50"
              : uploading
              ? "border-gray-300 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 hover:border-emerald-400 hover:bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="sr-only"
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <>
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Drag and drop or{" "}
                <span className="text-emerald-600 hover:text-emerald-700">
                  browse
                </span>
              </p>
              <p className="text-xs text-gray-500 mb-4">
                PNG, JPG, WEBP up to 10 MB
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <span>Size: {recommendedSize}</span>
                <span>•</span>
                <span>Ratio: {aspectRatio}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface BrandingUploaderProps {
  onSave?: (data: any) => void;
  initialData?: any;
  initialLogo?: string;
  initialBanner?: string;
}

export function BrandingUploader({ onSave, initialData, initialLogo = "", initialBanner = "" }: BrandingUploaderProps) {
  const [logo, setLogo] = useState<string>(initialData?.logo || initialLogo);
  const [banner, setBanner] = useState<string>(initialData?.banner || initialBanner);
  const [coverImage, setCoverImage] = useState<string>("");
  const [storeIcon, setStoreIcon] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      if (onSave) {
        await onSave({ logo, banner, coverImage, storeIcon });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Branding</h2>
        <p className="text-gray-600">
          Customize your store&apos;s visual identity and appearance
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm font-medium">
          ✓ Branding images saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Logo */}
        <ImageUpload
          label="Store Logo"
          description="Your primary logo displayed on your store and products"
          recommendedSize="400×400px"
          aspectRatio="1:1"
          currentImage={logo}
          onUpload={setLogo}
          onRemove={() => setLogo("")}
        />

        {/* Store Icon */}
        <ImageUpload
          label="Store Icon"
          description="Small icon for browser tabs and mobile apps"
          recommendedSize="64×64px"
          aspectRatio="1:1"
          currentImage={storeIcon}
          onUpload={setStoreIcon}
          onRemove={() => setStoreIcon("")}
        />
      </div>

      {/* Store Banner */}
      <ImageUpload
        label="Store Banner"
        description="Large banner displayed at the top of your store page"
        recommendedSize="1200×400px"
        aspectRatio="3:1"
        currentImage={banner}
        onUpload={setBanner}
        onRemove={() => setBanner("")}
      />

      {/* Cover Image */}
      <ImageUpload
        label="Cover Image"
        description="Background image for your store profile"
        recommendedSize="1920×600px"
        aspectRatio="16:5"
        currentImage={coverImage}
        onUpload={setCoverImage}
        onRemove={() => setCoverImage("")}
      />

      {/* Store Preview */}
      <div className="p-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
        <p className="text-sm font-medium text-gray-700 mb-4">Store Preview</p>
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-emerald-100 to-emerald-200 relative">
            {banner && (
              <img
                src={banner}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Logo + Info */}
          <div className="p-6 flex items-start gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-white shadow-lg -mt-10 relative bg-gray-100 flex items-center justify-center">
              {logo ? (
                <img
                  src={logo}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-gray-300" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">Your Store</h3>
              <p className="text-sm text-gray-600 mt-1">Your store tagline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      {onSave && (
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Save Branding
          </Button>
        </div>
      )}
    </div>
  );
}

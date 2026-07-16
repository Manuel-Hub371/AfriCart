"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  label: string;
  description: string;
  recommendedSize: string;
  aspectRatio: string;
  currentImage?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

function ImageUpload({ 
  label, 
  description, 
  recommendedSize, 
  aspectRatio, 
  currentImage,
  onUpload,
  onRemove 
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <p className="text-xs text-gray-500 mb-3">{description}</p>
      
      {currentImage ? (
        <div className="relative group">
          <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
            <img 
              src={currentImage} 
              alt={label}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <label>
                <input
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
                  onClick={() => document.querySelector('input[type="file"]')?.click()}
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
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragging 
              ? "border-emerald-500 bg-emerald-50" 
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="sr-only"
            id={`upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          />
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm font-medium text-gray-900 mb-1">
            Drag and drop or{" "}
            <label 
              htmlFor={`upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
              className="text-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              browse
            </label>
          </p>
          <p className="text-xs text-gray-500 mb-4">
            PNG, JPG up to 5MB
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>Size: {recommendedSize}</span>
            <span>•</span>
            <span>Ratio: {aspectRatio}</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface BrandingUploaderProps {
  onSave: (data: any) => void;
}

export function BrandingUploader({ onSave }: BrandingUploaderProps) {
  const [logo, setLogo] = useState<string>("https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=400&fit=crop");
  const [banner, setBanner] = useState<string>("https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=400&fit=crop");
  const [coverImage, setCoverImage] = useState<string>("");
  const [storeIcon, setStoreIcon] = useState<string>("");

  const handleUpload = (type: string, file: File) => {
    // In real app, upload to server and get URL
    const url = URL.createObjectURL(file);
    switch(type) {
      case "logo": setLogo(url); break;
      case "banner": setBanner(url); break;
      case "cover": setCoverImage(url); break;
      case "icon": setStoreIcon(url); break;
    }
  };

  const handleRemove = (type: string) => {
    switch(type) {
      case "logo": setLogo(""); break;
      case "banner": setBanner(""); break;
      case "cover": setCoverImage(""); break;
      case "icon": setStoreIcon(""); break;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Branding</h2>
        <p className="text-gray-600">Customize your store's visual identity and appearance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Logo */}
        <ImageUpload
          label="Store Logo"
          description="Your primary logo displayed on your store and products"
          recommendedSize="400x400px"
          aspectRatio="1:1"
          currentImage={logo}
          onUpload={(file) => handleUpload("logo", file)}
          onRemove={() => handleRemove("logo")}
        />

        {/* Store Icon */}
        <ImageUpload
          label="Store Icon"
          description="Small icon for browser tabs and mobile apps"
          recommendedSize="64x64px"
          aspectRatio="1:1"
          currentImage={storeIcon}
          onUpload={(file) => handleUpload("icon", file)}
          onRemove={() => handleRemove("icon")}
        />
      </div>

      {/* Store Banner */}
      <ImageUpload
        label="Store Banner"
        description="Large banner displayed at the top of your store page"
        recommendedSize="1200x400px"
        aspectRatio="3:1"
        currentImage={banner}
        onUpload={(file) => handleUpload("banner", file)}
        onRemove={() => handleRemove("banner")}
      />

      {/* Cover Image */}
      <ImageUpload
        label="Cover Image"
        description="Background image for your store profile"
        recommendedSize="1920x600px"
        aspectRatio="16:5"
        currentImage={coverImage}
        onUpload={(file) => handleUpload("cover", file)}
        onRemove={() => handleRemove("cover")}
      />

      {/* Preview */}
      <div className="p-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
        <p className="text-sm font-medium text-gray-700 mb-4">Store Preview</p>
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          {/* Banner */}
          {banner && (
            <div className="h-32 bg-gray-200 relative">
              <img src={banner} alt="Banner" className="w-full h-full object-cover" />
            </div>
          )}
          
          {/* Logo and Info */}
          <div className="p-6 flex items-start gap-4">
            {logo && (
              <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-white shadow-lg -mt-10 relative">
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">AfriCart Electronics</h3>
              <p className="text-sm text-gray-600 mt-1">Premium electronics and gadgets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

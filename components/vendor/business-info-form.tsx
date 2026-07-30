"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface BusinessInfoFormProps {
  onSave: (data: any) => void;
  initialData?: any;
}

export function BusinessInfoForm({ onSave, initialData }: BusinessInfoFormProps) {
  const [address, setAddress] = useState(initialData?.address || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [region, setRegion] = useState(initialData?.region || "");
  const [country, setCountry] = useState(initialData?.country || "Ghana");
  const [postalCode, setPostalCode] = useState(initialData?.postalCode || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setAddress(initialData.address || "");
      setCity(initialData.city || "");
      setRegion(initialData.region || "");
      setCountry(initialData.country || "Ghana");
      setPostalCode(initialData.postalCode || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave({
      address,
      city,
      region,
      country,
      postalCode,
    });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Business & Location</h2>
          <p className="text-gray-600 text-sm">Provide your physical business location and address details</p>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 h-11 rounded-xl"
        >
          {isSubmitting ? "Saving..." : "Save Business Info"}
        </Button>
      </div>

      {/* Street Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          placeholder="e.g., 12 Oxford Street, Osu"
        />
      </div>

      {/* City & Region */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="e.g., Accra"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Region / State</label>
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="e.g., Greater Accra Region"
          />
        </div>
      </div>

      {/* Country & Postal Code */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="e.g., Ghana"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Postal / Zip Code</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            placeholder="e.g., GA-183-9020"
          />
        </div>
      </div>
    </form>
  );
}

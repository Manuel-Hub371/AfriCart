"use client";

import { useState } from "react";
import { Mail, Phone, Facebook, Instagram, Twitter, Globe } from "lucide-react";

interface ContactInfoFormProps {
  onSave: (data: any) => void;
}

export function ContactInfoForm({ onSave }: ContactInfoFormProps) {
  const [businessEmail, setBusinessEmail] = useState("contact@africart.com");
  const [businessPhone, setBusinessPhone] = useState("+233 24 123 4567");
  const [supportEmail, setSupportEmail] = useState("support@africart.com");
  const [supportPhone, setSupportPhone] = useState("+233 24 765 4321");
  const [displayAddress, setDisplayAddress] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
        <p className="text-gray-600">Manage how customers can reach you</p>
      </div>

      {/* Business Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="business@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Phone <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="+233 XX XXX XXXX"
            />
          </div>
        </div>
      </div>

      {/* Customer Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Support Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="support@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Support Phone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="+233 XX XXX XXXX"
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Social Media Links
        </label>
        <div className="space-y-3">
          {[
            { icon: Facebook, label: "Facebook", placeholder: "https://facebook.com/yourstore" },
            { icon: Instagram, label: "Instagram", placeholder: "https://instagram.com/yourstore" },
            { icon: Twitter, label: "X / Twitter", placeholder: "https://twitter.com/yourstore" },
            { icon: Globe, label: "Website", placeholder: "https://yourwebsite.com" },
          ].map((social) => {
            const Icon = social.icon;
            return (
              <div key={social.label} className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder={social.placeholder}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Business Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Business Address
        </label>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Country"
                defaultValue="Ghana"
              />
            </div>
            <div>
              <input
                type="text"
                className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Region / State"
                defaultValue="Greater Accra"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="City"
                defaultValue="Accra"
              />
            </div>
            <div>
              <input
                type="text"
                className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Postal Code"
                defaultValue="00233"
              />
            </div>
          </div>

          <div>
            <input
              type="text"
              className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Street Address"
              defaultValue="123 Independence Avenue"
            />
          </div>
        </div>
      </div>

      {/* Address Visibility */}
      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={displayAddress}
            onChange={(e) => setDisplayAddress(e.target.checked)}
            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Display Address Publicly</p>
            <p className="text-xs text-gray-600">
              Show your business address on your store page
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}

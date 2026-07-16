"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";

interface BusinessInfoFormProps {
  onSave: (data: any) => void;
}

export function BusinessInfoForm({ onSave }: BusinessInfoFormProps) {
  const [businessName, setBusinessName] = useState("AfriCart Electronics Ltd.");
  const [businessType, setBusinessType] = useState("registered");
  const [registrationNumber, setRegistrationNumber] = useState("GH-2024-12345");
  const [taxId, setTaxId] = useState("TIN-987654321");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Information</h2>
        <p className="text-gray-600">Provide your legal business details and documentation</p>
      </div>

      {/* Business Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Enter your legal business name"
        />
      </div>

      {/* Business Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Business Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { value: "individual", label: "Individual Seller", desc: "Sole proprietor" },
            { value: "registered", label: "Registered Business", desc: "LLC, Partnership" },
            { value: "company", label: "Company", desc: "Corporation" },
          ].map((type) => (
            <label
              key={type.value}
              className={`flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all ${
                businessType === type.value
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="businessType"
                value={type.value}
                checked={businessType === type.value}
                onChange={(e) => setBusinessType(e.target.value)}
                className="sr-only"
              />
              <span className="text-sm font-medium text-gray-900 mb-1">{type.label}</span>
              <span className="text-xs text-gray-600">{type.desc}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Registration Number */}
      {businessType !== "individual" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Registration Number
          </label>
          <input
            type="text"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g., GH-2024-12345"
          />
        </div>
      )}

      {/* Tax ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tax Identification Number (TIN)
        </label>
        <input
          type="text"
          value={taxId}
          onChange={(e) => setTaxId(e.target.value)}
          className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="e.g., TIN-987654321"
        />
        <p className="text-xs text-gray-500 mt-1">Required for tax reporting purposes</p>
      </div>

      {/* Document Upload */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Business Documents
          </label>
          
          {/* Business Certificate */}
          <div className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Business Certificate</p>
                  <p className="text-xs text-gray-500">business_cert.pdf (2.4 MB)</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Replace
              </Button>
            </div>
          </div>

          {/* Verification Documents */}
          <div className="mt-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
            <div className="text-center">
              <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Upload Verification Document
              </p>
              <p className="text-xs text-gray-500 mb-3">
                ID Card, Passport, or Driver's License
              </p>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Status */}
      <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-yellow-600 mt-2"></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-900 mb-1">Verification Pending</p>
            <p className="text-xs text-yellow-700">
              Your business documents are under review. This typically takes 1-2 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

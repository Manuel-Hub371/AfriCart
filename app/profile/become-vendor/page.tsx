"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import { useAuth } from "@/lib/auth/context";
import { useUpload } from "@/lib/hooks/use-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, Image as ImageIcon, X } from "lucide-react";
import { OFFICIAL_STORE_CATEGORIES } from "@/lib/constants/store-categories";
import { OFFICIAL_BUSINESS_TYPES } from "@/lib/constants/business-types";

export default function BecomeVendorPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { upgradeToVendor } = useAuth();
  const { uploadFile } = useUpload();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storeLogoUrl, setStoreLogoUrl] = useState<string>("");
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [formData, setFormData] = useState({
    storeName: "",
    storeDescription: "",
    storeCategory: "",
    businessType: "individual",
    businessName: "",
    registrationNumber: "",
    taxId: "",
    country: "",
    region: "",
    city: "",
    streetAddress: "",
    postalCode: "",
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingLogo(true);
      const url = await uploadFile(file);
      if (url) setStoreLogoUrl(url);
    } catch (err) {
      console.error("Failed to upload store logo:", err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await upgradeToVendor({
        ...formData,
        storeLogo: storeLogoUrl || undefined,
      });
      // Context handles redirection to /vendor
    } catch (err: any) {
      setError(err.message || "Failed to upgrade account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Become a Vendor
              </h1>
              <p className="text-gray-600">
                Upgrade your account to start selling on AfriCart
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="bg-white rounded-lg border p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Store Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Store Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Store Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.storeName}
                        onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Store Categories <span className="text-red-500">*</span>
                        </label>
                        <span className="text-xs text-green-700 font-bold bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                          You can select multiple categories
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">
                        Select all categories that describe your business:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                        {OFFICIAL_STORE_CATEGORIES.map((cat) => {
                          const isSelected = (formData.storeCategory || "").split(",").includes(cat.slug);
                          const toggle = () => {
                            const current = (formData.storeCategory || "").split(",").filter(Boolean);
                            let updated: string[];
                            if (current.includes(cat.slug)) {
                              updated = current.filter((s) => s !== cat.slug);
                            } else {
                              updated = [...current, cat.slug];
                            }
                            setFormData({ ...formData, storeCategory: updated.join(",") });
                          };
                          return (
                            <button
                              key={cat.slug}
                              type="button"
                              onClick={toggle}
                              className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-all ${
                                isSelected
                                  ? "bg-green-50 border-green-500 text-green-900 font-medium ring-1 ring-green-500/20"
                                  : "bg-white border-gray-200 text-gray-700 hover:border-green-300"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer pointer-events-none"
                              />
                              <div>
                                <p className="text-xs font-bold leading-tight">{cat.name}</p>
                                <p className="text-[10px] text-gray-500 line-clamp-1">{cat.description}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Store Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.storeDescription}
                        onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                        required
                        className="w-full h-24 px-4 py-3 rounded-md border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 resize-none"
                      />
                    </div>

                    {/* Store Logo */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Store Logo
                      </label>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-emerald-500 transition-colors">
                        {uploadingLogo ? (
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 py-2">
                            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                            <span>Uploading store logo...</span>
                          </div>
                        ) : storeLogoUrl ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={storeLogoUrl} alt="Store Logo" className="w-12 h-12 rounded-lg object-cover border" />
                              <span className="text-xs text-emerald-600 font-semibold">✓ Store logo uploaded</span>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => setStoreLogoUrl("")} className="text-red-600 hover:bg-red-50">
                              <X className="h-4 w-4 mr-1" /> Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-left">
                              <ImageIcon className="h-8 w-8 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Upload Store Logo</p>
                                <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                              </div>
                            </div>
                            <label htmlFor="become-vendor-logo">
                              <input
                                id="become-vendor-logo"
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="sr-only"
                              />
                              <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("become-vendor-logo")?.click()}>
                                <Upload className="h-4 w-4 mr-2" /> Upload
                              </Button>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Business Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Business Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        required
                        className="w-full h-11 px-4 rounded-md border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      >
                        {OFFICIAL_BUSINESS_TYPES.map((bt) => (
                          <option key={bt.value} value={bt.value}>
                            {bt.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Business/Legal Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>
                    {formData.businessType === "company" && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Registration Number
                          </label>
                          <Input
                            type="text"
                            value={formData.registrationNumber}
                            onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                            className="h-11"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tax ID
                          </label>
                          <Input
                            type="text"
                            value={formData.taxId}
                            onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                            className="h-11"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Business Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        required
                        className="w-full h-11 px-4 rounded-md border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      >
                        <option value="">Select country</option>
                        <option value="ghana">Ghana</option>
                        <option value="nigeria">Nigeria</option>
                        <option value="kenya">Kenya</option>
                        <option value="south-africa">South Africa</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Region/State <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <Input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="h-11"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.streetAddress}
                        onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="gradient-primary text-white h-12 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    {isLoading ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

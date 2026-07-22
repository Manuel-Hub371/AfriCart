"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BecomeVendorPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { upgradeToVendor } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await upgradeToVendor(formData);
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
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Store Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.storeCategory}
                        onChange={(e) => setFormData({ ...formData, storeCategory: e.target.value })}
                        required
                        className="w-full h-11 px-4 rounded-md border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      >
                        <option value="">Select a category</option>
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="home">Home & Living</option>
                        <option value="beauty">Beauty</option>
                        <option value="other">Other</option>
                      </select>
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
                        <option value="individual">Individual / Sole Proprietor</option>
                        <option value="company">Registered Company</option>
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

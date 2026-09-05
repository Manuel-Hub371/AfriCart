"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/profile/dashboard-sidebar";
import DashboardHeader from "@/components/profile/dashboard-header";
import { useAuth } from "@/lib/auth/context";
import { useUpload } from "@/lib/hooks/use-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Store,
  Building2,
  MapPin,
  FileText,
  CreditCard,
  CheckCircle2,
  Upload,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Check,
  Building,
} from "lucide-react";
import { OFFICIAL_STORE_CATEGORIES } from "@/lib/constants/store-categories";
import { OFFICIAL_BUSINESS_TYPES } from "@/lib/constants/business-types";

const STEPS = [
  { id: 1, title: "Store Profile", icon: Store },
  { id: 2, title: "Business Info", icon: Building2 },
  { id: 3, title: "Location", icon: MapPin },
  { id: 4, title: "Documents", icon: FileText },
  { id: 5, title: "Payout & Review", icon: CreditCard },
];

export default function BecomeVendorPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { upgradeToVendor } = useAuth();
  const { uploadFile } = useUpload();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upload States
  const [storeLogoUrl, setStoreLogoUrl] = useState<string>("");
  const [idDocumentUrl, setIdDocumentUrl] = useState<string>("");
  const [businessCertificateUrl, setBusinessCertificateUrl] = useState<string>("");

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingId, setUploadingId] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);

  const [formData, setFormData] = useState({
    storeName: "",
    storeDescription: "",
    storeCategory: "electronics-gadget",
    businessType: "Indivual",
    businessName: "",
    registrationNumber: "",
    taxId: "",
    country: "Ghana",
    region: "Greater Accra",
    city: "Accra",
    streetAddress: "",
    postalCode: "",
    payoutMethod: "MOBILE_MONEY",
    payoutProvider: "MTN",
    payoutAccountNumber: "",
    payoutAccountName: "",
  });

  const handleFileUpload = async (
    field: "storeLogo" | "idDocument" | "businessCertificate",
    file: File | null
  ) => {
    if (!file) return;

    if (field === "storeLogo") setUploadingLogo(true);
    if (field === "idDocument") setUploadingId(true);
    if (field === "businessCertificate") setUploadingCert(true);

    try {
      const url = await uploadFile(file);
      if (url) {
        if (field === "storeLogo") setStoreLogoUrl(url);
        if (field === "idDocument") setIdDocumentUrl(url);
        if (field === "businessCertificate") setBusinessCertificateUrl(url);
      }
    } catch (err) {
      console.error(`Failed to upload ${field}:`, err);
    } finally {
      if (field === "storeLogo") setUploadingLogo(false);
      if (field === "idDocument") setUploadingId(false);
      if (field === "businessCertificate") setUploadingCert(false);
    }
  };

  const validateStep = (step: number): boolean => {
    setError(null);
    if (step === 1) {
      if (!formData.storeName.trim()) {
        setError("Please enter your store name.");
        return false;
      }
      if (!formData.storeCategory) {
        setError("Please select at least one store category.");
        return false;
      }
    }
    if (step === 2) {
      if (!formData.businessName.trim()) {
        setError("Please enter your registered business or personal trading name.");
        return false;
      }
    }
    if (step === 3) {
      if (!formData.streetAddress.trim() || !formData.city.trim() || !formData.region.trim()) {
        setError("Please fill out your street address, city, and region.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    setError(null);

    try {
      await upgradeToVendor({
        ...formData,
        storeCategorySlugs: formData.storeCategory.split(",").filter(Boolean),
        storeLogo: storeLogoUrl || undefined,
        idDocumentUrl: idDocumentUrl || undefined,
        businessCertificateUrl: businessCertificateUrl || undefined,
      });
    } catch (err: any) {
      setError(err.message || "Failed to upgrade account to vendor. Please check details and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-4xl mx-auto w-full space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
            <h1 className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Become an AfriCart Vendor
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Complete the 5-step onboarding wizard to start selling your products across Africa
            </p>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
            <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.id;
                const isActive = currentStep === step.id;

                return (
                  <div key={step.id} className="flex items-center gap-2 flex-1 min-w-[110px]">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-emerald-600 text-white shadow-xs"
                          : isActive
                          ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-600 font-extrabold shadow-xs"
                          : "bg-gray-100 text-gray-400 border border-gray-200"
                      }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <div className="hidden sm:block min-w-0">
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-emerald-700" : isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                        Step {step.id}
                      </p>
                      <p className={`text-xs font-bold line-clamp-1 ${isActive ? "text-emerald-900" : "text-gray-700"}`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-6 shadow-2xs">
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-base font-extrabold text-gray-900">Step 1: Store Information</h2>
                    <p className="text-xs text-gray-500 font-medium">Define your store branding and marketplace category</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Store Name *</label>
                      <Input
                        required
                        value={formData.storeName}
                        onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                        placeholder="e.g. Kente Heritage Crafts"
                        className="h-9 text-xs rounded-xl bg-gray-50 border-gray-200 focus-within:border-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Store Description</label>
                      <textarea
                        value={formData.storeDescription}
                        onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                        placeholder="Describe your products, craftsmanship, and brand mission..."
                        rows={3}
                        className="w-full p-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Select Store Categories *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {OFFICIAL_STORE_CATEGORIES.map((cat) => {
                          const selected = (formData.storeCategory || "").split(",").includes(cat.slug);
                          const toggle = () => {
                            const current = (formData.storeCategory || "").split(",").filter(Boolean);
                            const updated = selected ? current.filter((s) => s !== cat.slug) : [...current, cat.slug];
                            setFormData({ ...formData, storeCategory: updated.join(",") });
                          };

                          return (
                            <button
                              key={cat.slug}
                              type="button"
                              onClick={toggle}
                              className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2 ${
                                selected
                                  ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-1 ring-emerald-500/20"
                                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 font-medium"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${selected ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300"}`}>
                                {selected && <Check className="h-3 w-3 stroke-[3]" />}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold line-clamp-1">{cat.name}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Store Logo (Optional)</label>
                      <div className="flex items-center gap-3">
                        {storeLogoUrl ? (
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200">
                            {/* eslint-disable-next-html-loader */}
                            <img src={storeLogoUrl} alt="Store logo" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                            <Store className="h-5 w-5" />
                          </div>
                        )}
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700">
                          {uploadingLogo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5 text-emerald-600" />}
                          <span>{uploadingLogo ? "Uploading..." : "Upload Logo"}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload("storeLogo", e.target.files?.[0] || null)} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-base font-extrabold text-gray-900">Step 2: Business & Legal Entity</h2>
                    <p className="text-xs text-gray-500 font-medium">Provide legal entity details for merchant verification</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Business Type *</label>
                      <select
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        className="w-full h-9 px-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                      >
                        {OFFICIAL_BUSINESS_TYPES.map((bt) => (
                          <option key={bt.value} value={bt.value}>{bt.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Registered Business Name *</label>
                      <Input
                        required
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="Company or Sole Proprietor Name"
                        className="h-9 text-xs rounded-xl bg-gray-50 border-gray-200 focus-within:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Business Registration Number (RGD)</label>
                      <Input
                        value={formData.registrationNumber}
                        onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                        placeholder="e.g. CS-12345678"
                        className="h-9 text-xs rounded-xl bg-gray-50 border-gray-200 focus-within:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Tax Identification Number (TIN)</label>
                      <Input
                        value={formData.taxId}
                        onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                        placeholder="e.g. C0001234567"
                        className="h-9 text-xs rounded-xl bg-gray-50 border-gray-200 focus-within:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-base font-extrabold text-gray-900">Step 3: Physical Location & Address</h2>
                    <p className="text-xs text-gray-500 font-medium">Where is your primary warehouse or store located?</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Country *</label>
                      <Input
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="Ghana"
                        className="h-9 text-xs rounded-xl bg-gray-50 border-gray-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Region / State *</label>
                      <Input
                        required
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        placeholder="Greater Accra"
                        className="h-9 text-xs rounded-xl bg-gray-50 border-gray-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">City / Town *</label>
                      <Input
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Accra"
                        className="h-9 text-xs rounded-xl bg-gray-50 border-gray-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Postal / GPS Code</label>
                      <Input
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        placeholder="GA-123-4567"
                        className="h-9 text-xs rounded-xl bg-gray-50 border-gray-200"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Street Address *</label>
                      <Input
                        required
                        value={formData.streetAddress}
                        onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                        placeholder="e.g. Oxford Street, Osu, Plot 42"
                        className="h-9 text-xs rounded-xl bg-gray-50 border-gray-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-base font-extrabold text-gray-900">Step 4: Verification Documents</h2>
                    <p className="text-xs text-gray-500 font-medium">Upload identification and business certificate for verification</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-emerald-600" />
                        <h3 className="text-xs font-extrabold text-gray-900">ID Document (Ghana Card / Passport)</h3>
                      </div>
                      <p className="text-[11px] text-gray-500">Upload a clear photo of your National ID card or Passport.</p>

                      <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700">
                        {uploadingId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5 text-emerald-600" />}
                        <span>{uploadingId ? "Uploading..." : idDocumentUrl ? "Replace ID File" : "Choose ID File"}</span>
                        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFileUpload("idDocument", e.target.files?.[0] || null)} />
                      </label>
                      {idDocumentUrl && <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1"><Check className="h-3 w-3" /> ID Document Uploaded</p>}
                    </div>

                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-emerald-600" />
                        <h3 className="text-xs font-extrabold text-gray-900">Business Certificate (Optional)</h3>
                      </div>
                      <p className="text-[11px] text-gray-500">RGD Certificate of Incorporation or Business Name Registration.</p>

                      <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700">
                        {uploadingCert ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5 text-emerald-600" />}
                        <span>{uploadingCert ? "Uploading..." : businessCertificateUrl ? "Replace Certificate" : "Choose Certificate"}</span>
                        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFileUpload("businessCertificate", e.target.files?.[0] || null)} />
                      </label>
                      {businessCertificateUrl && <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1"><Check className="h-3 w-3" /> Certificate Uploaded</p>}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <h2 className="text-base font-extrabold text-gray-900">Step 5: Payout Profile & Final Review</h2>
                    <p className="text-xs text-gray-500 font-medium">Set up where your merchant sales payouts will be transferred</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Payout Method *</label>
                      <select
                        value={formData.payoutMethod}
                        onChange={(e) => setFormData({ ...formData, payoutMethod: e.target.value })}
                        className="w-full h-9 px-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                      >
                        <option value="MOBILE_MONEY">Mobile Money Payout</option>
                        <option value="BANK_TRANSFER">Bank Transfer Payout</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Network Provider / Bank *</label>
                      <select
                        value={formData.payoutProvider}
                        onChange={(e) => setFormData({ ...formData, payoutProvider: e.target.value })}
                        className="w-full h-9 px-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                      >
                        <option value="MTN">MTN Mobile Money</option>
                        <option value="Telecel">Telecel Cash (Vodafone)</option>
                        <option value="AT">AT Money (AirtelTigo)</option>
                        <option value="Ecobank">Ecobank Ghana</option>
                        <option value="GCB">GCB Bank</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Account Holder Name *</label>
                      <Input
                        required
                        value={formData.payoutAccountName}
                        onChange={(e) => setFormData({ ...formData, payoutAccountName: e.target.value })}
                        placeholder="Registered Name on SIM / Account"
                        className="h-9 text-xs rounded-xl bg-gray-50 border-gray-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone Number / Account Number *</label>
                      <Input
                        required
                        value={formData.payoutAccountNumber}
                        onChange={(e) => setFormData({ ...formData, payoutAccountNumber: e.target.value })}
                        placeholder="e.g. 0241234567"
                        className="h-9 text-xs rounded-xl bg-gray-50 border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2 mt-4">
                    <h3 className="text-xs font-extrabold text-emerald-900">Summary Review</h3>
                    <p className="text-xs text-emerald-800 font-medium">
                      Store <span className="font-bold">{formData.storeName}</span> ({formData.businessName}) located in {formData.city}, {formData.region}.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="h-9 px-4 text-xs font-bold gap-1.5 rounded-xl border-gray-200"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="h-9 px-5 text-xs font-bold gap-1.5 rounded-xl gradient-primary text-white"
                  >
                    Next Step <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-9 px-6 text-xs font-bold gap-1.5 rounded-xl gradient-primary text-white shadow-xs"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    <span>{isLoading ? "Submitting Application..." : "Submit Vendor Registration"}</span>
                  </Button>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

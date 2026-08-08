"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthLayout } from "@/components/auth/auth-layout";
import { useAuth } from "@/lib/auth/context";
import { useUpload } from "@/lib/hooks/use-upload";
import { 
  Store, 
  Building2, 
  MapPin, 
  FileText, 
  CreditCard, 
  CheckCircle,
  Upload,
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
  Loader2,
  X
} from "lucide-react";
import { OFFICIAL_STORE_CATEGORIES } from "@/lib/constants/store-categories";
import { OFFICIAL_BUSINESS_TYPES } from "@/lib/constants/business-types";

export default function VendorRegistrationPage() {
  const router = useRouter();
  const { registerVendor } = useAuth();
  const { uploadFile } = useUpload();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vendorRegData, setVendorRegData] = useState<any>(null);

  // Upload States
  const [storeLogoUrl, setStoreLogoUrl] = useState<string>("");
  const [storeBannerUrl, setStoreBannerUrl] = useState<string>("");
  const [idDocumentUrl, setIdDocumentUrl] = useState<string>("");
  const [businessCertificateUrl, setBusinessCertificateUrl] = useState<string>("");

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingId, setUploadingId] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem("vendorRegData");
    if (data) {
      setVendorRegData(JSON.parse(data));
    } else {
      router.push("/auth/register?type=vendor");
    }
  }, [router]);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    storeName: "",
    storeDescription: "",
    storeCategory: "",
    businessType: "",
    businessName: "",
    registrationNumber: "",
    taxId: "",
    businessEmail: "",
    businessPhone: "",
    country: "",
    region: "",
    city: "",
    streetAddress: "",
    postalCode: "",
    payoutMethod: "",
    acceptSellerAgreement: false,
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const totalSteps = 6;

  const handleFileUpload = async (
    field: "storeLogo" | "storeBanner" | "idDocument" | "businessCertificate",
    file: File | null
  ) => {
    if (!file) return;

    // Generate immediate local preview for image fields
    const localPreviewUrl = URL.createObjectURL(file);
    if (field === "storeLogo") {
      setStoreLogoUrl(localPreviewUrl);
      setUploadingLogo(true);
    } else if (field === "storeBanner") {
      setStoreBannerUrl(localPreviewUrl);
      setUploadingBanner(true);
    } else if (field === "idDocument") {
      setUploadingId(true);
    } else if (field === "businessCertificate") {
      setUploadingCert(true);
    }

    try {
      const url = await uploadFile(file);
      if (url) {
        if (field === "storeLogo") setStoreLogoUrl(url);
        if (field === "storeBanner") setStoreBannerUrl(url);
        if (field === "idDocument") setIdDocumentUrl(url);
        if (field === "businessCertificate") setBusinessCertificateUrl(url);
      }
    } catch (err) {
      console.error(`Failed to upload ${field}:`, err);
    } finally {
      if (field === "storeLogo") setUploadingLogo(false);
      if (field === "storeBanner") setUploadingBanner(false);
      if (field === "idDocument") setUploadingId(false);
      if (field === "businessCertificate") setUploadingCert(false);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!vendorRegData) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const categorySlugs = (formData.storeCategory || "electronics-gadget")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await registerVendor({
        firstName: vendorRegData.firstName,
        lastName: vendorRegData.lastName,
        email: vendorRegData.email,
        phone: vendorRegData.phone,
        password: vendorRegData.password || formData.password,
        confirmPassword: vendorRegData.confirmPassword || formData.confirmPassword,
        
        storeName: formData.storeName,
        storeDescription: formData.storeDescription,
        storeCategory: categorySlugs[0] || "electronics-gadget",
        storeCategories: categorySlugs,
        storeCategorySlugs: categorySlugs,
        storeLogo: storeLogoUrl.startsWith("blob:") ? undefined : storeLogoUrl || undefined,
        storeBanner: storeBannerUrl.startsWith("blob:") ? undefined : storeBannerUrl || undefined,

        businessType: formData.businessType,
        businessName: formData.businessName,
        registrationNumber: formData.registrationNumber,
        taxId: formData.taxId,
        businessEmail: formData.businessEmail,
        businessPhone: formData.businessPhone,
        country: formData.country,
        region: formData.region,
        city: formData.city,
        streetAddress: formData.streetAddress,
        postalCode: formData.postalCode,
        idDocumentUrl: idDocumentUrl.startsWith("blob:") ? undefined : idDocumentUrl || undefined,
        businessCertificateUrl: businessCertificateUrl.startsWith("blob:") ? undefined : businessCertificateUrl || undefined,
        payoutMethod: formData.payoutMethod || "MOBILE_MONEY",
        acceptTerms: formData.acceptTerms,
        acceptVendorPolicy: formData.acceptSellerAgreement,
      });
      sessionStorage.removeItem("vendorRegData");
    } catch (err: any) {
      setError(err.message || "Vendor registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Store Info", icon: Store },
    { number: 2, title: "Business", icon: Building2 },
    { number: 3, title: "Contact", icon: MapPin },
    { number: 4, title: "Verification", icon: FileText },
    { number: 5, title: "Payout", icon: CreditCard },
    { number: 6, title: "Review", icon: CheckCircle },
  ];

  return (
    <AuthLayout>
      <div className="max-w-4xl w-full">
        {/* Back Button */}
        <Link 
          href="/auth/register"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              
              return (
                <div key={step.number} className="flex-1 relative">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-green-600 text-white"
                          : isCurrent
                          ? "bg-green-600 text-white shadow-lg"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium ${
                        isCurrent ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-6 left-1/2 w-full h-0.5 -z-10 ${
                        isCompleted ? "bg-green-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold text-gradient">AfriCart</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
              Vendor Registration
            </h1>
            <p className="text-gray-600 text-center">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Step Content */}
          <div className="space-y-6">
            {/* Step 1: Store Information */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Store Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="My Awesome Store"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Store Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Describe your store and products..."
                    value={formData.storeDescription}
                    onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                    className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 resize-none"
                    required
                  />
                </div>

                <div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
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

                {/* Store Logo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Store Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                    {storeLogoUrl ? (
                      <div className="flex flex-col items-center">
                        <div className="relative mb-3">
                          <img
                            src={storeLogoUrl}
                            alt="Store Logo Preview"
                            className="w-24 h-24 object-cover rounded-xl border border-gray-200 shadow-sm"
                          />
                          {uploadingLogo && (
                            <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center">
                              <Loader2 className="h-6 w-6 text-green-600 animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload("storeLogo", e.target.files?.[0] || null)}
                            className="hidden"
                            id="storeLogoInput"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("storeLogoInput")?.click()}
                          >
                            Replace Logo
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setStoreLogoUrl("")}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Click to upload store logo</p>
                        <p className="text-xs text-gray-500 mb-3">PNG, JPG, WEBP up to 10MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload("storeLogo", e.target.files?.[0] || null)}
                          className="hidden"
                          id="storeLogoInput"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("storeLogoInput")?.click()}
                        >
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Store Banner */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Store Banner (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                    {storeBannerUrl ? (
                      <div className="flex flex-col items-center">
                        <div className="relative w-full mb-3">
                          <img
                            src={storeBannerUrl}
                            alt="Store Banner Preview"
                            className="w-full h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                          />
                          {uploadingBanner && (
                            <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center">
                              <Loader2 className="h-6 w-6 text-green-600 animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload("storeBanner", e.target.files?.[0] || null)}
                            className="hidden"
                            id="storeBannerInput"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("storeBannerInput")?.click()}
                          >
                            Replace Banner
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setStoreBannerUrl("")}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Click to upload store banner</p>
                        <p className="text-xs text-gray-500 mb-3">PNG, JPG, WEBP up to 10MB (1200x400 recommended)</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload("storeBanner", e.target.files?.[0] || null)}
                          className="hidden"
                          id="storeBannerInput"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("storeBannerInput")?.click()}
                        >
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Business Information */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    required
                  >
                    <option value="">Select business type</option>
                    {OFFICIAL_BUSINESS_TYPES.map((bt) => (
                      <option key={bt.value} value={bt.value}>
                        {bt.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Legal business name"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Registration Number (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., RC123456"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                  <p className="text-xs text-gray-500 mt-1">Required for registered companies</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tax ID / VAT Number (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="Tax identification number"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Contact Information */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="business@example.com"
                    value={formData.businessEmail}
                    onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Phone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="+233 XX XXX XXXX"
                    value={formData.businessPhone}
                    onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      required
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
                      placeholder="e.g., Greater Accra"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Accra"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Building number, street name"
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., 00233"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Identity Verification */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Note:</span> Upload a clear photo or scan of your identification document. This helps us verify your identity and protect the marketplace.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ID Document <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    National ID, Passport, or Driver&apos;s License
                  </p>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                    {uploadingId ? (
                      <div className="flex flex-col items-center py-4">
                        <Loader2 className="h-8 w-8 text-green-600 animate-spin mb-2" />
                        <p className="text-sm text-gray-600">Uploading document...</p>
                      </div>
                    ) : idDocumentUrl ? (
                      <div className="flex flex-col items-center">
                        <p className="text-sm text-green-600 font-semibold mb-2">✓ Document uploaded successfully</p>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileUpload("idDocument", e.target.files?.[0] || null)}
                          className="hidden"
                          id="idDocumentInput"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("idDocumentInput")?.click()}
                        >
                          Replace Document
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Upload your ID document</p>
                        <p className="text-xs text-gray-500 mb-3">PDF, JPG, PNG up to 10MB</p>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileUpload("idDocument", e.target.files?.[0] || null)}
                          className="hidden"
                          id="idDocumentInput"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("idDocumentInput")?.click()}
                        >
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {formData.businessType === "company" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Registration Certificate <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                      {uploadingCert ? (
                        <div className="flex flex-col items-center py-4">
                          <Loader2 className="h-8 w-8 text-green-600 animate-spin mb-2" />
                          <p className="text-sm text-gray-600">Uploading certificate...</p>
                        </div>
                      ) : businessCertificateUrl ? (
                        <div className="flex flex-col items-center">
                          <p className="text-sm text-green-600 font-semibold mb-2">✓ Certificate uploaded successfully</p>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload("businessCertificate", e.target.files?.[0] || null)}
                            className="hidden"
                            id="businessCertificateInput"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("businessCertificateInput")?.click()}
                          >
                            Replace Certificate
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <FileText className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-1">Upload business certificate</p>
                          <p className="text-xs text-gray-500 mb-3">PDF, JPG, PNG up to 10MB</p>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload("businessCertificate", e.target.files?.[0] || null)}
                            className="hidden"
                            id="businessCertificateInput"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("businessCertificateInput")?.click()}
                          >
                            Choose File
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Payout Preference */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Note:</span> You can configure complete payout details later in your vendor dashboard.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Preferred Payout Method <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: "bank", label: "Bank Transfer", desc: "Direct deposit to your bank account" },
                      { value: "mobile", label: "Mobile Money", desc: "MTN, Vodafone, AirtelTigo, etc." },
                      { value: "paypal", label: "PayPal", desc: "International payments via PayPal" },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.payoutMethod === method.value
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payoutMethod"
                          value={method.value}
                          checked={formData.payoutMethod === method.value}
                          onChange={(e) => setFormData({ ...formData, payoutMethod: e.target.value })}
                          className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{method.label}</p>
                          <p className="text-sm text-gray-500">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Review & Agreements */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Review Your Information</h3>
                  <div className="space-y-4 bg-gray-50 rounded-xl p-6">
                    <div>
                      <p className="text-sm text-gray-600">Store Name</p>
                      <p className="font-semibold text-gray-900">{formData.storeName || "Not provided"}</p>
                    </div>
                    {storeLogoUrl && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Store Logo</p>
                        <img src={storeLogoUrl} alt="Logo" className="w-16 h-16 object-cover rounded-lg border" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Business Type</p>
                      <p className="font-semibold text-gray-900">{formData.businessType || "Not selected"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Business Email</p>
                      <p className="font-semibold text-gray-900">{formData.businessEmail || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payout Method</p>
                      <p className="font-semibold text-gray-900">{formData.payoutMethod || "Not selected"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Agreements</h3>
                  
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="sellerAgreement"
                      checked={formData.acceptSellerAgreement}
                      onChange={(e) => 
                        setFormData({ ...formData, acceptSellerAgreement: e.target.checked })
                      }
                      required
                    />
                    <label htmlFor="sellerAgreement" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                      I accept the{" "}
                      <Link href="/seller-agreement" className="text-green-600 hover:underline font-semibold" target="_blank">
                        Marketplace Seller Agreement
                      </Link>
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onChange={(e) => 
                        setFormData({ ...formData, acceptTerms: e.target.checked })
                      }
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                      I accept the{" "}
                      <Link href="/terms" className="text-green-600 hover:underline font-semibold" target="_blank">
                        Terms & Conditions
                      </Link>
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="privacy"
                      checked={formData.acceptPrivacy}
                      onChange={(e) => 
                        setFormData({ ...formData, acceptPrivacy: e.target.checked })
                      }
                      required
                    />
                    <label htmlFor="privacy" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                      I accept the{" "}
                      <Link href="/privacy" className="text-green-600 hover:underline font-semibold" target="_blank">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="h-12 px-6 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                className="gradient-primary text-white h-12 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Next
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !formData.acceptSellerAgreement || !formData.acceptTerms || !formData.acceptPrivacy}
                className="gradient-primary text-white h-12 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

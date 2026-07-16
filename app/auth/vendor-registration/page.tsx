"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthLayout } from "@/components/auth/auth-layout";
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
  Image as ImageIcon
} from "lucide-react";

export default function VendorRegistrationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Store Information
    storeName: "",
    storeDescription: "",
    storeCategory: "",
    storeLogo: null as File | null,
    storeBanner: null as File | null,

    // Business Information
    businessType: "",
    businessName: "",
    registrationNumber: "",
    taxId: "",

    // Contact Information
    businessEmail: "",
    businessPhone: "",
    country: "",
    region: "",
    city: "",
    streetAddress: "",
    postalCode: "",

    // Identity Verification
    idDocument: null as File | null,
    businessCertificate: null as File | null,

    // Payout Preference
    payoutMethod: "",

    // Agreements
    acceptSellerAgreement: false,
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const totalSteps = 6;

  const handleFileChange = (field: string, file: File | null) => {
    setFormData({ ...formData, [field]: file });
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
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      router.push("/auth/pending-approval");
      setIsLoading(false);
    }, 2000);
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Store Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.storeCategory}
                    onChange={(e) => setFormData({ ...formData, storeCategory: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home & Living</option>
                    <option value="beauty">Beauty</option>
                    <option value="sports">Sports</option>
                    <option value="books">Books</option>
                    <option value="groceries">Groceries</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Store Logo <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange("storeLogo", e.target.files?.[0] || null)}
                      className="hidden"
                      id="storeLogo"
                    />
                    <label htmlFor="storeLogo" className="mt-3 inline-block">
                      <Button type="button" variant="outline" size="sm">
                        Choose File
                      </Button>
                    </label>
                    {formData.storeLogo && (
                      <p className="text-sm text-green-600 mt-2">✓ {formData.storeLogo.name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Store Banner (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload banner image</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB (1200x400 recommended)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange("storeBanner", e.target.files?.[0] || null)}
                      className="hidden"
                      id="storeBanner"
                    />
                    <label htmlFor="storeBanner" className="mt-3 inline-block">
                      <Button type="button" variant="outline" size="sm">
                        Choose File
                      </Button>
                    </label>
                    {formData.storeBanner && (
                      <p className="text-sm text-green-600 mt-2">✓ {formData.storeBanner.name}</p>
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
                    <option value="individual">Individual / Sole Proprietor</option>
                    <option value="company">Registered Company</option>
                    <option value="partnership">Partnership</option>
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
                    National ID, Passport, or Driver's License
                  </p>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload your ID document</p>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange("idDocument", e.target.files?.[0] || null)}
                      className="hidden"
                      id="idDocument"
                    />
                    <label htmlFor="idDocument" className="mt-3 inline-block">
                      <Button type="button" variant="outline" size="sm">
                        Choose File
                      </Button>
                    </label>
                    {formData.idDocument && (
                      <p className="text-sm text-green-600 mt-2">✓ {formData.idDocument.name}</p>
                    )}
                  </div>
                </div>

                {formData.businessType === "company" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Registration Certificate <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload business certificate</p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange("businessCertificate", e.target.files?.[0] || null)}
                        className="hidden"
                        id="businessCertificate"
                      />
                      <label htmlFor="businessCertificate" className="mt-3 inline-block">
                        <Button type="button" variant="outline" size="sm">
                          Choose File
                        </Button>
                      </label>
                      {formData.businessCertificate && (
                        <p className="text-sm text-green-600 mt-2">✓ {formData.businessCertificate.name}</p>
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

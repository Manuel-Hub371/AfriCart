"use client";

import { useState } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { StoreProfileForm } from "@/components/vendor/store-profile-form";
import { BrandingUploader } from "@/components/vendor/branding-uploader";
import { BusinessInfoForm } from "@/components/vendor/business-info-form";
import { ContactInfoForm } from "@/components/vendor/contact-info-form";
import { Save, AlertCircle, Eye } from "lucide-react";

export default function VendorStorePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSave = (data: any) => {
    console.log("Saving:", data);
    setHasUnsavedChanges(false);
    // Show success notification
  };

  const handleViewStore = () => {
    window.open("/store/africart-electronics", "_blank");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <StoreProfileForm onSave={handleSave} />;
      case "branding":
        return <BrandingUploader onSave={handleSave} />;
      case "business":
        return <BusinessInfoForm onSave={handleSave} />;
      case "contact":
        return <ContactInfoForm onSave={handleSave} />;
      case "policies":
        return <PolicyPlaceholder section="Store Policies" />;
      case "shipping":
        return <PolicyPlaceholder section="Shipping Settings" />;
      case "payment":
        return <PolicyPlaceholder section="Payment Settings" />;
      case "seo":
        return <PolicyPlaceholder section="SEO Settings" />;
      case "social":
        return <PolicyPlaceholder section="Social Media" />;
      case "notifications":
        return <PolicyPlaceholder section="Notifications" />;
      case "advanced":
        return <PolicyPlaceholder section="Advanced Settings" />;
      default:
        return <StoreProfileForm onSave={handleSave} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <VendorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <VendorTopbar
          onMenuClick={() => setSidebarOpen(true)}
          breadcrumbs={[
            { label: "Dashboard", href: "/vendor" },
            { label: "Store Settings" },
          ]}
        />

        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Store Settings
                  </h1>
                  <p className="text-gray-600">
                    Manage your store profile, branding, and preferences
                  </p>
                </div>
                <Button
                  onClick={handleViewStore}
                  variant="outline"
                  className="border-gray-200"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Store
                </Button>
              </div>

              {/* Horizontal Settings Navigation */}
              <div className="mb-6 overflow-x-auto thin-scrollbar">
                <div className="flex gap-2 pb-2 min-w-max">
                  {[
                    { id: "profile", label: "Store Profile" },
                    { id: "branding", label: "Branding" },
                    { id: "business", label: "Business Information" },
                    { id: "contact", label: "Contact Information" },
                    { id: "policies", label: "Store Policies" },
                    { id: "shipping", label: "Shipping Settings" },
                    { id: "payment", label: "Payment Settings" },
                    { id: "seo", label: "SEO Settings" },
                    { id: "social", label: "Social Media" },
                    { id: "notifications", label: "Notifications" },
                    { id: "advanced", label: "Advanced Settings" },
                  ].map((section) => {
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                          isActive
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {section.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Unsaved Changes Warning */}
              {hasUnsavedChanges && (
                <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">
                      You have unsaved changes
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Don't forget to save your changes before leaving this page
                    </p>
                  </div>
                </div>
              )}

              {/* Settings Content */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 mb-20">
                {renderSection()}
              </div>
            </div>
          </div>

          {/* Sticky Save Button */}
          <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-gray-200 p-4 z-30">
            <div className="max-w-[1600px] mx-auto flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {hasUnsavedChanges ? "You have unsaved changes" : "All changes saved"}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setHasUnsavedChanges(false)}
                  className="border-gray-200"
                >
                  Discard
                </Button>
                <Button
                  onClick={() => handleSave({})}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Placeholder component for sections not yet implemented
function PolicyPlaceholder({ section }: { section: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{section}</h2>
        <p className="text-gray-600">Configure your {section.toLowerCase()} preferences</p>
      </div>
      <div className="p-12 text-center rounded-lg border-2 border-dashed border-gray-300">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {section} Coming Soon
        </h3>
        <p className="text-gray-600 mb-6">
          This section is under development and will be available soon.
        </p>
      </div>
    </div>
  );
}

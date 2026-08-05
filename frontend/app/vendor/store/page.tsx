"use client";

import { useState, useEffect, useCallback } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { StoreProfileForm } from "@/components/vendor/store-profile-form";
import { BrandingUploader } from "@/components/vendor/branding-uploader";
import { BusinessInfoForm } from "@/components/vendor/business-info-form";
import { ContactInfoForm } from "@/components/vendor/contact-info-form";
import { StorePoliciesForm } from "@/components/vendor/store-policies-form";
import { ShippingSettingsForm } from "@/components/vendor/shipping-settings-form";
import { PaymentSettingsForm } from "@/components/vendor/payment-settings-form";
import { SeoSettingsForm } from "@/components/vendor/seo-settings-form";
import { NotificationSettingsForm } from "@/components/vendor/notification-settings-form";
import { SocialMediaForm } from "@/components/vendor/social-media-form";
import { AdvancedSettingsForm } from "@/components/vendor/advanced-settings-form";
import { Eye } from "lucide-react";

export default function VendorStorePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [storeData, setStoreData] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const fetchStore = useCallback(async () => {
    try {
      const res = await fetch("/api/vendor/store");
      if (res.ok) {
        const data = await res.json();
        setStoreData(data.store);
      }
    } catch {
      // silently fail on load
    }
  }, []);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  const handleSave = async (data: any) => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/vendor/store", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to save");
      }
      const updated = await res.json();
      setStoreData(updated.store);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (e: any) {
      setSaveStatus("error");
      alert(e.message || "Failed to save settings");
    }
  };

  const handleViewStore = () => {
    if (storeData?.slug) {
      window.open(`/stores/${storeData.slug}`, "_blank");
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <StoreProfileForm onSave={handleSave} initialData={storeData} />;
      case "branding":
        return <BrandingUploader onSave={handleSave} initialData={storeData} />;
      case "business":
        return <BusinessInfoForm onSave={handleSave} initialData={storeData} />;
      case "contact":
        return <ContactInfoForm onSave={handleSave} initialData={storeData} />;
      case "policies":
        return <StorePoliciesForm onSave={handleSave} initialData={storeData} />;
      case "shipping":
        return <ShippingSettingsForm onSave={handleSave} initialData={storeData} />;
      case "payment":
        return <PaymentSettingsForm onSave={handleSave} initialData={storeData} />;
      case "seo":
        return <SeoSettingsForm onSave={handleSave} initialData={storeData} />;
      case "notifications":
        return <NotificationSettingsForm onSave={handleSave} initialData={storeData} />;
      case "advanced":
        return <AdvancedSettingsForm onSave={handleSave} initialData={storeData} />;
      default:
        return <StoreProfileForm onSave={handleSave} initialData={storeData} />;
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
            <div className="p-6 lg:p-8 max-w-[1600px] mx-auto pb-24">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
                    Store Settings
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Configure your storefront profile, shipping policies, payments, and SEO parameters.
                  </p>
                </div>
                <Button
                  onClick={handleViewStore}
                  variant="outline"
                  className="border-gray-200 rounded-xl"
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
                    { id: "notifications", label: "Notifications" },
                    { id: "advanced", label: "Advanced Settings" },
                  ].map((section) => {
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                          isActive
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {section.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Settings Form Container */}
              <div className="bg-white rounded-3xl border border-gray-200 p-6 lg:p-8 shadow-sm">
                {renderSection()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

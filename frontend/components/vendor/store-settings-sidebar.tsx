"use client";

import { 
  Store, 
  Palette, 
  Building2, 
  Phone, 
  FileText, 
  Truck, 
  CreditCard,
  Search,
  Share2,
  Bell,
  Settings
} from "lucide-react";

interface SettingsSection {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface StoreSettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections: SettingsSection[] = [
  { id: "profile", label: "Store Profile", icon: Store },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "business", label: "Business Information", icon: Building2 },
  { id: "contact", label: "Contact Information", icon: Phone },
  { id: "policies", label: "Store Policies", icon: FileText },
  { id: "shipping", label: "Shipping Settings", icon: Truck },
  { id: "payment", label: "Payment Settings", icon: CreditCard },
  { id: "seo", label: "SEO Settings", icon: Search },
  { id: "social", label: "Social Media", icon: Share2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "advanced", label: "Advanced Settings", icon: Settings },
];

export function StoreSettingsSidebar({ activeSection, onSectionChange }: StoreSettingsSidebarProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4 px-2">Settings</h3>
      <nav className="space-y-1">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-gray-400"}`} />
              {section.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

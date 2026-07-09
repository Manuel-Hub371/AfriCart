"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Tag,
  DollarSign,
  Store,
  Truck,
  Settings,
  HelpCircle,
  X,
  Boxes,
  MessageSquare,
} from "lucide-react";

interface VendorSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/vendor" },
  { icon: Package, label: "Products", href: "/vendor/products" },
  { icon: ShoppingBag, label: "Orders", href: "/vendor/orders" },
  { icon: Users, label: "Customers", href: "/vendor/customers" },
  { icon: Boxes, label: "Inventory", href: "/vendor/inventory" },
  { icon: MessageSquare, label: "Reviews", href: "/vendor/reviews" },
  { icon: BarChart3, label: "Analytics", href: "/vendor/analytics" },
  { icon: Tag, label: "Marketing", href: "/vendor/marketing" },
  { icon: DollarSign, label: "Finance", href: "/vendor/finance" },
  { icon: Truck, label: "Shipping", href: "/vendor/shipping" },
  { icon: Store, label: "Store Settings", href: "/vendor/store" },
  { icon: HelpCircle, label: "Support", href: "/vendor/support" },
];

export default function VendorSidebar({
  isOpen = true,
  onClose,
}: VendorSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } w-64 flex flex-col`}
      >
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Logo */}
        <div className="p-6 border-b">
          <Link href="/vendor" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Tech World</h2>
              <p className="text-xs text-gray-600">Vendor Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-emerald-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Settings at bottom */}
        <div className="p-4 border-t">
          <Link
            href="/vendor/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === "/vendor/settings"
                ? "bg-emerald-50 text-emerald-600 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

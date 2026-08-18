"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Star,
  MapPin,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  X,
  Store,
  MessageSquare,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth/context";

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/profile" },
  { icon: ShoppingBag, label: "My Orders", href: "/profile/orders" },
  { icon: MessageSquare, label: "Messages", href: "/profile/messages" },
  { icon: Heart, label: "Wishlist", href: "/profile/wishlist" },
  { icon: Star, label: "Reviews", href: "/profile/reviews" },
  { icon: MapPin, label: "Addresses", href: "/profile/addresses" },
  { icon: CreditCard, label: "Payment Methods", href: "/profile/payments" },
  { icon: Bell, label: "Notifications", href: "/profile/notifications" },
  { icon: Settings, label: "Settings", href: "/profile/settings" },
];

export default function DashboardSidebar({
  isOpen = true,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userMenuItems = [...menuItems];
  if (user && !user.roles?.includes("VENDOR") && !user.roles?.includes("ADMIN")) {
    userMenuItems.push({ icon: Store, label: "Become a Vendor", href: "/profile/become-vendor" });
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

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

        {/* Profile Section Header */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 overflow-hidden border border-gray-200 shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                  {user?.firstName?.[0] || "U"}{user?.lastName?.[0] || ""}
                </div>
              )}
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Customer Account"}
              </h3>
              <p className="text-[11px] text-gray-400 font-medium truncate">{user?.email || "customer@africart.com"}</p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {userMenuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 shadow-2xs"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-emerald-600" : "text-gray-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sign Out Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/50">
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 font-bold text-xs w-full transition-colors disabled:opacity-50"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

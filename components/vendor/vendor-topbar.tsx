"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Menu, Search, ChevronRight, User, Package, Heart, Store, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";

interface VendorTopbarProps {
  onMenuClick: () => void;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function VendorTopbar({
  onMenuClick,
  breadcrumbs = [{ label: "Dashboard" }],
}: VendorTopbarProps) {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);
  
  // Get vendor initials for avatar
  const getVendorInitials = () => {
    if (!user) return "V";
    if (user.storeName) {
      const words = user.storeName.split(" ");
      return words.length > 1 
        ? `${words[0][0]}${words[1][0]}`.toUpperCase()
        : user.storeName.substring(0, 2).toUpperCase();
    }
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setProfileOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="flex-shrink-0 z-30 bg-white border-b">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left: Menu + Breadcrumbs */}
        <div className="flex items-center gap-4 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Breadcrumbs */}
          <nav className="hidden md:flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">
                    {crumb.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Center: Search */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search products, orders, customers..."
              className="pl-10 pr-4 w-full"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5 text-gray-700" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600">
              3
            </Badge>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                {getVendorInitials()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.storeName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Vendor"}
                </p>
                <p className="text-xs text-gray-600">Vendor</p>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl ring-1 ring-gray-100 overflow-hidden animate-slide-up z-50">
                <div className="px-5 py-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
                  <p className="text-sm font-bold text-gray-900">
                    {user ? `${user.firstName} ${user.lastName}` : "Vendor"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {user ? user.email : ""}
                  </p>
                </div>
                <div className="py-2">
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                  <Link
                    href="/profile/orders"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                  >
                    <Package className="h-4 w-4" />
                    My Orders
                  </Link>
                  <Link
                    href="/profile/wishlist"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    Wishlist
                  </Link>
                  <div className="border-t my-1"></div>
                  <Link
                    href="/vendor"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-5 py-2.5 text-sm text-emerald-600 font-medium hover:bg-emerald-50 transition-colors"
                  >
                    <Store className="h-4 w-4" />
                    Vendor Dashboard
                  </Link>
                </div>
                <div className="border-t">
                  <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className="h-4 w-4" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

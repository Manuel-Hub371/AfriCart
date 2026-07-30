"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Bell, User, Menu, X, Heart, Package, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/context";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout, user, isAuthenticated } = useAuth();

  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);

  const fetchCartAndNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItemCount(0);
      setNotifications([]);
      setUnreadNotifications(0);
      return;
    }

    try {
      // Fetch Cart
      const cartRes = await fetch("/api/cart");
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        const totalItems = (cartData?.items || []).reduce(
          (acc: number, item: any) => acc + (item.quantity || 1),
          0
        );
        setCartItemCount(totalItems);
      } else {
        setCartItemCount(0);
      }

      // Fetch Notifications
      const notifRes = await fetch("/api/notifications");
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        const list = Array.isArray(notifData) ? notifData : notifData.notifications || [];
        setNotifications(list);
        const unread = list.filter((n: any) => !n.isRead && !n.read).length;
        setUnreadNotifications(unread);
      }
    } catch (err) {
      console.error("Failed to fetch navbar badges:", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCartAndNotifications();

    const handleCartUpdate = () => fetchCartAndNotifications();
    const handleNotifUpdate = () => fetchCartAndNotifications();

    window.addEventListener("cart:updated", handleCartUpdate);
    window.addEventListener("notifications:updated", handleNotifUpdate);

    return () => {
      window.removeEventListener("cart:updated", handleCartUpdate);
      window.removeEventListener("notifications:updated", handleNotifUpdate);
    };
  }, [fetchCartAndNotifications]);

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-white shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                AfriCart
              </span>
            </Link>

            {/* Center: Navigation Links (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/"
                className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 rounded-lg hover:bg-green-50 relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/products"
                className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 rounded-lg hover:bg-green-50 relative group"
              >
                Products
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/stores"
                className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 rounded-lg hover:bg-green-50 relative group"
              >
                Stores
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-emerald-600" />
              <Input
                type="text"
                placeholder="Search products, stores or brands..."
                className="pl-12 pr-4 w-full h-11 rounded-full border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all"
              />
            </div>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-2">
            {/* Search Icon (Mobile) */}
            <button className="lg:hidden p-2.5 hover:bg-green-50 rounded-xl transition-all duration-200 hover:scale-105">
              <Search className="h-5 w-5 text-gray-700" />
            </button>

            {/* Show these only when authenticated */}
            {isAuthenticated ? (
              <>
                {/* Wishlist */}
                <Link
                  href="/profile/wishlist"
                  className="hidden sm:flex relative p-2.5 hover:bg-green-50 rounded-xl transition-all duration-200 hover:scale-105 group"
                >
                  <Heart className="h-5 w-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
                </Link>

                {/* Cart */}
                <Link
                  href="/cart"
                  className="relative p-2.5 hover:bg-green-50 rounded-xl transition-all duration-200 hover:scale-105 group"
                >
                  <ShoppingCart className="h-5 w-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs gradient-primary text-white border-2 border-white shadow-lg font-bold">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </Badge>
                  )}
                </Link>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2.5 hover:bg-green-50 rounded-xl transition-all duration-200 hover:scale-105 group"
                  >
                    <Bell className="h-5 w-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
                    {unreadNotifications > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs border-2 border-white shadow-lg bg-red-600 text-white font-bold"
                      >
                        {unreadNotifications > 99 ? "99+" : unreadNotifications}
                      </Badge>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl ring-1 ring-gray-100 overflow-hidden animate-slide-up">
                      <div className="px-5 py-4 border-b bg-gradient-to-r from-green-50 to-emerald-50 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        {unreadNotifications > 0 && (
                          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            {unreadNotifications} new
                          </span>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                        {notifications.length > 0 ? (
                          notifications.slice(0, 5).map((n: any) => (
                            <div
                              key={n.id}
                              className={`px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                !n.isRead && !n.read ? "bg-emerald-50/40" : ""
                              }`}
                            >
                              <div className="flex gap-3">
                                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                                  <Package className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-900">
                                    {n.title || "Notification"}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                    {n.message || n.content || "System update"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-5 py-8 text-center text-xs text-gray-500">
                            No notifications yet
                          </div>
                        )}
                      </div>
                      <div className="px-5 py-3 border-t bg-gray-50 text-center">
                        <Link
                          href="/profile/notifications"
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                          View all notifications →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown (Authenticated) */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="p-2.5 hover:bg-green-50 rounded-xl transition-all duration-200 hover:scale-105 group"
                  >
                    <User className="h-5 w-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl ring-1 ring-gray-100 overflow-hidden animate-slide-up">
                      <div className="px-5 py-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
                        <p className="text-sm font-bold text-gray-900">
                          {user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User Account" : "User Account"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
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
                        {user?.roles?.includes("VENDOR") && (
                          <Link
                            href="/vendor"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-colors font-medium text-emerald-700"
                          >
                            <Store className="h-4 w-4" />
                            Vendor Dashboard
                          </Link>
                        )}
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
                      </div>
                      <div className="border-t">
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="flex items-center gap-3 w-full px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Show Login and Sign Up when not authenticated */
              <>
                <Link
                  href="/auth/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/welcome"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-lg transition-all shadow-md hover:shadow-lg font-bold"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 hover:bg-green-50 rounded-xl transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-emerald-600" />
            <Input
              type="text"
              placeholder="Search products, stores or brands..."
              className="pl-12 pr-4 w-full h-11 rounded-full border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-gradient-to-b from-white to-green-50/30 animate-slide-up">
          <div className="px-4 py-4 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-green-50 rounded-xl font-medium transition-all duration-200 hover:pl-6"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-green-50 rounded-xl font-medium transition-all duration-200 hover:pl-6"
            >
              Products
            </Link>
            <Link
              href="/stores"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-green-50 rounded-xl font-medium transition-all duration-200 hover:pl-6"
            >
              Stores
            </Link>

            {/* Show Login/Sign Up in mobile menu when not authenticated */}
            {!isAuthenticated && (
              <div className="border-t my-2 pt-2 space-y-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-green-50 rounded-xl font-medium transition-all duration-200 hover:pl-6"
                >
                  Login
                </Link>
                <Link
                  href="/auth/welcome"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl font-medium transition-all duration-200 text-center shadow-md hover:shadow-lg mx-2"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

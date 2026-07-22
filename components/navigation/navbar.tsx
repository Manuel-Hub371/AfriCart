"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Bell, User, Menu, X, Heart, Package, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/context";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout, user, isAuthenticated } = useAuth();

  const cartItemCount = 3;
  const unreadNotifications = 2;

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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white shadow-sm'
    }`}>
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
                className="px-4 py-2 text-gray-700 hover:text-primary font-medium transition-all duration-200 rounded-lg hover:bg-green-50 relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/products"
                className="px-4 py-2 text-gray-700 hover:text-primary font-medium transition-all duration-200 rounded-lg hover:bg-green-50 relative group"
              >
                Products
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/stores"
                className="px-4 py-2 text-gray-700 hover:text-primary font-medium transition-all duration-200 rounded-lg hover:bg-green-50 relative group"
              >
                Stores
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-primary" />
              <Input
                type="text"
                placeholder="Search products, stores or brands..."
                className="pl-12 pr-4 w-full h-11 rounded-full border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                  <Heart className="h-5 w-5 text-gray-700 group-hover:text-primary transition-colors" />
                </Link>

                {/* Cart */}
                <Link
                  href="/cart"
                  className="relative p-2.5 hover:bg-green-50 rounded-xl transition-all duration-200 hover:scale-105 group"
                >
                  <ShoppingCart className="h-5 w-5 text-gray-700 group-hover:text-primary transition-colors" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs gradient-primary border-2 border-white shadow-lg">
                      {cartItemCount}
                    </Badge>
                  )}
                </Link>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2.5 hover:bg-green-50 rounded-xl transition-all duration-200 hover:scale-105 group"
                  >
                    <Bell className="h-5 w-5 text-gray-700 group-hover:text-primary transition-colors" />
                    {unreadNotifications > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs border-2 border-white shadow-lg"
                      >
                        {unreadNotifications}
                      </Badge>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl ring-1 ring-gray-100 overflow-hidden animate-slide-up">
                      <div className="px-5 py-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <div className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-transparent hover:border-primary">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                              <Package className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900">
                                Order Shipped
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Your order #12345 has been shipped
                              </p>
                              <p className="text-xs text-green-600 mt-1">2 hours ago</p>
                            </div>
                          </div>
                        </div>
                        <div className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-transparent hover:border-primary">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0">
                              <ShoppingCart className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900">
                                Special Offer
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Get 20% off on electronics this week
                              </p>
                              <p className="text-xs text-green-600 mt-1">1 day ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-5 py-3 border-t bg-gray-50">
                        <Link href="/profile/notifications" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                          View all notifications
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
                    <User className="h-5 w-5 text-gray-700 group-hover:text-primary transition-colors" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl ring-1 ring-gray-100 overflow-hidden animate-slide-up">
                      <div className="px-5 py-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
                        <p className="text-sm font-bold text-gray-900">
                          {user ? `${user.firstName} ${user.lastName}` : "User"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {user ? user.email : ""}
                        </p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                        >
                          <User className="h-4 w-4" />
                          My Profile
                        </Link>
                        {user?.roles?.includes("VENDOR") && (
                          <Link
                            href="/vendor"
                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                          >
                            <Store className="h-4 w-4" />
                            Vendor Dashboard
                          </Link>
                        )}
                        <Link
                          href="/profile/orders"
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                        >
                          <Package className="h-4 w-4" />
                          My Orders
                        </Link>
                        <Link
                          href="/profile/wishlist"
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
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/welcome"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-lg transition-all shadow-md hover:shadow-lg"
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
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-primary" />
            <Input
              type="text"
              placeholder="Search products, stores or brands..."
              className="pl-12 pr-4 w-full h-11 rounded-full border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
              className="block px-4 py-3 text-gray-700 hover:bg-green-50 rounded-xl font-medium transition-all duration-200 hover:pl-6"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block px-4 py-3 text-gray-700 hover:bg-green-50 rounded-xl font-medium transition-all duration-200 hover:pl-6"
            >
              Products
            </Link>
            <Link
              href="/stores"
              className="block px-4 py-3 text-gray-700 hover:bg-green-50 rounded-xl font-medium transition-all duration-200 hover:pl-6"
            >
              Stores
            </Link>
            
            {/* Show Login/Sign Up in mobile menu when not authenticated */}
            {!isAuthenticated && (
              <>
                <div className="border-t my-2 pt-2">
                  <Link
                    href="/auth/login"
                    className="block px-4 py-3 text-gray-700 hover:bg-green-50 rounded-xl font-medium transition-all duration-200 hover:pl-6"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/welcome"
                    className="block px-4 py-3 text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl font-medium transition-all duration-200 text-center shadow-md hover:shadow-lg mx-2"
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

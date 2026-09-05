"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Store, Tag, User } from "lucide-react";
import { useAuth } from "@/lib/auth/context";

export function BottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // Hide bottom nav on vendor dashboard or admin workspace routes
  if (pathname?.startsWith("/vendor") || pathname?.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Products", href: "/products", icon: Grid },
    { label: "Stores", href: "/stores", icon: Store },
    { label: "Deals", href: "/deals", icon: Tag },
    { label: "Profile", href: isAuthenticated ? "/profile" : "/auth/login", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
                isActive ? "text-emerald-600 font-bold" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? "scale-110 text-emerald-600" : ""}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5 animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

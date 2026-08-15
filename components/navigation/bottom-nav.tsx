"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Tag, ShoppingCart, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/context";

export function BottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [cartCount, setCartCount] = useState<number>(0);

  const fetchCartCount = useCallback(async () => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        const total = (data?.items || []).reduce(
          (sum: number, item: any) => sum + (item.quantity || 1),
          0
        );
        setCartCount(total);
      }
    } catch {
      setCartCount(0);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCartCount();

    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener("cart:updated", handleCartUpdate);

    return () => {
      window.removeEventListener("cart:updated", handleCartUpdate);
    };
  }, [fetchCartCount]);

  // Hide bottom nav on vendor dashboard or admin workspace routes
  if (pathname?.startsWith("/vendor") || pathname?.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Products", href: "/products", icon: Grid },
    { label: "Deals", href: "/deals", icon: Tag },
    { label: "Cart", href: "/cart", icon: ShoppingCart, badge: cartCount },
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
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge className="absolute -top-1.5 -right-2.5 h-4 w-4 flex items-center justify-center p-0 text-[9px] gradient-primary text-white border border-white font-extrabold shadow-xs">
                    {item.badge > 99 ? "99+" : item.badge}
                  </Badge>
                )}
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

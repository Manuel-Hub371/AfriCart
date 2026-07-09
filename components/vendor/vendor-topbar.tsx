"use client";

import { Bell, Menu, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface VendorTopbarProps {
  onMenuClick: () => void;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function VendorTopbar({
  onMenuClick,
  breadcrumbs = [{ label: "Dashboard" }],
}: VendorTopbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b">
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

          {/* Profile */}
          <Link
            href="/vendor/settings"
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              TW
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900">Tech World</p>
              <p className="text-xs text-gray-600">Vendor</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

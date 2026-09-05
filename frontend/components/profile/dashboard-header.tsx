"use client";

import { useState } from "react";
import { Menu, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/context";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-3 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </Button>
        <h1 className="text-sm sm:text-base font-black text-emerald-600 tracking-tight">AfriCart Dashboard</h1>
      </div>

      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="flex items-center gap-1 text-[11px] font-extrabold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 px-2.5 py-1 rounded-lg transition-colors"
        title="Sign Out Account"
      >
        {isLoggingOut ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <LogOut className="h-3.5 w-3.5" />
        )}
        <span>Logout</span>
      </button>
    </header>
  );
}

"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-emerald-600">AfriCart</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}

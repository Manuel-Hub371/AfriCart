"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "lucide-react";

export type DateRange = 
  | "today"
  | "yesterday"
  | "last-7-days"
  | "last-30-days"
  | "this-month"
  | "last-month"
  | "this-year"
  | "custom";

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const dateRangeLabels: Record<DateRange, string> = {
  "today": "Today",
  "yesterday": "Yesterday",
  "last-7-days": "Last 7 Days",
  "last-30-days": "Last 30 Days",
  "this-month": "This Month",
  "last-month": "Last Month",
  "this-year": "This Year",
  "custom": "Custom Range",
};

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-50 h-10 px-4">
        <Calendar className="h-4 w-4 mr-2" />
        {dateRangeLabels[value]}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {(Object.keys(dateRangeLabels) as DateRange[]).map((range) => (
          <DropdownMenuItem
            key={range}
            onClick={() => onChange(range)}
            className={value === range ? "bg-emerald-50 text-emerald-700" : ""}
          >
            {dateRangeLabels[range]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

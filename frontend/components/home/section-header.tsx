import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 sm:mb-12",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <div className={cn("mb-2 sm:mb-3", align === "center" ? "inline-block" : "inline-flex")}>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs sm:text-sm font-bold">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "text-xs sm:text-sm md:text-base text-gray-600 mt-2 sm:mt-3 max-w-2xl font-medium leading-relaxed",
          align === "center" && "mx-auto"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
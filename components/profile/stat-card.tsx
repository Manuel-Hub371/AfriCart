import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
  iconBg?: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  iconColor = "text-emerald-600",
  iconBg = "bg-emerald-50",
}: StatCardProps) {
  return (
    <div className="p-3 sm:p-4 rounded-xl border border-gray-200/80 bg-white shadow-2xs transition-all hover:border-gray-300">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl shrink-0 flex items-center justify-center border border-gray-100 ${iconBg}`}>
          <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs text-gray-500 font-semibold tracking-tight truncate">{label}</p>
          <p className="text-sm sm:text-xl font-extrabold text-gray-900 truncate mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  );
}

import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

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
  iconBg = "bg-emerald-100",
}: StatCardProps) {
  return (
    <Card className="p-2.5 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-2xs transition-all hover:shadow-xs">
      <div className="flex items-center gap-2.5 sm:gap-4">
        <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl shrink-0 ${iconBg}`}>
          <Icon className={`h-4 w-4 sm:h-6 sm:w-6 ${iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider truncate">{label}</p>
          <p className="text-sm sm:text-2xl font-black text-gray-900 truncate">{value}</p>
        </div>
      </div>
    </Card>
  );
}

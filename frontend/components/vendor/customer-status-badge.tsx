import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type CustomerStatus = "new" | "returning" | "vip" | "inactive";

interface CustomerStatusBadgeProps {
  status: CustomerStatus;
  className?: string;
}

const statusConfig = {
  new: {
    label: "New Customer",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  returning: {
    label: "Returning",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  vip: {
    label: "VIP",
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
  inactive: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
};

export function CustomerStatusBadge({ status, className }: CustomerStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border px-2.5 py-0.5",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}

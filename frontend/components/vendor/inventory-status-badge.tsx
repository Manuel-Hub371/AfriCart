import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type InventoryStatus = 
  | "in-stock" 
  | "low-stock" 
  | "out-of-stock" 
  | "overstocked"
  | "incoming";

interface InventoryStatusBadgeProps {
  status: InventoryStatus;
  className?: string;
}

const statusConfig = {
  "in-stock": {
    label: "In Stock",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  "low-stock": {
    label: "Low Stock",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  "out-of-stock": {
    label: "Out of Stock",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  "overstocked": {
    label: "Overstocked",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  "incoming": {
    label: "Incoming",
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
};

export function InventoryStatusBadge({ status, className }: InventoryStatusBadgeProps) {
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

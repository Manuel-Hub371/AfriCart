import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "ready-to-ship"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  processing: {
    label: "Processing",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  packed: {
    label: "Packed",
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
  "ready-to-ship": {
    label: "Ready to Ship",
    className: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  shipped: {
    label: "Shipped",
    className: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
  delivered: {
    label: "Delivered",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  returned: {
    label: "Returned",
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
  refunded: {
    label: "Refunded",
    className: "bg-pink-100 text-pink-700 border-pink-200",
  },
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
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

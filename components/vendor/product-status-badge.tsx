import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  Calendar, 
  Archive, 
  AlertCircle, 
  AlertTriangle 
} from "lucide-react";

interface ProductStatusBadgeProps {
  status: "published" | "draft" | "scheduled" | "archived" | "out-of-stock" | "low-stock";
  className?: string;
}

export function ProductStatusBadge({ status, className }: ProductStatusBadgeProps) {
  const statusConfig = {
    published: {
      label: "Published",
      icon: CheckCircle,
      className: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100",
    },
    draft: {
      label: "Draft",
      icon: Clock,
      className: "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100",
    },
    scheduled: {
      label: "Scheduled",
      icon: Calendar,
      className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
    },
    archived: {
      label: "Archived",
      icon: Archive,
      className: "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100",
    },
    "out-of-stock": {
      label: "Out of Stock",
      icon: AlertCircle,
      className: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
    },
    "low-stock": {
      label: "Low Stock",
      icon: AlertTriangle,
      className: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${className} font-medium gap-1.5 text-xs px-2.5 py-1`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

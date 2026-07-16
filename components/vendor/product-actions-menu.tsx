import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Package,
  BarChart3,
  TrendingUp,
  Archive,
  Trash2,
} from "lucide-react";

interface ProductActionsMenuProps {
  productId: string;
  onAction: (action: string, productId: string) => void;
}

export function ProductActionsMenu({ productId, onAction }: ProductActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onAction("view", productId)}>
          <Eye className="h-4 w-4 mr-2" />
          View Product
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction("edit", productId)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Product
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction("duplicate", productId)}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAction("inventory", productId)}>
          <Package className="h-4 w-4 mr-2" />
          Manage Inventory
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction("analytics", productId)}>
          <BarChart3 className="h-4 w-4 mr-2" />
          View Analytics
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction("promote", productId)}>
          <TrendingUp className="h-4 w-4 mr-2" />
          Promote Product
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAction("archive", productId)}>
          <Archive className="h-4 w-4 mr-2" />
          Archive
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onAction("delete", productId)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

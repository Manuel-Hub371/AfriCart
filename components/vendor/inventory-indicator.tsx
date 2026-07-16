interface InventoryIndicatorProps {
  stock: number;
  lowStockThreshold?: number;
  className?: string;
}

export function InventoryIndicator({ 
  stock, 
  lowStockThreshold = 10,
  className 
}: InventoryIndicatorProps) {
  const getIndicator = () => {
    if (stock === 0) {
      return {
        color: "text-red-600",
        bgColor: "bg-red-100",
        dotColor: "bg-red-500",
        label: "Out of Stock",
        icon: "🔴",
      };
    } else if (stock <= lowStockThreshold) {
      return {
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        dotColor: "bg-yellow-500",
        label: "Low Stock",
        icon: "🟠",
      };
    } else {
      return {
        color: "text-green-600",
        bgColor: "bg-green-100",
        dotColor: "bg-green-500",
        label: "Healthy Stock",
        icon: "🟢",
      };
    }
  };

  const indicator = getIndicator();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{stock}</span>
          <span className="text-sm text-gray-500">
            {stock === 0 ? "" : stock === 1 ? "item" : "items"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className={`w-2 h-2 rounded-full ${indicator.dotColor}`}></div>
          <span className={`text-xs font-medium ${indicator.color}`}>
            {indicator.label}
          </span>
        </div>
      </div>
    </div>
  );
}

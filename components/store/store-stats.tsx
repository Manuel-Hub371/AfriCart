import { Card } from "@/components/ui/card";
import { Users, Package, Star, TrendingUp } from "lucide-react";

interface StoreStatsProps {
  customers: string;
  products: string;
  rating: string;
  positiveReviews: string;
}

export function StoreStats({
  customers,
  products,
  rating,
  positiveReviews,
}: StoreStatsProps) {
  const stats = [
    {
      icon: Users,
      value: customers,
      label: "Customers",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Package,
      value: products,
      label: "Products",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Star,
      value: rating,
      label: "Rating",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: TrendingUp,
      value: positiveReviews,
      label: "Positive Reviews",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface StoreCategoryCardProps {
  name: string;
  icon: LucideIcon;
  storeCount: number;
  color: string;
  href: string;
}

export function StoreCategoryCard({
  name,
  icon: Icon,
  storeCount,
  color,
  href,
}: StoreCategoryCardProps) {
  return (
    <Link href={href}>
      <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className={`p-4 rounded-full ${color} bg-opacity-10`}>
            <Icon className={`h-8 w-8 ${color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
            <p className="text-sm text-gray-600">{storeCount} stores</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

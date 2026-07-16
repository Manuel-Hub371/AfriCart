import { Card } from "@/components/ui/card";
import { Truck, Package, RefreshCw, Shield } from "lucide-react";

interface ShippingCardProps {
  estimatedDelivery: string;
  shippingCost: number;
  returnDays: number;
}

export function ShippingCard({
  estimatedDelivery,
  shippingCost,
  returnDays,
}: ShippingCardProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Delivery & Returns
      </h3>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">
              Estimated Delivery
            </h4>
            <p className="text-gray-600">{estimatedDelivery}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <Package className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">Shipping</h4>
            <p className="text-gray-600">
              {shippingCost === 0 ? (
                <span className="text-green-600 font-semibold">
                  Free Shipping
                </span>
              ) : (
                `$${shippingCost.toFixed(2)}`
              )}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <RefreshCw className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">Return Policy</h4>
            <p className="text-gray-600">{returnDays} Days Return</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">
              Buyer Protection
            </h4>
            <p className="text-gray-600">100% Money Back Guarantee</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

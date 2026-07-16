import { Button } from "@/components/ui/button";
import { Megaphone, Ticket, Zap } from "lucide-react";

interface MarketingEmptyStateProps {
  onCreateCampaign: () => void;
  onCreateCoupon: () => void;
}

export function MarketingEmptyState({ onCreateCampaign, onCreateCoupon }: MarketingEmptyStateProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Megaphone className="h-10 w-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          Start Your First Marketing Campaign
        </h3>
        <p className="text-gray-600 mb-8">
          Create promotional campaigns, offer discounts, and increase sales with powerful marketing tools.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 text-left">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <Megaphone className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Promotional Campaigns</h4>
            <p className="text-sm text-gray-600 mb-4">
              Create percentage discounts, bundle deals, BOGO offers, and more.
            </p>
            <Button 
              onClick={onCreateCampaign}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Create Campaign
            </Button>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-left">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <Ticket className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Discount Coupons</h4>
            <p className="text-sm text-gray-600 mb-4">
              Generate coupon codes with custom rules and usage limits.
            </p>
            <Button 
              onClick={onCreateCoupon}
              variant="outline"
              className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Create Coupon
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Zap className="h-4 w-4 text-emerald-600" />
          <span>Pro Tip: Start with a simple percentage discount to test the waters</span>
        </div>
      </div>
    </div>
  );
}

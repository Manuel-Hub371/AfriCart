import { Card } from "@/components/ui/card";
import { 
  MapPin, 
  Store, 
  Calendar, 
  CreditCard,
  Truck,
  RefreshCw,
  Mail,
  Phone
} from "lucide-react";

interface StoreAboutProps {
  description: string;
  location: string;
  businessType: string;
  yearsActive: number;
}

export function StoreAbout({
  description,
  location,
  businessType,
  yearsActive,
}: StoreAboutProps) {
  return (
    <div className="space-y-6">
      {/* About Store */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">About Store</h3>
        <p className="text-gray-600 leading-relaxed mb-6">{description}</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-gray-700">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Location</div>
              <div className="font-medium">{location}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Store className="h-5 w-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Business Type</div>
              <div className="font-medium">{businessType}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Years Active</div>
              <div className="font-medium">{yearsActive} years</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Store Policies */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Store Policies</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Truck className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Shipping Information</h4>
              <p className="text-gray-600 text-sm">
                Free shipping on orders over $50. Standard delivery takes 3-5 business days. 
                Express shipping available at checkout.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <RefreshCw className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Return Policy</h4>
              <p className="text-gray-600 text-sm">
                30-day return policy for all items. Products must be unused and in original 
                packaging. Return shipping costs may apply.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <CreditCard className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Payment Methods</h4>
              <p className="text-gray-600 text-sm">
                We accept Visa, Mastercard, American Express, PayPal, and Apple Pay. 
                All transactions are secure and encrypted.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail className="h-5 w-5 text-gray-400" />
            <span>support@techworld.com</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Phone className="h-5 w-5 text-gray-400" />
            <span>+1 (555) 123-4567</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

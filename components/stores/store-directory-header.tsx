import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Store } from "lucide-react";

export function StoreDirectoryHeader() {
  return (
    <div className="bg-gradient-to-br from-primary-50 to-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Store className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Discover Trusted Stores
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Explore thousands of sellers, brands, and businesses offering quality products
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search stores, brands, or categories..."
                className="pl-12 pr-4 h-14 text-lg"
              />
              <Button 
                size="lg" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                Explore
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-600 flex-wrap">
            <div>
              <span className="font-bold text-2xl text-gray-900 block">2,500+</span>
              <span>Active Stores</span>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div>
              <span className="font-bold text-2xl text-gray-900 block">50K+</span>
              <span>Products</span>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div>
              <span className="font-bold text-2xl text-gray-900 block">98%</span>
              <span>Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

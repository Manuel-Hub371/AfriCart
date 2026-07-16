"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CheckoutSteps from "@/components/checkout/checkout-steps";
import AddressForm from "@/components/checkout/address-form";
import AddressCard from "@/components/checkout/address-card";
import ShippingOptions from "@/components/checkout/shipping-options";
import VendorOrderReview from "@/components/checkout/vendor-order-review";
import PaymentMethods from "@/components/checkout/payment-methods";
import OrderSummary from "@/components/checkout/order-summary";
import CouponBox from "@/components/checkout/coupon-box";
import PlaceOrderButton from "@/components/checkout/place-order-button";
import { Shield, Lock } from "lucide-react";
import Link from "next/link";

// Mock data
const savedAddresses = [
  {
    id: "1",
    name: "John Doe",
    phone: "+233 XX XXX XXXX",
    email: "john.doe@example.com",
    country: "Ghana",
    region: "Greater Accra",
    city: "Accra",
    address: "123 Oxford Street, Osu",
    postalCode: "GA-123-4567",
    isDefault: true,
  },
  {
    id: "2",
    name: "John Doe",
    phone: "+233 XX XXX XXXX",
    email: "john.doe@example.com",
    country: "Ghana",
    region: "Ashanti",
    city: "Kumasi",
    address: "456 Adum Street",
    postalCode: "AK-456-7890",
    isDefault: false,
  },
];

const vendorOrders = [
  {
    vendorId: "1",
    vendorName: "Tech World",
    vendorLogo: "bg-gradient-to-br from-blue-500 to-blue-600",
    verified: true,
    rating: 4.8,
    products: [
      {
        id: "1",
        name: "Premium Wireless Headphones",
        image: "bg-gradient-to-br from-green-400 to-pink-400",
        variant: "Color: Black, Storage: 256GB",
        quantity: 1,
        price: 120,
        originalPrice: 150,
      },
      {
        id: "2",
        name: "Smart Watch Pro",
        image: "bg-gradient-to-br from-blue-400 to-cyan-400",
        variant: "Color: Silver",
        quantity: 1,
        price: 200,
        originalPrice: 250,
      },
    ],
    shippingOptions: [
      {
        id: "standard",
        name: "Standard Delivery",
        duration: "July 12 - July 15",
        price: 10,
      },
      {
        id: "express",
        name: "Express Delivery",
        duration: "July 10 - July 11",
        price: 25,
      },
    ],
    selectedShipping: "standard",
  },
  {
    vendorId: "2",
    vendorName: "Fashion House",
    vendorLogo: "bg-gradient-to-br from-pink-500 to-rose-600",
    verified: true,
    rating: 4.9,
    products: [
      {
        id: "3",
        name: "Designer Sneakers",
        image: "bg-gradient-to-br from-orange-400 to-red-400",
        variant: "Size: 42, Color: White",
        quantity: 2,
        price: 100,
        originalPrice: 120,
      },
    ],
    shippingOptions: [
      {
        id: "standard",
        name: "Standard Delivery",
        duration: "July 13 - July 16",
        price: 15,
      },
      {
        id: "express",
        name: "Express Delivery",
        duration: "July 11 - July 12",
        price: 30,
      },
    ],
    selectedShipping: "standard",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(2);
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [vendors, setVendors] = useState(vendorOrders);
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleShippingChange = (vendorId: string, shippingId: string) => {
    setVendors(
      vendors.map((vendor) =>
        vendor.vendorId === vendorId
          ? { ...vendor, selectedShipping: shippingId }
          : vendor
      )
    );
  };

  const calculateSubtotal = () => {
    return vendors.reduce(
      (total, vendor) =>
        total +
        vendor.products.reduce(
          (sum, product) => sum + product.price * product.quantity,
          0
        ),
      0
    );
  };

  const calculateShipping = () => {
    return vendors.reduce((total, vendor) => {
      const selectedOption = vendor.shippingOptions.find(
        (option) => option.id === vendor.selectedShipping
      );
      return total + (selectedOption?.price || 0);
    }, 0);
  };

  const calculateDiscount = () => {
    return appliedCoupon ? 50 : 0;
  };

  const calculateTax = () => {
    return Math.round(calculateSubtotal() * 0.025);
  };

  const calculateTotal = () => {
    return (
      calculateSubtotal() +
      calculateShipping() -
      calculateDiscount() +
      calculateTax()
    );
  };

  const handlePlaceOrder = async () => {
    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      router.push("/checkout/success?orderId=MK123456");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Checkout Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-emerald-600">
              AfriCart
            </Link>
            <div className="flex items-center gap-2 text-gray-600">
              <Lock className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">
                Secure Checkout
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="bg-emerald-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center gap-2 text-emerald-700 text-sm">
            <Shield className="h-4 w-4" />
            <span>Your payment information is protected with SSL encryption</span>
          </div>
        </div>
      </div>

      {/* Checkout Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CheckoutSteps currentStep={currentStep} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Delivery Information</h2>
                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    + Add New Address
                  </button>
                )}
              </div>

              {showAddressForm ? (
                <AddressForm
                  onSave={(address) => {
                    setSelectedAddress(address);
                    setShowAddressForm(false);
                  }}
                  onCancel={() => setShowAddressForm(false)}
                />
              ) : (
                <div className="space-y-4">
                  {savedAddresses.map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      isSelected={selectedAddress.id === address.id}
                      onSelect={() => setSelectedAddress(address)}
                      onEdit={() => setShowAddressForm(true)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Multi-Vendor Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Note:</span> Your order contains
                items from {vendors.length} different stores. Products may arrive
                separately with different delivery dates.
              </p>
            </div>

            {/* Shipping Method & Order Review */}
            {vendors.map((vendor, index) => (
              <div key={vendor.vendorId}>
                <VendorOrderReview vendor={vendor} index={index} />
                <div className="mt-4">
                  <ShippingOptions
                    vendor={vendor}
                    onShippingChange={handleShippingChange}
                  />
                </div>
              </div>
            ))}

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
              <PaymentMethods
                selectedPayment={selectedPayment}
                onPaymentChange={setSelectedPayment}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-emerald-600 hover:underline"
                  >
                    Terms and Conditions
                  </Link>
                  ,{" "}
                  <Link
                    href="/privacy"
                    className="text-emerald-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  , and{" "}
                  <Link
                    href="/return-policy"
                    className="text-emerald-600 hover:underline"
                  >
                    Return Policy
                  </Link>
                </span>
              </label>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <CouponBox
                appliedCoupon={appliedCoupon}
                onApplyCoupon={setAppliedCoupon}
              />
              <OrderSummary
                subtotal={calculateSubtotal()}
                shipping={calculateShipping()}
                discount={calculateDiscount()}
                tax={calculateTax()}
                total={calculateTotal()}
              />
              <PlaceOrderButton
                isProcessing={isProcessing}
                isDisabled={!agreeToTerms}
                onPlaceOrder={handlePlaceOrder}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Checkout Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40">
        <PlaceOrderButton
          isProcessing={isProcessing}
          isDisabled={!agreeToTerms}
          onPlaceOrder={handlePlaceOrder}
          total={calculateTotal()}
        />
      </div>
    </div>
  );
}

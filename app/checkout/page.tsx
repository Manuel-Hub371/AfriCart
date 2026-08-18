"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Shield, Lock, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep] = useState(2);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real addresses, cart items, and saved dashboard payment methods on mount
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [addrRes, cartRes, payRes] = await Promise.all([
        fetch("/api/addresses"),
        fetch("/api/cart"),
        fetch("/api/payments"),
      ]);

      if (addrRes.ok) {
        const addrData = await addrRes.json();
        const addrs = (Array.isArray(addrData) ? addrData : addrData.addresses || []).filter((a: any) => a && a.id);
        setAddresses(addrs);
        const defaultAddr = addrs.find((a: any) => a.isDefault) || addrs[0] || null;
        setSelectedAddress(defaultAddr);
      }

      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setCartItems(cartData.items || []);
      }

      if (payRes.ok) {
        const payData = await payRes.json();
        const pms = Array.isArray(payData) ? payData : payData.paymentMethods || [];
        setSavedPaymentMethods(pms);
        const defaultPm = pms.find((p: any) => p.isDefault) || pms[0] || null;
        setSelectedPaymentMethod(defaultPm);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddNewPaymentMethod = async (data: { provider: string; phone: string; accountName: string; isDefault?: boolean }) => {
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "MOBILE_MONEY",
        provider: data.provider,
        accountName: data.accountName,
        phone: data.phone,
        isDefault: data.isDefault ?? true,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to save payment method");
    }

    const updated = await res.json();
    const pms = Array.isArray(updated) ? updated : updated.paymentMethods || [];
    setSavedPaymentMethods(pms);
    const newest = pms.length > 0 ? pms[pms.length - 1] : null;
    setSelectedPaymentMethod(newest);
  };

  // Selected shipping options per vendor state
  const [selectedShippingPerVendor, setSelectedShippingPerVendor] = useState<Record<string, string>>({});
  const [storePoliciesMap, setStorePoliciesMap] = useState<Record<string, any[]>>({});

  useEffect(() => {
    async function loadStorePolicies() {
      const storeIds = new Set<string>();
      cartItems.forEach((item: any) => {
        const storeId = item.storeId || item.product?.storeId;
        if (storeId) storeIds.add(storeId);
      });

      const map: Record<string, any[]> = {};
      for (const sid of Array.from(storeIds)) {
        try {
          const res = await fetch(`/api/stores/${sid}/shipping-policies`);
          if (res.ok) {
            const data = await res.json();
            map[sid] = data.policies || [];
          }
        } catch (err) {
          console.error(`Failed to fetch policies for store ${sid}:`, err);
        }
      }
      setStorePoliciesMap(map);
    }

    if (cartItems.length > 0) {
      loadStorePolicies();
    }
  }, [cartItems]);

  // Group cart items by vendor/store
  const vendorGroups = cartItems.reduce((acc: any[], item: any) => {
    const storeId = item.storeId || item.product?.storeId || "default";
    const storeName = item.storeName || item.product?.store?.name || "AfriCart Merchant";

    let existing = acc.find((g) => g.vendorId === storeId);
    if (!existing) {
      const dbPolicies = storePoliciesMap[storeId] || [];
      const shippingOptions = dbPolicies.length > 0
        ? dbPolicies.map((p: any) => ({
            id: p.id,
            name: p.name,
            duration: p.deliveryTime,
            price: Number(p.shippingCost),
          }))
        : [
            {
              id: "standard",
              name: "Standard Delivery",
              duration: "2 - 4 business days",
              price: 5.00,
            },
          ];

      const defaultShippingId = selectedShippingPerVendor[storeId] || shippingOptions[0].id;

      existing = {
        vendorId: storeId,
        vendorName: storeName,
        vendorLogo: "bg-gradient-to-br from-emerald-500 to-teal-600",
        verified: true,
        rating: 4.9,
        products: [],
        shippingOptions,
        selectedShipping: defaultShippingId,
      };
      acc.push(existing);
    }

    existing.products.push({
      id: item.id,
      name: item.productName || item.product?.name || "Product",
      image: item.productImage || item.product?.images?.[0] || "",
      variant: "",
      quantity: item.quantity,
      price: item.price || item.product?.price || 0,
    });

    return acc;
  }, []);

  const handleShippingChange = (vendorId: string, shippingId: string) => {
    setSelectedShippingPerVendor((prev) => ({
      ...prev,
      [vendorId]: shippingId,
    }));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price || item.product?.price || 0) * item.quantity, 0);
  };

  const calculateShipping = () => {
    let totalShipping = 0;
    vendorGroups.forEach((vg: any) => {
      const selectedOption = vg.shippingOptions.find((opt: any) => opt.id === vg.selectedShipping) || vg.shippingOptions[0];
      if (selectedOption) {
        totalShipping += selectedOption.price;
      }
    });
    return totalShipping;
  };

  const calculateDiscount = () => (appliedCoupon ? 50 : 0);
  const calculateTax = () => Math.round(calculateSubtotal() * 0.025);
  const calculateTotal = () => Math.max(0, calculateSubtotal() + calculateShipping() - calculateDiscount() + calculateTax());

  const handlePlaceOrder = async () => {
    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }
    if (!selectedAddress) {
      alert("Please select or add a shipping address");
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: {
            firstName: selectedAddress.firstName,
            lastName: selectedAddress.lastName,
            phone: selectedAddress.phone,
            streetAddress: selectedAddress.streetAddress || selectedAddress.address,
            city: selectedAddress.city,
            region: selectedAddress.region,
            country: selectedAddress.country,
            postalCode: selectedAddress.postalCode,
          },
          paymentMethod: selectedPaymentMethod?.provider || "MOBILE_MONEY",
          paymentMethodId: selectedPaymentMethod?.id,
          paymentPhone: selectedPaymentMethod?.phone || selectedPaymentMethod?.accountNumber,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to place order");
      }

      const data = await res.json();
      router.push(`/profile/orders?newOrder=${data.order.id}`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsProcessing(false);
    }
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mr-3" />
          <span className="text-gray-600">Loading checkout details...</span>
        </div>
      )}

      {/* Main Content */}
      {!loading && (
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
                    onSave={async (newAddr) => {
                      try {
                        const res = await fetch("/api/addresses", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            firstName: newAddr.name?.split(" ")[0] || "Customer",
                            lastName: newAddr.name?.split(" ").slice(1).join(" ") || "User",
                            phone: newAddr.phone || "",
                            streetAddress: newAddr.address || "",
                            city: newAddr.city || "",
                            region: newAddr.region || "",
                            country: newAddr.country || "Ghana",
                            postalCode: newAddr.postalCode || "",
                            type: "shipping",
                            isDefault: true,
                          }),
                        });
                        if (res.ok) {
                          const data = await res.json();
                          let updatedList: any[] = [];
                          if (Array.isArray(data)) {
                            updatedList = data.filter(Boolean);
                          } else if (data.addresses && Array.isArray(data.addresses)) {
                            updatedList = data.addresses.filter(Boolean);
                          } else if (data.address && data.address.id) {
                            updatedList = [...addresses.filter(Boolean), data.address];
                          } else if (data.id) {
                            updatedList = [...addresses.filter(Boolean), data];
                          } else {
                            const reload = await fetch("/api/addresses");
                            if (reload.ok) {
                              const reData = await reload.json();
                              updatedList = (Array.isArray(reData) ? reData : reData.addresses || []).filter(Boolean);
                            }
                          }

                          setAddresses(updatedList);
                          const lastAddr = updatedList.length > 0 ? updatedList[updatedList.length - 1] : null;
                          setSelectedAddress(lastAddr);
                        }
                      } catch {
                        // ignore error
                      }
                      setShowAddressForm(false);
                    }}
                    onCancel={() => setShowAddressForm(false)}
                  />
                ) : (
                  <div className="space-y-4">
                    {addresses.filter((a) => a && a.id).length === 0 ? (
                      <p className="text-sm text-gray-500">No saved addresses found. Please add a new address above.</p>
                    ) : (
                      addresses.filter((a) => a && a.id).map((address) => (
                        <AddressCard
                          key={address.id}
                          address={{
                            id: address.id,
                            name: `${address.firstName || ""} ${address.lastName || ""}`.trim() || "Customer",
                            phone: address.phone || "",
                            email: "",
                            country: address.country || "Ghana",
                            region: address.region || "",
                            city: address.city || "",
                            address: address.streetAddress || address.address || "",
                            postalCode: address.postalCode || "",
                            isDefault: address.isDefault || false,
                          }}
                          isSelected={selectedAddress?.id === address.id}
                          onSelect={() => setSelectedAddress(address)}
                          onEdit={() => setShowAddressForm(true)}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Multi-Vendor Notice */}
              {vendorGroups.length > 1 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    <span className="font-semibold">Note:</span> Your order contains
                    items from {vendorGroups.length} different stores. Products may arrive
                    separately with different delivery dates.
                  </p>
                </div>
              )}

              {/* Shipping Method & Order Review */}
              {vendorGroups.map((vendor, index) => (
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
                  savedPaymentMethods={savedPaymentMethods}
                  selectedPaymentMethod={selectedPaymentMethod}
                  onSelectPaymentMethod={setSelectedPaymentMethod}
                  onAddNewPaymentMethod={handleAddNewPaymentMethod}
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
                  isDisabled={!agreeToTerms || cartItems.length === 0}
                  onPlaceOrder={handlePlaceOrder}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Checkout Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40">
        <PlaceOrderButton
          isProcessing={isProcessing}
          isDisabled={!agreeToTerms || cartItems.length === 0}
          onPlaceOrder={handlePlaceOrder}
          total={calculateTotal()}
        />
      </div>
    </div>
  );
}

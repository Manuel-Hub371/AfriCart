"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Share2, 
  ShoppingCart, 
  Zap, 
  Minus, 
  Plus, 
  Check, 
  Copy, 
  Layers, 
  Flag, 
  UserPlus, 
  Loader2,
  CheckCircle2,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";

interface PurchaseActionsProps {
  productId?: string;
  inStock: boolean;
  maxQuantity: number;
  selectedVariantId?: string | null;
  selectedVariantPrice?: number | null;
  productName?: string;
  storeId?: string;
}

export function PurchaseActions({
  productId,
  inStock,
  maxQuantity,
  selectedVariantId,
  selectedVariantPrice,
  productName = "Product",
  storeId,
}: PurchaseActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Modals & Feedback
  const [copySuccess, setCopySuccess] = useState(false);
  const [compared, setCompared] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("Inaccurate Information");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [isFollowingStore, setIsFollowingStore] = useState(false);

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(maxQuantity, prev + 1));
  };

  const handleAddToCart = async () => {
    if (!productId) return;
    try {
      setIsLoading(true);
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, variantId: selectedVariantId }),
      });
      if (res.ok) {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2500);
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/checkout");
  };

  const handleToggleWishlist = async () => {
    if (!productId) return;
    try {
      if (!wishlisted) {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        setWishlisted(true);
      } else {
        await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
        setWishlisted(false);
      }
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleCompare = () => {
    if (!productId) return;
    try {
      const existing = JSON.parse(localStorage.getItem("africart_compare") || "[]");
      if (!existing.includes(productId)) {
        existing.push(productId);
        localStorage.setItem("africart_compare", JSON.stringify(existing));
      }
      setCompared(true);
      setTimeout(() => setCompared(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setIsReportModalOpen(false);
      setReportSubmitted(false);
    }, 1500);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Quantity & Stock */}
      <div className="space-y-1">
        <label className="block text-[10px] sm:text-xs font-bold uppercase text-gray-700 tracking-wider">
          Quantity
        </label>
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center border border-gray-200 rounded-xl bg-gray-50 p-0.5 shadow-2xs">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="p-1 sm:p-2 hover:bg-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-700"
            >
              <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
            <span className="px-2.5 sm:px-4 font-black text-gray-900 text-xs sm:text-base">{quantity}</span>
            <button
              onClick={increaseQuantity}
              disabled={quantity >= maxQuantity}
              className="p-1 sm:p-2 hover:bg-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-700"
            >
              <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-gray-500">
            {maxQuantity} available
          </span>
        </div>
      </div>

      {/* Primary Desktop/Tablet Actions */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-0.5">
        <Button
          size="lg"
          className="h-9 sm:h-12 rounded-xl sm:rounded-2xl gap-1.5 gradient-primary text-white font-extrabold text-xs sm:text-base shadow-2xs hover:opacity-95"
          disabled={!inStock || isLoading}
          onClick={handleAddToCart}
        >
          {addedToCart ? <Check className="h-3.5 w-3.5 text-white" /> : <ShoppingCart className="h-3.5 w-3.5" />}
          {addedToCart ? "Added!" : "Add to Cart"}
        </Button>
        <Button
          size="lg"
          className="h-9 sm:h-12 rounded-xl sm:rounded-2xl gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs sm:text-base shadow-2xs"
          disabled={!inStock || isLoading}
          onClick={handleBuyNow}
        >
          <Zap className="h-3.5 w-3.5 fill-white" />
          Buy Now
        </Button>
      </div>

      {/* Sticky Mobile Purchase Bar (<768px) */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2 shadow-xl flex items-center justify-between gap-2">
        <div className="flex flex-col min-w-0">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Price</span>
          <span className="text-sm font-black text-emerald-700 truncate">
            GH₵{Number(selectedVariantPrice || 0).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-1 justify-end">
          <Button
            size="sm"
            className="h-9 rounded-xl gap-1 gradient-primary text-white font-extrabold text-xs flex-1 shadow-2xs"
            disabled={!inStock || isLoading}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {addedToCart ? "Added" : "Add to Cart"}
          </Button>
          <Button
            size="sm"
            className="h-9 rounded-xl gap-1 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs flex-1 shadow-2xs"
            disabled={!inStock || isLoading}
            onClick={handleBuyNow}
          >
            <Zap className="h-3.5 w-3.5 fill-white" />
            Buy Now
          </Button>
        </div>
      </div>

      {/* Secondary Product Actions Toolbar */}
      <div className="grid grid-cols-4 gap-2 pt-2 text-xs">
        <Button
          variant="outline"
          onClick={handleToggleWishlist}
          className={`h-11 rounded-xl gap-1.5 font-bold ${
            wishlisted ? "bg-red-50 text-red-600 border-red-200" : "border-gray-200 text-gray-700"
          }`}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-red-600 text-red-600" : ""}`} />
          <span className="hidden sm:inline">{wishlisted ? "Saved" : "Wishlist"}</span>
        </Button>

        <Button
          variant="outline"
          onClick={handleCopyLink}
          className="h-11 rounded-xl gap-1.5 font-bold border-gray-200 text-gray-700"
        >
          {copySuccess ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          <span className="hidden sm:inline">{copySuccess ? "Copied!" : "Copy Link"}</span>
        </Button>

        <Button
          variant="outline"
          onClick={handleCompare}
          className={`h-11 rounded-xl gap-1.5 font-bold border-gray-200 text-gray-700 ${
            compared ? "bg-emerald-50 text-emerald-800" : ""
          }`}
        >
          <Layers className="h-4 w-4 text-emerald-600" />
          <span className="hidden sm:inline">{compared ? "Added!" : "Compare"}</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => setIsReportModalOpen(true)}
          className="h-11 rounded-xl gap-1.5 font-bold border-gray-200 text-gray-700 hover:text-red-600"
        >
          <Flag className="h-4 w-4" />
          <span className="hidden sm:inline">Report</span>
        </Button>
      </div>

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Flag className="h-5 w-5 text-red-600" />
              Report Product Listing
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Report incorrect details, counterfeit items, or policy violations to AfriCart Moderation.
            </p>

            {reportSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 text-sm font-bold rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Report submitted successfully for review!
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Reason</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs bg-white font-semibold"
                  >
                    <option value="Inaccurate Information">Inaccurate Information / Misleading Specs</option>
                    <option value="Counterfeit or Replica">Counterfeit or Fake Product</option>
                    <option value="Prohibited Item">Prohibited or Illegal Item</option>
                    <option value="Pricing Fraud">Pricing Fraud or Scam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Details (Optional)</label>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide additional details to assist our team..."
                    rows={3}
                    className="w-full p-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsReportModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold">
                    Submit Report
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

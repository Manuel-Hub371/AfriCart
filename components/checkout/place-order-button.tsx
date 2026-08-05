"use client";

import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaceOrderButtonProps {
  isProcessing: boolean;
  isDisabled: boolean;
  onPlaceOrder: () => void;
  total?: number;
}

export default function PlaceOrderButton({
  isProcessing,
  isDisabled,
  onPlaceOrder,
  total,
}: PlaceOrderButtonProps) {
  return (
    <Button
      onClick={onPlaceOrder}
      disabled={isDisabled || isProcessing}
      className="w-full h-12 text-base font-semibold"
      size="lg"
    >
      {isProcessing ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Processing Payment...
        </>
      ) : (
        <>
          <Lock className="h-5 w-5 mr-2" />
          {total ? `Place Order - $${total}` : "Place Order"}
        </>
      )}
    </Button>
  );
}

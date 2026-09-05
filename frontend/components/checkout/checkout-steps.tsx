"use client";

import { ShoppingCart, Truck, CreditCard, CheckCircle } from "lucide-react";

interface CheckoutStepsProps {
  currentStep: number;
}

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { number: 1, name: "Cart", icon: ShoppingCart },
    { number: 2, name: "Delivery", icon: Truck },
    { number: 3, name: "Payment", icon: CreditCard },
    { number: 4, name: "Confirmation", icon: CheckCircle },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all ${
                  step.number <= currentStep
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                <step.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span
                className={`mt-2 text-xs sm:text-sm font-medium ${
                  step.number <= currentStep
                    ? "text-emerald-600"
                    : "text-gray-400"
                }`}
              >
                {step.name}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 sm:mx-4">
                <div
                  className={`h-full transition-all ${
                    step.number < currentStep ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

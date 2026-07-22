"use client";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["customer", "vendor", "admin"]}>
      {children}
    </ProtectedRoute>
  );
}

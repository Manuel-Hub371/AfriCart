"use client";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["vendor", "admin"]}>
      {children}
    </ProtectedRoute>
  );
}

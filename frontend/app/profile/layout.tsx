"use client";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["customer", "vendor", "admin"]}>
      {children}
    </ProtectedRoute>
  );
}

import { AdminShell } from "@/components/admin/admin-shell";

export const metadata = {
  title: "Admin Dashboard | AfriCart",
  description: "AfriCart Administrator Control Center & Vendor Verification System",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}

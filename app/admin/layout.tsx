import { AdminLayout } from "@/components/admin/admin-layout";

export const metadata = {
  title: "Admin Dashboard | AfriCart",
  description: "AfriCart Administrator Control Center & Vendor Verification System",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

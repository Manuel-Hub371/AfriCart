import { AdminOverview } from "@/components/admin/admin-overview";

/**
 * Legacy overview route. The canonical dashboard now lives at
 * /admin/dashboard (see app/admin/dashboard/page.tsx); this route renders the
 * same component so existing /admin bookmarks and redirects keep working.
 */
export default function AdminOverviewPage() {
  return <AdminOverview />;
}
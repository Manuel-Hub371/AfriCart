"use client";

import { useState, useEffect, useMemo } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { CustomerStatistics } from "@/components/vendor/customer-statistics";
import { CustomerToolbar } from "@/components/vendor/customer-toolbar";
import { CustomersTable, Customer } from "@/components/vendor/customers-table";
import { CustomerPagination } from "@/components/vendor/customer-pagination";
import { CustomerProfileDrawer } from "@/components/vendor/customer-profile-drawer";
import { CustomerEmptyState } from "@/components/vendor/customer-empty-state";
import { Download, Loader2 } from "lucide-react";

export default function CustomersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/vendor/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = c.name?.toLowerCase().includes(query);
        const matchEmail = c.email?.toLowerCase().includes(query);
        const matchPhone = c.phone?.toLowerCase().includes(query);
        if (!matchName && !matchEmail && !matchPhone) return false;
      }
      return true;
    });
  }, [customers, searchQuery]);

  const totalCustomers = filteredCustomers.length;
  const totalPages = Math.max(1, Math.ceil(totalCustomers / itemsPerPage));
  const currentCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleExport = () => {
    if (customers.length === 0) return;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Name,Email,Phone,Total Orders,Lifetime Spend,Last Purchase"]
        .concat(
          customers.map(
            (c) => `"${c.name}","${c.email}","${c.phone}",${c.totalOrders},${c.lifetimeSpend},"${c.lastPurchase}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vendor_customers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <VendorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <VendorTopbar
          onMenuClick={() => setSidebarOpen(true)}
          breadcrumbs={[
            { label: "Dashboard", href: "/vendor" },
            { label: "Customers" },
          ]}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
                  Store Customers
                </h1>
                <p className="text-gray-600 text-sm">
                  Track and manage buyers who have purchased products from your store.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={customers.length === 0}
                  className="h-10 px-4 border-gray-200 hover:bg-gray-50 rounded-xl"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
              <CustomerToolbar
                onSearch={setSearchQuery}
                onFilterChange={setFilters}
                onExport={handleExport}
                onRefresh={loadCustomers}
                onSort={setSortBy}
                onSendPromotion={() => {}}
              />
            </div>

            {isLoading ? (
              <div className="py-24 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
                <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mx-auto mb-3" />
                <p className="text-gray-500 font-medium text-sm">Loading customer accounts...</p>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <CustomerEmptyState
                onRefresh={loadCustomers}
                onClearFilters={handleClearFilters}
              />
            ) : (
              <>
                {/* Customers Table */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
                  <CustomersTable
                    customers={currentCustomers}
                    onViewCustomer={handleViewCustomer}
                    onSort={(column) => console.log("Sort by:", column)}
                  />
                </div>

                {/* Pagination */}
                <div className="bg-white rounded-2xl border border-gray-200 px-6 py-4 shadow-sm">
                  <CustomerPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalCustomers}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(items) => {
                      setItemsPerPage(items);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Customer Profile Drawer */}
      <CustomerProfileDrawer
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
}

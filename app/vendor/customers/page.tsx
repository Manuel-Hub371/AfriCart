"use client";

import { useState } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { CustomerStatistics } from "@/components/vendor/customer-statistics";
import { CustomerToolbar } from "@/components/vendor/customer-toolbar";
import { CustomersTable, Customer } from "@/components/vendor/customers-table";
import { CustomerPagination } from "@/components/vendor/customer-pagination";
import { CustomerProfileDrawer } from "@/components/vendor/customer-profile-drawer";
import { CustomerEmptyState } from "@/components/vendor/customer-empty-state";
import { Download, Send } from "lucide-react";
import type { CustomerStatus } from "@/components/vendor/customer-status-badge";

export default function CustomersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Mock data - replace with actual API call
  const mockCustomers: Customer[] = Array.from({ length: 100 }, (_, i) => {
    const firstNames = [
      "John", "Sarah", "Michael", "Emily", "David",
      "Jessica", "Daniel", "Ashley", "Christopher", "Amanda"
    ];
    const lastNames = [
      "Smith", "Johnson", "Brown", "Davis", "Wilson",
      "Martinez", "Garcia", "Rodriguez", "Lee", "Taylor"
    ];
    
    const firstName = firstNames[i % 10];
    const lastName = lastNames[(i * 3) % 10];
    const name = `${firstName} ${lastName}`;
    
    const totalOrders = ((i * 7 + 3) % 20) + 1;
    const lifetimeSpend = ((i * 123 + 456) % 2000) + 100;
    
    return {
      id: `customer-${i + 1}`,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `+1 (555) ${String((i * 123) % 900 + 100).padStart(3, '0')}-${String((i * 456) % 10000).padStart(4, '0')}`,
      country: ["USA", "Canada", "UK", "Australia", "Germany"][i % 5],
      city: ["New York", "Toronto", "London", "Sydney", "Berlin"][i % 5],
      totalOrders,
      lifetimeSpend,
      averageOrderValue: lifetimeSpend / totalOrders,
      lastPurchase: new Date(Date.now() - (i * 3 * 86400000)).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: (["new", "returning", "vip", "inactive"] as const)[
        totalOrders === 1 ? 0 : totalOrders > 10 ? 2 : totalOrders > 5 ? 1 : 3
      ] as CustomerStatus,
      registrationDate: new Date(Date.now() - (i * 30 * 86400000)).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    };
  });

  const totalCustomers = mockCustomers.length;
  const totalPages = Math.ceil(totalCustomers / itemsPerPage);
  const currentCustomers = mockCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleExport = () => {
    console.log("Exporting customers...");
  };

  const handleRefresh = () => {
    console.log("Refreshing customers...");
  };

  const handleSendPromotion = () => {
    console.log("Send promotion...");
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  const showEmptyState = false; // Change based on actual filter results

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Customers
                </h1>
                <p className="text-gray-600">
                  Manage customers who have purchased from your store and strengthen relationships
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="h-10 px-4 border-gray-200 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Statistics */}
            <CustomerStatistics />

            {/* Toolbar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
              <CustomerToolbar
                onSearch={setSearchQuery}
                onFilterChange={setFilters}
                onExport={handleExport}
                onRefresh={handleRefresh}
                onSort={setSortBy}
                onSendPromotion={handleSendPromotion}
              />
            </div>

            {showEmptyState ? (
              <CustomerEmptyState
                onRefresh={handleRefresh}
                onClearFilters={handleClearFilters}
              />
            ) : (
              <>
                {/* Customers Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                  <CustomersTable
                    customers={currentCustomers}
                    onViewCustomer={handleViewCustomer}
                    onSort={(column) => console.log("Sort by:", column)}
                  />
                </div>

                {/* Pagination */}
                <div className="bg-white rounded-xl border border-gray-200 px-6 py-4">
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

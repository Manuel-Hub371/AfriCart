"use client";

import { useState, useMemo } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { SupportOverviewCards } from "@/components/vendor/support-overview-cards";
import { SupportCategoryCard } from "@/components/vendor/support-category-card";
import { TicketTable, Ticket, TicketStatus, TicketPriority } from "@/components/vendor/ticket-table";
import { ContactSupportCards } from "@/components/vendor/contact-support-cards";
import { 
  Plus, 
  Search,
  ShoppingCart,
  DollarSign,
  Package,
  User,
  Truck,
  Bug
} from "lucide-react";

// Generate deterministic mock tickets
function generateTickets(count: number): Ticket[] {
  const tickets: Ticket[] = [];
  
  const subjects = [
    "Payment not received for order #12345",
    "Product approval pending",
    "Shipping label generation issue",
    "Customer dispute on order",
    "Account verification problem",
    "Dashboard loading slowly",
    "Missing payout from last week",
    "Product listing rejected",
    "Unable to update inventory",
    "Refund request question",
  ];

  const categories = ["Orders", "Payments", "Products", "Shipping", "Account", "Technical"];
  const statuses: TicketStatus[] = ["open", "pending", "awaiting-reply", "in-progress", "resolved", "closed"];
  const priorities: TicketPriority[] = ["low", "medium", "high", "urgent"];

  for (let i = 0; i < count; i++) {
    const day = (i * 2) % 28 + 1;
    const statusIndex = (i * 3) % statuses.length;
    const priorityIndex = (i * 2) % priorities.length;
    
    tickets.push({
      id: `TKT-${(10000 + i).toString()}`,
      subject: subjects[i % subjects.length],
      category: categories[i % categories.length],
      priority: priorities[priorityIndex],
      status: statuses[statusIndex],
      lastUpdate: `${Math.floor((Date.now() - i * 3600000) / 3600000)}h ago`,
      createdDate: `July ${day}, 2026`,
    });
  }

  return tickets;
}

export default function VendorSupportPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Generate mock tickets
  const tickets = useMemo(() => generateTickets(30), []);

  const handleCreateTicket = () => {
    console.log("Create ticket");
  };

  const handleViewTicket = (id: string) => {
    console.log("View ticket:", id);
  };

  const handleCategoryClick = (category: string) => {
    console.log("Category clicked:", category);
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
            { label: "Support" },
          ]}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Support Center
                </h1>
                <p className="text-gray-600">
                  Get help, resolve issues, and manage your support requests
                </p>
              </div>
              <Button
                onClick={handleCreateTicket}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Ticket
              </Button>
            </div>

            {/* Support Overview */}
            <SupportOverviewCards />

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help articles, tickets, or common issues..."
                  className="w-full h-14 pl-12 pr-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Quick Help Categories */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Help</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SupportCategoryCard
                  title="Orders"
                  icon={ShoppingCart}
                  topics={[
                    "Order issues",
                    "Cancellations",
                    "Returns",
                    "Customer disputes",
                  ]}
                  color="bg-blue-600"
                  onClick={() => handleCategoryClick("orders")}
                />
                <SupportCategoryCard
                  title="Payments"
                  icon={DollarSign}
                  topics={[
                    "Missing payouts",
                    "Payout delays",
                    "Transaction issues",
                    "Commission questions",
                  ]}
                  color="bg-emerald-600"
                  onClick={() => handleCategoryClick("payments")}
                />
                <SupportCategoryCard
                  title="Products"
                  icon={Package}
                  topics={[
                    "Product approval",
                    "Listing problems",
                    "Category issues",
                    "Inventory management",
                  ]}
                  color="bg-purple-600"
                  onClick={() => handleCategoryClick("products")}
                />
                <SupportCategoryCard
                  title="Account"
                  icon={User}
                  topics={[
                    "Verification",
                    "Login problems",
                    "Security settings",
                    "Profile updates",
                  ]}
                  color="bg-orange-600"
                  onClick={() => handleCategoryClick("account")}
                />
                <SupportCategoryCard
                  title="Shipping"
                  icon={Truck}
                  topics={[
                    "Delivery issues",
                    "Tracking problems",
                    "Courier issues",
                    "Shipping rates",
                  ]}
                  color="bg-cyan-600"
                  onClick={() => handleCategoryClick("shipping")}
                />
                <SupportCategoryCard
                  title="Technical"
                  icon={Bug}
                  topics={[
                    "Website errors",
                    "Dashboard issues",
                    "Bugs and glitches",
                    "Performance problems",
                  ]}
                  color="bg-red-600"
                  onClick={() => handleCategoryClick("technical")}
                />
              </div>
            </div>

            {/* Active Tickets */}
            <div className="mb-8">
              <TicketTable
                tickets={tickets}
                onViewDetails={handleViewTicket}
              />
            </div>

            {/* Contact Support */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Support</h2>
              <ContactSupportCards />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

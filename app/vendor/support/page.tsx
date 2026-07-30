"use client";

import { useState, useEffect } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { SupportOverviewCards } from "@/components/vendor/support-overview-cards";
import { SupportCategoryCard } from "@/components/vendor/support-category-card";
import { TicketTable, Ticket } from "@/components/vendor/ticket-table";
import { ContactSupportCards } from "@/components/vendor/contact-support-cards";
import { 
  Plus, 
  Search,
  ShoppingCart,
  DollarSign,
  Package,
  User,
  Truck,
  Bug,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function VendorSupportPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // New ticket modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Orders");
  const [priority, setPriority] = useState("medium");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/vendor/support/tickets");
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!subject.trim()) {
      setSubmitError("Subject title is required.");
      return;
    }
    if (!message.trim()) {
      setSubmitError("Message description is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/vendor/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, category, priority, message }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create ticket");
      }

      setSubmitSuccess("Ticket created successfully!");
      setSubject("");
      setMessage("");
      fetchTickets();
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(null);
      }, 1000);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewTicket = (id: string) => {
    console.log("View ticket:", id);
  };

  const handleCategoryClick = (category: string) => {
    setSearchQuery(category);
  };

  const filteredTickets = tickets.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.subject.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
  });

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
                onClick={() => setIsModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Ticket
              </Button>
            </div>

            {/* Support Overview */}
            <SupportOverviewCards tickets={tickets} />

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
                  onClick={() => handleCategoryClick("Orders")}
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
                  onClick={() => handleCategoryClick("Payments")}
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
                  onClick={() => handleCategoryClick("Products")}
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
                  onClick={() => handleCategoryClick("Account")}
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
                  onClick={() => handleCategoryClick("Shipping")}
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
                  onClick={() => handleCategoryClick("Technical")}
                />
              </div>
            </div>

            {/* Active Tickets */}
            <div className="mb-8">
              <TicketTable
                tickets={filteredTickets}
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

      {/* Create Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-1">Create Support Ticket</h2>
            <p className="text-sm text-gray-500 mb-6">Submit your inquiry or technical issue to the AfriCart Support Team.</p>

            {submitError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm mb-4">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {submitError}
              </div>
            )}

            {submitSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-sm mb-4 font-bold">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                {submitSuccess}
              </div>
            )}

            <form onSubmit={handleCreateTicketSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Subject Title *</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Payment issue on order #12345"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                  >
                    <option value="Orders">Orders</option>
                    <option value="Payments">Payments</option>
                    <option value="Products">Products</option>
                    <option value="Shipping">Shipping</option>
                    <option value="Account">Account</option>
                    <option value="Technical">Technical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Description *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or question in detail..."
                  rows={4}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Ticket"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

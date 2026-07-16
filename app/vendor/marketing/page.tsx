"use client";

import { useState, useMemo } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { MarketingStatistics } from "@/components/vendor/marketing-statistics";
import { CampaignFilters } from "@/components/vendor/campaign-filters";
import { CampaignSearch } from "@/components/vendor/campaign-search";
import { CampaignToolbar } from "@/components/vendor/campaign-toolbar";
import { CampaignsList } from "@/components/vendor/campaigns-list";
import { CampaignPagination } from "@/components/vendor/campaign-pagination";
import { MarketingEmptyState } from "@/components/vendor/marketing-empty-state";
import { CampaignPerformanceChart } from "@/components/vendor/campaign-performance-chart";
import { CouponRedemptionChart } from "@/components/vendor/coupon-redemption-chart";
import { CampaignDrawer } from "@/components/vendor/campaign-drawer";
import { Campaign, CampaignType, CampaignStatus } from "@/components/vendor/campaign-card";

// Generate deterministic mock campaigns
function generateCampaigns(count: number): Campaign[] {
  const campaigns: Campaign[] = [];
  
  const types: CampaignType[] = [
    "percentage-discount",
    "fixed-discount",
    "bogo",
    "bundle",
    "free-shipping",
    "category-discount",
    "product-discount",
    "minimum-spend",
  ];
  
  const statuses: CampaignStatus[] = ["active", "scheduled", "paused", "ended"];
  
  const names = [
    "Summer Sale 2026",
    "Back to School Deal",
    "Black Friday Bonanza",
    "Cyber Monday Special",
    "New Year Kickoff",
    "Valentine's Day Romance",
    "Spring Clearance",
    "Holiday Season Sale",
    "Flash Weekend Deal",
    "Member Exclusive Offer",
    "First Time Buyer Discount",
    "Category Mega Sale",
    "Bundle & Save Campaign",
    "Free Shipping Event",
    "Minimum Purchase Promo",
    "Product Launch Sale",
    "Anniversary Celebration",
    "Customer Appreciation Day",
    "Early Bird Special",
    "Last Chance Clearance",
  ];

  for (let i = 0; i < count; i++) {
    const typeIndex = (i * 7) % types.length;
    const statusIndex = (i * 3) % statuses.length;
    const nameIndex = i % names.length;
    
    const startDay = 1 + (i * 3) % 28;
    const endDay = startDay + 7 + (i * 2) % 14;
    
    const revenue = 5000 + (i * 347) % 45000;
    const orders = 20 + (i * 13) % 180;
    const conversionRate = 2.5 + ((i * 23) % 75) / 10;
    
    const discountValue = 10 + (i * 5) % 40;
    let discount = "";
    
    switch (types[typeIndex]) {
      case "percentage-discount":
        discount = `${discountValue}% off`;
        break;
      case "fixed-discount":
        discount = `$${discountValue} off`;
        break;
      case "bogo":
        discount = "Buy 1 Get 1 Free";
        break;
      case "bundle":
        discount = `${discountValue}% off bundles`;
        break;
      case "free-shipping":
        discount = "Free Shipping";
        break;
      case "category-discount":
        discount = `${discountValue}% off category`;
        break;
      case "product-discount":
        discount = `${discountValue}% off products`;
        break;
      case "minimum-spend":
        discount = `$${discountValue} off $${discountValue * 5}+`;
        break;
    }

    campaigns.push({
      id: `campaign-${i + 1}`,
      name: `${names[nameIndex]} ${i > 19 ? Math.floor(i / 20) + 1 : ""}`.trim(),
      type: types[typeIndex],
      startDate: `July ${startDay}, 2026`,
      endDate: `July ${endDay}, 2026`,
      status: statuses[statusIndex],
      revenue,
      orders,
      conversionRate: parseFloat(conversionRate.toFixed(1)),
      discount,
    });
  }

  return campaigns;
}

const ITEMS_PER_PAGE = 24;

export default function VendorMarketingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Generate mock data
  const allCampaigns = useMemo(() => generateCampaigns(100), []);

  // Filter and sort campaigns
  const filteredCampaigns = useMemo(() => {
    let result = [...allCampaigns];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((campaign) =>
        campaign.name.toLowerCase().includes(query) ||
        campaign.discount.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      result = result.filter((campaign) =>
        filters.status.includes(campaign.status)
      );
    }

    // Type filter
    if (filters.type && filters.type.length > 0) {
      result = result.filter((campaign) => filters.type.includes(campaign.type));
    }

    // Sort
    switch (sortBy) {
      case "newest":
        // Already in order
        break;
      case "highest-revenue":
        result.sort((a, b) => b.revenue - a.revenue);
        break;
      case "most-orders":
        result.sort((a, b) => b.orders - a.orders);
        break;
      case "best-conversion":
        result.sort((a, b) => b.conversionRate - a.conversionRate);
        break;
    }

    return result;
  }, [allCampaigns, searchQuery, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (newFilters: Record<string, string[]>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSort = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateCampaign = () => {
    console.log("Create campaign");
  };

  const handleCreateCoupon = () => {
    console.log("Create coupon");
  };

  const handleExport = () => {
    console.log("Export campaigns");
  };

  const handleRefresh = () => {
    console.log("Refresh data");
  };

  const handleEdit = (id: string) => {
    console.log("Edit campaign:", id);
  };

  const handlePause = (id: string) => {
    console.log("Pause campaign:", id);
  };

  const handleResume = (id: string) => {
    console.log("Resume campaign:", id);
  };

  const handleDuplicate = (id: string) => {
    console.log("Duplicate campaign:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete campaign:", id);
  };

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setDrawerOpen(true);
  };

  const showEmptyState = filteredCampaigns.length === 0 && !searchQuery && Object.keys(filters).length === 0;

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
            { label: "Marketing" },
          ]}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Marketing Center
                  </h1>
                  <p className="text-gray-600">
                    Create promotions, increase conversions, and grow your store with powerful marketing tools
                  </p>
                </div>
                <CampaignToolbar
                  onCreateCampaign={handleCreateCampaign}
                  onExport={handleExport}
                  onRefresh={handleRefresh}
                />
              </div>
            </div>

            {/* Empty State */}
            {showEmptyState ? (
              <MarketingEmptyState
                onCreateCampaign={handleCreateCampaign}
                onCreateCoupon={handleCreateCoupon}
              />
            ) : (
              <>
                {/* Marketing Statistics */}
                <MarketingStatistics />

                {/* Analytics Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <CampaignPerformanceChart />
                  <CouponRedemptionChart />
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl border border-gray-200 mb-6">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <CampaignSearch
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search campaigns by name or discount..."
                      />
                      <CampaignFilters
                        onFilterChange={handleFilterChange}
                        onSort={handleSort}
                      />
                    </div>
                  </div>

                  {/* Campaign Count */}
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <p className="text-sm text-gray-600">
                      Showing <span className="font-medium text-gray-900">{filteredCampaigns.length}</span> campaigns
                      {searchQuery && ` matching "${searchQuery}"`}
                    </p>
                  </div>

                  {/* Campaigns List or No Results */}
                  {paginatedCampaigns.length > 0 ? (
                    <div className="p-6">
                      <CampaignsList
                        campaigns={paginatedCampaigns}
                        onEdit={handleEdit}
                        onPause={handlePause}
                        onResume={handleResume}
                        onDuplicate={handleDuplicate}
                        onDelete={handleDelete}
                        onViewDetails={handleViewDetails}
                      />
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No campaigns found
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Try adjusting your search or filters to find what you're looking for.
                      </p>
                    </div>
                  )}

                  {/* Pagination */}
                  {paginatedCampaigns.length > 0 && totalPages > 1 && (
                    <CampaignPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={filteredCampaigns.length}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={handlePageChange}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Campaign Details Drawer */}
      <CampaignDrawer
        campaign={selectedCampaign}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}

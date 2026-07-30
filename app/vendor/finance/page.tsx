"use client";

import { useState, useEffect } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { DateRangePicker, DateRange } from "@/components/vendor/date-range-picker";
import { FinanceSummaryCard } from "@/components/vendor/finance-summary-card";
import { RevenueOverviewChart } from "@/components/vendor/revenue-overview-chart";
import { EarningsBreakdown } from "@/components/vendor/earnings-breakdown";
import { PayoutCard } from "@/components/vendor/payout-card";
import { TransactionTable } from "@/components/vendor/transaction-table";
import { TransactionDrawer } from "@/components/vendor/transaction-drawer";
import { WithdrawalDialog } from "@/components/vendor/withdrawal-dialog";
import { 
  Download, 
  FileText,
  DollarSign,
  TrendingUp,
  CreditCard,
  Wallet,
  ArrowUpRight,
  Clock,
  Loader2
} from "lucide-react";

export default function VendorFinancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>("last-30-days");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [transactionDrawerOpen, setTransactionDrawerOpen] = useState(false);
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);

  const [financeData, setFinanceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFinance() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/vendor/finance");
        if (res.ok) {
          const data = await res.json();
          setFinanceData(data);
        }
      } catch (err) {
        console.error("Failed to fetch vendor finance stats:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFinance();
  }, []);

  const summary = financeData?.summary || {};
  const transactions = financeData?.transactions || [];

  const handleExportReport = () => {
    if (transactions.length === 0) return;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Transaction ID,Customer,Gross Amount,Fee,Net Amount,Status,Date"]
        .concat(
          transactions.map(
            (t: any) => `"${t.id}","${t.customer}",${t.grossAmount},${t.fee},${t.netAmount},"${t.status}","${t.date}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vendor_finance_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewTransaction = (id: string) => {
    const transaction = transactions.find((t: any) => t.id === id || t.fullId === id);
    if (transaction) {
      setSelectedTransaction(transaction);
      setTransactionDrawerOpen(true);
    }
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
            { label: "Finance" },
          ]}
        />

        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
                  Financial Dashboard
                </h1>
                <p className="text-gray-600 text-sm">
                  Track real store gross earnings, platform commissions, net payouts, and transaction history.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <DateRangePicker value={dateRange} onChange={setDateRange} />
                <Button
                  variant="outline"
                  onClick={handleExportReport}
                  className="h-10 px-4 border-gray-200 hover:bg-gray-50 rounded-xl"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="py-24 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
                <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mx-auto mb-3" />
                <p className="text-gray-500 font-medium text-sm">Loading financial data...</p>
              </div>
            ) : (
              <>
                {/* Financial Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  <FinanceSummaryCard
                    title="Gross Sales"
                    value={summary.grossRevenue || 0}
                    change={12.5}
                    trend="up"
                    icon={DollarSign}
                    description="Customer purchases before fees"
                  />
                  <FinanceSummaryCard
                    title="Platform Commission"
                    value={summary.platformFees || 0}
                    change={10.0}
                    trend="up"
                    icon={CreditCard}
                    description="Standard marketplace commission (10%)"
                  />
                  <FinanceSummaryCard
                    title="Net Earnings"
                    value={summary.netEarnings || 0}
                    change={14.2}
                    trend="up"
                    icon={Wallet}
                    description="Your net store earnings"
                    highlight={true}
                  />
                  <FinanceSummaryCard
                    title="Pending Payouts"
                    value={summary.pendingPayouts || 0}
                    icon={Clock}
                    description="In-flight processing orders"
                  />
                  <FinanceSummaryCard
                    title="Completed Payouts"
                    value={summary.completedPayouts || 0}
                    change={15.0}
                    trend="up"
                    icon={ArrowUpRight}
                    description="Completed delivered orders"
                  />
                </div>

                {/* Revenue Overview Chart */}
                <div className="mb-8">
                  <RevenueOverviewChart />
                </div>

                {/* Earnings Breakdown and Payout Card */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <EarningsBreakdown />
                  <PayoutCard
                    availableBalance={summary.completedPayouts || 0}
                    pendingAmount={summary.pendingPayouts || 0}
                    nextPayoutDate="Automatic Bi-Weekly Payout"
                    minimumPayout={50}
                    onWithdraw={() => setWithdrawalDialogOpen(true)}
                  />
                </div>

                {/* Transaction History */}
                <TransactionTable
                  transactions={transactions}
                  onViewDetails={handleViewTransaction}
                />
              </>
            )}
          </div>
        </main>
      </div>

      {/* Transaction Details Drawer */}
      <TransactionDrawer
        transaction={selectedTransaction}
        isOpen={transactionDrawerOpen}
        onClose={() => setTransactionDrawerOpen(false)}
      />

      {/* Withdrawal Dialog */}
      <WithdrawalDialog
        isOpen={withdrawalDialogOpen}
        onClose={() => setWithdrawalDialogOpen(false)}
        availableBalance={summary.completedPayouts || 0}
        minimumAmount={50}
        paymentMethods={[]}
        onSubmit={() => setWithdrawalDialogOpen(false)}
      />
    </div>
  );
}

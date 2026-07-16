"use client";

import { useState, useMemo } from "react";
import VendorSidebar from "@/components/vendor/vendor-sidebar";
import VendorTopbar from "@/components/vendor/vendor-topbar";
import { Button } from "@/components/ui/button";
import { DateRangePicker, DateRange } from "@/components/vendor/date-range-picker";
import { FinanceSummaryCard } from "@/components/vendor/finance-summary-card";
import { RevenueOverviewChart } from "@/components/vendor/revenue-overview-chart";
import { EarningsBreakdown } from "@/components/vendor/earnings-breakdown";
import { PayoutCard } from "@/components/vendor/payout-card";
import { PayoutHistoryTable, Payout, PayoutStatus } from "@/components/vendor/payout-history-table";
import { TransactionTable, Transaction, TransactionType, TransactionStatus } from "@/components/vendor/transaction-table";
import { TransactionDrawer } from "@/components/vendor/transaction-drawer";
import { PaymentMethodCard, PaymentMethod, PaymentMethodType } from "@/components/vendor/payment-method-card";
import { WithdrawalDialog } from "@/components/vendor/withdrawal-dialog";
import { 
  Download, 
  FileText,
  DollarSign,
  TrendingUp,
  CreditCard,
  Wallet,
  ArrowUpRight,
  Plus,
  Clock
} from "lucide-react";

// Generate deterministic mock payouts
function generatePayouts(count: number): Payout[] {
  const payouts: Payout[] = [];
  const statuses: PayoutStatus[] = ["completed", "processing", "pending"];
  const methods = ["Bank Account (****1234)", "PayPal (****5678)", "Mobile Money (****9012)"];

  for (let i = 0; i < count; i++) {
    const day = (i * 7) % 28 + 1;
    const statusIndex = i < 3 ? i : 0; // First 3 are varied, rest completed
    
    payouts.push({
      id: `PO-${(10000 + i).toString().padStart(5, "0")}`,
      date: `July ${day}, 2026`,
      amount: 2000 + (i * 347) % 8000,
      paymentMethod: methods[i % methods.length],
      status: statuses[statusIndex],
      transactionId: `TXN-${(50000 + i * 123).toString()}`,
    });
  }

  return payouts;
}

// Generate deterministic mock transactions
function generateTransactions(count: number): Transaction[] {
  const transactions: Transaction[] = [];
  const types: TransactionType[] = ["sale", "refund", "commission", "withdrawal", "adjustment", "bonus"];
  const statuses: TransactionStatus[] = ["completed", "pending", "failed"];
  
  const customers = [
    "John Smith",
    "Sarah Johnson",
    "Michael Brown",
    "Emily Davis",
    "David Wilson",
  ];

  for (let i = 0; i < count; i++) {
    const typeIndex = (i * 3) % types.length;
    const type = types[typeIndex];
    const statusIndex = i < 5 ? (i % 3) : 0; // First 5 varied, rest completed
    
    const amount = 50 + (i * 23) % 450;
    const fees = Math.floor(amount * 0.125); // 12.5% fees
    const netAmount = amount - fees;
    
    const day = (i * 2) % 28 + 1;
    
    transactions.push({
      id: `TXN-${(100000 + i).toString().padStart(6, "0")}`,
      type,
      orderNumber: type === "sale" || type === "refund" ? `ORD-${(20000 + i * 7).toString()}` : undefined,
      customer: type === "sale" || type === "refund" ? customers[i % customers.length] : undefined,
      amount,
      fees,
      netAmount,
      status: statuses[statusIndex],
      date: `July ${day}, 2026`,
    });
  }

  return transactions;
}

// Mock payment methods
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm-1",
    type: "bank",
    name: "Wells Fargo Bank",
    accountNumber: "123456789012",
    isDefault: true,
  },
  {
    id: "pm-2",
    type: "paypal",
    name: "PayPal Account",
    accountNumber: "user@example.com",
    isDefault: false,
  },
  {
    id: "pm-3",
    type: "mobile",
    name: "M-Pesa",
    accountNumber: "+254712345678",
    isDefault: false,
  },
];

export default function VendorFinancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>("last-30-days");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionDrawerOpen, setTransactionDrawerOpen] = useState(false);
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);

  // Generate mock data
  const payouts = useMemo(() => generatePayouts(15), []);
  const transactions = useMemo(() => generateTransactions(100), []);

  const handleExportReport = () => {
    console.log("Export report...");
  };

  const handleDownloadStatement = () => {
    console.log("Download statement...");
  };

  const handleViewTransaction = (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    if (transaction) {
      setSelectedTransaction(transaction);
      setTransactionDrawerOpen(true);
    }
  };

  const handleViewPayout = (id: string) => {
    console.log("View payout:", id);
  };

  const handleWithdraw = () => {
    setWithdrawalDialogOpen(true);
  };

  const handleWithdrawalSubmit = (amount: number, methodId: string) => {
    console.log("Withdraw:", amount, methodId);
    // Handle withdrawal logic
  };

  const handleEditPaymentMethod = (id: string) => {
    console.log("Edit payment method:", id);
  };

  const handleDeletePaymentMethod = (id: string) => {
    console.log("Delete payment method:", id);
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    console.log("Set default payment method:", id);
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Finance Dashboard
                </h1>
                <p className="text-gray-600">
                  Track your earnings, payouts, transactions, and financial performance
                </p>
              </div>
              <div className="flex items-center gap-3">
                <DateRangePicker value={dateRange} onChange={setDateRange} />
                <Button
                  variant="outline"
                  onClick={handleDownloadStatement}
                  className="h-10 px-4 border-gray-200 hover:bg-gray-50"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Statement
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportReport}
                  className="h-10 px-4 border-gray-200 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <FinanceSummaryCard
                title="Total Sales"
                value={125000}
                change={15.3}
                trend="up"
                icon={DollarSign}
                description="Customer purchases before deductions"
              />
              <FinanceSummaryCard
                title="Gross Earnings"
                value={112500}
                change={14.8}
                trend="up"
                icon={TrendingUp}
                description="Before marketplace commission"
              />
              <FinanceSummaryCard
                title="Marketplace Commission"
                value={12500}
                change={12.5}
                trend="up"
                icon={CreditCard}
                description="Platform fees (10%)"
              />
              <FinanceSummaryCard
                title="Net Earnings"
                value={102750}
                change={16.2}
                trend="up"
                icon={Wallet}
                description="Your actual earnings"
                highlight={true}
              />
              <FinanceSummaryCard
                title="Pending Payout"
                value={8450}
                icon={Clock}
                description="Awaiting next payout cycle"
              />
              <FinanceSummaryCard
                title="Available Balance"
                value={15250}
                change={22.4}
                trend="up"
                icon={ArrowUpRight}
                description="Ready for withdrawal"
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
                availableBalance={15250}
                pendingAmount={8450}
                nextPayoutDate="July 22, 2026"
                minimumPayout={50}
                onWithdraw={handleWithdraw}
              />
            </div>

            {/* Payout History */}
            <div className="mb-8">
              <PayoutHistoryTable
                payouts={payouts}
                onViewDetails={handleViewPayout}
              />
            </div>

            {/* Payment Methods */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage your payout accounts and preferences
                  </p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Method
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockPaymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    onEdit={handleEditPaymentMethod}
                    onDelete={handleDeletePaymentMethod}
                    onSetDefault={handleSetDefaultPaymentMethod}
                  />
                ))}
              </div>
            </div>

            {/* Transaction History */}
            <TransactionTable
              transactions={transactions}
              onViewDetails={handleViewTransaction}
            />
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
        availableBalance={15250}
        minimumAmount={50}
        paymentMethods={mockPaymentMethods}
        onSubmit={handleWithdrawalSubmit}
      />
    </div>
  );
}

import { DashboardStats } from "@/components/DashboardStats";
import { ExpenseChart } from "@/components/ExpenseChart";
import { RecentTransactions } from "@/components/RecentTransactions";

export default function Dashboard() {
  const date = new Date();
  const monthYear = date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  return (
    <div className="bg-gradient-to-br from-background via-background to-finance-primary/5 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-finance-primary to-finance-accent bg-clip-text text-transparent">
          Financial Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your financial overview for {monthYear}
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Charts Section */}
      <div className="mb-8">
        <ExpenseChart />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import useUser from "@/hooks/useUser";
import useDashboardStats from "@/hooks/useDashboardStats";
import IncomeTableSkeleton from "@/components/skeletons/IncomeTableSkeleton";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function DashboardStats() {
  const { user } = useUser();
  const userId = user?.id ?? "";
  const stats = useDashboardStats(userId);

  if (stats.loading) {
    return <IncomeTableSkeleton />;
  }

  const expenseChange = calculatePercentageChange(
    stats.monthlyExpenses,
    stats.previousMonthExpenses
  );
  const incomeChange = calculatePercentageChange(
    stats.monthlyIncome,
    stats.previousMonthIncome
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Total Balance */}
      <Card className="bg-gradient-to-br from-finance-primary via-finance-primary/90 to-finance-accent">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-finance-primary-foreground/80">
            Total Balance
          </CardTitle>
          <Wallet className="h-4 w-4 text-finance-primary-foreground/80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-finance-primary-foreground">
            {formatCurrency(stats.totalBalance)}
          </div>
          <p className="text-xs text-finance-primary-foreground/70 mt-1">
            Available funds
          </p>
        </CardContent>
      </Card>

      {/* Monthly Income */}
      <Card className="border-finance-success/20 bg-gradient-to-br from-background to-finance-success/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Monthly Income
          </CardTitle>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4 text-finance-success" />
            <span className="text-xs text-finance-success font-medium">
              +{incomeChange.toFixed(1)}%
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-finance-success">
            {formatCurrency(stats.monthlyIncome)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            vs {formatCurrency(stats.previousMonthIncome)} last month
          </p>
        </CardContent>
      </Card>

      {/* Monthly Expenses */}
      <Card className="border-finance-warning/20 bg-gradient-to-br from-background to-finance-warning/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Monthly Expenses
          </CardTitle>
          <div className="flex items-center space-x-1">
            <TrendingDown className="h-4 w-4 text-finance-success" />
            <span className="text-xs text-finance-success font-medium">
              {expenseChange.toFixed(1)}%
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-finance-warning">
            {formatCurrency(stats.monthlyExpenses)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            vs {formatCurrency(stats.previousMonthExpenses)} last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

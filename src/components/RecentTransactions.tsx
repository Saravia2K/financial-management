"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useUser from "@/hooks/useUser";
import useRecentTransactions from "@/hooks/useRecentTransactions";
import useCategories from "@/hooks/useCategories";
import IncomeTableSkeleton from "@/components/skeletons/IncomeTableSkeleton";
import {
  ArrowUpRight,
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Zap,
  Gamepad2,
  PiggyBank,
  DollarSign,
  Briefcase,
  Gift,
  Heart,
  LucideIcon,
} from "lucide-react";

const expenseIconMap: Record<string, LucideIcon> = {
  Food: ShoppingBag,
  Transport: Car,
  Utilities: Zap,
  Housing: Home,
  Entertainment: Gamepad2,
  Coffee: Coffee,
  Other: Gift,
  Health: Heart,
};
const incomeIconMap: Record<string, LucideIcon> = {
  Salary: DollarSign,
  Bonus: Gift,
  Investment: PiggyBank,
  Business: Briefcase,
  Other: ArrowUpRight,
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function RecentTransactions() {
  const { user } = useUser();
  const userId = user?.id ?? "";
  const { transactions, loading } = useRecentTransactions(userId, 7);
  const { categories } = useCategories(userId);

  if (loading) {
    return <IncomeTableSkeleton />;
  }

  function getCategoryName(
    type: "income" | "expense",
    categoryId: number | null
  ) {
    if (!categoryId) return "Other";
    const arr = type === "income" ? categories.incomes : categories.expenses;
    return arr.find((c) => c.id === categoryId)?.name || "Other";
  }
  function getIcon(type: "income" | "expense", categoryName: string) {
    if (type === "income") return incomeIconMap[categoryName] || ArrowUpRight;
    return expenseIconMap[categoryName] || ShoppingBag;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Transactions
          <Badge variant="outline" className="text-xs">
            Last 7 days
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => {
            const categoryName = getCategoryName(
              transaction.type,
              transaction.category
            );
            const IconComponent = getIcon(transaction.type, categoryName);
            const isIncome = transaction.type === "income";
            return (
              <div
                key={`${transaction.type}-${transaction.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full ${
                      isIncome
                        ? "bg-finance-success/10 text-finance-success"
                        : "bg-finance-warning/10 text-finance-warning"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {categoryName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-medium text-sm ${
                      isIncome ? "text-finance-success" : "text-finance-warning"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

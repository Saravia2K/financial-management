"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import useUser from "@/hooks/useUser";
import useMonthlyIncomeExpenseChart from "@/hooks/useMonthlyIncomeExpenseChart";
import useExpenseCategoryChart from "@/hooks/useExpenseCategoryChart";
import IncomeTableSkeleton from "@/components/skeletons/IncomeTableSkeleton";

// Colores fijos para las barras de ingresos y gastos
const INCOME_COLOR = "#4ade80"; // verde
const EXPENSE_COLOR = "#f87171"; // rojo

export function ExpenseChart() {
  const { user } = useUser();
  const userId = user?.id ?? "";
  const { data: monthlyData, loading: loadingMonthly } =
    useMonthlyIncomeExpenseChart(userId);
  const { data: expenseCategories, loading: loadingCategories } =
    useExpenseCategoryChart(userId);

  if (loadingMonthly || loadingCategories) {
    return <IncomeTableSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Income vs Expenses Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Income vs Expenses
            <span className="text-sm font-normal text-muted-foreground">
              Last 4 months
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => `$${value}`}
              />
              <Bar dataKey="income" radius={[4, 4, 0, 0]} name="Income">
                {monthlyData.map((entry, idx) => (
                  <Cell key={`income-bar-${idx}`} fill={INCOME_COLOR} />
                ))}
              </Bar>
              <Bar dataKey="expenses" radius={[4, 4, 0, 0]} name="Expenses">
                {monthlyData.map((entry, idx) => (
                  <Cell key={`expense-bar-${idx}`} fill={EXPENSE_COLOR} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Leyenda de colores usados */}
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: INCOME_COLOR }}
              ></div>
              <span>Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: EXPENSE_COLOR }}
              ></div>
              <span>Expenses</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Expense Categories
            <span className="text-sm font-normal text-muted-foreground">
              This month
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseCategories}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={2}
                dataKey="value"
              >
                {expenseCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {expenseCategories.map((category, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-muted-foreground">{category.name}</span>
                <span className="font-medium ml-auto">${category.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

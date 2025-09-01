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

const monthlyData = [
  { month: "Jan", income: 4000, expenses: 3200 },
  { month: "Feb", income: 4100, expenses: 2900 },
  { month: "Mar", income: 4000, expenses: 3100 },
  { month: "Apr", income: 4200, expenses: 2850 },
];

const expenseCategories = [
  { name: "Housing", value: 1200, color: "hsl(var(--finance-primary))" },
  { name: "Food", value: 450, color: "hsl(var(--finance-accent))" },
  { name: "Transport", value: 320, color: "hsl(var(--finance-success))" },
  { name: "Entertainment", value: 280, color: "hsl(var(--finance-warning))" },
  { name: "Utilities", value: 200, color: "hsl(var(--finance-muted))" },
  { name: "Other", value: 400, color: "hsl(var(--finance-secondary))" },
];

export function ExpenseChart() {
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
              <Bar
                dataKey="income"
                fill="hsl(var(--finance-success))"
                radius={[4, 4, 0, 0]}
                name="Income"
              />
              <Bar
                dataKey="expenses"
                fill="hsl(var(--finance-warning))"
                radius={[4, 4, 0, 0]}
                name="Expenses"
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-finance-success"></div>
              <span>Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-finance-warning"></div>
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

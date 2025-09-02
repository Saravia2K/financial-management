import { useMemo } from "react";
import useIncomes from "@/hooks/useIncomes";
import useExpenses from "@/hooks/useExpenses";

export interface MonthlyChartData {
  month: string;
  income: number;
  expenses: number;
}

function getMonthKey(date: string) {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth() + 1}`;
}

function getMonthLabel(date: string) {
  const d = new Date(date);
  return d.toLocaleString("default", { month: "short" });
}

export default function useMonthlyIncomeExpenseChart(userId: string) {
  const { incomes, incomesLoading } = useIncomes(userId);
  const { expenses, expensesLoading } = useExpenses(userId);

  const data: MonthlyChartData[] = useMemo(() => {
    const map: Record<
      string,
      { income: number; expenses: number; label: string }
    > = {};
    for (const i of incomes) {
      const key = getMonthKey(i.date);
      if (!map[key])
        map[key] = { income: 0, expenses: 0, label: getMonthLabel(i.date) };
      map[key].income += i.amount;
    }
    for (const e of expenses) {
      const key = getMonthKey(e.date);
      if (!map[key])
        map[key] = { income: 0, expenses: 0, label: getMonthLabel(e.date) };
      map[key].expenses += e.amount;
    }
    // Sort by month (descending), take last 4
    const sorted = Object.entries(map)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .slice(-4)
      .map(([, v]) => ({
        month: v.label,
        income: v.income,
        expenses: v.expenses,
      }));
    return sorted;
  }, [incomes, expenses]);

  return { data, loading: incomesLoading || expensesLoading };
}

import { useMemo } from "react";
import useIncomes from "@/hooks/useIncomes";
import useExpenses from "@/hooks/useExpenses";

export interface DashboardStatsData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  previousMonthIncome: number;
  previousMonthExpenses: number;
  loading: boolean;
}

export default function useDashboardStats(userId: string) {
  const { incomes, incomesLoading } = useIncomes(userId);
  const { expenses, expensesLoading } = useExpenses(userId);

  const data: DashboardStatsData = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const prevMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const prevYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    let monthlyIncome = 0;
    let previousMonthIncome = 0;
    let monthlyExpenses = 0;
    let previousMonthExpenses = 0;
    let totalIncome = 0;
    let totalExpenses = 0;

    for (const i of incomes) {
      const d = new Date(i.date);
      totalIncome += i.amount;
      if (d.getFullYear() === thisYear && d.getMonth() === thisMonth) {
        monthlyIncome += i.amount;
      } else if (d.getFullYear() === prevYear && d.getMonth() === prevMonth) {
        previousMonthIncome += i.amount;
      }
    }
    for (const e of expenses) {
      const d = new Date(e.date);
      totalExpenses += e.amount;
      if (d.getFullYear() === thisYear && d.getMonth() === thisMonth) {
        monthlyExpenses += e.amount;
      } else if (d.getFullYear() === prevYear && d.getMonth() === prevMonth) {
        previousMonthExpenses += e.amount;
      }
    }
    return {
      totalBalance: totalIncome - totalExpenses,
      monthlyIncome,
      monthlyExpenses,
      previousMonthIncome,
      previousMonthExpenses,
      loading: incomesLoading || expensesLoading,
    };
  }, [incomes, expenses, incomesLoading, expensesLoading]);

  return data;
}

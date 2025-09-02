import { useMemo } from "react";
import useIncomes from "@/hooks/useIncomes";
import useExpenses from "@/hooks/useExpenses";
import { Income } from "@/lib/types/income";
import { Expense } from "@/lib/types/expense";

export interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: number | null;
  date: string;
}

export default function useRecentTransactions(userId: string, count = 7) {
  const { incomes, incomesLoading } = useIncomes(userId);
  const { expenses, expensesLoading } = useExpenses(userId);

  const transactions: Transaction[] = useMemo(() => {
    const incomeTx: Transaction[] = incomes.map((i) => ({
      id: i.id,
      type: "income",
      amount: i.amount,
      description: i.description,
      category: i.category,
      date: i.date,
    }));
    const expenseTx: Transaction[] = expenses.map((e) => ({
      id: e.id,
      type: "expense",
      amount: e.amount,
      description: e.description,
      category: e.category,
      date: e.date,
    }));
    return [...incomeTx, ...expenseTx]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, count);
  }, [incomes, expenses, count]);

  return { transactions, loading: incomesLoading || expensesLoading };
}

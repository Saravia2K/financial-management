import getAll from "@/services/expenses/getAll";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useExpenses(userId: string) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["expense", userId],
    queryFn: () => getAll(userId),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    enabled: !!userId,
  });

  return {
    expenses: data ?? [],
    expensesLoading: isLoading,
    reloadExpenses: refetch,
  };
}

import getAll from "@/services/incomes/getAll";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useIncomes(userId: string) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["income", userId],
    queryFn: () => getAll(userId),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    enabled: !!userId,
  });

  return {
    incomes: data ?? [],
    incomesLoading: isLoading,
    reloadIncomes: refetch,
  };
}

import getAll from "@/services/categories/getAll";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useCategories() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["category"],
    queryFn: getAll,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  return {
    categories: data ?? { expenses: [], incomes: [] },
    categoriesLoading: isLoading,
    realoadCategories: refetch,
  };
}

import { createClient } from "@/lib/supabase/client";
import { serviceErrorMessage, throwUnknownServiceError } from "@/lib/utils";
import { Category } from "@/lib/types/category";

export default async function getAll() {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("category")
    .select("*")
    .order("id", {
      ascending: true,
    });

  if (error) serviceErrorMessage(error);

  if (!data) return throwUnknownServiceError("Category");

  return data.reduce(
    (prevVal, currVal) => {
      prevVal[`${currVal.type}s`].push(currVal);

      return prevVal;
    },
    { incomes: [], expenses: [] } as Categories
  );
}

export type Categories = {
  incomes: Category[];
  expenses: Category[];
};

import { createClient } from "@/lib/supabase/client";
import { serviceErrorMessage, throwUnknownServiceError } from "@/lib/utils";

export default async function deleteExpense(id: number) {
  const supabase = createClient();
  const { data, error, count, status } = await supabase
    .from("expense")
    .delete()
    .eq("id", id)
    .select();

  if (error) return serviceErrorMessage(error);

  if (status != 200 || count == 0 || data == null)
    return throwUnknownServiceError("Expense");

  return data[0];
}

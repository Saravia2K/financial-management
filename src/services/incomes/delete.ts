import { createClient } from "@/lib/supabase/client";
import { serviceErrorMessage, throwUnknownServiceError } from "@/lib/utils";

export default async function deleteIncome(id: number) {
  const supabase = createClient();
  const { data, error, count, status } = await supabase
    .from("income")
    .delete()
    .eq("id", id)
    .select();

  if (error) return serviceErrorMessage(error);

  if (status != 200 || count == 0 || data == null)
    return throwUnknownServiceError("Income");

  return data[0];
}

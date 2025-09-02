import { createClient } from "@/lib/supabase/client";
import { serviceErrorMessage, throwUnknownServiceError } from "@/lib/utils";
import { Expense } from "@/lib/types/expense";

export default async function getAll(userId: string) {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("expense")
    .select("*")
    .eq("user_id", userId)
    .order("id", {
      ascending: true,
    });

  if (error) return serviceErrorMessage(error);

  if (!data) return throwUnknownServiceError("Expense");

  return data as Expense[];
}

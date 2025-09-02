"use client";

import { createClient } from "@/lib/supabase/client";
import { UpdateExpenseData } from "@/lib/types/expense";
import { serviceErrorMessage, throwUnknownServiceError } from "@/lib/utils";

export default async function update(id: number, expense: UpdateExpenseData) {
  const supabase = createClient();
  const { count, data, error, status } = await supabase
    .from("expense")
    .update(expense)
    .eq("id", id)
    .select();

  if (error) return serviceErrorMessage(error);

  if (status != 200 || count == 0 || data == null)
    return throwUnknownServiceError("Expense");

  return data[0];
}

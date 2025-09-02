"use client";

import { createClient } from "@/lib/supabase/client";
import { NewExpenseData } from "@/lib/types/expense";
import { serviceErrorMessage, throwUnknownServiceError } from "@/lib/utils";

export default async function create(
  expense: NewExpenseData & { user_id: string }
) {
  const supabase = createClient();
  const { count, data, error, status } = await supabase
    .from("expense")
    .insert(expense)
    .select();

  if (error) return serviceErrorMessage(error);

  if (status != 201 || count == 0 || data == null)
    return throwUnknownServiceError("Expense");

  return data[0];
}

"use client";

import { createClient } from "@/lib/supabase/client";
import { UpdateIncomeData } from "@/lib/types/income";
import { serviceErrorMessage, throwUnknownServiceError } from "@/lib/utils";

export default async function update(id: number, income: UpdateIncomeData) {
  const supabase = createClient();
  const { count, data, error, status } = await supabase
    .from("income")
    .update(income)
    .eq("id", id)
    .select();

  if (error) return serviceErrorMessage(error);

  if (status != 200 || count == 0 || data == null)
    return throwUnknownServiceError("Income");

  return data[0];
}

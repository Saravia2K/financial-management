"use client";

import { createClient } from "@/lib/supabase/client";
import { NewIncomeData } from "@/lib/types/income";
import { serviceErrorMessage, throwUnknownServiceError } from "@/lib/utils";

export default async function create(income: NewIncomeData) {
  const supabase = createClient();
  const { count, data, error, status } = await supabase
    .from("income")
    .insert(income)
    .select();

  if (error) return serviceErrorMessage(error);

  if (status != 201 || count == 0 || data == null)
    return throwUnknownServiceError("Income");

  return data[0];
}

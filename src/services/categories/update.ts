"use client";

import { createClient } from "@/lib/supabase/client";
import { UpdateCategoryData } from "@/lib/types/category";
import { serviceErrorMessage, throwUnknownServiceError } from "@/lib/utils";

export default async function update(id: number, category: UpdateCategoryData) {
  const supabase = createClient();
  const { count, data, error, status } = await supabase
    .from("category")
    .update(category)
    .eq("id", id)
    .select();

  if (error) return serviceErrorMessage(error);

  if (status != 200 || count == 0 || data == null)
    return throwUnknownServiceError("Category");

  return data[0];
}

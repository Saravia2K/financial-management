"use client";

import { createClient } from "@/lib/supabase/client";
import { NewCategoryData } from "@/lib/types/category";
import { serviceErrorMessage, throwUnknownServiceError } from "@/lib/utils";

export default async function create(category: NewCategoryData) {
  const supabase = createClient();
  const { count, data, error, status } = await supabase
    .from("category")
    .insert(category)
    .select();

  if (error) return serviceErrorMessage(error);

  if (status != 201 || count == 0 || data == null)
    return throwUnknownServiceError("Category");

  return data[0];
}

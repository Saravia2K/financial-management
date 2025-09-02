import { createClient } from "@/lib/supabase/client";
import { serviceErrorMessage, throwUnknownServiceError } from "@/lib/utils";
import { Income } from "@/lib/types/income";

export default async function getAll(userId: string) {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("income")
    .select("*")
    .eq("user_id", userId)
    .order("id", {
      ascending: true,
    });

  if (error) return serviceErrorMessage(error);

  if (!data) return throwUnknownServiceError("Income");

  return data as Income[];
}

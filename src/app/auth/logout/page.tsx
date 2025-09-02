"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Logout() {
  const supabase = await createClient();
  supabase.auth.signOut({ scope: "local" });

  return redirect("/");
}

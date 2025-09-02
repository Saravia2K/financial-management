import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const supabase = await createClient();
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = (await req.json()) as {
    email: string;
    password: string;
  };
  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    return NextResponse.json(null, { status: 401 });
  }

  return NextResponse.json(null);
};

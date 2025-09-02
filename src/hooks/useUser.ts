import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type SupabaseUser = {
  id: string;
  email: string | null;
};

export default function useUser() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email ?? null,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  return { user, loading };
}

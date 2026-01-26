// src/hooks/useMemberAccounts.ts
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function useMemberAccounts(userId) {
  return useQuery({
    queryKey: ["member-accounts", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("member_accounts")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      return data;
    },
  });
}

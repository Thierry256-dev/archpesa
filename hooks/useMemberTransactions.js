import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function useMemberTransactions(userId) {
  return useQuery({
    queryKey: ["member-transactions", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("member_transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

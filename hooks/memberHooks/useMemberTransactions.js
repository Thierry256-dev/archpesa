import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { subscribeToTable } from "../../lib/supabaseRealtime";

export function useMemberTransactions(userId, options = {}) {
  const QUERY_KEY = ["member-transactions"];
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    enabled: !!userId && options.enabled !== false,
    staleTime: Infinity,
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      const { data, error } = await supabase
        .from("member_transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToTable({
      table: "member_transactions",
      filter: `user_id=eq.${userId}`,
      onChange: (payload) => {
        console.log("Realtime update:");
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId, queryClient]);

  return query;
}

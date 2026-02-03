import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { subscribeToTable } from "../lib/supabaseRealtime";

export function useMemberAccounts(userId, options = {}) {
  const queryClient = useQueryClient();
  const QUERY_KEY = ["member-accounts"];

  const query = useQuery({
    queryKey: QUERY_KEY,
    enabled: !!userId && options.enabled !== false,
    staleTime: Infinity,
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      const { data, error } = await supabase
        .from("member_accounts")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      return data;
    },
  });

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToTable({
      table: "member_accounts",
      filter: `user_id=eq.${userId}`,
      onChange: (payload) => {
        console.log("Realtime update:", payload);
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId, queryClient]);

  return query;
}

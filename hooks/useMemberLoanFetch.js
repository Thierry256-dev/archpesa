import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { subscribeToTable } from "../lib/supabaseRealtime";

export function useMemberLoanFetch(userId, options = {}) {
  const QUERY_KEY = ["member-loan", userId];
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    enabled: !!userId && options.enabled !== false,
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      const { data, error } = await supabase
        .from("loans")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToTable({
      table: "loans",
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

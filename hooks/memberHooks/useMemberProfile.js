import { supabase } from "@/lib/supabase";
import { subscribeToTable } from "@/lib/supabaseRealtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useMemberProfile(userId) {
  const QUERY_KEY = ["member-profile"];
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("auth_user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToTable({
      table: "users",
      filter: `auth_user_id=eq.${userId}`,
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

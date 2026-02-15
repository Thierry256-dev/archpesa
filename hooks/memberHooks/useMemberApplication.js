import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { subscribeToTable } from "../../lib/supabaseRealtime";

export function useMemberApplication(userId, options = {}) {
  const queryClient = useQueryClient();
  const QUERY_KEY = ["member-application"];

  const query = useQuery({
    queryKey: QUERY_KEY,
    enabled: !!userId && options.enabled !== false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,

    queryFn: async () => {
      if (!userId) {
        return [];
      }

      const { data, error } = await supabase
        .from("member_applications")
        .select("*")
        .eq("auth_user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Member application fetch error:", error);
        throw error;
      }

      return data;
    },
  });

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToTable({
      table: "member_applications",
      filter: `auth_user_id=eq.${userId}`,
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

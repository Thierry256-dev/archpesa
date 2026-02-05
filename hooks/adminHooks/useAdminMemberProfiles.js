import { supabase } from "@/lib/supabase";
import { subscribeToTable } from "@/lib/supabaseRealtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useAdminMemberProfiles() {
  const queryClient = useQueryClient();
  const QUERY_KEY = ["admin-member-profiles"];

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("role", "member")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },

    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = subscribeToTable({
      table: "users",
      onChange: (payload) => {
        console.log("Admin realtime update:", payload.eventType);
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [queryClient]);

  return query;
}

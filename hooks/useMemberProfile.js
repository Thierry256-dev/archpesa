import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { subscribeToTable } from "../lib/supabaseRealtime";

export function useMemberProfile() {
  const { user } = useAuth();
  const QUERY_KEY = ["member-profile"];
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["member-profile", user.id],
    enabled: !!user.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!user.id) return;

    const unsubscribe = subscribeToTable({
      table: "users",
      filter: `auth_user_id=eq.${user.id}`,
      onChange: (payload) => {
        console.log("Realtime update:", payload);
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user.id, queryClient]);

  return query;
}

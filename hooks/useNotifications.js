import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { subscribeToTable } from "../lib/supabaseRealtime";

export function useNotifications() {
  const { user } = useAuth();
  const userId = user?.auth_user_id;
  const queryClient = useQueryClient();
  const QUERY_KEY = ["notifications"];

  const query = useQuery({
    queryKey: QUERY_KEY,
    enabled: !!userId,
    refetchOnWindowFocus: false,

    queryFn: async () => {
      if (!userId) {
        return [];
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToTable({
      table: "notifications",
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

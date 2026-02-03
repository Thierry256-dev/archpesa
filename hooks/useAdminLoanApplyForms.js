import { supabase } from "@/lib/supabase";
import { subscribeToTable } from "@/lib/supabaseRealtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useAdminLoanForms() {
  const queryClient = useQueryClient();
  const QUERY_KEY = ["member-loan-forms"];

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loan_applications")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },

    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = subscribeToTable({
      table: "loan_applications",
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

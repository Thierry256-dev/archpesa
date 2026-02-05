import { supabase } from "@/lib/supabase";
import { subscribeToTable } from "@/lib/supabaseRealtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useAdminMemberRegisterForms() {
  const queryClient = useQueryClient();
  const QUERY_KEY = ["member-register-forms"];

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("member_applications")
        .select(
          `
          id,
          first_name,
          last_name,
          phone_number,
          district,
          submitted_at
        `,
        )
        .eq("status", "pending")
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      return data;
    },

    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = subscribeToTable({
      table: "member_applications",
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

import { supabase } from "@/lib/supabase";
import { subscribeToTable } from "@/lib/supabaseRealtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useLoanApplication(userId) {
  const queryClient = useQueryClient();
  const QUERY_KEY = ["loan-application", userId];

  const query = useQuery({
    queryKey: QUERY_KEY,
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loan_applications")
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
      table: "loan_applications",
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

export function useLoanApplicationGuarantors(loan_application_id) {
  const queryClient = useQueryClient();
  const QUERY_KEY = ["loan-application-guarantors", loan_application_id];

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loan_guarantors")
        .select("*")
        .eq("loan_application_id", loan_application_id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Failed to fetch application guarantors:", error);
        throw error;
      }

      return data;
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!loan_application_id) return;

    const unsubscribe = subscribeToTable({
      table: "loan_guarantors",
      filter: `loan_application_id=eq.${loan_application_id}`,
      onChange: (payload) => {
        console.log("Realtime update:", payload);
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      },
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [loan_application_id, queryClient]);

  return query;
}

export function useLoanGuarantorRequest(userId) {
  const queryClient = useQueryClient();
  const QUERY_KEY = ["loan-guarantors-request"];

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loan_guarantors")
        .select("*")
        .eq("guarantor_user_id", userId)

        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch guarantor Requests:", error);
        throw error;
      }

      return data;
    },
  });

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToTable({
      table: "loan_guarantors",
      filter: `guarantor_user_id=eq.${userId}`,
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

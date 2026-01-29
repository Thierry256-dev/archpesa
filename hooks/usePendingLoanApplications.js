import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function usePendingLoanApplication(userId) {
  return useQuery({
    queryKey: ["pending-loan-application"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loan_applications")
        .select("*")
        .eq("status", "pending")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Failed to fetch pending loan:", error);
        throw error;
      }

      return data;
    },
  });
}

export function useLoanApplicationGuarantors(loan_application_id) {
  return useQuery({
    queryKey: ["loan-application-guarantors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loan_guarantors")
        .select("*")
        .eq("loan_application_id", loan_application_id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Failed to fetch pending loan:", error);
        throw error;
      }

      return data;
    },
  });
}

export function useLoanGuarantorRequest(userId) {
  return useQuery({
    queryKey: ["loan-guarantors-request"],
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
}

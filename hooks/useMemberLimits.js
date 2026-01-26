// src/hooks/useMemberLimits.ts
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function useMemberLimits(userId) {
  return useQuery({
    queryKey: ["member-limits", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("member_limits")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return data;
    },
    staleTime: 60 * 1000,
  });
}

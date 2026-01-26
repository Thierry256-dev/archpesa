import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function useMemberApplication(userId) {
  return useQuery({
    queryKey: ["member-application", userId],
    enabled: !!userId,

    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,

    queryFn: async () => {
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
}

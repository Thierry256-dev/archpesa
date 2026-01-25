import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function useMemberApplication(userId) {
  return useQuery({
    queryKey: ["member-application", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("member_applications")
        .select("*")
        .eq("auth_user_id", userId)
        .single();

      if (error) throw error;
      return data;
    },
  });
}

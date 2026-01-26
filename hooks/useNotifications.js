import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function useNotifications() {
  const { user } = useAuth();
  const userId = user?.auth_user_id;

  return useQuery({
    queryKey: ["notifications", userId],
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,

    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

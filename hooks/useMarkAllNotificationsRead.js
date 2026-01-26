import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("is_read", false);

      if (error) throw error;
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previous = queryClient.getQueryData(["notifications"]);

      queryClient.setQueryData(["notifications"], (old = []) =>
        old.map((n) => ({ ...n, is_read: true })),
      );

      return { previous };
    },

    onError: (_err, _v, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["notifications"], context.previous);
      }
    },
  });
}

import { useQueryClient } from "@tanstack/react-query";

export function useUnreadNotificationCount() {
  const queryClient = useQueryClient();
  const notifications = queryClient.getQueryData(["notifications"]) || [];

  return notifications.filter((n) => !n.is_read).length;
}

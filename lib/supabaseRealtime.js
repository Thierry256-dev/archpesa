import { supabase } from "./supabase";

export const subscribeToTable = ({ table, filter, onChange }) => {
  const channel = supabase
    .channel(`public:${table}:${filter}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table, filter },
      (payload) => onChange(payload),
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

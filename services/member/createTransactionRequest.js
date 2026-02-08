import { supabase } from "@/lib/supabase";

export async function createTransactionRequest(payload) {
  const { data, error } = await supabase
    .from("transaction_requests")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

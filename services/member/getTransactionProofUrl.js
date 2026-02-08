import { supabase } from "@/lib/supabase";

export async function getTransactionProofUrl(path) {
  const { data, error } = await supabase.storage
    .from("transaction-proofs")
    .createSignedUrl(path, 60 * 10);

  if (error) throw error;

  return data.signedUrl;
}

import { supabase } from "@/lib/supabase";

export async function uploadTransactionProof({ file, userId, requestId }) {
  const filePath = `user_${userId}/${requestId}_${Date.now()}.jpg`;

  const { error } = await supabase.storage
    .from("transaction-proofs")
    .upload(filePath, file, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (error) throw error;

  return filePath;
}

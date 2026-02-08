import { supabase } from "@/lib/supabase";

export async function uploadTransactionProof({ uri, userId }) {
  const fileName = `user_${userId}_${Date.now()}.jpg`;
  const filePath = fileName;

  const formData = new FormData();

  formData.append("file", {
    uri,
    name: fileName,
    type: "image/jpeg",
  });

  const { data, error } = await supabase.storage
    .from("transaction-proofs")
    .upload(filePath, formData, {
      upsert: false,
    });

  if (error) {
    console.error("Storage upload error:", error);
    throw error;
  }

  return filePath;
}

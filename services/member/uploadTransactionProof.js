import { supabase } from "@/lib/supabase";
import { Platform } from "react-native";

export async function uploadTransactionProof({ uri, userId }) {
  const fileName = `user_${userId}_${Date.now()}.jpg`;
  const filePath = fileName;

  const formData = new FormData();

  if (Platform.OS === "web") {
    formData.append("file", uri);
  } else {
    formData.append("file", {
      uri,
      name: fileName,
      type: "image/jpeg",
    });
  }

  const { data, error } = await supabase.storage
    .from("transaction-proofs")
    .upload(filePath, formData, {
      upsert: false,
    });

  if (error) {
    console.log("Storage upload error:", error);
    throw error;
  }

  return filePath;
}

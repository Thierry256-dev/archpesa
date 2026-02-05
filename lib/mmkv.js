import MMKV from "react-native-mmkv";

const storage = new MMKV({
  id: "supabase-storage",
  encryptionKey: process.env.EXPO_PUBLIC_SACCO_ENCRYPTION_KEY,
});

export const MMKVAdapter = {
  setItem: (key, value) => {
    storage.set(key, value);
  },
  getItem: (key) => {
    const value = storage.getString(key);
    return value === undefined ? null : value;
  },
  removeItem: (key) => {
    storage.delete(key);
  },
};

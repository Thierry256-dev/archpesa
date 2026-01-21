import { supabase } from "@/lib/supabase";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Supabase auth user
  const [appUser, setAppUser] = useState(null); // From users table
  const [loading, setLoading] = useState(true);
  const [rememberMe, setRememberMeState] = useState(false);

  /** Save rememberMe preference */
  const setRememberMe = async (value) => {
    setRememberMeState(value);
    await SecureStore.setItemAsync("rememberMe", value ? "1" : "0");
  };

  /** Fetch role & SACCO info from users table */
  const fetchAppUser = async (authUser) => {
    if (!authUser) {
      setAppUser(null);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (error) {
      // Not yet approved / not in users table
      setAppUser(null);
      return;
    }

    setAppUser(data);
  };

  /** Logout */
  const signOut = async () => {
    await supabase.auth.signOut();
    await SecureStore.deleteItemAsync("rememberMe");
    setUser(null);
    setAppUser(null);
  };

  /** Initial boot logic */
  useEffect(() => {
    const initAuth = async () => {
      const remember = await SecureStore.getItemAsync("rememberMe");

      // Auth listener (single source of truth)
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        const authUser = session?.user ?? null;
        setUser(authUser);
        await fetchAppUser(authUser);
      });

      if (remember === "1") {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const authUser = session?.user ?? null;
        setUser(authUser);
        await fetchAppUser(authUser);
      } else {
        await supabase.auth.signOut();
        setUser(null);
        setAppUser(null);
      }

      setRememberMeState(remember === "1");
      setLoading(false);

      return () => subscription.unsubscribe();
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        appUser,
        loading,
        rememberMe,
        setRememberMe,
        signOut,
        isAdmin: appUser?.role === "admin",
        isMember: appUser?.role === "member",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** Hook */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

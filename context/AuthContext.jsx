import { supabase } from "@/lib/supabase";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rememberMe, setRememberMeState] = useState(false);

  const setRememberMe = async (value) => {
    setRememberMeState(value);
    await SecureStore.setItemAsync("rememberMe", value ? "1" : "0");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    await SecureStore.deleteItemAsync("rememberMe");
    setUser(null);
    setAppUser(null);
    setIsAdmin(false);
  };

  /** Fetch SACCO user */
  const fetchAppUser = async (authUser) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single(); // use single now that RLS is correct

    if (error) {
      console.error("User fetch error:", error);
      return null;
    }

    return data;
  };

  useEffect(() => {
    const initAuth = async () => {
      const remember = await SecureStore.getItemAsync("rememberMe");

      // Subscribe to auth state changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        const authUser = session?.user ?? null;
        setUser(authUser);

        if (authUser) {
          const appUserData = await fetchAppUser(authUser);
          setAppUser(appUserData);
          setIsAdmin(appUserData?.role === "admin");
        } else {
          setAppUser(null);
          setIsAdmin(false);
        }
      });

      if (remember === "1") {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user ?? null);

        if (data.session?.user) {
          const appUserData = await fetchAppUser(data.session.user);
          setAppUser(appUserData);
          setIsAdmin(appUserData?.role === "admin");
        }
      } else {
        await supabase.auth.signOut();
      }

      setRememberMeState(remember === "1");
      setLoading(false);

      // Cleanup subscription on unmount
      return () => subscription?.unsubscribe();
    };

    const cleanup = initAuth();
    return () => {
      cleanup.then((fn) => fn?.());
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        appUser,
        isAdmin,
        loading,
        rememberMe,
        setRememberMe,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

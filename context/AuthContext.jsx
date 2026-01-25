import { supabase } from "@/lib/supabase";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rememberMe, setRememberMeState] = useState(false);

  const setRememberMe = async (value) => {
    try {
      await SecureStore.setItemAsync("rememberMe", value ? "1" : "0");
      setRememberMeState(value);
    } catch (error) {
      console.error("Failed to save rememberMe preference:", error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    await SecureStore.deleteItemAsync("rememberMe");
    setUser(null);
    setAppUser(null);
  };

  //Fetch User Context
  const fetchUserContext = async () => {
    const { data, error } = await supabase.rpc("get_user_context");

    if (error) {
      console.error("User context error:", error);
      return null;
    }

    return data;
  };

  useEffect(() => {
    let isMounted = true;
    let subscription;

    const initAuth = async () => {
      try {
        const remember = await SecureStore.getItemAsync("rememberMe");

        if (remember !== "1") {
          await supabase.auth.signOut();
          if (isMounted) setLoading(false);
          return;
        }

        setRememberMeState(true);

        const { data } = await supabase.auth.getSession();
        const authUser = data?.session?.user ?? null;

        setUser(authUser);

        if (authUser) {
          const context = await fetchUserContext();
          if (isMounted) setAppUser(context);
        }

        const {
          data: { subscription: authSubscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (!isMounted) return;

          const nextUser = session?.user ?? null;
          setUser(nextUser);

          if (!nextUser) {
            setAppUser(null);
            setLoading(false);
            return;
          }

          // Only fetch if we don’t already have context
          if (!appUser || appUser.auth_user_id !== nextUser.id) {
            const context = await fetchUserContext();
            if (isMounted) setAppUser(context);
          }

          setLoading(false);
        });

        subscription = authSubscription;

        if (isMounted) setLoading(false);
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    // Cleanup on unmount
    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        appUser,
        userType: appUser?.type ?? null,
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

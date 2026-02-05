import { queryClient } from "@/lib/queryClient";
import { supabase } from "@/lib/supabase";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rememberMe, setRememberMeState] = useState(false);
  const currentAuthIdRef = useRef(null);

  const setRememberMe = async (value) => {
    try {
      await SecureStore.setItemAsync("rememberMe", value ? "1" : "0");
      setRememberMeState(value);
    } catch (error) {
      console.error("Failed to save rememberMe preference:", error);
    }
  };

  const signOut = async () => {
    try {
      currentAuthIdRef.current = null;

      queryClient.cancelQueries();
      queryClient.clear();

      setUser(null);
      setAppUser(null);

      await supabase.auth.signOut();
      await SecureStore.deleteItemAsync("rememberMe");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

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
    let authSubscription = null;

    const initAuth = async () => {
      try {
        const remember = await SecureStore.getItemAsync("rememberMe");
        const shouldRemember = remember === "1";
        if (isMounted) setRememberMeState(shouldRemember);

        const { data } = await supabase.auth.getSession();
        let sessionUser = data?.session?.user ?? null;

        if (!shouldRemember) {
          await supabase.auth.signOut();
          setUser(null);
          setAppUser(null);
          setLoading(false);
          return;
        }

        if (isMounted) setUser(sessionUser);

        if (sessionUser) {
          const context = await fetchUserContext();
          if (isMounted) setAppUser(context);
        }

        const { data: subData } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            const nextUser = session?.user ?? null;

            currentAuthIdRef.current = nextUser?.id ?? null;
            setUser(nextUser);

            if (!nextUser) {
              setAppUser(null);
              setLoading(false);
              return;
            }

            const context = await fetchUserContext();

            if (currentAuthIdRef.current !== nextUser.id) return;

            setAppUser(context);
            setLoading(false);
          },
        );

        authSubscription = subData.subscription;
      } catch (error) {
        console.error("Auth init failed:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
      authSubscription?.unsubscribe();
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

import { queryClient } from "@/lib/queryClient";
import { storage } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
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
      await storage.setItem("rememberMe", value ? "1" : "0");
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
      await storage.removeItem("rememberMe");
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

    const initAuth = async () => {
      try {
        setLoading(true);

        const remember = await storage.getItem("rememberMe");
        const shouldRemember = remember === "1";
        if (isMounted) setRememberMeState(shouldRemember);

        const { data } = await supabase.auth.getSession();
        const sessionUser = data?.session?.user ?? null;

        if (!shouldRemember && sessionUser) {
          await supabase.auth.signOut();
          if (isMounted) {
            setUser(null);
            setAppUser(null);
            setLoading(false);
          }
          return;
        }

        if (!isMounted) return;

        setUser(sessionUser);

        if (sessionUser) {
          const context = await fetchUserContext();
          if (!isMounted) return;

          currentAuthIdRef.current = sessionUser.id;
          setAppUser(context);
        }

        setLoading(false);
      } catch (error) {
        console.error("Auth init failed:", error);
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    const { data: subData } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const nextUser = session?.user ?? null;

        currentAuthIdRef.current = nextUser?.id ?? null;

        setLoading(true);
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

    return () => {
      isMounted = false;
      subData.subscription.unsubscribe();
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

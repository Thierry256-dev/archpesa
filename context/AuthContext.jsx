import { queryClient } from "@/lib/queryClient";
import { storage } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [contextLoading, setContextLoading] = useState(false);
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
    try {
      const { data, error } = await supabase.rpc("get_user_context");

      if (error) throw error;

      return data;
    } catch (err) {
      console.error("Context fetch failed:", err);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        setAuthLoading(true);

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
            setAuthLoading(false);
          }
          return;
        }

        if (!isMounted) return;

        setUser(sessionUser);
        setAuthLoading(false);

        if (sessionUser) {
          setContextLoading(true);
          const context = await fetchUserContext();
          if (!isMounted) return;

          currentAuthIdRef.current = sessionUser.id;
          setAppUser(context);
          setContextLoading(false);
        }
      } catch (error) {
        console.error("Auth init failed:", error);
        if (isMounted) setAuthLoading(false);
      }
    };

    initAuth();

    const { data: subData } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const nextUser = session?.user ?? null;

        currentAuthIdRef.current = nextUser?.id ?? null;

        setContextLoading(true);
        setUser(nextUser);

        if (!nextUser) {
          setAppUser(null);
          setContextLoading(false);
          return;
        }

        const context = await fetchUserContext();

        if (currentAuthIdRef.current !== nextUser.id) return;

        setAppUser(context);
        setContextLoading(false);
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
        loading: authLoading || contextLoading,
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

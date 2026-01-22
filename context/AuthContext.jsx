import { supabase } from "@/lib/supabase";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [application, setApplication] = useState(null);
  const [isPendingApplicant, setIsPendingApplicant] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
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

  /** Fetch member application (if any) */
  const fetchApplication = async (authUser) => {
    const { data, error } = await supabase
      .from("member_applications")
      .select("*")
      .eq("auth_user_id", authUser.id)
      .single();

    if (error) {
      // no row found is NORMAL for brand new users
      if (error.code !== "PGRST116") {
        console.error("Application fetch error:", error);
      }
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

        // Subscribe to auth state changes
        const {
          data: { subscription: authSubscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (!isMounted) return;

          const authUser = session?.user ?? null;
          setUser(authUser);
          if (authUser) {
            const appUserData = await fetchAppUser(authUser);
            const applicationData = await fetchApplication(authUser);

            if (!isMounted) return;

            setAppUser(appUserData);
            setApplication(applicationData);

            // ADMIN
            if (appUserData?.role === "admin") {
              setIsAdmin(true);
              setIsNewUser(false);
              setIsPendingApplicant(false);
              return;
            }

            // REGISTERED MEMBER
            if (appUserData) {
              setIsAdmin(false);
              setIsNewUser(false);
              setIsPendingApplicant(false);
              return;
            }

            // PENDING / REJECTED APPLICANT
            if (applicationData) {
              setIsPendingApplicant(true);
              setIsNewUser(false);
              setIsAdmin(false);
              return;
            }

            // BRAND NEW USER
            setIsNewUser(true);
            setIsPendingApplicant(false);
            setIsAdmin(false);
          } else {
            if (isMounted) {
              setAppUser(null);
              setIsAdmin(false);
            }
          }
        });

        subscription = authSubscription;

        if (remember === "1") {
          const { data } = await supabase.auth.getSession();
          if (isMounted) {
            setUser(data.session?.user ?? null);

            if (data.session?.user) {
              const appUserData = await fetchAppUser(data.session.user);
              if (isMounted) {
                setAppUser(appUserData);
                setIsAdmin(appUserData?.role === "admin");
              }
            }
          }
        } else {
          await supabase.auth.signOut();
        }

        if (isMounted) {
          setRememberMeState(remember === "1");
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (isMounted) {
          setLoading(false);
        }
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
        application,
        isAdmin,
        isNewUser,
        isPendingApplicant,
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

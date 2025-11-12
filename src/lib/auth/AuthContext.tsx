import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User, AuthResponse } from "@supabase/supabase-js";
import { supabase } from "../supabase-client";

type AuthCredentials = {
  email: string;
  password: string;
};

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signUp: (credentials: AuthCredentials) => Promise<AuthResponse["data"]>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getRedirectUrl = (path: string) =>
  typeof window === "undefined" ? undefined : `${window.location.origin}${path}`;

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const syncSession = (newSession: Session | null) => {
      if (!isMounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    };

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) {
          console.error("[AuthProvider] Failed to retrieve session", error);
          syncSession(null);
          return;
        }
        syncSession(data.session);
      })
      .catch((error) => {
        console.error("[AuthProvider] Unexpected error during getSession", error);
        syncSession(null);
      });

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      syncSession(newSession);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async ({ email, password }: AuthCredentials) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
  }, []);

  const signUp = useCallback(
    async ({ email, password }: AuthCredentials) => {
      const redirectTo = getRedirectUrl("/auth/sign-in");
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
        },
      });
      if (error) {
        throw error;
      }
      return data;
    },
    [],
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    const redirectTo = getRedirectUrl("/auth/sign-in");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo ?? undefined,
    });
    if (error) {
      throw error;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      signOut,
      sendPasswordReset,
    }),
    [user, session, loading, signIn, signUp, signOut, sendPasswordReset],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


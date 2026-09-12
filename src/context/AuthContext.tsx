import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, supabaseConfigured } from '../lib/supabase';

interface AuthValue {
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<string | null>;
  updatePassword: (email: string, current: string, next: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      session,
      loading,
      async login(email, password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error ? 'Email o contraseña incorrectos.' : null;
      },
      async logout() {
        await supabase.auth.signOut();
      },
      async requestPasswordReset(email) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/admin`,
        });
        return error ? error.message : null;
      },
      async updatePassword(email, current, next) {
        // Reautentica con la contraseña actual antes de cambiarla.
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password: current,
        });
        if (authError) return 'La contraseña actual no es correcta.';

        const { error } = await supabase.auth.updateUser({ password: next });
        return error ? error.message : null;
      },
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}

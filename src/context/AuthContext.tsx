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

/**
 * Traduce el error de Supabase a algo accionable. Antes todo se resumía en
 * «email o contraseña incorrectos», lo que escondía causas muy distintas
 * (usuario sin confirmar, límite de intentos, proyecto inalcanzable).
 */
function mensajeDeError(error: { code?: string; message: string }): string {
  switch (error.code) {
    case 'invalid_credentials':
      return 'Email o contraseña incorrectos.';
    case 'email_not_confirmed':
      return 'El usuario existe pero no está confirmado. Confírmalo en Supabase → Authentication → Users.';
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
      return 'Demasiados intentos seguidos. Espera un minuto y vuelve a probar.';
    case 'user_not_found':
      return 'No existe ningún usuario con ese email.';
    default:
      // Fallo de red, proyecto pausado o URL mal configurada.
      return `No se pudo conectar con el servidor: ${error.message}`;
  }
}

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
        if (!supabaseConfigured) {
          return 'Faltan las credenciales de Supabase en este entorno.';
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error ? mensajeDeError(error) : null;
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

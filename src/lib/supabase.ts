import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * `true` cuando hay credenciales configuradas. Si es `false`, la web pública
 * sigue funcionando con el contenido por defecto y el admin muestra un aviso,
 * en vez de romperse con una pantalla en blanco.
 */
export const supabaseConfigured = Boolean(url && anonKey);

if (!supabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[supabase] Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env.local. ' +
      'La web se mostrará con el contenido por defecto y el panel /admin no podrá guardar.',
  );
}

export const supabase = createClient(
  url ?? 'https://placeholder.supabase.co',
  anonKey ?? 'placeholder-anon-key',
);

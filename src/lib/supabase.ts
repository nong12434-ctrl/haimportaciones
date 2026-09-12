import { createClient } from '@supabase/supabase-js';

// `trim()` porque al pegar la clave en un panel (Vercel, .env) es fácil que
// arrastre espacios o un salto de línea al final.
const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

/**
 * Las credenciales viajan como cabeceras HTTP, que solo admiten caracteres
 * ASCII. Si al copiarlas se cuela un carácter tipográfico (unos puntos
 * suspensivos «…», una comilla curva, un espacio duro), `fetch` falla con un
 * error ilegible: "String contains non ISO-8859-1 code point". Se detecta aquí
 * para poder decir qué pasa de verdad.
 */
function caracteresNoAscii(valor: string): string[] {
  return [...valor].filter((c) => c.charCodeAt(0) > 127);
}

function revisar(): string | null {
  if (!url || !anonKey) {
    return 'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY.';
  }

  const raros = [...caracteresNoAscii(url), ...caracteresNoAscii(anonKey)];
  if (raros.length > 0) {
    return (
      `Las credenciales de Supabase contienen caracteres no válidos (${raros.join(' ')}). ` +
      'Suele pasar al copiar la clave abreviada con «…» en vez de la clave completa: ' +
      'vuelve a copiarla desde Supabase → Settings → API.'
    );
  }

  if (!url.startsWith('https://')) {
    return 'VITE_SUPABASE_URL debe empezar por https://';
  }

  return null;
}

/** `null` si todo está bien, o el motivo por el que no se puede usar Supabase. */
export const problemaDeCredenciales = revisar();

/** `true` cuando hay credenciales usables. */
export const supabaseConfigured = problemaDeCredenciales === null;

if (!supabaseConfigured) {
  console.error(
    `[supabase] ${problemaDeCredenciales} La web se mostrará con el contenido ` +
      'por defecto y el panel /admin no podrá guardar.',
  );
}

export const supabase = createClient(
  supabaseConfigured ? (url as string) : 'https://placeholder.supabase.co',
  supabaseConfigured ? (anonKey as string) : 'placeholder-anon-key',
);

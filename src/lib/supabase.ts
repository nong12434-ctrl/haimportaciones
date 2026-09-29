import { createClient } from '@supabase/supabase-js';

// `trim()` porque al pegar la clave en un panel (Vercel, .env) es fácil que
// arrastre espacios o un salto de línea al final.
/**
 * Se acepta tanto el prefijo propio de Vite como el que crea la integración
 * de Vercel con Supabase (`NEXT_PUBLIC_`), para que sirva cualquiera de los
 * dos sin tener que duplicar las variables en el panel de Vercel.
 */
function leerEnv(...nombres: string[]): string | undefined {
  const env = import.meta.env as Record<string, string | undefined>;
  for (const nombre of nombres) {
    const valor = env[nombre]?.trim();
    if (valor) return valor;
  }
  return undefined;
}

const url = leerEnv('VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL');
const anonKey = leerEnv(
  'VITE_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
);

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
    return 'Faltan las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY (o sus equivalentes NEXT_PUBLIC_).';
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

import { supabase, supabaseConfigured } from './supabase';

export const CONTENT_BUCKET = 'contenido-web';

/**
 * Descarga el JSON de una página. Devuelve `null` si aún no se ha guardado
 * nunca (la vista usará entonces los valores por defecto).
 */
export async function fetchPageJson<T>(slug: string): Promise<T | null> {
  if (!supabaseConfigured) return null;

  const { data, error } = await supabase.storage
    .from(CONTENT_BUCKET)
    // cache-buster: evita que el navegador sirva una versión antigua del JSON
    // justo después de guardar.
    .download(`${slug}.json?t=${Date.now()}`);

  if (error || !data) return null;

  try {
    return JSON.parse(await data.text()) as T;
  } catch {
    console.error(`[contentApi] El JSON de "${slug}" no es válido.`);
    return null;
  }
}

/** Sobrescribe el JSON completo de una página. Devuelve un mensaje de error o `null`. */
export async function savePageJson(slug: string, content: unknown): Promise<string | null> {
  if (!supabaseConfigured) {
    return 'Supabase no está configurado: falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY.';
  }

  const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });

  const { error } = await supabase.storage
    .from(CONTENT_BUCKET)
    .upload(`${slug}.json`, blob, { upsert: true, contentType: 'application/json' });

  return error ? error.message : null;
}

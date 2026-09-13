import { supabase, supabaseConfigured } from './supabase';

export const CONTENT_BUCKET = 'contenido-web';

/**
 * Descarga el JSON de una página. Devuelve `null` si aún no se ha guardado
 * nunca (la vista usará entonces los valores por defecto).
 *
 * Se lee por la **URL pública** del bucket, no con `storage.download()`: ese
 * método usa el endpoint autenticado, que exigiría una política de lectura
 * para el rol anónimo. Al ser un bucket público, la URL pública la sirve
 * cualquiera sin permisos — que es justo lo que necesita la web pública.
 */
export async function fetchPageJson<T>(slug: string): Promise<T | null> {
  if (!supabaseConfigured) return null;

  const { data } = supabase.storage.from(CONTENT_BUCKET).getPublicUrl(`${slug}.json`);

  try {
    // El parámetro de tiempo evita que el CDN sirva una versión antigua del
    // JSON justo después de guardar.
    const res = await fetch(`${data.publicUrl}?t=${Date.now()}`, { cache: 'no-store' });

    // 404 = la página todavía no se ha guardado nunca. No es un error.
    if (!res.ok) return null;

    return (await res.json()) as T;
  } catch {
    // Sin conexión, o el JSON está corrupto: la web cae a los valores por
    // defecto en vez de quedarse en blanco.
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

import { useCallback, useEffect, useState } from 'react';
import { fetchPageJson } from '../lib/contentApi';

/** Carga el JSON de una página y lo mezcla con sus valores por defecto. */
export function usePageJson<T>(slug: string, defaults: T, merge: (stored: never) => T) {
  const [content, setContent] = useState<T>(defaults);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchPageJson<never>(slug).then((stored) => {
      if (!active) return;
      setContent(merge(stored as never));
      setLoading(false);
    });

    return () => {
      active = false;
    };
    // `merge` y `defaults` son constantes de módulo: no entran en las dependencias.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return { content, loading, reload };
}

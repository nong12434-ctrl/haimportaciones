import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Sube arriba al cambiar de página, o baja a la sección si la URL trae un #ancla. */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
}

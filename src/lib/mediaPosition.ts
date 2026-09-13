/**
 * Encuadre de una foto o vídeo dentro de un hueco de proporción fija.
 *
 * El punto de encuadre se guarda pegado a la URL (`…/foto.jpg#pos=50,20`) en
 * lugar de en un campo aparte del JSON. Así el contenido ya guardado sigue
 * siendo válido: una URL sin marca se centra, que es el comportamiento de
 * siempre. El fragmento `#…` no llega al servidor, así que no afecta a la
 * descarga del archivo.
 */

export interface MediaValue {
  url: string;
  /** Porcentaje horizontal del punto que queda centrado (0 = izquierda, 100 = derecha). */
  x: number;
  /** Porcentaje vertical (0 = arriba, 100 = abajo). */
  y: number;
}

export const ENCUADRE_CENTRADO = { x: 50, y: 50 };

const MARCA = '#pos=';

function acotar(n: number): number {
  return Math.min(100, Math.max(0, Math.round(n)));
}

export function parseMediaValue(value: string): MediaValue {
  const corte = value.indexOf(MARCA);
  if (corte === -1) return { url: value, ...ENCUADRE_CENTRADO };

  const url = value.slice(0, corte);
  const [x, y] = value
    .slice(corte + MARCA.length)
    .split(',')
    .map(Number);

  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return { url, ...ENCUADRE_CENTRADO };
  }

  return { url, x: acotar(x), y: acotar(y) };
}

export function buildMediaValue(url: string, x: number, y: number): string {
  if (!url) return '';
  // Un encuadre centrado no se guarda: mantiene las URLs limpias.
  if (acotar(x) === 50 && acotar(y) === 50) return url;
  return `${url}${MARCA}${acotar(x)},${acotar(y)}`;
}

/** Valor de `object-position` para el CSS. */
export function objectPosition({ x, y }: { x: number; y: number }): string {
  return `${x}% ${y}%`;
}

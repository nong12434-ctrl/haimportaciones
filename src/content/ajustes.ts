import { mergeObj, type DeepPartial } from './_shared';

/** Ajustes compartidos por todas las páginas (no es una página pública). */
export interface AjustesContent {
  whatsapp: { numero: string; mensaje: string };
  footer: { tagline: string };
}

export const AJUSTES_DEFAULTS: AjustesContent = {
  whatsapp: {
    numero: '+34 640 33 74 90',
    mensaje: 'Hola, quiero empezar a importar desde China.',
  },
  footer: {
    tagline: 'Acompañamiento completo en todo el proceso de importación desde China.',
  },
};

export function mergeAjustesContent(
  stored: DeepPartial<AjustesContent> | null | undefined,
): AjustesContent {
  if (!stored) return AJUSTES_DEFAULTS;
  return {
    whatsapp: mergeObj(AJUSTES_DEFAULTS.whatsapp, stored.whatsapp),
    footer: mergeObj(AJUSTES_DEFAULTS.footer, stored.footer),
  };
}

/** Construye el enlace wa.me a partir del número y el mensaje configurados. */
export function whatsappUrl(ajustes: AjustesContent): string {
  const numero = ajustes.whatsapp.numero.replace(/[^\d]/g, '');
  const texto = encodeURIComponent(ajustes.whatsapp.mensaje ?? '');
  return `https://wa.me/${numero}${texto ? `?text=${texto}` : ''}`;
}

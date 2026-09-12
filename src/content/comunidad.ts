import { mergeList, mergeObj, type DeepPartial } from './_shared';

export interface IncluyeItem {
  texto: string;
}

export interface FaqItem {
  pregunta: string;
  respuesta: string;
}

export interface ComunidadContent {
  hero: { titulo: string; imagen: string; cta: string };
  incluye: { titulo: string; items: IncluyeItem[] };
  faq: { titulo: string; items: FaqItem[] };
  ctaFinal: { texto: string };
}

export const INCLUYE_ITEM_DEFAULT: IncluyeItem = { texto: 'Nueva ventaja de la comunidad' };

export const FAQ_ITEM_DEFAULT: FaqItem = {
  pregunta: 'Nueva pregunta',
  respuesta: 'Escribe aquí la respuesta.',
};

export const COMUNIDAD_DEFAULTS: ComunidadContent = {
  hero: {
    titulo: 'Accede a mi comunidad privada de importadores',
    imagen: '',
    cta: 'Unirte a la comunidad',
  },
  incluye: {
    titulo: '¿Qué incluye?',
    items: [
      { texto: 'Recursos esenciales para tu primera importación' },
      { texto: 'Herramienta propia para calcular costes de importación' },
      { texto: 'Nuestra lista de productos ganadores' },
      { texto: 'Lista exclusiva de proveedores' },
      { texto: 'Formación sobre logística y aduanas' },
    ],
  },
  faq: {
    titulo: 'Preguntas frecuentes',
    items: [
      {
        pregunta: '¿Necesito experiencia previa para unirme?',
        respuesta:
          'No. La comunidad está pensada tanto para quien empieza desde cero como para quien ya ha importado alguna vez y quiere escalar su negocio. Empezamos por lo básico y avanzamos a tu ritmo.',
      },
      {
        pregunta: '¿Qué voy a encontrar dentro de la comunidad?',
        respuesta:
          'Acceso a un grupo privado donde comparto proveedores verificados, plantillas de contacto y negociación, formación sobre logística y aduanas, resolución de dudas en tiempo real y la experiencia de otras personas que están importando ahora mismo.',
      },
      {
        pregunta: '¿Cuánto dinero necesito para empezar a importar?',
        respuesta:
          'Depende del producto y del volumen, pero se puede empezar con presupuestos pequeños. Dentro de la comunidad te ayudo a calcular tu inversión inicial según tu caso concreto.',
      },
      {
        pregunta: '¿Cómo sé si un proveedor de China es fiable?',
        respuesta:
          'Es una de las mayores preocupaciones al empezar, y por eso dedico contenido específico a verificar proveedores, detectar señales de alerta y evitar las estafas más comunes.',
      },
      {
        pregunta: '¿Necesito hablar inglés o chino?',
        respuesta:
          'No es imprescindible. Te enseño las herramientas y frases clave que se usan habitualmente para negociar con proveedores, aunque no domines el idioma.',
      },
      {
        pregunta: '¿Qué pasa con los aranceles e impuestos al importar a España?',
        respuesta:
          'Dentro de la comunidad explico paso a paso el proceso aduanero, qué impuestos aplican y cómo evitar sorpresas en el despacho de aduanas.',
      },
      {
        pregunta: '¿Es una membresía de pago o gratuita?',
        respuesta: 'Es una membresía de pago.',
      },
      {
        pregunta: '¿Puedo cancelar cuando quiera?',
        respuesta:
          'Sí, no hay permanencia. Puedes darte de baja en el momento que lo necesites.',
      },
      {
        pregunta: '¿Cómo accedo una vez me apunto?',
        respuesta:
          'En cuanto completes el registro, recibirás por correo el enlace de acceso al grupo y las instrucciones para empezar.',
      },
      {
        pregunta: '¿Tendré contacto directo contigo?',
        respuesta:
          'Sí, dentro de la comunidad puedo resolver dudas concretas sobre tu proyecto, no es solo contenido genérico.',
      },
    ],
  },
  ctaFinal: { texto: 'Unirte a la comunidad' },
};

export function mergeComunidadContent(
  stored: DeepPartial<ComunidadContent> | null | undefined,
): ComunidadContent {
  if (!stored) return COMUNIDAD_DEFAULTS;
  const d = COMUNIDAD_DEFAULTS;

  return {
    hero: mergeObj(d.hero, stored.hero),
    incluye: {
      ...mergeObj(d.incluye, stored.incluye),
      items: mergeList(d.incluye.items, stored.incluye?.items, INCLUYE_ITEM_DEFAULT),
    },
    faq: {
      ...mergeObj(d.faq, stored.faq),
      items: mergeList(d.faq.items, stored.faq?.items, FAQ_ITEM_DEFAULT),
    },
    ctaFinal: mergeObj(d.ctaFinal, stored.ctaFinal),
  };
}

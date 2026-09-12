import { mergeList, mergeObj, type DeepPartial } from './_shared';

export interface ServicioItem {
  titulo: string;
  imagen: string;
  texto: string;
}

export interface HomeContent {
  hero: { titulo: string; imagen: string; cta: string };
  servicios: { titulo: string; subtitulo: string; items: ServicioItem[] };
  casos: { titulo: string; subtitulo: string; imagen: string; texto: string; cta: string };
  masServicios: { titulo: string; items: ServicioItem[] };
  ctaFinal: { texto: string };
}

export const SERVICIO_ITEM_DEFAULT: ServicioItem = {
  titulo: 'Nuevo servicio',
  imagen: '',
  texto: 'Describe aquí este servicio.',
};

export const HOME_DEFAULTS: HomeContent = {
  hero: {
    titulo: 'Importar desde China no es fácil, *con nosotros sí*',
    imagen: '',
    cta: 'Comienza a Importar',
  },
  servicios: {
    titulo: 'Servicios',
    subtitulo: 'Apoyo en todos los procesos durante la importación',
    items: [
      {
        titulo: 'Búsqueda y Verificación de Proveedores',
        imagen: '',
        texto:
          'Localizar los proveedores que más se ajusten a tus necesidades o coordinar con los proveedores que ya tengas.\n\nConstruir una buena relación con los proveedores nos abrirá puertas para tener ventajas que otros importadores no tendrán.\n\nLa verificación de proveedores es clave para asegurar la transacción y evitar posibles timos y fraudes que pueden hacerte perder miles de euros.\n\nHaremos una auditoría de empresa para verificar al proveedor.',
      },
      {
        titulo: 'Simulación de Costes',
        imagen: '',
        texto:
          'Calcular el precio de la importación. El cálculo total de costes es un paso crucial para tomar la decisión de la ejecución de la importación. Es un paso crucial para tener una idea de la inversión y no llevarnos sorpresas.\n\nCada producto tiene un arancel diferente e incluso hay productos que tienen impuestos Antidumping. Si te suena a China, no te preocupes: nosotros te especificaremos todos los gastos en destino para calcular los costes totales de la importación.',
      },
      {
        titulo: 'Gestión de Muestras del Producto',
        imagen: '',
        texto:
          'Nos encargamos de programar las muestras de los nuevos proveedores con los que tenemos pensado trabajar en el futuro a largo plazo.',
      },
    ],
  },
  casos: {
    titulo: 'Casos de Éxito',
    subtitulo: 'Estas son algunas de nuestras importaciones realizadas para nuestros clientes recurrentes',
    imagen: '',
    texto: 'Si quieres empezar a importar, cuéntanos tu caso y te asesoramos.',
    cta: 'Comienza a Importar',
  },
  masServicios: {
    titulo: 'Más Servicios',
    items: [
      {
        titulo: 'Gestión de Documentos Aduaneros',
        imagen: '',
        texto:
          'Cada producto tiene un arancel diferente e incluso hay productos que tienen impuestos Antidumping. Si te suena a China, no te preocupes: nosotros te especificaremos todos los gastos en destino para calcular los costes totales de la importación.\n\nEn el mercado hay muchos productos que requieren de una serie de certificaciones homologadas, declaraciones de conformidad y otros ensayos que necesita la mercancía para ser introducida correctamente al país de destino. Este es un paso crucial en la importación.',
      },
      {
        titulo: 'Control de Calidad',
        imagen: '',
        texto:
          'Para asegurarnos de que los productos están correctamente fabricados, ofrecemos un control de calidad en origen para asegurarnos de que no haya sorpresas cuando llegue la mercancía a destino. Esta pequeña inversión ahorra miles de euros.',
      },
      {
        titulo: 'Logística',
        imagen: '',
        texto:
          '¿Qué método logístico utilizo, envío por barco, tren o aéreo? Nos encargamos de elegir la operativa que mejor se adapte a la mercancía.',
      },
      {
        titulo: 'Gestión de Pagos',
        imagen: '',
        texto:
          'Contactaremos con el proveedor para concretar los pagos estructurando cada paso a seguir. Revisamos incoterms, documentos comerciales, procesos de producción y cada fase de la importación.',
      },
      {
        titulo: 'Procesos Aduaneros en Destino',
        imagen: '',
        texto:
          'Organizamos todos los documentos de importación en las aduanas del destino, para poder despachar la mercancía de la manera más eficiente para nuestros clientes.',
      },
    ],
  },
  ctaFinal: { texto: 'Comienza a Importar' },
};

export function mergeHomeContent(stored: DeepPartial<HomeContent> | null | undefined): HomeContent {
  if (!stored) return HOME_DEFAULTS;
  const d = HOME_DEFAULTS;

  return {
    hero: mergeObj(d.hero, stored.hero),
    servicios: {
      ...mergeObj(d.servicios, stored.servicios),
      items: mergeList(d.servicios.items, stored.servicios?.items, SERVICIO_ITEM_DEFAULT),
    },
    casos: mergeObj(d.casos, stored.casos),
    masServicios: {
      ...mergeObj(d.masServicios, stored.masServicios),
      items: mergeList(d.masServicios.items, stored.masServicios?.items, SERVICIO_ITEM_DEFAULT),
    },
    ctaFinal: mergeObj(d.ctaFinal, stored.ctaFinal),
  };
}

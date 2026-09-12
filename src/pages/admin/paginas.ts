import type { ComponentType } from 'react';
import ComunidadView from '../../components/ComunidadView';
import HomeView from '../../components/HomeView';
import { COMUNIDAD_DEFAULTS, mergeComunidadContent } from '../../content/comunidad';
import { HOME_DEFAULTS, mergeHomeContent } from '../../content/home';

export interface PaginaConfig {
  nombre: string;
  descripcion: string;
  /** Ruta pública correspondiente, para el enlace "Ver la página". */
  ruta: string;
  defaults: unknown;
  merge: (stored: never) => unknown;
  View: ComponentType;
}

/** Registro de páginas editables. Añadir una página = añadir una entrada aquí. */
export const PAGINAS: Record<string, PaginaConfig> = {
  home: {
    nombre: 'Inicio',
    descripcion: 'Hero, Servicios, Casos de Éxito y Más Servicios',
    ruta: '/',
    defaults: HOME_DEFAULTS,
    merge: mergeHomeContent as (stored: never) => unknown,
    View: HomeView,
  },
  comunidad: {
    nombre: 'Comunidad',
    descripcion: 'Hero, Qué incluye y Preguntas frecuentes',
    ruta: '/comunidad',
    defaults: COMUNIDAD_DEFAULTS,
    merge: mergeComunidadContent as (stored: never) => unknown,
    View: ComunidadView,
  },
};

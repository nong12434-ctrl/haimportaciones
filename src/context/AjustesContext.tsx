import { createContext, useContext, type ReactNode } from 'react';
import { AJUSTES_DEFAULTS, mergeAjustesContent, type AjustesContent } from '../content/ajustes';
import { usePageJson } from '../hooks/usePageJson';

const AjustesContext = createContext<AjustesContent>(AJUSTES_DEFAULTS);

/** Carga una sola vez los ajustes compartidos (WhatsApp, footer). */
export function AjustesProvider({ children }: { children: ReactNode }) {
  const { content } = usePageJson('ajustes', AJUSTES_DEFAULTS, mergeAjustesContent);
  return <AjustesContext.Provider value={content}>{children}</AjustesContext.Provider>;
}

export function useAjustes(): AjustesContent {
  return useContext(AjustesContext);
}

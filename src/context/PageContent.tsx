import { createContext, useContext, type ReactNode } from 'react';

export interface PageContextValue<T> {
  content: T;
  /** true = editor de admin (campos clicables); false = web pública (solo lectura). */
  editing: boolean;
  /** Slug de la página; lo usan las subidas de imagen para nombrar el archivo. */
  slug: string;
  /** Actualiza un campo por ruta de puntos: 'hero.titulo', 'servicios.items.0.texto'. */
  setField: (path: string, value: unknown) => void;
  /** Añade un elemento al final de la lista indicada por la ruta. */
  addItem: (path: string, item: unknown) => void;
  /** Elimina el elemento `index` de la lista indicada por la ruta. */
  removeItem: (path: string, index: number) => void;
  /** Mueve un elemento dentro de la lista (para reordenar arriba/abajo). */
  moveItem: (path: string, from: number, to: number) => void;
}

const PageContentContext = createContext<PageContextValue<unknown> | null>(null);

export function PageContentProvider<T>({
  value,
  children,
}: {
  value: PageContextValue<T>;
  children: ReactNode;
}) {
  return (
    <PageContentContext.Provider value={value as PageContextValue<unknown>}>
      {children}
    </PageContentContext.Provider>
  );
}

export function usePageContext<T>(): PageContextValue<T> {
  const ctx = useContext(PageContentContext);
  if (!ctx) throw new Error('usePageContext debe usarse dentro de PageContentProvider');
  return ctx as PageContextValue<T>;
}

/* ------------------------------------------------------------------ */
/*  Utilidades inmutables de escritura por ruta de puntos              */
/* ------------------------------------------------------------------ */

type AnyRecord = Record<string, unknown>;

function walk(root: AnyRecord, segments: string[]): AnyRecord {
  let node: AnyRecord = root;
  for (const seg of segments) {
    node = node[seg] as AnyRecord;
    if (node === undefined || node === null) {
      throw new Error(`Ruta de contenido inexistente: "${segments.join('.')}"`);
    }
  }
  return node;
}

/** Devuelve una copia de `content` con el campo de `path` cambiado. */
export function setByPath<T>(content: T, path: string, value: unknown): T {
  const clone = structuredClone(content) as AnyRecord;
  const segments = path.split('.');
  const last = segments.pop() as string;
  walk(clone, segments)[last] = value;
  return clone as T;
}

/** Devuelve una copia de `content` con `mutate` aplicado sobre la lista de `path`. */
export function updateListByPath<T>(
  content: T,
  path: string,
  mutate: (list: unknown[]) => void,
): T {
  const clone = structuredClone(content) as AnyRecord;
  const list = walk(clone, path.split('.')) as unknown as unknown[];
  if (!Array.isArray(list)) throw new Error(`"${path}" no es una lista.`);
  mutate(list);
  return clone as T;
}

/** Lee un valor del contenido por ruta de puntos. */
export function getByPath<V = unknown>(content: unknown, path: string): V {
  return path
    .split('.')
    .reduce<unknown>((node, seg) => (node as AnyRecord)?.[seg], content) as V;
}

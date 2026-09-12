import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  PageContentProvider,
  setByPath,
  updateListByPath,
} from '../../context/PageContent';
import { usePageJson } from '../../hooks/usePageJson';
import { savePageJson } from '../../lib/contentApi';
import { PAGINAS } from './paginas';

export default function PageEditor() {
  const { slug = '' } = useParams();
  const config = PAGINAS[slug];

  if (!config) return <Navigate to="/admin" replace />;
  return <Editor key={slug} slug={slug} config={config} />;
}

function Editor({ slug, config }: { slug: string; config: (typeof PAGINAS)[string] }) {
  const { content, loading, reload } = usePageJson(slug, config.defaults, config.merge);

  const [local, setLocal] = useState<unknown>(content);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // Sincroniza cuando termina la carga (o tras recargar el original).
  useEffect(() => {
    if (!loading) {
      setLocal(content);
      setDirty(false);
    }
  }, [content, loading]);

  // Aviso si se intenta cerrar la pestaña con cambios sin guardar.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const mark = useCallback(() => {
    setDirty(true);
    setMsg(null);
  }, []);

  const setField = useCallback(
    (path: string, value: unknown) => {
      setLocal((prev: unknown) => setByPath(prev, path, value));
      mark();
    },
    [mark],
  );

  const addItem = useCallback(
    (path: string, item: unknown) => {
      setLocal((prev: unknown) => updateListByPath(prev, path, (list) => list.push(structuredClone(item))));
      mark();
    },
    [mark],
  );

  const removeItem = useCallback(
    (path: string, index: number) => {
      setLocal((prev: unknown) => updateListByPath(prev, path, (list) => list.splice(index, 1)));
      mark();
    },
    [mark],
  );

  const moveItem = useCallback(
    (path: string, from: number, to: number) => {
      setLocal((prev: unknown) =>
        updateListByPath(prev, path, (list) => {
          if (to < 0 || to >= list.length) return;
          const [item] = list.splice(from, 1);
          list.splice(to, 0, item);
        }),
      );
      mark();
    },
    [mark],
  );

  const guardar = async () => {
    setSaving(true);
    setMsg(null);
    const error = await savePageJson(slug, local);
    setSaving(false);

    if (error) {
      setMsg({ text: `No se pudo guardar: ${error}`, ok: false });
      return;
    }
    setDirty(false);
    setMsg({ text: 'Cambios publicados.', ok: true });
  };

  const cancelar = () => {
    if (dirty && !window.confirm('Se descartarán los cambios sin guardar. ¿Continuar?')) return;
    setMsg(null);
    reload();
  };

  const { View } = config;

  return (
    <div className="admin-shell">
      <div className="editor-bar">
        <Link to="/admin" className="btn btn-ghost">
          ←
        </Link>
        <h1 className="editor-bar-title">{config.nombre}</h1>

        {msg && (
          <span className={`editor-status ${msg.ok ? 'is-ok' : 'is-error'}`}>{msg.text}</span>
        )}
        {!msg && dirty && <span className="editor-status">Cambios sin guardar</span>}

        <button type="button" className="btn btn-ghost" onClick={cancelar} disabled={saving}>
          Cancelar
        </button>
        <button type="button" className="btn" onClick={() => void guardar()} disabled={saving || !dirty}>
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>

      {loading ? (
        <div className="admin-center">
          <span className="editor-status">Cargando contenido…</span>
        </div>
      ) : (
        <div className="editor-canvas">
          <PageContentProvider
            value={{ content: local, editing: true, slug, setField, addItem, removeItem, moveItem }}
          >
            <View />
          </PageContentProvider>
        </div>
      )}
    </div>
  );
}

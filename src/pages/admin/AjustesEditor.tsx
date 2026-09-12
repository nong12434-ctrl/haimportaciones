import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AJUSTES_DEFAULTS, mergeAjustesContent, type AjustesContent } from '../../content/ajustes';
import { usePageJson } from '../../hooks/usePageJson';
import { savePageJson } from '../../lib/contentApi';

/** Formulario simple: los ajustes no son una página pública, no necesitan vista compartida. */
export default function AjustesEditor() {
  const { content, loading } = usePageJson('ajustes', AJUSTES_DEFAULTS, mergeAjustesContent);

  const [local, setLocal] = useState<AjustesContent>(AJUSTES_DEFAULTS);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (!loading) {
      setLocal(content);
      setDirty(false);
    }
  }, [content, loading]);

  const update = (patch: Partial<AjustesContent>) => {
    setLocal((prev) => ({ ...prev, ...patch }));
    setDirty(true);
    setMsg(null);
  };

  const guardar = async () => {
    setSaving(true);
    const error = await savePageJson('ajustes', local);
    setSaving(false);
    setMsg(
      error
        ? { text: `No se pudo guardar: ${error}`, ok: false }
        : { text: 'Ajustes guardados.', ok: true },
    );
    if (!error) setDirty(false);
  };

  return (
    <div className="admin-shell">
      <div className="editor-bar">
        <Link to="/admin" className="btn btn-ghost">
          ←
        </Link>
        <h1 className="editor-bar-title">Ajustes generales</h1>
        {msg && <span className={`editor-status ${msg.ok ? 'is-ok' : 'is-error'}`}>{msg.text}</span>}
        <button type="button" className="btn" onClick={() => void guardar()} disabled={saving || !dirty}>
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>

      <div className="admin-body" style={{ maxWidth: 520 }}>
        <div className="field">
          <label htmlFor="numero">Número de WhatsApp (con prefijo del país)</label>
          <input
            id="numero"
            type="tel"
            value={local.whatsapp.numero}
            onChange={(e) => update({ whatsapp: { ...local.whatsapp, numero: e.target.value } })}
          />
        </div>

        <div className="field">
          <label htmlFor="mensaje">Mensaje predefinido al abrir WhatsApp</label>
          <input
            id="mensaje"
            type="text"
            value={local.whatsapp.mensaje}
            onChange={(e) => update({ whatsapp: { ...local.whatsapp, mensaje: e.target.value } })}
          />
        </div>

        <div className="field">
          <label htmlFor="tagline">Texto del pie de página</label>
          <input
            id="tagline"
            type="text"
            value={local.footer.tagline}
            onChange={(e) => update({ footer: { ...local.footer, tagline: e.target.value } })}
          />
        </div>

        <p className="page-tile-desc">
          Todos los botones de la web («Comienza a Importar», «Unirte a la comunidad») abren
          WhatsApp con este número y este mensaje.
        </p>
      </div>
    </div>
  );
}

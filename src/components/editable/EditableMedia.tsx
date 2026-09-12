import { useRef, useState } from 'react';
import { getByPath, usePageContext } from '../../context/PageContent';
import { ACCEPT_MEDIA, isVideoUrl, uploadMedia } from '../../lib/storageApi';

interface Props {
  path: string;
  className?: string;
  alt?: string;
  /** Proporción del hueco, p. ej. '16 / 10'. Fija el alto para evitar saltos de layout. */
  ratio?: string;
}

/**
 * Hueco de foto o vídeo. En lectura muestra el archivo subido (o un placeholder
 * blanco si aún no hay ninguno). En edición permite sustituirlo: el archivo se
 * sube a Storage en cuanto se elige, pero la URL no queda publicada hasta que
 * se pulsa "Guardar" en el editor.
 *
 * Foto y vídeo comparten el mismo campo del JSON: el tipo se deduce de la
 * extensión de la URL, así que cambiar una foto por un vídeo (o al revés) no
 * requiere tocar el contenido ni el código de la página.
 */
export default function EditableMedia({ path, className, alt = '', ratio }: Props) {
  const { content, editing, slug, setField } = usePageContext<unknown>();
  const src = (getByPath<string>(content, path) ?? '') as string;

  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const style = ratio ? { aspectRatio: ratio } : undefined;
  const esVideo = src ? isVideoUrl(src) : false;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const url = await uploadMedia(file, slug, path);
      setField(path, url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo subir el archivo.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  let inner;
  if (!src) {
    inner = <div className="media-placeholder">{editing ? 'Sin foto ni vídeo' : ''}</div>;
  } else if (esVideo) {
    inner = (
      // `key` fuerza a recargar el reproductor al cambiar de archivo en el editor.
      // En modo edición se ocultan los controles: el overlay de "Cambiar vídeo"
      // los taparía y quedarían muertos al pulsarlos.
      <video
        key={src}
        controls={!editing}
        playsInline
        preload="metadata"
        aria-label={alt || undefined}
      >
        <source src={src} />
        Tu navegador no puede reproducir este vídeo.
      </video>
    );
  } else {
    inner = <img src={src} alt={alt} loading="lazy" />;
  }

  if (!editing) {
    return (
      <div className={`media ${className ?? ''}`.trim()} style={style}>
        {inner}
      </div>
    );
  }

  const etiqueta = src ? (esVideo ? 'Cambiar vídeo' : 'Cambiar foto') : 'Subir foto o vídeo';

  return (
    <div className={className}>
      <div className="media media-editable" style={style}>
        {inner}
        <div className={`media-overlay ${busy ? 'is-busy' : ''}`.trim()}>
          {busy ? (
            <span className="editor-status">Subiendo…</span>
          ) : (
            <>
              <button type="button" className="btn" onClick={() => inputRef.current?.click()}>
                {etiqueta}
              </button>
              {src && (
                <button type="button" className="btn btn-ghost" onClick={() => setField(path, '')}>
                  Quitar
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_MEDIA}
        hidden
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
      {error && <p className="media-error">{error}</p>}
    </div>
  );
}

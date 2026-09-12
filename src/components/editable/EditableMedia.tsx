import { useRef, useState } from 'react';
import { getByPath, usePageContext } from '../../context/PageContent';
import { uploadImage } from '../../lib/storageApi';

interface Props {
  path: string;
  className?: string;
  alt?: string;
  /** Proporción del hueco, p. ej. '16 / 10'. Fija el alto para evitar saltos de layout. */
  ratio?: string;
}

/**
 * Hueco de imagen. En lectura muestra la foto (o un placeholder blanco si aún
 * no se ha subido ninguna). En edición permite sustituirla: la imagen se sube a
 * Storage en cuanto se elige el archivo, pero la URL no queda publicada hasta
 * que se pulsa "Guardar" en el editor.
 */
export default function EditableMedia({ path, className, alt = '', ratio }: Props) {
  const { content, editing, slug, setField } = usePageContext<unknown>();
  const src = (getByPath<string>(content, path) ?? '') as string;

  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const style = ratio ? { aspectRatio: ratio } : undefined;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const url = await uploadImage(file, slug, path);
      setField(path, url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo subir la imagen.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const inner = src ? (
    <img src={src} alt={alt} loading="lazy" />
  ) : (
    <div className="media-placeholder">{editing ? 'Sin foto' : ''}</div>
  );

  if (!editing) {
    return (
      <div className={`media ${className ?? ''}`.trim()} style={style}>
        {inner}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="media media-editable" style={style}>
        {inner}
        <div className={`media-overlay ${busy ? 'is-busy' : ''}`.trim()}>
          {busy ? (
            <span className="editor-status">Subiendo…</span>
          ) : (
            <>
              <button
                type="button"
                className="btn"
                onClick={() => inputRef.current?.click()}
              >
                {src ? 'Cambiar foto' : 'Subir foto'}
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
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
      {error && <p className="media-error">{error}</p>}
    </div>
  );
}

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { getByPath, usePageContext } from '../../context/PageContent';
import {
  buildMediaValue,
  ENCUADRE_CENTRADO,
  objectPosition,
  parseMediaValue,
} from '../../lib/mediaPosition';
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
 * blanco si aún no hay ninguno). En edición permite sustituirlo y **encuadrarlo**:
 * como el hueco tiene una proporción fija, una foto vertical se recortaría por
 * el centro, así que se puede arrastrar para elegir qué franja se ve.
 */
export default function EditableMedia({ path, className, alt = '', ratio }: Props) {
  const { content, editing, slug, setField } = usePageContext<unknown>();
  const valor = (getByPath<string>(content, path) ?? '') as string;
  const { url, x, y } = parseMediaValue(valor);

  const inputRef = useRef<HTMLInputElement>(null);
  const marcoRef = useRef<HTMLDivElement>(null);
  const arrastre = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [encuadrando, setEncuadrando] = useState(false);

  const style = ratio ? { aspectRatio: ratio } : undefined;
  const esVideo = url ? isVideoUrl(url) : false;
  const encuadre = { objectPosition: objectPosition({ x, y }) };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const subida = await uploadMedia(file, slug, path);
      // Cada archivo nuevo empieza centrado.
      setField(path, subida);
      setEncuadrando(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo subir el archivo.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  /* ---- Arrastre para encuadrar ---- */

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!encuadrando) return;
    e.preventDefault();
    try {
      // Mantiene el arrastre aunque el puntero salga del marco.
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Algunos navegadores lo rechazan según el tipo de puntero; el arrastre
      // sigue funcionando mientras el cursor no salga del marco.
    }
    arrastre.current = { x: e.clientX, y: e.clientY, posX: x, posY: y };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const inicio = arrastre.current;
    const marco = marcoRef.current;
    if (!inicio || !marco) return;

    const { width, height } = marco.getBoundingClientRect();
    // Se arrastra la imagen, no el encuadre: al bajar el ratón sube la parte
    // visible, de ahí el signo negativo.
    const nuevoX = inicio.posX - ((e.clientX - inicio.x) / width) * 100;
    const nuevoY = inicio.posY - ((e.clientY - inicio.y) / height) * 100;

    setField(path, buildMediaValue(url, nuevoX, nuevoY));
  };

  const onPointerUp = () => {
    arrastre.current = null;
  };

  /* ---- Render ---- */

  let inner;
  if (!url) {
    inner = <div className="media-placeholder">{editing ? 'Sin foto ni vídeo' : ''}</div>;
  } else if (esVideo) {
    inner = (
      // `key` fuerza a recargar el reproductor al cambiar de archivo en el editor.
      // En modo edición se ocultan los controles: el overlay de "Cambiar vídeo"
      // los taparía y quedarían muertos al pulsarlos.
      <video
        key={url}
        controls={!editing}
        playsInline
        preload="metadata"
        style={encuadre}
        aria-label={alt || undefined}
      >
        <source src={url} />
        Tu navegador no puede reproducir este vídeo.
      </video>
    );
  } else {
    inner = <img src={url} alt={alt} loading="lazy" style={encuadre} />;
  }

  if (!editing) {
    return (
      <div className={`media ${className ?? ''}`.trim()} style={style}>
        {inner}
      </div>
    );
  }

  const etiqueta = url ? (esVideo ? 'Cambiar vídeo' : 'Cambiar foto') : 'Subir foto o vídeo';

  return (
    <div className={className}>
      <div
        ref={marcoRef}
        className={`media media-editable ${encuadrando ? 'is-framing' : ''}`.trim()}
        style={style}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {inner}

        {encuadrando && <div className="media-frame-guide" aria-hidden="true" />}

        {!encuadrando && (
          <div className={`media-overlay ${busy ? 'is-busy' : ''}`.trim()}>
            {busy ? (
              <span className="editor-status">Subiendo…</span>
            ) : (
              <>
                <button type="button" className="btn" onClick={() => inputRef.current?.click()}>
                  {etiqueta}
                </button>
                {url && (
                  <>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setEncuadrando(true)}
                    >
                      Encuadrar
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setField(path, '')}
                    >
                      Quitar
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {encuadrando && (
        <div className="media-frame-bar">
          <span className="editor-status">
            Arrastra {esVideo ? 'el vídeo' : 'la foto'} para elegir qué parte se ve
          </span>
          <button
            type="button"
            className="icon-btn"
            title="Centrar"
            onClick={() =>
              setField(path, buildMediaValue(url, ENCUADRE_CENTRADO.x, ENCUADRE_CENTRADO.y))
            }
          >
            ⌖
          </button>
          <button type="button" className="btn" onClick={() => setEncuadrando(false)}>
            Hecho
          </button>
        </div>
      )}

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

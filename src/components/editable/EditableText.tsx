import { useEffect, useRef, useState, type ElementType } from 'react';
import { getByPath, usePageContext } from '../../context/PageContent';

interface Props {
  path: string;
  as?: ElementType;
  className?: string;
  /** Permite saltos de línea (textarea en edición, `white-space: pre-line` en lectura). */
  multiline?: boolean;
  /** Interpreta *texto* como cursiva. */
  rich?: boolean;
  /** Texto gris que se muestra en el editor cuando el campo está vacío. */
  placeholder?: string;
}

/** Convierte *texto* en <em>texto</em>. Solo se usa cuando `rich` está activo. */
function renderRich(text: string) {
  return text.split(/(\*[^*]+\*)/g).map((chunk, i) =>
    chunk.startsWith('*') && chunk.endsWith('*') && chunk.length > 2 ? (
      <em key={i}>{chunk.slice(1, -1)}</em>
    ) : (
      chunk
    ),
  );
}

export default function EditableText({
  path,
  as: Tag = 'p',
  className,
  multiline = false,
  rich = false,
  placeholder = 'Escribe aquí…',
}: Props) {
  const { content, editing, setField } = usePageContext<unknown>();
  const value = (getByPath<string>(content, path) ?? '') as string;

  const [active, setActive] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (active) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [active]);

  if (!editing) {
    return <Tag className={className}>{rich ? renderRich(value) : value}</Tag>;
  }

  const commit = () => {
    if (draft !== value) setField(path, draft);
    setActive(false);
  };

  if (active) {
    const shared = {
      ref: inputRef as never,
      className: 'editable-input',
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setDraft(e.target.value),
      onBlur: commit,
      onClick: (e: React.MouseEvent) => e.stopPropagation(),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
          setDraft(value);
          setActive(false);
        }
        if (e.key === 'Enter' && !multiline) commit();
      },
    };

    return multiline ? <textarea rows={6} {...shared} /> : <input type="text" {...shared} />;
  }

  return (
    <Tag
      className={`${className ?? ''} editable`.trim()}
      role="button"
      tabIndex={0}
      title="Haz clic para editar"
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDraft(value);
        setActive(true);
      }}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setDraft(value);
          setActive(true);
        }
      }}
    >
      {value ? (
        rich ? (
          renderRich(value)
        ) : (
          value
        )
      ) : (
        <span className="editable-empty">{placeholder}</span>
      )}
    </Tag>
  );
}

import { usePageContext } from '../../context/PageContent';

interface ItemProps {
  /** Ruta de la lista, p. ej. 'servicios.items'. */
  path: string;
  index: number;
  total: number;
}

/** Botones de subir / bajar / eliminar de un elemento de lista editable. */
export function ListItemTools({ path, index, total }: ItemProps) {
  const { editing, removeItem, moveItem } = usePageContext<unknown>();
  if (!editing) return null;

  return (
    <div className="list-item-tools">
      <button
        type="button"
        className="icon-btn"
        title="Subir"
        disabled={index === 0}
        onClick={() => moveItem(path, index, index - 1)}
      >
        ↑
      </button>
      <button
        type="button"
        className="icon-btn"
        title="Bajar"
        disabled={index === total - 1}
        onClick={() => moveItem(path, index, index + 1)}
      >
        ↓
      </button>
      <button
        type="button"
        className="icon-btn icon-btn-danger"
        title="Eliminar"
        onClick={() => {
          if (window.confirm('¿Eliminar este elemento?')) removeItem(path, index);
        }}
      >
        ✕
      </button>
    </div>
  );
}

interface AddProps {
  path: string;
  item: unknown;
  label: string;
}

/** Botón de "añadir elemento" al final de una lista editable. */
export function AddItemButton({ path, item, label }: AddProps) {
  const { editing, addItem } = usePageContext<unknown>();
  if (!editing) return null;

  return (
    <button type="button" className="list-add" onClick={() => addItem(path, item)}>
      + {label}
    </button>
  );
}

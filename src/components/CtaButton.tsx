import { whatsappUrl } from '../content/ajustes';
import { useAjustes } from '../context/AjustesContext';
import { usePageContext } from '../context/PageContent';
import EditableText from './editable/EditableText';

interface Props {
  /** Ruta del texto del botón dentro del JSON de la página. */
  path: string;
  className?: string;
}

/** Botón de llamada a la acción: abre WhatsApp con el número de los ajustes. */
export default function CtaButton({ path, className }: Props) {
  const ajustes = useAjustes();
  const { editing } = usePageContext<unknown>();
  const classes = `btn ${className ?? ''}`.trim();

  if (editing) {
    return <EditableText as="span" className={classes} path={path} placeholder="Texto del botón" />;
  }

  return (
    <a
      className={classes}
      href={whatsappUrl(ajustes)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <EditableText as="span" path={path} />
    </a>
  );
}

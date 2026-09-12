import ComunidadView from '../components/ComunidadView';
import { COMUNIDAD_DEFAULTS, mergeComunidadContent } from '../content/comunidad';
import { PageContentProvider } from '../context/PageContent';
import { usePageJson } from '../hooks/usePageJson';
import { noop } from '../lib/noop';

export default function Comunidad() {
  const { content } = usePageJson('comunidad', COMUNIDAD_DEFAULTS, mergeComunidadContent);

  return (
    <PageContentProvider
      value={{
        content,
        editing: false,
        slug: 'comunidad',
        setField: noop,
        addItem: noop,
        removeItem: noop,
        moveItem: noop,
      }}
    >
      <ComunidadView />
    </PageContentProvider>
  );
}

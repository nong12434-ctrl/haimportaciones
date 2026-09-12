import HomeView from '../components/HomeView';
import { HOME_DEFAULTS, mergeHomeContent } from '../content/home';
import { PageContentProvider } from '../context/PageContent';
import { usePageJson } from '../hooks/usePageJson';
import { noop } from '../lib/noop';

export default function Home() {
  const { content } = usePageJson('home', HOME_DEFAULTS, mergeHomeContent);

  return (
    <PageContentProvider
      value={{
        content,
        editing: false,
        slug: 'home',
        setField: noop,
        addItem: noop,
        removeItem: noop,
        moveItem: noop,
      }}
    >
      <HomeView />
    </PageContentProvider>
  );
}

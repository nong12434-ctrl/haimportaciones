import { HOME_DEFAULTS, SERVICIO_ITEM_DEFAULT, type HomeContent } from '../content/home';
import { usePageContext } from '../context/PageContent';
import CtaButton from './CtaButton';
import EditableMedia from './editable/EditableMedia';
import EditableText from './editable/EditableText';
import FlipList from './editable/FlipList';
import { AddItemButton, ListItemTools } from './editable/ListTools';

/** Bloque de tarjetas reutilizado por "Servicios" y "Más Servicios". */
function Tarjetas({ path, items }: { path: string; items: HomeContent['servicios']['items'] }) {
  return (
    <>
      <FlipList className="card-list">
        {items.map((_, i) => (
          <article className="card flip-item" key={`${path}-${i}`} data-flip-key={`${path}-${i}`}>
            <EditableText as="h3" className="card-title" path={`${path}.${i}.titulo`} />
            <EditableMedia path={`${path}.${i}.imagen`} className="card-media" ratio="16 / 10" />
            <EditableText as="p" className="card-text" path={`${path}.${i}.texto`} multiline />
            <ListItemTools path={path} index={i} total={items.length} />
          </article>
        ))}
      </FlipList>
      <AddItemButton path={path} item={SERVICIO_ITEM_DEFAULT} label="Añadir servicio" />
    </>
  );
}

export default function HomeView() {
  const { content } = usePageContext<HomeContent>();
  const c = content ?? HOME_DEFAULTS;

  return (
    <>
      <header className="hero container">
        <EditableMedia path="hero.imagen" className="hero-media" ratio="16 / 9" />
        <EditableText as="h1" className="hero-title" path="hero.titulo" rich multiline />
        <div className="hero-actions">
          <CtaButton path="hero.cta" />
        </div>
      </header>

      <section className="section container" id="servicios">
        <div className="section-head">
          <EditableText as="h2" className="section-title" path="servicios.titulo" />
          <EditableText as="p" className="section-sub" path="servicios.subtitulo" />
        </div>
        <Tarjetas path="servicios.items" items={c.servicios.items} />
      </section>

      <section className="section container feature" id="casos-de-exito">
        <div className="section-head">
          <EditableText as="h2" className="section-title" path="casos.titulo" />
          <EditableText as="p" className="section-sub" path="casos.subtitulo" />
        </div>
        <EditableMedia path="casos.imagen" className="feature-media" ratio="16 / 10" />
        <EditableText as="p" className="feature-text" path="casos.texto" multiline />
        <CtaButton path="casos.cta" />
      </section>

      <section className="section container" id="mas-servicios">
        <div className="section-head">
          <EditableText as="h2" className="section-title" path="masServicios.titulo" />
        </div>
        <Tarjetas path="masServicios.items" items={c.masServicios.items} />
      </section>

      <div className="cta-block container">
        <CtaButton path="ctaFinal.texto" />
      </div>
    </>
  );
}

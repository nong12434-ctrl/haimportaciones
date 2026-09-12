import { useState } from 'react';
import {
  COMUNIDAD_DEFAULTS,
  FAQ_ITEM_DEFAULT,
  INCLUYE_ITEM_DEFAULT,
  type ComunidadContent,
} from '../content/comunidad';
import { usePageContext } from '../context/PageContent';
import CtaButton from './CtaButton';
import EditableMedia from './editable/EditableMedia';
import EditableText from './editable/EditableText';
import FlipList from './editable/FlipList';
import { AddItemButton, ListItemTools } from './editable/ListTools';

function Check() {
  return (
    <svg className="check-icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M2.5 8.5 6 12l7.5-8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Caret() {
  return (
    <svg className="faq-caret" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
      <path
        d="M1 1.5 6 6.5l5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Faq({ items }: { items: ComunidadContent['faq']['items'] }) {
  const { editing } = usePageContext<ComunidadContent>();
  const [open, setOpen] = useState<number | null>(null);
  const path = 'faq.items';

  return (
    <>
      <FlipList className="faq-list">
        {items.map((_, i) => {
          const isOpen = editing || open === i;
          return (
            <div className="faq-item flip-item" key={`faq-${i}`} data-flip-key={`faq-${i}`}>
              {editing ? (
                <div className="faq-trigger">
                  <Caret />
                  <EditableText as="span" path={`${path}.${i}.pregunta`} />
                </div>
              ) : (
                <button
                  type="button"
                  className="faq-trigger"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <Caret />
                  <EditableText as="span" path={`${path}.${i}.pregunta`} />
                </button>
              )}

              <div className={`reveal-wrap ${isOpen ? 'is-open' : ''}`.trim()}>
                <div className="reveal-inner">
                  <div id={`faq-panel-${i}`}>
                    <EditableText
                      as="p"
                      className="faq-answer"
                      path={`${path}.${i}.respuesta`}
                      multiline
                    />
                    <ListItemTools path={path} index={i} total={items.length} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </FlipList>
      <AddItemButton path={path} item={FAQ_ITEM_DEFAULT} label="Añadir pregunta" />
    </>
  );
}

export default function ComunidadView() {
  const { content } = usePageContext<ComunidadContent>();
  const c = content ?? COMUNIDAD_DEFAULTS;

  return (
    <>
      <header className="hero container">
        <EditableText as="h1" className="hero-title" path="hero.titulo" rich multiline />
        <EditableMedia path="hero.imagen" className="hero-media" ratio="16 / 10" />
        <div className="hero-actions">
          <CtaButton path="hero.cta" />
        </div>
      </header>

      <section className="section container" id="que-incluye">
        <div className="section-head">
          <EditableText as="h2" className="section-title" path="incluye.titulo" />
        </div>
        <FlipList className="check-list">
          {c.incluye.items.map((_, i) => (
            <div className="flip-item" key={`inc-${i}`} data-flip-key={`inc-${i}`}>
              <div className="check-item">
                <Check />
                <EditableText as="span" path={`incluye.items.${i}.texto`} />
              </div>
              <ListItemTools path="incluye.items" index={i} total={c.incluye.items.length} />
            </div>
          ))}
        </FlipList>
        <AddItemButton path="incluye.items" item={INCLUYE_ITEM_DEFAULT} label="Añadir ventaja" />
      </section>

      <section className="section container" id="faq">
        <div className="section-head">
          <EditableText as="h2" className="section-title" path="faq.titulo" />
        </div>
        <Faq items={c.faq.items} />
      </section>

      <div className="cta-block container">
        <CtaButton path="ctaFinal.texto" />
      </div>
    </>
  );
}

import { useLayoutEffect, useRef, type ReactNode } from 'react';

interface Props {
  className?: string;
  children: ReactNode;
}

/**
 * Contenedor de lista que anima el reordenado de sus hijos con la técnica FLIP
 * (§9.3 de la plantilla). Cada hijo directo debe llevar `data-flip-key`.
 */
export default function FlipList({ className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const prev = useRef<Map<string, DOMRect>>(new Map());

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = Array.from(root.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el.dataset.flipKey !== undefined,
    );

    const next = new Map<string, DOMRect>();

    for (const el of items) {
      const key = el.dataset.flipKey as string;
      const rect = el.getBoundingClientRect();
      next.set(key, rect);

      const before = prev.current.get(key);
      if (!before || reduced) continue;

      const dy = before.top - rect.top;
      if (Math.abs(dy) < 1) continue;

      // Invert: colocar el elemento donde estaba, sin transición.
      el.classList.remove('is-animating');
      el.style.transform = `translateY(${dy}px)`;

      // Play: en el siguiente frame, soltarlo con transición.
      requestAnimationFrame(() => {
        el.classList.add('is-animating');
        el.style.transform = '';
      });
    }

    prev.current = next;
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

# Animaciones

Todas en CSS puro, sin librerías. Definidas en `src/styles/animaciones.css`.
Cada una tiene su bloque `@media (prefers-reduced-motion: reduce)`.

## Transición entre páginas — fade up
`.page-fade` (opacidad + 14px de desplazamiento vertical, 420ms). Se reproduce
en cada cambio de ruta gracias al `key={pathname}` de `PublicLayout`, que
remonta el contenido pero **no** el navbar.

## Revelado — reveal
`.reveal-wrap` / `.reveal-inner`, con `grid-template-rows: 0fr → 1fr`. Anima la
altura real del contenido sin medirla en JS. Se usa en el menú desplegable del
navbar y en el acordeón de preguntas frecuentes.

## Reordenar listas — FLIP
`src/components/editable/FlipList.tsx`. Al subir o bajar un elemento en el
editor: se miden las posiciones, se aplica el desplazamiento inverso sin
transición y en el siguiente frame se suelta con `transition: transform`. Cada
hijo directo debe llevar `data-flip-key`.

## Menú hamburguesa
Las tres barras se transforman en una X con `transform` sobre cada `span`.

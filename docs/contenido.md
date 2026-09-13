# Cómo funciona el contenido editable

Cada página editable es **un archivo JSON** en el bucket `contenido-web`. No hay
base de datos: al pulsar «Guardar» se sobrescribe el archivo entero.

## Piezas de una página

1. `src/content/{slug}.ts` — tipos, valores por defecto y función `merge`.
2. `src/components/{Slug}View.tsx` — la vista, **compartida** por la web
   pública y el editor. El mismo JSX sirve para los dos.
3. `src/pages/{Slug}.tsx` — ruta pública: monta la vista en modo lectura.
4. Una entrada en `src/pages/admin/paginas.ts` — la registra en el editor.

## Modo lectura vs modo edición

`PageContentProvider` pasa `editing: true/false`. Con `editing=false`,
`EditableText` y `EditableMedia` se renderizan como texto e imagen normales;
con `editing=true` se convierten en campos clicables.

## Valores por defecto

Son el contenido que se ve mientras no se ha editado nada. La web nunca debe
quedar vacía antes de la primera edición. El `merge` rellena con los valores por
defecto cualquier campo que falte en el JSON guardado (por ejemplo, si se añade
un campo nuevo después de que el cliente ya hubiera editado la página).

## Listas editables

Servicios, «Qué incluye» y preguntas frecuentes son listas: desde el editor se
pueden añadir, eliminar y reordenar elementos (botones ↑ ↓ ✕ y «+ Añadir…»).

## Fotos y vídeos

Todos los huecos de imagen admiten **foto o vídeo, indistintamente**. Se
gestionan con el mismo componente (`EditableMedia`) y el mismo campo del JSON:
el tipo se deduce de la extensión de la URL, así que sustituir una foto por un
vídeo no requiere tocar el contenido ni el código de la página.

| | Formatos | Límite | Tratamiento |
|---|---|---|---|
| Foto | JPG, PNG, WEBP | 10 MB | Se redimensiona a 1600px y se convierte a JPEG al 85% en el navegador |
| Vídeo | MP4, WEBM, MOV | 50 MB | Se sube tal cual (no se puede recomprimir en el navegador) |

MP4 (H.264) es el formato más seguro: lo reproducen todos los navegadores. El
límite de 50 MB es el de Supabase Storage por archivo; para vídeos más largos,
lo razonable es subirlos a YouTube o Vimeo y enlazarlos.

El archivo se sube a Storage en cuanto se elige, pero **la URL no se publica
hasta pulsar «Guardar»**. Si se cancela, el archivo queda huérfano en el bucket
sin afectar a la web.

En el editor los vídeos se muestran sin controles de reproducción, porque el
botón de «Cambiar vídeo» los taparía. En la web pública salen con controles.

### Encuadre

Los huecos tienen una proporción fija, así que una foto vertical se recorta.
El botón **Encuadrar** activa el modo de arrastre: se mueve la foto (o el
vídeo) dentro del marco, con una cuadrícula de tercios como guía, hasta dejar
visible la parte que interesa. «Centrar» vuelve al encuadre por defecto.

El punto de encuadre se guarda **pegado a la URL**, como
`…/foto.jpg#pos=50,20` (porcentajes horizontal y vertical), y se aplica con
`object-position`. Ventajas de hacerlo así:

- El contenido guardado antes de existir esta función sigue siendo válido: una
  URL sin marca se centra, como siempre.
- No hay que cambiar el tipo de las páginas ni sus funciones de merge.
- Un encuadre centrado no escribe nada, así que las URLs se mantienen limpias.

El fragmento `#…` no se envía al servidor, así que no afecta a la descarga del
archivo.

## Añadir una página nueva

Crear `content/{slug}.ts` + `{Slug}View.tsx` + `pages/{Slug}.tsx`, añadir la
ruta en `App.tsx` y una entrada en `PAGINAS`. No hay que tocar nada más.

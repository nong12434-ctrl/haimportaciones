# Haimportador

Web de Haimportador: servicios de importación desde China y comunidad privada
de importadores. React + TypeScript + Vite, con las páginas editables desde
`/admin` sin tocar código y sin base de datos (cada página es un JSON en
Supabase Storage).

## Arrancar en local

```bash
npm install
npm run dev
```

Necesita un `.env.local` con las credenciales de Supabase (ver
[docs/supabase.md](docs/supabase.md)).

## Rutas

| Ruta | Qué es |
|---|---|
| `/` | Inicio — editable |
| `/comunidad` | Comunidad — editable |
| `/aviso-legal`, `/privacidad`, `/cookies` | Legales — texto fijo en código |
| `/admin` | Panel: listado de páginas editables |
| `/admin/paginas/:slug/editar` | Editor de una página |
| `/admin/ajustes` | Número de WhatsApp y texto del pie |

## Documentación

- [docs/supabase.md](docs/supabase.md) — buckets, políticas y usuario admin
- [docs/contenido.md](docs/contenido.md) — cómo funciona el contenido editable
- [docs/animaciones.md](docs/animaciones.md) — patrones de animación

## Despliegue

Vercel, despliegue automático desde `main`. `vercel.json` ya incluye el rewrite
a `/index.html` para que las rutas no den 404 al refrescar. Las variables
`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` se configuran en el panel de
Vercel (nunca en el repositorio).

# Configuración de Supabase

La web usa Supabase solo para dos cosas: **Auth** (el login del panel) y
**Storage** (los JSON de contenido y las fotos). No hay tablas ni SQL de datos.

## 1. Crear los dos buckets

Panel de Supabase → **Storage** → *New bucket*:

| Nombre | Público | Para qué |
|---|---|---|
| `contenido-web` | **Sí** | Un `.json` por página (`home.json`, `comunidad.json`, `ajustes.json`) |
| `imagenes` | **Sí** | Las fotos y vídeos que sube el cliente desde `/admin` |

Marcar «Public bucket» en ambos: la web pública necesita leerlos sin login.

En el bucket `imagenes`, dejar **sin restringir** los tipos MIME permitidos (o
incluir `image/*` y `video/*`) y el límite de tamaño por archivo en 50 MB, que
es lo que espera el editor para los vídeos.

## 2. Políticas de acceso

Público en lectura, solo el admin autenticado en escritura. En
**SQL Editor**, ejecutar una vez:

La lectura no necesita política: al ser buckets públicos, la web lee por la
URL pública (`/object/public/…`), que no pasa por RLS. Solo hay que declarar
la escritura.

```sql
-- Escritura solo para usuarios autenticados
create policy "escritura autenticada"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('contenido-web', 'imagenes'));

create policy "actualizacion autenticada"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('contenido-web', 'imagenes'))
  with check (bucket_id in ('contenido-web', 'imagenes'));

create policy "borrado autenticado"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('contenido-web', 'imagenes'));
```

> Estas políticas son lo que de verdad bloquea las escrituras no autenticadas.
> Ocultar el botón «Guardar» en la interfaz no protege nada por sí solo.

## 3. Crear el usuario admin

**Authentication → Users → Add user**, con *Auto Confirm User* activado.
Ese email y esa contraseña son los que se usan en `/admin/login`. No hay
pantalla de registro público: el único usuario es el del cliente.

Para que funcione «¿Has olvidado tu contraseña?», en **Authentication → URL
Configuration** hay que añadir la URL del sitio (y `https://tudominio.com/admin`
en *Redirect URLs*).

## 4. Variables de entorno

`.env.local` en local (está en `.gitignore`, nunca se commitea):

```
VITE_SUPABASE_URL=https://bfzvhoifbxbfpmbiyhsd.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

En producción, las mismas variables se configuran en el panel de Vercel.
Se incrustan en el build, así que cambiarlas exige un redeploy.

**Nunca** poner la clave `service_role` en el frontend, ni en Vercel, ni en git.

## 5. Comprobación rápida

Con los buckets creados, esta URL debe devolver «Object not found» (no
«Bucket not found»):

```
https://bfzvhoifbxbfpmbiyhsd.supabase.co/storage/v1/object/public/contenido-web/home.json
```

Devolverá el JSON en cuanto se guarde la página Inicio por primera vez desde
`/admin`.

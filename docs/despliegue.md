# Despliegue

## 1. Repositorio

Repositorio privado en GitHub, rama `main`. Cada push a `main` despliega solo.

## 2. Vercel

1. Entrar en [vercel.com](https://vercel.com) con la cuenta de GitHub.
2. **Add New → Project** e importar el repositorio.
3. Vercel detecta Vite automáticamente. No hay que tocar los ajustes de build:
   - Framework: Vite · Build: `npm run build` · Output: `dist`
4. Antes de desplegar, en **Environment Variables**, añadir para *Production*,
   *Preview* y *Development*:

   | Variable | Valor |
   |---|---|
   | `VITE_SUPABASE_URL` | `https://bfzvhoifbxbfpmbiyhsd.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | la clave **completa**, copiada desde Supabase → Settings → API |

   > Estas variables se incrustan en el build: si se cambian después, hay que
   > volver a desplegar para que surtan efecto.
   >
   > La clave `service_role` **nunca** se pone aquí ni en ningún sitio del
   > frontend.
   >
   > Copia siempre la clave **entera** desde Supabase, nunca una versión
   > abreviada con «…»: las credenciales viajan como cabeceras HTTP, que solo
   > admiten ASCII, y un carácter tipográfico hace fallar todas las peticiones
   > con un error ilegible.

5. **Deploy**. El `vercel.json` del repositorio ya incluye el rewrite a
   `/index.html`, así que `/comunidad` o `/admin` no darán 404 al refrescar.

## 3. Dominio

1. Comprar el dominio donde se prefiera (Namecheap, Dinahosting, IONOS…).
2. En Vercel: **Project → Settings → Domains → Add**, escribir el dominio.
3. Vercel indica qué registros DNS crear en el panel del proveedor del
   dominio. Lo habitual:
   - `A` de `@` → `76.76.21.21`
   - `CNAME` de `www` → `cname.vercel-dns.com`
4. **No tocar los registros MX ni TXT** si ese dominio ya tiene correo
   configurado: se quedaría sin email.
5. El certificado HTTPS lo emite Vercel solo, en unos minutos.

## 4. Avisar a Supabase del dominio nuevo

En Supabase → **Authentication → URL Configuration**:

- *Site URL*: `https://tudominio.com`
- *Redirect URLs*: añadir `https://tudominio.com/admin`

Sin esto, el enlace de «¿Has olvidado tu contraseña?» apuntaría a la
dirección equivocada.

## 5. Comprobación final en producción

- [ ] La web pública carga en el dominio, con HTTPS.
- [ ] Refrescar (F5) en `/comunidad` no da 404.
- [ ] Se entra en `/admin` con el usuario real.
- [ ] Se edita un texto, se pulsa Guardar y el cambio se ve en la web pública
      **sin volver a desplegar**.
- [ ] Se sube una foto y se ve en la web pública.
- [ ] Los botones abren WhatsApp con el número correcto.

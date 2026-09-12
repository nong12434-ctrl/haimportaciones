import { LEGAL_ACTUALIZADO, TITULAR } from '../content/legal';

export default function Cookies() {
  return (
    <div className="legal container">
      <h1>Política de cookies</h1>
      <p className="legal-updated">Última actualización: {LEGAL_ACTUALIZADO}</p>

      <h2>1. Qué son las cookies</h2>
      <p>
        Una cookie es un pequeño archivo que un sitio web almacena en el navegador del usuario para
        recordar información sobre su visita.
      </p>

      <h2>2. Cookies que utiliza este sitio</h2>
      <p>
        Este sitio web <strong>no utiliza cookies de analítica, publicidad ni seguimiento</strong>{' '}
        de ningún tipo, ni propias ni de terceros.
      </p>
      <p>
        Únicamente en el área privada de administración (<code>/admin</code>), a la que solo accede
        el titular del sitio, se emplea almacenamiento local del navegador para mantener la sesión
        iniciada. Es un almacenamiento técnicamente necesario y no requiere consentimiento.
      </p>

      <h2>3. Cómo gestionar las cookies</h2>
      <p>
        Puedes configurar tu navegador para bloquear o eliminar el almacenamiento de cookies y
        datos de sitios. Consulta la ayuda de tu navegador (Chrome, Firefox, Safari o Edge) para
        conocer el procedimiento concreto.
      </p>

      <h2>4. Cambios en esta política</h2>
      <p>
        Si en el futuro se incorporan cookies adicionales, esta política se actualizará y, cuando
        la normativa lo exija, se solicitará el consentimiento previo del usuario.
      </p>

      <h2>5. Contacto</h2>
      <p>
        Para cualquier duda sobre esta política puedes escribir a{' '}
        <a href={`mailto:${TITULAR.email}`}>{TITULAR.email}</a> ({TITULAR.marca}).
      </p>
    </div>
  );
}

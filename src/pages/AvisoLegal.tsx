import { LEGAL_ACTUALIZADO, TITULAR } from '../content/legal';

export default function AvisoLegal() {
  return (
    <div className="legal container">
      <h1>Aviso legal</h1>
      <p className="legal-updated">Última actualización: {LEGAL_ACTUALIZADO}</p>

      <h2>1. Titular del sitio web</h2>
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la
        Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular:
      </p>
      <ul>
        <li>Titular: {TITULAR.nombre}</li>
        <li>NIF/NIE: {TITULAR.nif}</li>
        <li>
          Domicilio: <span className="legal-placeholder">[dirección completa pendiente]</span>,{' '}
          {TITULAR.localidad}
        </li>
        <li>
          Correo electrónico: <a href={`mailto:${TITULAR.email}`}>{TITULAR.email}</a>
        </li>
        <li>Nombre comercial: {TITULAR.marca}</li>
      </ul>

      <h2>2. Objeto</h2>
      <p>
        Este sitio web tiene por objeto informar sobre los servicios de asesoramiento y gestión de
        importaciones desde China, así como dar acceso a la comunidad privada de importadores. El
        acceso al sitio atribuye la condición de usuario e implica la aceptación de las condiciones
        recogidas en este aviso legal.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        El usuario se compromete a utilizar el sitio conforme a la ley, a la buena fe y al orden
        público, absteniéndose de realizar cualquier acción que pueda dañar, inutilizar o
        sobrecargar el sitio o impedir su normal uso por otros usuarios.
      </p>

      <h2>4. Propiedad intelectual e industrial</h2>
      <p>
        Todos los contenidos del sitio (textos, fotografías, logotipos, diseño y código) son
        titularidad del titular o se utilizan con autorización, y están protegidos por la normativa
        de propiedad intelectual e industrial. Queda prohibida su reproducción, distribución o
        transformación sin autorización expresa y por escrito.
      </p>

      <h2>5. Exclusión de responsabilidad</h2>
      <p>
        La información publicada tiene carácter orientativo y no constituye asesoramiento fiscal,
        aduanero ni jurídico vinculante. El titular no se responsabiliza de las decisiones tomadas
        a partir de la información del sitio, ni de los contenidos de sitios de terceros a los que
        se pueda acceder mediante enlaces.
      </p>

      <h2>6. Enlaces a terceros</h2>
      <p>
        Este sitio puede contener enlaces a servicios de terceros, como WhatsApp. El titular no
        controla dichos servicios ni responde de sus contenidos o políticas de privacidad.
      </p>

      <h2>7. Legislación aplicable</h2>
      <p>
        Este aviso legal se rige por la legislación española. Para cualquier controversia serán
        competentes los juzgados y tribunales que correspondan conforme a la normativa aplicable.
      </p>
    </div>
  );
}

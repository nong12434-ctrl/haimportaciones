import { LEGAL_ACTUALIZADO, TITULAR } from '../content/legal';

export default function Privacidad() {
  return (
    <div className="legal container">
      <h1>Política de privacidad</h1>
      <p className="legal-updated">Última actualización: {LEGAL_ACTUALIZADO}</p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li>Responsable: {TITULAR.nombre}</li>
        <li>NIF/NIE: {TITULAR.nif}</li>
        <li>
          Domicilio: <span className="legal-placeholder">[dirección completa pendiente]</span>,{' '}
          {TITULAR.localidad}
        </li>
        <li>
          Contacto: <a href={`mailto:${TITULAR.email}`}>{TITULAR.email}</a>
        </li>
      </ul>

      <h2>2. Qué datos tratamos y con qué finalidad</h2>
      <p>
        Este sitio web no dispone de formularios de registro ni de contacto: no se recogen datos
        personales a través de él. El contacto se realiza a través de WhatsApp, por iniciativa del
        propio usuario.
      </p>
      <ul>
        <li>
          Datos de contacto facilitados por WhatsApp (número de teléfono, nombre de perfil y el
          contenido de los mensajes), con la finalidad de atender la consulta y, en su caso,
          prestar los servicios solicitados.
        </li>
      </ul>

      <h2>3. Base jurídica</h2>
      <p>
        El tratamiento se basa en la aplicación de medidas precontractuales a petición del
        interesado y en la ejecución del contrato de servicios (art. 6.1.b del RGPD), así como en
        el consentimiento del usuario al iniciar la conversación (art. 6.1.a del RGPD).
      </p>

      <h2>4. Conservación</h2>
      <p>
        Los datos se conservan mientras se mantenga la relación y, posteriormente, durante los
        plazos legalmente exigibles para atender posibles responsabilidades.
      </p>

      <h2>5. Destinatarios</h2>
      <p>
        No se ceden datos a terceros, salvo obligación legal. La comunicación por WhatsApp implica
        el tratamiento de datos por parte de su proveedor, conforme a sus propias condiciones y
        política de privacidad.
      </p>

      <h2>6. Derechos</h2>
      <p>
        Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación del
        tratamiento y portabilidad escribiendo a{' '}
        <a href={`mailto:${TITULAR.email}`}>{TITULAR.email}</a>, indicando el derecho que deseas
        ejercer. También puedes presentar una reclamación ante la Agencia Española de Protección de
        Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">aepd.es</a>).
      </p>

      <h2>7. Seguridad</h2>
      <p>
        Se aplican las medidas técnicas y organizativas razonables para proteger los datos frente a
        pérdida, uso indebido o acceso no autorizado.
      </p>
    </div>
  );
}

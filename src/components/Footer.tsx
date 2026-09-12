import { Link } from 'react-router-dom';
import { TITULAR } from '../content/legal';
import { useAjustes } from '../context/AjustesContext';
import { NAV_LINKS } from './Navbar';

const LEGAL_LINKS = [
  { to: '/aviso-legal', label: 'Aviso legal' },
  { to: '/privacidad', label: 'Política de privacidad' },
  { to: '/cookies', label: 'Política de cookies' },
];

export default function Footer() {
  const ajustes = useAjustes();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <div className="footer-brand">{TITULAR.marca}</div>
            <p className="footer-tagline">{ajustes.footer.tagline}</p>
          </div>

          <div className="footer-cols">
            <div>
              <h2 className="footer-col-title">Navegación</h2>
              <ul className="footer-list">
                {NAV_LINKS.map((link) => (
                  <li key={link.to}>
                    {link.to.includes('#') ? (
                      <a href={link.to}>{link.label}</a>
                    ) : (
                      <Link to={link.to}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="footer-col-title">Legal</h2>
              <ul className="footer-list">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {year} {TITULAR.nombre} · NIF {TITULAR.nif} · Todos los derechos reservados.
          </span>
          <span className="footer-credit">
            <a href={`mailto:${TITULAR.email}`}>{TITULAR.email}</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/#servicios', label: 'Servicios' },
  { to: '/#casos-de-exito', label: 'Casos de Éxito' },
  { to: '/comunidad', label: 'Comunidad' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();

  // Cierra el menú al cambiar de página.
  useEffect(() => setOpen(false), [pathname, hash]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'is-scrolled' : ''}`.trim()}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            Haimportador
          </Link>
          <button
            type="button"
            className={`navbar-toggle ${open ? 'is-open' : ''}`.trim()}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`nav-drawer ${open ? 'is-open' : ''}`.trim()}>
        <div className="nav-drawer-inner">
          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                {link.to.includes('#') ? (
                  <a href={link.to}>{link.label}</a>
                ) : (
                  <NavLink to={link.to} end>
                    {link.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        className={`nav-backdrop ${open ? 'is-open' : ''}`.trim()}
        aria-hidden={!open}
        tabIndex={-1}
        onClick={() => setOpen(false)}
      />
    </>
  );
}

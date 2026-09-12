import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

/**
 * El Navbar se monta una sola vez y no se remonta al cambiar de página; solo
 * el contenido se remonta (key={pathname}) para reproducir el fade-up.
 */
export default function PublicLayout() {
  const { pathname } = useLocation();

  return (
    <>
      <Navbar />
      <div className="public-main">
        <div key={pathname} className="page-fade">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
}

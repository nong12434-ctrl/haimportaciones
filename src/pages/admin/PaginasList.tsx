import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PAGINAS } from './paginas';

export default function PaginasList() {
  const { logout } = useAuth();

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <h1>Panel de administración</h1>
        <button type="button" className="btn btn-ghost" onClick={() => void logout()}>
          Salir
        </button>
      </header>

      <div className="admin-body">
        <div className="page-grid">
          {Object.entries(PAGINAS).map(([slug, cfg]) => (
            <Link key={slug} to={`/admin/paginas/${slug}/editar`} className="page-tile">
              <div>
                <div className="page-tile-name">{cfg.nombre}</div>
                <p className="page-tile-desc">{cfg.descripcion}</p>
              </div>
            </Link>
          ))}

          <Link to="/admin/ajustes" className="page-tile">
            <div>
              <div className="page-tile-name">Ajustes generales</div>
              <p className="page-tile-desc">Número de WhatsApp y texto del pie de página</p>
            </div>
          </Link>
        </div>

        <p className="page-tile-desc" style={{ marginTop: 32 }}>
          Los cambios se publican en la web en cuanto pulsas «Guardar».
        </p>
      </div>
    </div>
  );
}

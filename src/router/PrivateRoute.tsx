import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Espera a que la sesión se resuelva antes de decidir: nunca redirige mientras carga. */
export default function PrivateRoute() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin-shell">
        <div className="admin-center">
          <span className="editor-status">Comprobando sesión…</span>
        </div>
      </div>
    );
  }

  if (!session) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;

  return <Outlet />;
}

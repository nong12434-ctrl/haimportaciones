import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import ScrollManager from './components/ScrollManager';
import { AjustesProvider } from './context/AjustesContext';
import { AuthProvider } from './context/AuthContext';
import AvisoLegal from './pages/AvisoLegal';
import Comunidad from './pages/Comunidad';
import Cookies from './pages/Cookies';
import Home from './pages/Home';
import NoEncontrada from './pages/NoEncontrada';
import Privacidad from './pages/Privacidad';
import AjustesEditor from './pages/admin/AjustesEditor';
import Login from './pages/admin/Login';
import PageEditor from './pages/admin/PageEditor';
import PaginasList from './pages/admin/PaginasList';
import PrivateRoute from './router/PrivateRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AjustesProvider>
          <ScrollManager />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="comunidad" element={<Comunidad />} />
              <Route path="aviso-legal" element={<AvisoLegal />} />
              <Route path="privacidad" element={<Privacidad />} />
              <Route path="cookies" element={<Cookies />} />
              <Route path="*" element={<NoEncontrada />} />
            </Route>

            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<PrivateRoute />}>
              <Route index element={<PaginasList />} />
              <Route path="ajustes" element={<AjustesEditor />} />
              <Route path="paginas/:slug/editar" element={<PageEditor />} />
            </Route>
          </Routes>
        </AjustesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

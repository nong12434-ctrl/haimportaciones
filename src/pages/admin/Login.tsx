import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabaseConfigured } from '../../lib/supabase';

type Mode = 'login' | 'recover' | 'change';

export default function Login() {
  const { session, loading, login, requestPasswordReset, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nueva, setNueva] = useState('');
  const [repetir, setRepetir] = useState('');
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && session) return <Navigate to="/admin" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setBusy(true);

    try {
      if (mode === 'login') {
        const error = await login(email, password);
        if (error) setMsg({ text: error, ok: false });
        else navigate('/admin', { replace: true });
        return;
      }

      if (mode === 'recover') {
        const error = await requestPasswordReset(email);
        setMsg(
          error
            ? { text: error, ok: false }
            : { text: 'Te hemos enviado un correo para restablecer la contraseña.', ok: true },
        );
        return;
      }

      if (nueva.length < 8) {
        setMsg({ text: 'La nueva contraseña debe tener al menos 8 caracteres.', ok: false });
        return;
      }
      if (nueva !== repetir) {
        setMsg({ text: 'Las dos contraseñas nuevas no coinciden.', ok: false });
        return;
      }

      const error = await updatePassword(email, password, nueva);
      setMsg(
        error
          ? { text: error, ok: false }
          : { text: 'Contraseña actualizada correctamente.', ok: true },
      );
      if (!error) {
        setPassword('');
        setNueva('');
        setRepetir('');
        setMode('login');
      }
    } finally {
      setBusy(false);
    }
  };

  const titles: Record<Mode, string> = {
    login: 'Acceso al panel',
    recover: 'Recuperar contraseña',
    change: 'Cambiar contraseña',
  };

  return (
    <div className="admin-shell">
      <div className="admin-center">
        <form className="admin-card" onSubmit={submit}>
          <h1>{titles[mode]}</h1>

          {!supabaseConfigured && (
            <p className="form-msg is-error">
              Faltan las variables de Supabase: el panel no puede funcionar.
            </p>
          )}

          {msg && (
            <p className={`form-msg ${msg.ok ? 'is-ok' : 'is-error'}`}>{msg.text}</p>
          )}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {mode !== 'recover' && (
            <div className="field">
              <label htmlFor="password">
                {mode === 'change' ? 'Contraseña actual' : 'Contraseña'}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {mode === 'change' && (
            <>
              <div className="field">
                <label htmlFor="nueva">Nueva contraseña</label>
                <input
                  id="nueva"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={nueva}
                  onChange={(e) => setNueva(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="repetir">Repetir nueva contraseña</label>
                <input
                  id="repetir"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={repetir}
                  onChange={(e) => setRepetir(e.target.value)}
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-block" disabled={busy}>
            {busy ? 'Un momento…' : mode === 'login' ? 'Entrar' : 'Continuar'}
          </button>

          <div style={{ display: 'grid', gap: 8, marginTop: 20, justifyItems: 'start' }}>
            {mode !== 'login' && (
              <button type="button" className="link-btn" onClick={() => setMode('login')}>
                Volver al acceso
              </button>
            )}
            {mode !== 'recover' && (
              <button type="button" className="link-btn" onClick={() => setMode('recover')}>
                ¿Has olvidado tu contraseña?
              </button>
            )}
            {mode !== 'change' && (
              <button type="button" className="link-btn" onClick={() => setMode('change')}>
                Cambiar la contraseña
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

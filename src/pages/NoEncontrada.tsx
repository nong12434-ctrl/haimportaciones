import { Link } from 'react-router-dom';

export default function NoEncontrada() {
  return (
    <div className="legal container" style={{ textAlign: 'center' }}>
      <h1>Página no encontrada</h1>
      <p>La dirección a la que has llegado no existe o ha cambiado.</p>
      <p>
        <Link to="/">Volver al inicio</Link>
      </p>
    </div>
  );
}

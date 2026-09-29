import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // La integración de Vercel con Supabase crea las variables con el prefijo
  // NEXT_PUBLIC_. Se aceptan además del prefijo propio de Vite para que valga
  // cualquiera de los dos y no haya que duplicarlas a mano.
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
})

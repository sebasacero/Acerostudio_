import { useEffect, useState } from 'react';
import { AppProvider } from './store.jsx';
import { PANTALLAS } from './datos.js';
import Riel from './Riel.jsx';
import Inicio from './pantallas/Inicio.jsx';
import Nuevo from './pantallas/Nuevo.jsx';
import Editor from './pantallas/Editor.jsx';
import Acero from './pantallas/Acero.jsx';
import Render from './pantallas/Render.jsx';
import Lamina from './pantallas/Lamina.jsx';
import Exportar from './pantallas/Exportar.jsx';
import Perfiles from './pantallas/Perfiles.jsx';
import Sistema from './pantallas/Sistema.jsx';

const VISTAS = { inicio: Inicio, nuevo: Nuevo, editor: Editor, acero: Acero, render: Render, lamina: Lamina, exportar: Exportar, perfiles: Perfiles, sistema: Sistema };

function leerHash() { const p = location.hash.slice(1); return PANTALLAS.includes(p) ? p : 'inicio'; }
export function useRuta() {
  const [ruta, setRuta] = useState(leerHash);
  useEffect(() => { const f = () => setRuta(leerHash()); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f); }, []);
  return ruta;
}
export const irAPantalla = (p) => { location.hash = p; };

export default function App() {
  const ruta = useRuta();
  const Vista = VISTAS[ruta];
  return (
    <AppProvider>
      <div className="shell">
        <Riel ruta={ruta} />
        <div className="vista"><Vista key={ruta} /></div>
      </div>
    </AppProvider>
  );
}

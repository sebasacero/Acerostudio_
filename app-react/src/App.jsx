import { useEffect, useState } from 'react';
import { AppProvider } from './visita.jsx';
import Riel from './Riel.jsx';
import Inicio from './pantallas/Inicio.jsx';
import Camara from './pantallas/Camara.jsx';
import Medir from './pantallas/Medir.jsx';
import Encajar from './pantallas/Encajar.jsx';
import Render from './pantallas/Render.jsx';
import Propuesta from './pantallas/Propuesta.jsx';
import Pedidos from './pantallas/Pedidos.jsx';

export const PANTALLAS = ['inicio', 'camara', 'medir', 'encajar', 'render', 'propuesta', 'pedidos'];
const VISTAS = { inicio: Inicio, camara: Camara, medir: Medir, encajar: Encajar, render: Render, propuesta: Propuesta, pedidos: Pedidos };

function leerHash() { const p = location.hash.slice(1).split('?')[0]; return PANTALLAS.includes(p) ? p : 'inicio'; }
export function useRuta() {
  const [ruta, setRuta] = useState(leerHash);
  useEffect(() => { const f = () => setRuta(leerHash()); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f); }, []);
  return ruta;
}
export const irA = (p) => { location.hash = p; };

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

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
// Estado de la app: la "visita" al cliente (fotos, video, medidas, vano, producto elegido, propuesta) y los pedidos.
// Se guarda en localStorage (fotos como JPEG pequeñas); el video vive solo en memoria de la sesión.

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);
const CLAVE = 'acero-visitas';

export const PRODUCTO_BASE = { producto: 'puerta', tipo: 'corredizo', diseno: 'celosia', motivo: 'cerros', acabado: 'grafito', ancho: 1, alto: 2.1 };

export function nuevaVisita(datos = {}) {
  return {
    id: 'v' + Date.now().toString(36), creada: new Date().toISOString(),
    cliente: '', direccion: '', telefono: '',
    foto: null,            // JPEG (data URL) del espacio
    video: null,           // { url, tipo, duracion } solo en sesión
    medidas: null,         // { ancho, alto, fuente: 'lidar' | 'webxr' | 'referencia' | 'manual', precision }
    vano: null,            // 4 esquinas [x,y] en fracción de la foto: [TL, TR, BR, BL]
    producto: { ...PRODUCTO_BASE },
    propuesta: null,       // { numero, fecha, total, plazo, estado }
    estado: 'visita',      // visita | propuesta | pedido
    ...datos,
  };
}

function leer() { try { return JSON.parse(localStorage.getItem(CLAVE) || '[]'); } catch { return []; } }
function guardar(v) { try { localStorage.setItem(CLAVE, JSON.stringify(v.map(({ video, ...r }) => r))); } catch (e) { console.warn('No se pudo guardar', e); } }

export function AppProvider({ children }) {
  const [visitas, setVisitas] = useState(leer);
  const [actualId, setActualId] = useState(() => leer()[0]?.id || null);
  const [dia, setDia] = useState(false);
  const [toast, setToastTxt] = useState('');
  const videos = useRef({}); // id -> video (no se persiste)
  const tt = useRef();

  useEffect(() => { document.body.classList.toggle('dia', dia); }, [dia]);
  useEffect(() => { guardar(visitas); }, [visitas]);

  const actual = useMemo(() => visitas.find((v) => v.id === actualId) || null, [visitas, actualId]);
  const crear = useCallback((datos) => { const v = nuevaVisita(datos); setVisitas((l) => [v, ...l]); setActualId(v.id); return v; }, []);
  const actualizar = useCallback((cambios, id) => {
    setVisitas((l) => l.map((v) => (v.id === (id || actualId) ? { ...v, ...(typeof cambios === 'function' ? cambios(v) : cambios) } : v)));
  }, [actualId]);
  const borrar = useCallback((id) => { setVisitas((l) => l.filter((v) => v.id !== id)); if (id === actualId) setActualId(null); }, [actualId]);
  const avisar = useCallback((msg) => { setToastTxt(msg); clearTimeout(tt.current); tt.current = setTimeout(() => setToastTxt(''), 2800); }, []);

  const valor = { visitas, actual, actualId, setActualId, crear, actualizar, borrar, dia, setDia, avisar, videos: videos.current };
  return <Ctx.Provider value={valor}>{children}<div className={'toast' + (toast ? ' on' : '')} role="status" aria-live="polite">{toast}</div></Ctx.Provider>;
}

export const fmt = (n, d = 0) => (n ?? 0).toLocaleString('es-CO', { maximumFractionDigits: d, minimumFractionDigits: d });
export const cop = (n) => '$ ' + fmt(Math.round((n || 0) / 1000) * 1000);
export const m = (n) => (n == null ? '–' : `${fmt(n, 2)} m`);
export const movil = () => matchMedia('(max-width: 900px)').matches;

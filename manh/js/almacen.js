// Almacén local de ManH en IndexedDB: respuestas, preguntas del equipo, audios y fotos.
// Todo queda en el celular o computador donde se graba; se comparte exportando el paquete.
const NOMBRE = 'acerostudio-manh', VERSION = 1;
let bd;

function abrir() {
  if (bd) return bd;
  bd = new Promise((ok, mal) => {
    const pet = indexedDB.open(NOMBRE, VERSION);
    pet.onupgradeneeded = () => {
      const d = pet.result;
      d.createObjectStore('respuestas', { keyPath: 'id' });
      d.createObjectStore('pendientes', { keyPath: 'id' });
      d.createObjectStore('archivos'); // id → Blob (audio o foto)
      d.createObjectStore('ajustes');
    };
    pet.onsuccess = () => ok(pet.result);
    pet.onerror = () => mal(pet.error);
  });
  return bd;
}

async function tx(almacen, modo, fn) {
  const d = await abrir();
  return new Promise((ok, mal) => {
    const t = d.transaction(almacen, modo);
    const r = fn(t.objectStore(almacen));
    t.oncomplete = () => ok(r && 'result' in r ? r.result : undefined);
    t.onerror = () => mal(t.error);
  });
}

export const todas = almacen => tx(almacen, 'readonly', s => s.getAll());
export const guardar = (almacen, obj, clave) => tx(almacen, 'readwrite', s => s.put(obj, clave));
export const borrar = (almacen, clave) => tx(almacen, 'readwrite', s => s.delete(clave));
export const leer = (almacen, clave) => tx(almacen, 'readonly', s => s.get(clave));

export const id = pre => `${pre}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const aDataURL = blob => new Promise((ok, mal) => { const f = new FileReader(); f.onload = () => ok(f.result); f.onerror = mal; f.readAsDataURL(blob); });
export const deDataURL = async url => (await fetch(url)).blob();

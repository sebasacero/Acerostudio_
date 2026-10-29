// Ventanas modales del Studio (IA, animación, visor, integraciones) con el mismo estilo HUD.
const esc = (t) => String(t ?? '').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
export { esc };

export function openDialog({ title, kicker = '', body, wide = false, onClose }) {
  const d = document.createElement('dialog');
  d.className = 'dlg' + (wide ? ' wide' : '');
  d.innerHTML = `<header><div><span class="k">${esc(kicker)}</span><h2>${esc(title)}</h2></div>
    <button class="ic" data-close aria-label="Cerrar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></header>
    <div class="dlg-body">${body}</div>`;
  document.body.append(d);
  const close = () => { d.close(); };
  d.addEventListener('close', () => { onClose?.(); d.remove(); });
  d.querySelector('[data-close]').addEventListener('click', close);
  d.addEventListener('click', (e) => { if (e.target === d) close(); });
  d.addEventListener('keydown', (e) => e.stopPropagation()); // que las teclas no activen herramientas
  d.showModal();
  return { el: d, close, $: (s) => d.querySelector(s), $$: (s) => [...d.querySelectorAll(s)] };
}

export const field = (k, label, v, attrs = '') => `<label class="f"><span>${esc(label)}</span><input data-k="${k}" value="${esc(v)}" ${attrs}></label>`;
export const numField = (k, label, v, step = 0.1, attrs = '') => field(k, label, v, `type="number" step="${step}" ${attrs}`);
export const selField = (k, label, v, opts) => `<label class="f"><span>${esc(label)}</span><select data-k="${k}">${opts.map(([val, t]) => `<option value="${esc(val)}" ${String(val) === String(v) ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></label>`;

// Lee los campos data-k de un contenedor como objeto (números como número, casillas como booleano).
export function readFields(root) {
  const o = {};
  root.querySelectorAll('[data-k]').forEach((i) => {
    if (i.type === 'checkbox') o[i.dataset.k] = i.checked;
    else if (i.type === 'number') { if (i.value !== '') o[i.dataset.k] = parseFloat(i.value); }
    else o[i.dataset.k] = i.value;
  });
  return o;
}

// Carga una imagen de archivo reducida a maxSide px: devuelve canvas, ImageData y JPEG en data URL.
export function loadImage(file, maxSide = 1400) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => {
      const s = Math.min(1, maxSide / Math.max(im.width, im.height));
      const c = document.createElement('canvas');
      c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
      const g = c.getContext('2d', { willReadFrequently: true });
      g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
      g.drawImage(im, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      res({ canvas: c, data: g.getImageData(0, 0, c.width, c.height), dataURL: c.toDataURL('image/jpeg', 0.88) });
    };
    im.onerror = () => { URL.revokeObjectURL(url); rej(new Error('imagen')); };
    im.src = url;
  });
}

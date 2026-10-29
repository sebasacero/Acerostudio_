/**
 * js/rediseno-ia.js
 * ─────────────────────────────────────────────────────────────
 * Chat de rediseño — sección "story/chat" de acero.press
 * Flujo: foto → estilo → tipo de espacio → sube a Supabase Storage
 *        → botón WhatsApp (con el brief + pre-dimensionamiento si existe)
 * (sin IA — el rediseño lo hace el equipo manualmente al recibir
 * el mensaje de WhatsApp con la foto).
 *
 * Usa el sistema de diseño YA existente en css/chat.css:
 * .row / .bubble (bot|user), .chips / .chip, .cta-btn (+ .ghost),
 * .scan-wrap / .scan-line / .scan-label, .result-tag, .fig-tag.
 * No se inventan clases nuevas de color — todo hereda las
 * variables --accent / --cyan / --panel / --ink del sitio.
 * ─────────────────────────────────────────────────────────────
 */

/* ============================================================
   CONFIGURACIÓN
============================================================ */
const IA_WHATSAPP_NUMBER = "573152125327"; // 🔧 tu número real
const IA_SUPABASE_URL = "https://tylylfrabjkaiukuilem.supabase.co";
const IA_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bHlsZnJhYmprYWl1a3VpbGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODAwNDAsImV4cCI6MjA5ODA1NjA0MH0.Bqe1f2QBUBMiLmLCfAeownFsHLpSpxg6qaAkgvTB3uE";

const IA_BUCKET_NAME = "disenos-cafe";
const IA_BUCKET_FOLDER = "originales";
const IA_LEADS_TABLE = "leads"; // opcional, best-effort

const IA_MAX_BYTES = 20 * 1024 * 1024;   // fotos más grandes se rechazan
const IA_MAX_EDGE = 2048;                // px: lado mayor tras comprimir
const IA_JPEG_QUALITY = 0.85;

/* Textos del chat en ES/EN — el idioma lo define <html lang> (i18n del index) */
const IA_TEXT = {
  es: {
    styles: ["Industrial", "Minimalista", "Cálido / Madera", "Escandinavo", "Tropical"],
    spaces: ["Interior completo", "Fachada", "Barra", "Interior + fachada"],
    state: 'estado', st_photo: 'foto recibida', st_space: 'tipo de espacio', st_upload: 'subiendo foto',
    st_contact: 'contacto', st_welcome: 'bienvenida',
    photo_alt: 'Foto subida',
    ask_style: '¡Buena foto! ¿Qué estilo te gustaría para tu espacio?',
    chosen_style: 'Estilo elegido',
    ask_space: '¿Qué parte del espacio quieres rediseñar?',
    chosen_space: 'Espacio',
    uploading: 'Subiendo tu foto…', optimizing: 'Optimizando tu foto…',
    received: '¡Foto recibida! ✅', upload_fail: '⚠ No se pudo subir la foto',
    retry_msg: 'Revisa tu conexión e intenta de nuevo.', retry: 'Reintentar',
    ready: 'listo para revisión',
    wa_prompt: 'Toca el botón para que nuestro equipo te escriba con tu propuesta:',
    wa_btn: 'Enviar a WhatsApp', restart: 'Nuevo rediseño',
    need_photo: 'Para comenzar, sube una foto de tu espacio con 📷 o 🖼️.',
    need_choice: 'Elige una opción arriba para continuar ↑',
    have_wa: 'Ya tienes tu botón de WhatsApp listo arriba ↑ para hablar con nuestro equipo.',
    bad_type: 'Ese archivo no parece una imagen. Sube una foto JPG, PNG, WEBP o HEIC.',
    too_big: 'La foto pesa más de 20 MB. Prueba con una más liviana.',
    calc_got: 'Recibí tu pre-dimensionamiento. Lo adjunto a tu solicitud:',
    calc_next: 'Ahora sube una foto de tu local con 📷 o 🖼️ para la propuesta visual.',
    wa_hello: 'Hola equipo de acero.studio 👋',
    wa_want: 'Quiero una propuesta de rediseño en estilo',
    wa_space: 'Espacio a intervenir',
    wa_note: 'Mi mensaje',
    wa_photo: 'Aquí está la foto de mi espacio'
  },
  en: {
    styles: ["Industrial", "Minimalist", "Warm / Wood", "Scandinavian", "Tropical"],
    spaces: ["Full interior", "Façade", "Bar", "Interior + façade"],
    state: 'status', st_photo: 'photo received', st_space: 'space type', st_upload: 'uploading photo',
    st_contact: 'contact', st_welcome: 'welcome',
    photo_alt: 'Uploaded photo',
    ask_style: 'Great photo! Which style would you like for your space?',
    chosen_style: 'Chosen style',
    ask_space: 'Which part of the space do you want to redesign?',
    chosen_space: 'Space',
    uploading: 'Uploading your photo…', optimizing: 'Optimizing your photo…',
    received: 'Photo received! ✅', upload_fail: '⚠ The photo could not be uploaded',
    retry_msg: 'Check your connection and try again.', retry: 'Retry',
    ready: 'ready for review',
    wa_prompt: 'Tap the button and our team will message you with your proposal:',
    wa_btn: 'Send on WhatsApp', restart: 'New redesign',
    need_photo: 'To start, upload a photo of your space with 📷 or 🖼️.',
    need_choice: 'Pick an option above to continue ↑',
    have_wa: 'Your WhatsApp button is ready above ↑ to talk with our team.',
    bad_type: "That file doesn't look like an image. Upload a JPG, PNG, WEBP or HEIC photo.",
    too_big: 'The photo is over 20 MB. Try a lighter one.',
    calc_got: 'Got your space plan. I\'ll attach it to your request:',
    calc_next: 'Now upload a photo of your space with 📷 or 🖼️ for the visual proposal.',
    wa_hello: 'Hi acero.studio team 👋',
    wa_want: "I'd like a redesign proposal in this style",
    wa_space: 'Area to redesign',
    wa_note: 'My message',
    wa_photo: "Here's the photo of my space"
  }
};

function iaLang(){
  return (document.documentElement.getAttribute('lang') || 'es').indexOf('en') === 0 ? 'en' : 'es';
}
function iaT(key){
  return IA_TEXT[iaLang()][key];
}
function iaEscape(str){
  return String(str).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}
function iaTrack(name, params){
  if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
}

/* ============================================================
   REFERENCIAS AL DOM
============================================================ */
const chatBox = document.getElementById('chat');
const textInput = document.getElementById('textInput');
const btnSend = document.getElementById('btnSend');
const btnCamera = document.getElementById('btnCamera');
const btnGallery = document.getElementById('btnGallery');
const fileCamera = document.getElementById('fileCamera');
const fileGallery = document.getElementById('fileGallery');
const storyInline = document.getElementById('storyInline');
const stateTag = document.getElementById('stateTag');
const storyProgress = document.getElementById('storyProgress');
const waFloatBtn = document.getElementById('wa-float-btn');
const appShell = document.getElementById('appShell');

const iaWidgetPresent = chatBox && btnCamera && btnGallery && fileCamera && fileGallery;

/* ============================================================
   ESTADO
============================================================ */
let iaRawFile = null;
let iaChosenStyle = null;
let iaUploadedPublicURL = null;
let iaChosenSpace = null;
let iaUserNotes = [];     // mensajes libres del usuario, se adjuntan al WhatsApp
let iaCalcSummary = null; // pre-dimensionamiento de la calculadora espacial

/* ============================================================
   UTILIDADES DE CHAT (usan .row / .bubble como el resto del sitio)
============================================================ */
function iaScrollToBottom(){
  chatBox.scrollTop = chatBox.scrollHeight;
}

function iaActivarChat(){
  // El propio CSS ya resuelve la visibilidad de #chat vs #storyInline
  // a través de la clase "story-active" en #appShell — solo hay que quitarla.
  if (appShell) appShell.classList.remove('story-active');
}

function iaSetState(label){
  if (stateTag) stateTag.textContent = `${iaT('state')}: ${label}`;
}

function iaSetProgress(step){
  if (!storyProgress) return;
  storyProgress.querySelectorAll('.p-dot').forEach(dot => {
    dot.classList.toggle('active', parseInt(dot.dataset.p, 10) <= step);
  });
}

// role: 'bot' | 'user' — respeta el markup .row > .bubble ya estilado
function iaAppendBubble(role, innerHTML){
  iaActivarChat();
  const row = document.createElement('div');
  row.className = `row ${role}`;
  const bubble = document.createElement('div');
  bubble.className = `bubble ${role}`;
  bubble.innerHTML = innerHTML;
  row.appendChild(bubble);
  chatBox.appendChild(row);
  iaScrollToBottom();
  return bubble;
}

function iaExtFromMime(mime){
  if (!mime) return 'jpg';
  if (mime.includes('png')) return 'png';
  if (mime.includes('webp')) return 'webp';
  if (mime.includes('heic')) return 'heic';
  return 'jpg';
}

/* ============================================================
   PASO 1 — FOTO SELECCIONADA
============================================================ */
function iaIsImage(file){
  if (file.type && file.type.indexOf('image/') === 0) return true;
  // Algunos navegadores no reportan MIME para HEIC
  return /\.(heic|heif|jpe?g|png|webp)$/i.test(file.name || '');
}

function iaOnImageSelected(file){
  if (!file) return;
  if (!iaIsImage(file)){
    iaAppendBubble('bot', `<p>${iaT('bad_type')}</p>`);
    return;
  }
  if (file.size > IA_MAX_BYTES){
    iaAppendBubble('bot', `<p>${iaT('too_big')}</p>`);
    return;
  }
  iaRawFile = file;
  iaChosenStyle = null;
  iaChosenSpace = null;
  iaUploadedPublicURL = null;
  const localUrl = URL.createObjectURL(file);

  iaAppendBubble('user', `<img src="${localUrl}" alt="${iaT('photo_alt')}">`);
  iaSetState(iaT('st_photo'));
  iaSetProgress(1);
  iaTrack('redesign_photo');

  const bot = iaAppendBubble('bot', `
    <span class="fig-tag">FIG. 02 — ESTILO</span>
    <p>${iaT('ask_style')}</p>
  `);
  iaRenderChips(bot, iaT('styles'), iaEstiloElegido);
}

// Chips de una sola elección: al tocar una, las demás se apagan
function iaRenderChips(containerBubble, options, onPick){
  const chipsWrap = document.createElement('div');
  chipsWrap.className = 'chips';
  chipsWrap.innerHTML = options.map(o => `<button type="button" class="chip" data-value="${iaEscape(o)}">${iaEscape(o)}</button>`).join('');
  containerBubble.appendChild(chipsWrap);
  iaScrollToBottom();

  chipsWrap.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chipsWrap.querySelectorAll('.chip').forEach(c => {
        c.disabled = true;
        c.style.pointerEvents = 'none';
        if (c !== chip) c.style.opacity = '.35';
      });
      onPick(chip.dataset.value);
    });
  });
}

/* ============================================================
   PASO 2 — ESTILO ELEGIDO → SUBIDA A SUPABASE STORAGE
   (reutiliza el efecto visual .scan-wrap / .scan-line ya existente,
   pensado originalmente para "generando con IA", ahora para "subiendo")
============================================================ */
function iaEstiloElegido(style){
  iaChosenStyle = style;
  iaAppendBubble('user', `<p>${iaT('chosen_style')}: <strong>${iaEscape(style)}</strong></p>`);
  iaSetState(iaT('st_space'));
  iaSetProgress(2);
  iaTrack('redesign_style', { style });

  const bot = iaAppendBubble('bot', `
    <span class="fig-tag">FIG. 02.1 — ALCANCE</span>
    <p>${iaT('ask_space')}</p>
  `);
  iaRenderChips(bot, iaT('spaces'), iaEspacioElegido);
}

function iaEspacioElegido(space){
  iaChosenSpace = space;
  iaAppendBubble('user', `<p>${iaT('chosen_space')}: <strong>${iaEscape(space)}</strong></p>`);
  iaSetState(iaT('st_upload'));
  iaSetProgress(3);
  iaTrack('redesign_space', { space });

  const localUrl = URL.createObjectURL(iaRawFile);
  const bot = iaAppendBubble('bot', `
    <span class="fig-tag">FIG. 03 — SUBIDA</span>
    <div class="scan-wrap">
      <img src="${localUrl}" alt="${iaT('photo_alt')}">
      <div class="scan-line"></div>
      <div class="scan-label">${iaT('optimizing')}</div>
    </div>
  `);

  iaComprimir(iaRawFile).then(file => iaSubirFoto(bot, file));
}

/* Reduce la foto a IA_MAX_EDGE px en JPEG antes de subirla: las fotos de
   celular pesan 4–10 MB y en datos móviles la subida se vuelve eterna.
   Si el navegador no puede decodificarla (p. ej. HEIC fuera de Safari),
   se sube el original. */
function iaComprimir(file){
  return new Promise(resolve => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, IA_MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
      if (scale === 1 && file.size < 1.5 * 1024 * 1024) return resolve(file);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        resolve(blob && blob.size < file.size ? blob : file);
      }, 'image/jpeg', IA_JPEG_QUALITY);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

function iaSubirFoto(bubble, file){
  const scanLine = bubble.querySelector('.scan-line');
  const scanLabel = bubble.querySelector('.scan-label');
  if (scanLabel) scanLabel.textContent = `${iaT('uploading')} 0%`;

  const ext = iaExtFromMime(file.type);
  const fileName = `${IA_BUCKET_FOLDER}/rediseno_${Date.now()}.${ext}`;
  const uploadUrl = `${IA_SUPABASE_URL}/storage/v1/object/${IA_BUCKET_NAME}/${fileName}`;

  const xhr = new XMLHttpRequest();
  xhr.open('POST', uploadUrl, true);
  xhr.setRequestHeader('Authorization', `Bearer ${IA_SUPABASE_ANON_KEY}`);
  xhr.setRequestHeader('apikey', IA_SUPABASE_ANON_KEY);
  xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable && scanLabel){
      const pct = Math.round((e.loaded / e.total) * 100);
      scanLabel.textContent = `${iaT('uploading')} ${pct}%`;
    }
  };

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300){
      const publicUrl = `${IA_SUPABASE_URL}/storage/v1/object/public/${IA_BUCKET_NAME}/${fileName}`;
      iaUploadedPublicURL = publicUrl;
      if (scanLine) scanLine.style.display = 'none';
      if (scanLabel) scanLabel.textContent = iaT('received');
      iaGuardarLead(publicUrl, iaChosenStyle);
      iaMostrarConfirmacion();
    } else {
      console.error('Error subiendo a Supabase Storage:', xhr.status, xhr.responseText);
      iaMostrarErrorSubida(bubble);
    }
  };

  xhr.onerror = () => {
    console.error('Error de red subiendo la foto.');
    iaMostrarErrorSubida(bubble);
  };

  xhr.send(file);
}

function iaMostrarErrorSubida(uploadBubble){
  const scanLine = uploadBubble.querySelector('.scan-line');
  const scanLabel = uploadBubble.querySelector('.scan-label');
  if (scanLine) scanLine.style.display = 'none';
  if (scanLabel) scanLabel.textContent = iaT('upload_fail');

  const bot = iaAppendBubble('bot', `
    <p>${iaT('retry_msg')}</p>
    <button class="cta-btn ghost" data-ia-retry>${iaT('retry')}</button>
  `);
  // Reintenta solo la subida: la foto, el estilo y el espacio ya están elegidos
  bot.querySelector('[data-ia-retry]').addEventListener('click', () => iaEspacioElegido(iaChosenSpace));
}

/* ============================================================
   REGISTRO OPCIONAL EN TABLA "leads" (best-effort)
============================================================ */
async function iaGuardarLead(publicUrl, style){
  try {
    await fetch(`${IA_SUPABASE_URL}/rest/v1/${IA_LEADS_TABLE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': IA_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${IA_SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        foto_url: publicUrl,
        estilo: style,
        estado: 'pendiente_rediseno',
        origen: 'acero-press-chat'
      })
    });
  } catch (err) {
    console.warn('No se pudo registrar el lead (no bloquea el flujo):', err);
  }
}

/* ============================================================
   PASO 3 — CONFIRMACIÓN + BOTÓN DE WHATSAPP
   (usa .cta-btn con los colores térmicos del sitio, no verde WA)
============================================================ */
function iaMostrarConfirmacion(){
  iaSetState(iaT('st_contact'));
  iaSetProgress(4);

  const bot = iaAppendBubble('bot', `
    <span class="fig-tag">FIG. 04 — CONTACTO</span>
    <div class="result-tag">${iaEscape(iaChosenStyle)} · ${iaEscape(iaChosenSpace)} · ${iaT('ready')}</div>
    <p>${iaT('wa_prompt')}</p>
    <button class="cta-btn" data-ia-wa>
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="15" height="15">
        <path d="M16.04 4C9.37 4 3.98 9.36 3.98 15.99c0 2.27.63 4.4 1.73 6.23L4 28l6.02-1.58a12.1 12.1 0 0 0 6.02 1.59h.01c6.67 0 12.06-5.36 12.06-11.99C28.1 9.36 22.71 4 16.04 4zm0 21.94h-.01a9.9 9.9 0 0 1-5.06-1.39l-.36-.21-3.58.94.96-3.5-.24-.36a9.86 9.86 0 0 1-1.52-5.27c0-5.49 4.49-9.96 10.02-9.96 5.52 0 10.01 4.47 10.01 9.96 0 5.5-4.49 9.95-10.02 9.95zm5.48-7.45c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.2 5.08 4.48.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"/>
      </svg>
      <span>${iaT('wa_btn')}</span>
    </button>
    <button class="cta-btn ghost" data-ia-restart>${iaT('restart')}</button>
  `);
  bot.querySelector('[data-ia-wa]').addEventListener('click', iaIrAWhatsapp);
  bot.querySelector('[data-ia-restart]').addEventListener('click', iaResetChat);

  // Ya estamos en el paso de contacto del chat: ocultamos el flotante
  // para no duplicar el CTA, dejando solo el botón dentro del chat.
  if (waFloatBtn) waFloatBtn.style.display = 'none';
}

function iaIrAWhatsapp(){
  const parts = [
    iaT('wa_hello'),
    `${iaT('wa_want')}: *${iaChosenStyle}*.`,
    `${iaT('wa_space')}: *${iaChosenSpace}*.`
  ];
  if (iaCalcSummary) parts.push(iaCalcSummary);
  if (iaUserNotes.length) parts.push(`${iaT('wa_note')}: ${iaUserNotes.join(' · ')}`);
  parts.push(`${iaT('wa_photo')}:\n${iaUploadedPublicURL}`);

  const url = `https://wa.me/${IA_WHATSAPP_NUMBER}?text=${encodeURIComponent(parts.join('\n\n'))}`;
  iaTrack('redesign_whatsapp', { style: iaChosenStyle, space: iaChosenSpace });
  window.open(url, '_blank', 'noopener');
}

/* ============================================================
   RESET DEL CHAT
============================================================ */
function iaResetChat(){
  iaRawFile = null;
  iaChosenStyle = null;
  iaUploadedPublicURL = null;
  iaChosenSpace = null;
  iaUserNotes = [];

  chatBox.innerHTML = '';
  if (appShell) appShell.classList.add('story-active');
  iaSetState(iaT('st_welcome'));
  iaSetProgress(0);

  if (waFloatBtn) waFloatBtn.style.display = '';
}

/* ============================================================
   MENSAJES DE TEXTO LIBRES (composer)
============================================================ */
function iaEnviarTexto(){
  const text = (textInput.value || '').trim();
  if (!text) return;
  // textContent-safe: el texto del usuario nunca se interpreta como HTML
  iaAppendBubble('user', `<p>${iaEscape(text)}</p>`);
  textInput.value = '';
  iaUserNotes.push(text.slice(0, 500));

  if (!iaRawFile){
    iaAppendBubble('bot', `<p>${iaT('need_photo')}</p>`);
  } else if (!iaUploadedPublicURL){
    iaAppendBubble('bot', `<p>${iaT('need_choice')}</p>`);
  } else {
    iaAppendBubble('bot', `<p>${iaT('have_wa')}</p>`);
  }
}

/* ============================================================
   PRE-DIMENSIONAMIENTO DESDE LA CALCULADORA ESPACIAL
============================================================ */
function iaRecibirCalculo(e){
  if (!e.detail || !e.detail.text) return;
  iaCalcSummary = e.detail.text;
  iaAppendBubble('bot', `
    <span class="fig-tag">FIG. 06 — PRE-DIMENSIONAMIENTO</span>
    <p>${iaT('calc_got')}</p>
    <div class="result-tag" style="white-space:pre-line">${iaEscape(iaCalcSummary)}</div>
    <p>${iaRawFile ? '' : iaT('calc_next')}</p>
  `);
}

/* ============================================================
   LISTENERS
============================================================ */
if (iaWidgetPresent){
  btnCamera.addEventListener('click', () => fileCamera.click());
  btnGallery.addEventListener('click', () => fileGallery.click());

  fileCamera.addEventListener('change', function(){
    if (this.files[0]) iaOnImageSelected(this.files[0]);
    this.value = '';
  });
  fileGallery.addEventListener('change', function(){
    if (this.files[0]) iaOnImageSelected(this.files[0]);
    this.value = '';
  });

  if (btnSend) btnSend.addEventListener('click', iaEnviarTexto);
  window.addEventListener('acero:calc', iaRecibirCalculo);
  if (textInput) textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') iaEnviarTexto();
  });
} else {
  console.warn('rediseno-ia.js: no se encontraron los elementos del chat en esta página; el widget no se activó.');
}

/**
 * js/rediseno-ia.js
 * ─────────────────────────────────────────────────────────────
 * Chat de rediseño — sección "story/chat" de acero.press
 * Flujo: foto → estilo → sube a Supabase Storage → botón WhatsApp
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

const IA_STYLES = ["Industrial", "Minimalista", "Cálido / Madera", "Escandinavo", "Tropical"];

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
  if (stateTag) stateTag.textContent = `estado: ${label}`;
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
function iaOnImageSelected(file){
  if (!file) return;
  iaRawFile = file;
  const localUrl = URL.createObjectURL(file);

  iaAppendBubble('user', `<img src="${localUrl}" alt="Foto subida">`);
  iaSetState('foto recibida');
  iaSetProgress(1);

  const bot = iaAppendBubble('bot', `
    <span class="fig-tag">FIG. 02 — ESTILO</span>
    <p>¡Buena foto! ¿Qué estilo te gustaría para tu cafetería?</p>
  `);
  iaRenderStyleChips(bot);
}

function iaRenderStyleChips(containerBubble){
  const chipsWrap = document.createElement('div');
  chipsWrap.className = 'chips';
  chipsWrap.innerHTML = IA_STYLES.map(s => `<span class="chip" data-style="${s}">${s}</span>`).join('');
  containerBubble.appendChild(chipsWrap);
  iaScrollToBottom();

  chipsWrap.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chipsWrap.querySelectorAll('.chip').forEach(c => {
        c.style.pointerEvents = 'none';
        if (c !== chip) c.style.opacity = '.35';
      });
      iaEstiloElegido(chip.dataset.style, chipsWrap.closest('.bubble'));
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
  iaAppendBubble('user', `<p>Estilo elegido: <strong>${style}</strong></p>`);
  iaSetState('subiendo foto');
  iaSetProgress(2);

  const localUrl = URL.createObjectURL(iaRawFile);
  const bot = iaAppendBubble('bot', `
    <span class="fig-tag">FIG. 03 — SUBIDA</span>
    <div class="scan-wrap">
      <img src="${localUrl}" alt="Subiendo foto">
      <div class="scan-line"></div>
      <div class="scan-label">Subiendo tu foto… 0%</div>
    </div>
  `);

  iaSubirFoto(bot);
}

function iaSubirFoto(bubble){
  const scanLine = bubble.querySelector('.scan-line');
  const scanLabel = bubble.querySelector('.scan-label');

  const ext = iaExtFromMime(iaRawFile.type);
  const fileName = `${IA_BUCKET_FOLDER}/rediseno_${Date.now()}.${ext}`;
  const uploadUrl = `${IA_SUPABASE_URL}/storage/v1/object/${IA_BUCKET_NAME}/${fileName}`;

  const xhr = new XMLHttpRequest();
  xhr.open('POST', uploadUrl, true);
  xhr.setRequestHeader('Authorization', `Bearer ${IA_SUPABASE_ANON_KEY}`);
  xhr.setRequestHeader('apikey', IA_SUPABASE_ANON_KEY);
  xhr.setRequestHeader('Content-Type', iaRawFile.type || 'application/octet-stream');

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable && scanLabel){
      const pct = Math.round((e.loaded / e.total) * 100);
      scanLabel.textContent = `Subiendo tu foto… ${pct}%`;
    }
  };

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300){
      const publicUrl = `${IA_SUPABASE_URL}/storage/v1/object/public/${IA_BUCKET_NAME}/${fileName}`;
      iaUploadedPublicURL = publicUrl;
      if (scanLine) scanLine.style.display = 'none';
      if (scanLabel) scanLabel.textContent = '¡Foto recibida! ✅';
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

  xhr.send(iaRawFile);
}

function iaMostrarErrorSubida(uploadBubble){
  const scanLine = uploadBubble.querySelector('.scan-line');
  const scanLabel = uploadBubble.querySelector('.scan-label');
  if (scanLine) scanLine.style.display = 'none';
  if (scanLabel) scanLabel.textContent = '⚠ No se pudo subir la foto';

  const bot = iaAppendBubble('bot', `
    <p>Revisa tu conexión e intenta de nuevo.</p>
    <button class="cta-btn ghost" id="iaRetryBtn">Reintentar</button>
  `);
  bot.querySelector('#iaRetryBtn').addEventListener('click', iaResetChat);
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
  iaSetState('contacto');
  iaSetProgress(4);

  const bot = iaAppendBubble('bot', `
    <span class="fig-tag">FIG. 04 — CONTACTO</span>
    <div class="result-tag">Estilo ${iaChosenStyle} · listo para revisión</div>
    <p>Toca el botón para que nuestro equipo te escriba con tu propuesta:</p>
    <button class="cta-btn" id="iaWaBtn">
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="15" height="15">
        <path d="M16.04 4C9.37 4 3.98 9.36 3.98 15.99c0 2.27.63 4.4 1.73 6.23L4 28l6.02-1.58a12.1 12.1 0 0 0 6.02 1.59h.01c6.67 0 12.06-5.36 12.06-11.99C28.1 9.36 22.71 4 16.04 4zm0 21.94h-.01a9.9 9.9 0 0 1-5.06-1.39l-.36-.21-3.58.94.96-3.5-.24-.36a9.86 9.86 0 0 1-1.52-5.27c0-5.49 4.49-9.96 10.02-9.96 5.52 0 10.01 4.47 10.01 9.96 0 5.5-4.49 9.95-10.02 9.95zm5.48-7.45c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.2 5.08 4.48.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"/>
      </svg>
      <span>Enviar a WhatsApp</span>
    </button>
  `);
  bot.querySelector('#iaWaBtn').addEventListener('click', iaIrAWhatsapp);

  // Ya estamos en el paso de contacto del chat: ocultamos el flotante
  // para no duplicar el CTA, dejando solo el botón dentro del chat.
  if (waFloatBtn) waFloatBtn.style.display = 'none';
}

function iaIrAWhatsapp(){
  const msg = `Hola equipo de acero.studio 👋\n\n` +
    `Quiero una propuesta de rediseño para mi cafetería en estilo *${iaChosenStyle}*.\n\n` +
    `Aquí está la foto de mi espacio:\n${iaUploadedPublicURL}`;
  const url = `https://wa.me/${IA_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

/* ============================================================
   RESET DEL CHAT
============================================================ */
function iaResetChat(){
  iaRawFile = null;
  iaChosenStyle = null;
  iaUploadedPublicURL = null;

  chatBox.innerHTML = '';
  if (appShell) appShell.classList.add('story-active');
  iaSetState('bienvenida');
  iaSetProgress(0);

  if (waFloatBtn) waFloatBtn.style.display = '';
}

/* ============================================================
   MENSAJES DE TEXTO LIBRES (composer)
============================================================ */
function iaEnviarTexto(){
  const text = (textInput.value || '').trim();
  if (!text) return;
  iaAppendBubble('user', `<p>${text}</p>`);
  textInput.value = '';

  if (!iaRawFile){
    iaAppendBubble('bot', `<p>Para comenzar, sube una foto de tu cafetería con 📷 o 🖼️.</p>`);
  } else if (!iaUploadedPublicURL){
    iaAppendBubble('bot', `<p>Elige un estilo arriba para continuar ↑</p>`);
  } else {
    iaAppendBubble('bot', `<p>Ya tienes tu botón de WhatsApp listo arriba ↑ para hablar con nuestro equipo.</p>`);
  }
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
  if (textInput) textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') iaEnviarTexto();
  });
} else {
  console.warn('rediseno-ia.js: no se encontraron los elementos del chat en esta página; el widget no se activó.');
}

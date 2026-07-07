/**
 * js/rediseno-ia.js
 * ─────────────────────────────────────────────────────────────
 * Chat de rediseño — sección "story/chat" de acero.press
 * Flujo: foto → estilo → sube a Supabase Storage → botón WhatsApp
 * (sin IA — el rediseño lo hace el equipo manualmente al recibir
 * el mensaje de WhatsApp con la foto).
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
   REFERENCIAS AL DOM (las que realmente existen en el HTML)
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

const iaWidgetPresent = chatBox && btnCamera && btnGallery && fileCamera && fileGallery;

/* ============================================================
   ESTADO
============================================================ */
let iaRawFile = null;
let iaChosenStyle = null;
let iaUploadedPublicURL = null;

/* ============================================================
   UTILIDADES DE CHAT
============================================================ */
function iaScrollToBottom(){
  chatBox.scrollTop = chatBox.scrollHeight;
}

function iaHideIntro(){
  if (storyInline && storyInline.style.display !== 'none'){
    storyInline.style.display = 'none';
  }
}

function iaSetState(label){
  if (stateTag) stateTag.textContent = `estado: ${label}`;
}

function iaSetProgress(step){
  if (!storyProgress) return;
  storyProgress.querySelectorAll('.p-dot').forEach(dot => {
    dot.classList.toggle('on', parseInt(dot.dataset.p, 10) <= step);
  });
}

// Crea una burbuja y devuelve el nodo para poder actualizarla después (ej. % de subida)
function iaAppendMessage(role, innerHTML){
  iaHideIntro();
  const msg = document.createElement('div');
  msg.className = `chat-msg chat-msg--${role}`;
  msg.innerHTML = innerHTML;
  chatBox.appendChild(msg);
  iaScrollToBottom();
  return msg;
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

  iaAppendMessage('user', `<img src="${localUrl}" alt="Foto subida" class="chat-msg-photo">`);
  iaSetState('foto recibida');
  iaSetProgress(1);

  const bot = iaAppendMessage('bot', `<p>¡Buena foto! ¿Qué estilo te gustaría para tu cafetería?</p>`);
  iaRenderStyleChips(bot);
}

function iaRenderStyleChips(containerMsg){
  const chipsWrap = document.createElement('div');
  chipsWrap.className = 'ia-chips';
  chipsWrap.innerHTML = IA_STYLES.map(s => `<span class="ia-chip" data-style="${s}">${s}</span>`).join('');
  containerMsg.appendChild(chipsWrap);
  iaScrollToBottom();

  chipsWrap.querySelectorAll('.ia-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chipsWrap.querySelectorAll('.ia-chip').forEach(c => {
        c.style.pointerEvents = 'none';
        if (c !== chip) c.style.opacity = '.35';
      });
      iaEstiloElegido(chip.dataset.style);
    });
  });
}

/* ============================================================
   PASO 2 — ESTILO ELEGIDO → SUBIDA A SUPABASE STORAGE
============================================================ */
function iaEstiloElegido(style){
  iaChosenStyle = style;
  iaAppendMessage('user', `<p>Estilo elegido: <strong>${style}</strong></p>`);
  iaSetState('subiendo foto');
  iaSetProgress(2);

  const progressMsg = iaAppendMessage('bot', `<p class="ia-progress-text">Subiendo tu foto… 0%</p>`);
  iaSubirFoto(style, progressMsg.querySelector('.ia-progress-text'));
}

function iaSubirFoto(style, progressEl){
  const ext = iaExtFromMime(iaRawFile.type);
  const fileName = `${IA_BUCKET_FOLDER}/rediseno_${Date.now()}.${ext}`;
  const uploadUrl = `${IA_SUPABASE_URL}/storage/v1/object/${IA_BUCKET_NAME}/${fileName}`;

  const xhr = new XMLHttpRequest();
  xhr.open('POST', uploadUrl, true);
  xhr.setRequestHeader('Authorization', `Bearer ${IA_SUPABASE_ANON_KEY}`);
  xhr.setRequestHeader('apikey', IA_SUPABASE_ANON_KEY);
  xhr.setRequestHeader('Content-Type', iaRawFile.type || 'application/octet-stream');

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable && progressEl){
      const pct = Math.round((e.loaded / e.total) * 100);
      progressEl.textContent = `Subiendo tu foto… ${pct}%`;
    }
  };

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300){
      const publicUrl = `${IA_SUPABASE_URL}/storage/v1/object/public/${IA_BUCKET_NAME}/${fileName}`;
      iaUploadedPublicURL = publicUrl;
      if (progressEl) progressEl.textContent = '¡Foto recibida! ✅';
      iaGuardarLead(publicUrl, style);
      iaMostrarConfirmacion();
    } else {
      console.error('Error subiendo a Supabase Storage:', xhr.status, xhr.responseText);
      iaMostrarErrorSubida();
    }
  };

  xhr.onerror = () => {
    console.error('Error de red subiendo la foto.');
    iaMostrarErrorSubida();
  };

  xhr.send(iaRawFile);
}

function iaMostrarErrorSubida(){
  const msg = iaAppendMessage('bot', `
    <p>⚠ No se pudo subir tu foto. Revisa tu conexión e intenta de nuevo.</p>
    <button class="ia-retry-btn">Reintentar</button>
  `);
  msg.querySelector('.ia-retry-btn').addEventListener('click', iaResetChat);
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
   PASO 3 — CONFIRMACIÓN + BOTÓN DE WHATSAPP EN EL CHAT
============================================================ */
function iaMostrarConfirmacion(){
  iaSetState('contacto');
  iaSetProgress(4);

  const msg = iaAppendMessage('bot', `
    <p>Tu foto en estilo <strong>${iaChosenStyle}</strong> ya está lista para revisión.</p>
    <p>Toca el botón para que nuestro equipo te escriba con tu propuesta:</p>
    <button class="ia-wa-btn">
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="18" height="18">
        <path d="M16.04 4C9.37 4 3.98 9.36 3.98 15.99c0 2.27.63 4.4 1.73 6.23L4 28l6.02-1.58a12.1 12.1 0 0 0 6.02 1.59h.01c6.67 0 12.06-5.36 12.06-11.99C28.1 9.36 22.71 4 16.04 4zm0 21.94h-.01a9.9 9.9 0 0 1-5.06-1.39l-.36-.21-3.58.94.96-3.5-.24-.36a9.86 9.86 0 0 1-1.52-5.27c0-5.49 4.49-9.96 10.02-9.96 5.52 0 10.01 4.47 10.01 9.96 0 5.5-4.49 9.95-10.02 9.95zm5.48-7.45c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.2 5.08 4.48.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"/>
      </svg>
      <span>Enviar a WhatsApp</span>
    </button>
  `);
  msg.querySelector('.ia-wa-btn').addEventListener('click', iaIrAWhatsapp);

  // Ya estamos "en la sección de whatsapp" del chat: ocultamos el flotante
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
  if (storyInline) storyInline.style.display = '';
  iaSetState('bienvenida');
  iaSetProgress(0);

  // Volvemos a mostrar el flotante de WhatsApp al salir del flujo
  if (waFloatBtn) waFloatBtn.style.display = '';
}

/* ============================================================
   MENSAJES DE TEXTO LIBRES (composer)
============================================================ */
function iaEnviarTexto(){
  const text = (textInput.value || '').trim();
  if (!text) return;
  iaAppendMessage('user', `<p>${text}</p>`);
  textInput.value = '';

  if (!iaRawFile){
    iaAppendMessage('bot', `<p>Para comenzar, sube una foto de tu cafetería con 📷 o 🖼️.</p>`);
  } else if (!iaUploadedPublicURL){
    iaAppendMessage('bot', `<p>Elige un estilo arriba para continuar ↑</p>`);
  } else {
    iaAppendMessage('bot', `<p>Ya tienes tu botón de WhatsApp listo arriba ↑ para hablar con nuestro equipo.</p>`);
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
    this.value = ''; // permite volver a elegir la misma foto si se reintenta
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

/**
 * js/rediseno-ia.js
 * ─────────────────────────────────────────────────────────────
 * Widget de rediseño — sección #rediseno-ia (acero.press)
 * Sube foto → elige estilo → la foto se sube a Supabase Storage →
 * al confirmarse la subida se habilita "Enviar a WhatsApp" →
 * el equipo de acero.studio responde manualmente con el rediseño.
 *
 * NOTA: Ya no se llama a la Edge Function "generar-dise-o" (Gemini).
 * Esa función puede quedar sin usar en Supabase o eliminarse.
 * ─────────────────────────────────────────────────────────────
 */

/* ============================================================
   CONFIGURACIÓN
============================================================ */
const IA_WHATSAPP_NUMBER = "573152125327"; // 🔧 tu número real
const IA_SUPABASE_URL = "https://tylylfrabjkaiukuilem.supabase.co";
const IA_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bHlsZnJhYmprYWl1a3VpbGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODAwNDAsImV4cCI6MjA5ODA1NjA0MH0.Bqe1f2QBUBMiLmLCfAeownFsHLpSpxg6qaAkgvTB3uE";

const IA_BUCKET_NAME = "disenos-cafe";       // bucket donde se guardan las fotos originales
const IA_BUCKET_FOLDER = "originales";       // subcarpeta para no mezclar con renders anteriores
const IA_LEADS_TABLE = "leads";              // tabla opcional; si no existe, se ignora el error

const IA_STYLES = ["Industrial", "Minimalista", "Cálido / Madera", "Escandinavo", "Tropical"];

/* ============================================================
   REFERENCIAS AL DOM (deben existir en el index de acero.press)
============================================================ */
const iaPreview = document.getElementById('iaPreview');
const iaPreviewImg = document.getElementById('iaPreviewImg');
const iaPreviewEmpty = document.getElementById('iaPreviewEmpty');
const iaStatusText = document.getElementById('iaStatusText');
const iaStylesBox = document.getElementById('iaStyles');
const btnCamera = document.getElementById('btnCamera');
const btnGallery = document.getElementById('btnGallery');
const fileCamera = document.getElementById('fileCamera');
const fileGallery = document.getElementById('fileGallery');
const btnIaWhatsapp = document.getElementById('btnIaWhatsapp');
const btnIaRetry = document.getElementById('btnIaRetry');

// Si esta página no tiene el widget, no hacemos nada (evita errores en otras vistas)
const iaWidgetPresent = iaPreview && btnCamera && btnGallery && fileCamera && fileGallery;

/* ============================================================
   ESTADO
============================================================ */
let iaRawFile = null;
let iaLocalPreviewURL = null;
let iaChosenStyle = null;
let iaUploadedPublicURL = null;

/* ============================================================
   UTILIDADES
============================================================ */
function iaSetStatus(text, colorVar){
  if(!iaStatusText) return;
  iaStatusText.style.display = text ? 'block' : 'none';
  iaStatusText.textContent = text || '';
  iaStatusText.style.color = colorVar || 'var(--t5)';
}

function iaExtFromMime(mime){
  if (!mime) return 'jpg';
  if (mime.includes('png')) return 'png';
  if (mime.includes('webp')) return 'webp';
  if (mime.includes('heic')) return 'heic';
  return 'jpg';
}

function iaResetWidget(){
  iaRawFile = null;
  iaLocalPreviewURL = null;
  iaChosenStyle = null;
  iaUploadedPublicURL = null;

  iaPreviewImg.style.display = 'none';
  iaPreviewImg.src = '';
  iaPreviewEmpty.style.display = 'flex';

  iaStylesBox.style.display = 'none';
  iaStylesBox.innerHTML = '';

  iaSetStatus('');

  btnIaWhatsapp.style.display = 'none';
  btnIaRetry.style.display = 'none';

  btnCamera.style.display = '';
  btnGallery.style.display = '';
}

/* ============================================================
   PASO 1 — FOTO SELECCIONADA
============================================================ */
function iaOnImageSelected(file){
  if(!file) return;
  iaRawFile = file;
  iaLocalPreviewURL = URL.createObjectURL(file);

  iaPreviewEmpty.style.display = 'none';
  iaPreviewImg.src = iaLocalPreviewURL;
  iaPreviewImg.style.display = 'block';

  iaSetStatus('Foto cargada. Elige un estilo para continuar ↓');

  // Ocultamos los botones de captura mientras se decide el estilo
  btnCamera.style.display = 'none';
  btnGallery.style.display = 'none';

  iaRenderStyleChips();
}

function iaRenderStyleChips(){
  iaStylesBox.innerHTML = IA_STYLES.map(s =>
    `<span class="ia-chip" data-style="${s}">${s}</span>`
  ).join('');
  iaStylesBox.style.display = 'flex';

  iaStylesBox.querySelectorAll('.ia-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      iaStylesBox.querySelectorAll('.ia-chip').forEach(c => c.style.pointerEvents = 'none');
      iaSubirFoto(chip.dataset.style);
    });
  });
}

/* ============================================================
   PASO 2 — SUBIDA A SUPABASE STORAGE (sin IA)
============================================================ */
function iaSubirFoto(style){
  iaChosenStyle = style;
  iaStylesBox.style.display = 'none';
  iaSetStatus('Subiendo tu foto… 0%');

  const ext = iaExtFromMime(iaRawFile.type);
  const fileName = `${IA_BUCKET_FOLDER}/rediseno_${Date.now()}.${ext}`;
  const uploadUrl = `${IA_SUPABASE_URL}/storage/v1/object/${IA_BUCKET_NAME}/${fileName}`;

  const xhr = new XMLHttpRequest();
  xhr.open('POST', uploadUrl, true);
  xhr.setRequestHeader('Authorization', `Bearer ${IA_SUPABASE_ANON_KEY}`);
  xhr.setRequestHeader('apikey', IA_SUPABASE_ANON_KEY);
  xhr.setRequestHeader('Content-Type', iaRawFile.type || 'application/octet-stream');

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable){
      const pct = Math.round((e.loaded / e.total) * 100);
      iaSetStatus(`Subiendo tu foto… ${pct}%`);
    }
  };

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300){
      const publicUrl = `${IA_SUPABASE_URL}/storage/v1/object/public/${IA_BUCKET_NAME}/${fileName}`;
      iaUploadedPublicURL = publicUrl;
      iaGuardarLead(publicUrl, style); // best-effort, no bloquea el flujo
      iaMostrarConfirmacion();
    } else {
      console.error('Error subiendo a Supabase Storage:', xhr.status, xhr.responseText);
      iaSetStatus('⚠ No se pudo subir la foto. Intenta de nuevo.', '#ff6a39');
      btnIaRetry.style.display = 'block';
    }
  };

  xhr.onerror = () => {
    console.error('Error de red subiendo la foto.');
    iaSetStatus('⚠ Error de red. Revisa tu conexión e intenta de nuevo.', '#ff6a39');
    btnIaRetry.style.display = 'block';
  };

  xhr.send(iaRawFile);
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
        origen: 'acero-studio-widget'
      })
    });
  } catch (err) {
    // No bloquea el flujo si la tabla no existe o falla el insert
    console.warn('No se pudo registrar el lead (no bloquea el flujo):', err);
  }
}

/* ============================================================
   PASO 3 — CONFIRMACIÓN + WHATSAPP
============================================================ */
function iaMostrarConfirmacion(){
  iaSetStatus(`Foto recibida · estilo ${iaChosenStyle}. Nuestro equipo te contacta con tu propuesta.`, 'var(--t7)');
  btnIaWhatsapp.style.display = 'block';
  btnIaRetry.style.display = 'block';
}

function iaIrAWhatsapp(){
  const msg = `Hola equipo de acero.studio 👋\n\n` +
    `Quiero una propuesta de rediseño para mi cafetería en estilo *${iaChosenStyle}*.\n\n` +
    `Aquí está la foto de mi espacio:\n${iaUploadedPublicURL}`;
  const url = `https://wa.me/${IA_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

/* ============================================================
   LISTENERS
============================================================ */
if (iaWidgetPresent){
  btnCamera.addEventListener('click', () => fileCamera.click());
  btnGallery.addEventListener('click', () => fileGallery.click());
  fileCamera.addEventListener('change', function(){ if(this.files[0]) iaOnImageSelected(this.files[0]); });
  fileGallery.addEventListener('change', function(){ if(this.files[0]) iaOnImageSelected(this.files[0]); });

  btnIaWhatsapp.addEventListener('click', iaIrAWhatsapp);
  btnIaRetry.addEventListener('click', iaResetWidget);
}

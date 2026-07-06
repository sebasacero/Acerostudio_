/**
 * js/rediseno-ia.js
 * ─────────────────────────────────────────────────────────────
 * Widget de rediseño con IA — sección #rediseno-ia (acero.press)
 * Sube foto → elige estilo → genera propuesta (Gemini vía Supabase
 * Edge Function) → cotiza por WhatsApp.
 * ─────────────────────────────────────────────────────────────
 */

/* ============================================================
   CONFIGURACIÓN
============================================================ */
const IA_WHATSAPP_NUMBER = "573152125327"; // 🔧 pon aquí tu número real
const IA_SUPABASE_FUNC_URL = "https://tylylfrabjkaiukuilem.supabase.co/functions/v1/generar-dise-o";
const IA_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bHlsZnJhYmprYWl1a3VpbGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODAwNDAsImV4cCI6MjA5ODA1NjA0MH0.Bqe1f2QBUBMiLmLCfAeownFsHLpSpxg6qaAkgvTB3uE"; // 🔧 Supabase → Settings → API → anon public

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
let iaUploadedURL = null;
let iaChosenStyle = null;
let iaGeneratedURL = null;

/* ============================================================
   UTILIDADES
============================================================ */
function iaSetStatus(text, colorVar){
  if(!iaStatusText) return;
  iaStatusText.style.display = text ? 'block' : 'none';
  iaStatusText.textContent = text || '';
  iaStatusText.style.color = colorVar || 'var(--t5)';
}

const iaFileToBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = reject;
});

function iaResetWidget(){
  iaRawFile = null;
  iaUploadedURL = null;
  iaChosenStyle = null;
  iaGeneratedURL = null;

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
  iaUploadedURL = URL.createObjectURL(file);

  iaPreviewEmpty.style.display = 'none';
  iaPreviewImg.src = iaUploadedURL;
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
      iaGenerarPropuesta(chip.dataset.style);
    });
  });
}

/* ============================================================
   PASO 2 — GENERACIÓN (Gemini vía Supabase Edge Function)
============================================================ */
async function iaGenerarPropuesta(style){
  iaChosenStyle = style;
  iaStylesBox.style.display = 'none';
  iaSetStatus(`Generando propuesta en estilo ${style}…`);

  try {
    const base64Data = await iaFileToBase64(iaRawFile);

    const prompt = `Rediseña esta cafetería manteniendo estrictamente la ubicación de paredes, columnas y ventanas estructurales. Aplica un estilo estético de alta gama de tipo: ${style}. Devuelve la imagen final procesada de forma realista.`;

    const response = await fetch(IA_SUPABASE_FUNC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${IA_SUPABASE_ANON_KEY}`,
        'apikey': IA_SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        prompt,
        image_base64: base64Data,
        mime_type: iaRawFile.type
      })
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || `Error de red (HTTP ${response.status})`);
    }

    const resData = await response.json();
    if (resData.error) throw new Error(resData.error);

    const url = resData.imageUrl || resData.image_url || resData.url || (resData.data && resData.data.publicUrl);
    if (!url) throw new Error('El servidor no devolvió una imagen válida.');

    iaGeneratedURL = url;
    iaMostrarResultado();

  } catch (err) {
    console.error(err);
    iaSetStatus(`⚠ ${err.message}`, '#ff6a39');
    btnIaRetry.style.display = 'block';
  }
}

/* ============================================================
   PASO 3 — RESULTADO + WHATSAPP
============================================================ */
function iaMostrarResultado(){
  iaPreviewImg.src = iaGeneratedURL;
  iaSetStatus(`Propuesta lista · estilo ${iaChosenStyle}`, 'var(--t7)');

  btnIaWhatsapp.style.display = 'block';
  btnIaRetry.style.display = 'block';
}

function iaIrAWhatsapp(){
  const msg = `Hola equipo de acero.studio 👋\n\n` +
    `Generé una propuesta de rediseño para mi cafetería en estilo *${iaChosenStyle}*.\n\n` +
    `Quiero cotizar la obra a partir de este render:\n${iaGeneratedURL}`;
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

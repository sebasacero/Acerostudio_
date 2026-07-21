/**
 * admin-panel.js — Acero.press
 * ─────────────────────────────────────────────────────────────
 * Panel de administración:
 *   - Login con Facebook OAuth
 *   - Métricas de Instagram
 *   - Editor de video (recorte + subtítulos)
 *   - Publicador en IG, TikTok y YouTube
 *
 * SETUP:
 *   1. Reemplaza FB_APP_ID con tu App ID de Meta for Developers
 *   2. Reemplaza SUPABASE_URL y SUPABASE_ANON con tus credenciales
 *   3. Agrega al final de cafe.html antes de </body>:
 *      <script src="admin-panel.js"></script>
 * ─────────────────────────────────────────────────────────────
 */

const ADMIN_CONFIG = {
  FB_APP_ID:    "878729934699085",
  SUPABASE_URL: "https://tylylfrabjkaiukuilem.supabase.co",
  SUPABASE_ANON:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bHlsZnJhYmprYWl1a3VpbGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODAwNDAsImV4cCI6MjA5ODA1NjA0MH0.Bqe1f2QBUBMiLmLCfAeownFsHLpSpxg6qaAkgvTB3uE",
  IG_USER_ID:   "17841402142996176",
};

/* ══════════════════════════════════════════════════════════════
   1. ESTADO GLOBAL
══════════════════════════════════════════════════════════════ */
 
const adminState = {
  isOpen:      false,
  isLoggedIn:  false,
  fbToken:     null,
  igToken:     ,
  metrics:     null,
  video:       null,
  videoURL:    null,
  trimStart:   0,
  trimEnd:     0,
  subtitles:   [],
  activeTab:   "metrics",
  publishing:  false,
  platforms:   { ig: true, tk: true, yt: true },
  scheduleDate: null,
};
 
/* ══════════════════════════════════════════════════════════════
   2. ESTILOS
══════════════════════════════════════════════════════════════ */
 
function injectAdminStyles() {
  if (document.getElementById("admin-panel-styles")) return;
  const style = document.createElement("style");
  style.id = "admin-panel-styles";
  style.textContent = 
    #admin-trigger{
      font-family:'Archivo',sans-serif; font-weight:700; font-size:.7rem;
      letter-spacing:.14em; text-transform:uppercase;
      padding:.65rem 1.3rem; border:1.5px solid rgba(255,255,255,.2);
      border-radius:3px; cursor:pointer; background:transparent;
      color:rgba(255,255,255,.6); transition:all .2s; margin-left:.5rem;
    }
    #admin-trigger:hover { border-color:var(--hot); color:var(--hot); }
    #admin-trigger.logged-in { border-color:#25D366; color:#25D366; }
 
    #admin-overlay {
      position:fixed; inset:0; z-index:1000;
      background:rgba(10,10,14,.92); backdrop-filter:blur(12px);
      display:none; align-items:flex-start; justify-content:center;
      padding:5rem 1rem 2rem; overflow-y:auto;
    }
    #admin-overlay.open { display:flex; }
 
    #admin-panel {
      width:100%; max-width:900px; background:#161618;
      border:1px solid rgba(255,255,255,.08); border-radius:6px;
      overflow:hidden; position:relative;
    }
 
    .adm-header {
      display:flex; align-items:center; justify-content:space-between;
      padding:1.2rem 1.5rem; border-bottom:1px solid rgba(255,255,255,.07);
      background:rgba(255,255,255,.02);
    }
    .adm-header-left { display:flex; align-items:center; gap:1rem; }
    .adm-logo {
      font-family:'JetBrains Mono',monospace; font-size:.72rem;
      letter-spacing:.14em; text-transform:uppercase;
      background:linear-gradient(90deg,var(--t5),var(--t7));
      -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    }
    .adm-user-badge { font-family:'JetBrains Mono',monospace; font-size:.65rem; color:rgba(255,255,255,.4); display:none; }
    .adm-user-badge.visible { display:block; }
    .adm-close { background:none; border:none; color:rgba(255,255,255,.4); font-size:1.4rem; cursor:pointer; transition:color .2s; }
    .adm-close:hover { color:#fff; }
 
    #adm-login {
      padding:4rem 2rem; text-align:center;
      display:flex; flex-direction:column; align-items:center; gap:1.5rem;
    }
    .adm-login-icon { font-size:3rem; opacity:.6; }
    .adm-login-title { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:1.4rem; text-transform:uppercase; color:#fff; }
    .adm-login-sub { font-family:'JetBrains Mono',monospace; font-size:.75rem; color:rgba(255,255,255,.35); max-width:32ch; line-height:1.6; }
    .btn-fb-login {
      font-family:'Archivo',sans-serif; font-weight:700; font-size:.78rem;
      letter-spacing:.1em; text-transform:uppercase; padding:1rem 2.5rem;
      border:none; border-radius:4px; cursor:pointer; background:#1877F2; color:#fff;
      display:flex; align-items:center; gap:.7rem; transition:opacity .2s;
    }
    .btn-fb-login:hover { opacity:.88; }
    .btn-fb-login svg { width:20px; height:20px; fill:#fff; }
 
    #adm-main { display:none; }
    #adm-main.visible { display:block; }
 
    .adm-tabs { display:flex; border-bottom:1px solid rgba(255,255,255,.07); padding:0 1.5rem; }
    .adm-tab {
      font-family:'JetBrains Mono',monospace; font-size:.7rem; letter-spacing:.1em;
      text-transform:uppercase; padding:.9rem 1.2rem; border:none; background:transparent;
      color:rgba(255,255,255,.35); cursor:pointer; border-bottom:2px solid transparent; transition:all .2s;
    }
    .adm-tab:hover { color:rgba(255,255,255,.7); }
    .adm-tab.active { color:var(--t6); border-bottom-color:var(--t6); }
 
    .adm-tab-content { display:none; padding:1.5rem; }
    .adm-tab-content.active { display:block; }
 
    .metrics-grid {
      display:grid; grid-template-columns:repeat(3,1fr);
      gap:1px; background:rgba(255,255,255,.06); margin-bottom:1.5rem;
    }
    @media(max-width:600px){ .metrics-grid{ grid-template-columns:1fr 1fr; } }
    .metric-cell { background:rgba(255,255,255,.02); padding:1.2rem 1rem; text-align:center; }
    .metric-n {
      font-family:'JetBrains Mono',monospace; font-weight:700; font-size:1.6rem;
      background:linear-gradient(90deg,var(--t5),var(--t7));
      -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
      line-height:1; margin-bottom:.3rem;
    }
    .metric-l { font-family:'JetBrains Mono',monospace; font-size:.62rem; color:rgba(255,255,255,.3); letter-spacing:.08em; text-transform:uppercase; }
    .metrics-loading { font-family:'JetBrains Mono',monospace; font-size:.75rem; color:rgba(255,255,255,.3); text-align:center; padding:2rem; animation:adm-pulse 1.4s ease-in-out infinite; }
    @keyframes adm-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
 
    .recent-posts-title { font-family:'JetBrains Mono',monospace; font-size:.68rem; letter-spacing:.12em; text-transform:uppercase; color:rgba(255,255,255,.3); margin-bottom:.8rem; }
    .recent-posts-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:4px; }
    @media(max-width:600px){ .recent-posts-grid{ grid-template-columns:repeat(3,1fr); } }
    .recent-post-thumb { aspect-ratio:1; border-radius:2px; overflow:hidden; cursor:pointer; opacity:.8; transition:opacity .2s; }
    .recent-post-thumb:hover { opacity:1; }
    .recent-post-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
    .recent-post-thumb.skeleton { background:rgba(255,255,255,.06); animation:adm-pulse 1.4s ease-in-out infinite; }
 
    .video-drop-zone {
      border:2px dashed rgba(255,255,255,.15); border-radius:4px;
      padding:3rem 2rem; text-align:center; cursor:pointer;
      transition:border-color .2s; margin-bottom:1.5rem;
    }
    .video-drop-zone:hover, .video-drop-zone.drag-over { border-color:var(--t6); }
    .video-drop-zone .drop-icon { font-size:2.5rem; margin-bottom:.8rem; }
    .video-drop-zone p { font-family:'JetBrains Mono',monospace; font-size:.75rem; color:rgba(255,255,255,.35); line-height:1.6; }
    .video-drop-zone span { color:var(--t6); cursor:pointer; text-decoration:underline; }
    #video-file-input { display:none; }
 
    .editor-layout { display:none; gap:1.5rem; flex-direction:column; }
    .editor-layout.visible { display:flex; }
 
    .video-preview-wrap { position:relative; background:#000; border-radius:4px; overflow:hidden; aspect-ratio:16/9; }
    #admin-video-preview { width:100%; height:100%; object-fit:contain; }
 
    .trim-section { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:4px; padding:1rem 1.2rem; }
    .trim-label { font-family:'JetBrains Mono',monospace; font-size:.65rem; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.3); margin-bottom:.8rem; }
    .trim-bar-wrap { position:relative; height:44px; background:rgba(255,255,255,.05); border-radius:3px; margin-bottom:.8rem; cursor:pointer; }
    .trim-bar-fill { position:absolute; top:0; bottom:0; background:rgba(255,140,0,.3); border-left:2px solid var(--t6); border-right:2px solid var(--t6); }
    .trim-playhead { position:absolute; top:0; bottom:0; width:2px; background:#fff; pointer-events:none; }
    .trim-times { display:flex; justify-content:space-between; font-family:'JetBrains Mono',monospace; font-size:.68rem; color:rgba(255,255,255,.45); }
 
    .subs-section { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:4px; padding:1rem 1.2rem; }
    .subs-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:.8rem; }
    .subs-title { font-family:'JetBrains Mono',monospace; font-size:.65rem; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.3); }
    .btn-add-sub { font-family:'JetBrains Mono',monospace; font-size:.65rem; letter-spacing:.08em; text-transform:uppercase; padding:.35rem .8rem; border:1px solid rgba(255,255,255,.15); border-radius:2px; background:transparent; color:rgba(255,255,255,.5); cursor:pointer; transition:all .2s; }
    .btn-add-sub:hover { border-color:var(--t6); color:var(--t6); }
    .sub-item { display:grid; grid-template-columns:70px 70px 1fr auto; gap:.5rem; align-items:center; margin-bottom:.5rem; }
    .sub-input { font-family:'JetBrains Mono',monospace; font-size:.72rem; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); border-radius:2px; padding:.4rem .6rem; color:#fff; outline:none; width:100%; transition:border-color .2s; }
    .sub-input:focus { border-color:var(--t6); }
    .btn-del-sub { background:none; border:none; color:rgba(255,255,255,.25); cursor:pointer; font-size:1rem; transition:color .2s; }
    .btn-del-sub:hover { color:var(--hot); }
    .subs-empty { font-family:'JetBrains Mono',monospace; font-size:.7rem; color:rgba(255,255,255,.2); text-align:center; padding:1rem 0; }
 
    .publish-section { display:flex; flex-direction:column; gap:1.2rem; }
    .publish-platforms { display:grid; grid-template-columns:repeat(3,1fr); gap:.8rem; }
    .platform-toggle { border:1.5px solid rgba(255,255,255,.12); border-radius:4px; padding:1rem; cursor:pointer; transition:all .2s; text-align:center; opacity:.5; }
    .platform-toggle.on { opacity:1; }
    .platform-toggle.ig.on { border-color:#E1306C; }
    .platform-toggle.tk.on { border-color:#69C9D0; }
    .platform-toggle.yt.on { border-color:var(--yt); }
    .platform-toggle .pt-icon { font-size:1.5rem; margin-bottom:.3rem; }
    .platform-toggle .pt-name { font-family:'JetBrains Mono',monospace; font-size:.65rem; letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,.5); }
 
    .publish-caption-wrap { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:4px; padding:1rem 1.2rem; }
    .publish-caption-label { font-family:'JetBrains Mono',monospace; font-size:.65rem; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.3); margin-bottom:.6rem; }
    #publish-caption { width:100%; min-height:80px; background:transparent; border:none; color:rgba(255,255,255,.7); font-family:'Archivo',sans-serif; font-size:.88rem; line-height:1.6; resize:vertical; outline:none; }
    .caption-count { font-family:'JetBrains Mono',monospace; font-size:.62rem; color:rgba(255,255,255,.2); text-align:right; margin-top:.3rem; }
 
    .publish-schedule { display:flex; align-items:center; gap:1rem; flex-wrap:wrap; }
    .schedule-label { font-family:'JetBrains Mono',monospace; font-size:.68rem; letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,.35); white-space:nowrap; }
    #schedule-datetime { background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); border-radius:2px; padding:.5rem .8rem; color:rgba(255,255,255,.7); font-family:'JetBrains Mono',monospace; font-size:.72rem; outline:none; cursor:pointer; }
    .btn-adm-primary { font-family:'Archivo',sans-serif; font-weight:700; font-size:.72rem; letter-spacing:.14em; text-transform:uppercase; padding:.85rem 2rem; border:none; border-radius:3px; cursor:pointer; background:linear-gradient(135deg,var(--t5),var(--t6),var(--t7)); color:var(--near-black); transition:opacity .2s; white-space:nowrap; }
    .btn-adm-primary:hover { opacity:.85; }
    .btn-adm-primary:disabled { opacity:.4; cursor:not-allowed; }
 
    .publish-status { font-family:'JetBrains Mono',monospace; font-size:.72rem; text-align:center; padding:1rem; border-radius:3px; display:none; }
    .publish-status.loading { display:block; background:rgba(255,140,0,.08); color:var(--t6); animation:adm-pulse 1.4s ease-in-out infinite; }
    .publish-status.success { display:block; background:rgba(37,211,102,.08); color:#25D366; }
    .publish-status.error { display:block; background:rgba(232,24,28,.08); color:var(--hot); }
 
    .upload-progress { display:none; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07); border-radius:4px; padding:1rem 1.2rem; }
    .upload-progress.visible { display:block; }
    .progress-bar-wrap { background:rgba(255,255,255,.08); border-radius:2px; height:4px; margin:.5rem 0; overflow:hidden; }
    .progress-bar-fill { height:100%; background:linear-gradient(90deg,var(--t5),var(--t7)); border-radius:2px; transition:width .3s ease; width:0%; }
    .progress-label { font-family:'JetBrains Mono',monospace; font-size:.65rem; color:rgba(255,255,255,.4); }
 
    .no-video-warning { font-family:'JetBrains Mono',monospace; font-size:.72rem; color:rgba(255,140,0,.7); background:rgba(255,140,0,.06); border:1px solid rgba(255,140,0,.2); border-radius:3px; padding:.8rem 1rem; text-align:center; }
  ;
  document.head.appendChild(style);
}
 
/* ══════════════════════════════════════════════════════════════
   3. RENDER DEL PANEL
══════════════════════════════════════════════════════════════ */
 

 
/* ══════════════════════════════════════════════════════════════
   4. FACEBOOK LOGIN
══════════════════════════════════════════════════════════════ */
 
function initFacebookSDK() {
  window.fbAsyncInit = function () {
    FB.init({ appId: ADMIN_CONFIG.FB_APP_ID, cookie: true, xfbml: true, version: "v19.0" });
  };
  if (!document.getElementById("facebook-jssdk")) {
    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src = "https://connect.facebook.net/es_LA/sdk.js";
    script.async = true; script.defer = true;
    document.head.appendChild(script);
  }
}
 
function handleFBLogin() {
  if (typeof FB === "undefined") {
    alert("El SDK de Facebook aún no cargó. Intenta en unos segundos.");
    return;
  }
  FB.login((response) => {
    if (response.authResponse) {
      adminState.fbToken = response.authResponse.accessToken;
      onLoginSuccess(response.authResponse);
    }
  }, { scope: "instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement" });
}
 
function onLoginSuccess(auth) {
  adminState.isLoggedIn = true;
  FB.api("/me", { fields: "name" }, (user) => {
    const badge = document.getElementById("adm-user-badge");
    if (badge) { badge.textContent = `· ${user.name}`; badge.classList.add("visible"); }
    const trigger = document.getElementById("admin-trigger");
    if (trigger) trigger.classList.add("logged-in");
  });
  document.getElementById("adm-login").style.display = "none";
  document.getElementById("adm-main").classList.add("visible");
  loadMetrics();
}
 
/* ══════════════════════════════════════════════════════════════
   5. MÉTRICAS
══════════════════════════════════════════════════════════════ */
 
async function loadMetrics() {
  const container = document.getElementById("metrics-container");
  if (!container) return;
  try {
    const res = await fetch(
      `${ADMIN_CONFIG.SUPABASE_URL}/functions/v1/instagram-proxy?user_id=${ADMIN_CONFIG.IG_USER_ID}&limit=6`,
      { headers: { "Authorization": `Bearer ${ADMIN_CONFIG.SUPABASE_ANON}`, "Content-Type": "application/json" } }
    );
    const data = await res.json();
    const posts = data.data || [];
    const totalLikes = posts.reduce((s, p) => s + (p.like_count || 0), 0);
    const avgLikes   = posts.length ? Math.round(totalLikes / posts.length) : 0;
    container.innerHTML = 
      <div class="metrics-grid">
        <div class="metric-cell"><div class="metric-n">${posts.length}</div><div class="metric-l">Posts recientes</div></div>
        <div class="metric-cell"><div class="metric-n">${fmtN(totalLikes)}</div><div class="metric-l">Likes totales</div></div>
        <div class="metric-cell"><div class="metric-n">${fmtN(avgLikes)}</div><div class="metric-l">Promedio / post</div></div>
      </div>
      <div class="recent-posts-title">// Publicaciones recientes</div>
      <div class="recent-posts-grid">
        ${posts.map(p => {
          const src = p.media_type === "VIDEO" ? p.thumbnail_url : p.media_url;
          return `<div class="recent-post-thumb"><img src="${src}" alt="" loading="lazy"></div>`;
        }).join("")}
      </div>
    ;
  } catch (err) {
    container.innerHTML = `<div class="metrics-loading" style="animation:none;color:rgba(255,100,100,.5);">No se pudieron cargar las métricas.</div>`;
  }
}
 
function fmtN(n) {
  if (!n) return "–";
  return n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n);
}
 
/* ══════════════════════════════════════════════════════════════
   6. EDITOR DE VIDEO
══════════════════════════════════════════════════════════════ */
 
function initVideoEditor() {
  const dropZone    = document.getElementById("video-drop-zone");
  const fileInput   = document.getElementById("video-file-input");
  const fileTrigger = document.getElementById("video-file-trigger");
  if (!dropZone) return;
 
  fileTrigger?.addEventListener("click", () => fileInput?.click());
  dropZone.addEventListener("dragover", (e) => { e.preventDefault(); dropZone.classList.add("drag-over"); });
  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault(); dropZone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) loadVideo(file);
  });
  fileInput?.addEventListener("change", (e) => { const f = e.target.files[0]; if (f) loadVideo(f); });
  document.getElementById("btn-add-sub")?.addEventListener("click", addSubtitle);
  initTrimBar();
}
 
function loadVideo(file) {
  if (adminState.videoURL) URL.revokeObjectURL(adminState.videoURL);
  adminState.video    = file;
  adminState.videoURL = URL.createObjectURL(file);
  const preview  = document.getElementById("admin-video-preview");
  const dropZone = document.getElementById("video-drop-zone");
  const layout   = document.getElementById("editor-layout");
  if (preview) {
    preview.src = adminState.videoURL;
    preview.onloadedmetadata = () => {
      adminState.trimStart = 0;
      adminState.trimEnd   = preview.duration;
      updateTrimUI();
      checkPublishReady();
    };
  }
  if (dropZone) dropZone.style.display = "none";
  if (layout)   layout.classList.add("visible");
}
 
function initTrimBar() {
  const bar = document.getElementById("trim-bar");
  if (!bar) return;
  let dragging = null;
  bar.addEventListener("mousedown", (e) => {
    const rect  = bar.getBoundingClientRect();
    const pct   = (e.clientX - rect.left) / rect.width;
    const video = document.getElementById("admin-video-preview");
    if (!video || !video.duration) return;
    const time      = pct * video.duration;
    const startPct  = adminState.trimStart / video.duration;
    const endPct    = adminState.trimEnd   / video.duration;
    if (Math.abs(pct - startPct) < 0.04)      dragging = "start";
    else if (Math.abs(pct - endPct) < 0.04)   dragging = "end";
    else { dragging = "playhead"; video.currentTime = time; }
  });
  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const b     = document.getElementById("trim-bar");
    const video = document.getElementById("admin-video-preview");
    if (!b || !video || !video.duration) return;
    const rect = b.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const time = pct * video.duration;
    if (dragging === "start") { adminState.trimStart = Math.min(time, adminState.trimEnd - 0.5); video.currentTime = adminState.trimStart; }
    else if (dragging === "end") { adminState.trimEnd = Math.max(time, adminState.trimStart + 0.5); video.currentTime = adminState.trimEnd; }
    else { video.currentTime = time; }
    updateTrimUI();
  });
  window.addEventListener("mouseup", () => { dragging = null; });
  const video = document.getElementById("admin-video-preview");
  video?.addEventListener("timeupdate", () => {
    if (!video.duration) return;
    const ph = document.getElementById("trim-playhead");
    if (ph) ph.style.left = ((video.currentTime / video.duration) * 100) + "%";
  });
}
 
function updateTrimUI() {
  const video = document.getElementById("admin-video-preview");
  if (!video || !video.duration) return;
  const startPct = (adminState.trimStart / video.duration) * 100;
  const widthPct = ((adminState.trimEnd - adminState.trimStart) / video.duration) * 100;
  const fill = document.getElementById("trim-fill");
  if (fill) { fill.style.left = startPct + "%"; fill.style.width = widthPct + "%"; }
  const fmt = (s) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
  const sl = document.getElementById("trim-start-label");
  const el = document.getElementById("trim-end-label");
  const dl = document.getElementById("trim-duration-label");
  if (sl) sl.textContent = `Inicio: ${fmt(adminState.trimStart)}`;
  if (el) el.textContent = `Fin: ${fmt(adminState.trimEnd)}`;
  if (dl) dl.textContent = `Duración: ${fmt(adminState.trimEnd - adminState.trimStart)}`;
}
 
function addSubtitle() {
  const video = document.getElementById("admin-video-preview");
  const t = video ? video.currentTime : 0;
  adminState.subtitles.push({ id: Date.now(), start: t, end: t + 3, text: "" });
  renderSubtitles();
}
 
function removeSubtitle(id) {
  adminState.subtitles = adminState.subtitles.filter(s => s.id !== id);
  renderSubtitles();
}
 
function renderSubtitles() {
  const list = document.getElementById("subs-list");
  if (!list) return;
  if (!adminState.subtitles.length) {
    list.innerHTML = `<div class="subs-empty">Sin subtítulos — haz clic en "+ Agregar"</div>`;
    return;
  }
  list.innerHTML = adminState.subtitles.map(sub => 
    <div class="sub-item" data-id="${sub.id}">
      <input class="sub-input" type="number" min="0" step="0.1" placeholder="Inicio" value="${sub.start.toFixed(1)}" onchange="updateSubtitle(${sub.id},'start',+this.value)">
      <input class="sub-input" type="number" min="0" step="0.1" placeholder="Fin" value="${sub.end.toFixed(1)}" onchange="updateSubtitle(${sub.id},'end',+this.value)">
      <input class="sub-input" type="text" placeholder="Texto..." value="${sub.text}" oninput="updateSubtitle(${sub.id},'text',this.value)">
      <button class="btn-del-sub" onclick="removeSubtitle(${sub.id})">✕</button>
    </div>
  ).join("");
}
 
window.updateSubtitle = (id, field, value) => {
  const sub = adminState.subtitles.find(s => s.id === id);
  if (sub) sub[field] = value;
};
 
window.removeSubtitle = removeSubtitle;
 
/* ══════════════════════════════════════════════════════════════
   7. PUBLICADOR — sube directo a Storage, luego llama Edge Fn
══════════════════════════════════════════════════════════════ */
 
function checkPublishReady() {
  const warning = document.getElementById("no-video-warning");
  const btn     = document.getElementById("btn-publish");
  if (!adminState.video) {
    if (warning) warning.style.display = "block";
    if (btn)     btn.disabled = true;
  } else {
    if (warning) warning.style.display = "none";
    if (btn)     btn.disabled = false;
  }
}
 
function setProgress(pct, label) {
  const bar      = document.getElementById("progress-bar");
  const labelEl  = document.getElementById("progress-label");
  const wrap     = document.getElementById("upload-progress");
  if (wrap)    wrap.classList.add("visible");
  if (bar)     bar.style.width = pct + "%";
  if (labelEl) labelEl.textContent = label;
}
 
function hideProgress() {
  const wrap = document.getElementById("upload-progress");
  if (wrap) wrap.classList.remove("visible");
}
 
async function handlePublish() {
  if (!adminState.video) return;
 
  const caption      = document.getElementById("publish-caption")?.value || "";
  const scheduleRaw  = document.getElementById("schedule-datetime")?.value;
  const scheduleTime = scheduleRaw ? new Date(scheduleRaw).toISOString() : null;
  const platforms    = adminState.platforms;
  const status       = document.getElementById("publish-status");
  const btn          = document.getElementById("btn-publish");
 
  if (status) { status.className = "publish-status loading"; status.textContent = "Preparando..."; }
  if (btn)    btn.disabled = true;
 
  try {
    // ── PASO 1: Subir video directo a Supabase Storage ──────
    const fileName = `videos/${Date.now()}-${adminState.video.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    setProgress(10, "Subiendo video a Storage...");
 
    const uploadRes = await fetch(
      `${ADMIN_CONFIG.SUPABASE_URL}/storage/v1/object/content/${fileName}`,
      {
        method:  "POST",
        headers: {
          "Authorization": `Bearer ${ADMIN_CONFIG.SUPABASE_ANON}`,
          "Content-Type":  adminState.video.type,
          "x-upsert":      "false",
        },
        body: adminState.video,
      }
    );
 
    if (!uploadRes.ok) {
      const errData = await uploadRes.json().catch(() => ({}));
      throw new Error(`Storage: ${errData.message || errData.error || uploadRes.status}`);
    }
 
    setProgress(60, "Video subido. Publicando en plataformas...");
 
    const videoPublicUrl = `${ADMIN_CONFIG.SUPABASE_URL}/storage/v1/object/public/content/${fileName}`;
 
    // ── PASO 2: Llamar Edge Function con la URL (sin el archivo) ──
    const res = await fetch(
      `${ADMIN_CONFIG.SUPABASE_URL}/functions/v1/publish-content`,
      {
        method:  "POST",
        headers: {
          "Authorization": `Bearer ${ADMIN_CONFIG.SUPABASE_ANON}`,
          "Content-Type":  "application/json",
        },
        body: JSON.stringify({
          video_url:   videoPublicUrl,
          caption:     caption,
          trim_start:  adminState.trimStart,
          trim_end:    adminState.trimEnd,
          subtitles:   adminState.subtitles,
          platforms:   platforms,
          schedule_at: scheduleTime,
        }),
      }
    );
 
    setProgress(90, "Procesando respuesta...");
 
    const result = await res.json();
    if (!res.ok || result.error) throw new Error(result.error || "Error al publicar");
 
    setProgress(100, "¡Listo!");
    setTimeout(hideProgress, 1500);
 
    const platformNames = [
      platforms.ig ? "Instagram" : null,
      platforms.tk ? "TikTok"   : null,
      platforms.yt ? "YouTube"  : null,
    ].filter(Boolean).join(", ");
 
    // Mostrar resultado por plataforma
    let detail = "";
    if (result.results) {
      const r = result.results;
      if (r.instagram) detail += r.instagram.success ? " ✓ Instagram" : ` ✕ IG: ${r.instagram.error}`;
      if (r.tiktok)    detail += r.tiktok.success    ? " ✓ TikTok"    : ` ✕ TK: ${r.tiktok.error}`;
      if (r.youtube)   detail += r.youtube.success   ? " ✓ YouTube"   : ` ✕ YT: ${r.youtube.error}`;
    }
 
    if (status) {
      status.className   = "publish-status success";
      status.textContent = scheduleTime
        ? `Programado para ${new Date(scheduleTime).toLocaleString("es-CO")} —${detail}`
        : `Publicado —${detail}`;
    }
 
  } catch (err) {
    console.error("[Admin] Error:", err);
    hideProgress();
    if (status) {
      status.className   = "publish-status error";
      status.textContent = `✕ ${err.message}`;
    }
  } finally {
    if (btn) btn.disabled = false;
  }
}
 
/* ══════════════════════════════════════════════════════════════
   8. EVENTOS
══════════════════════════════════════════════════════════════ */
 
function bindAdminEvents() {
  document.getElementById("admin-trigger")?.addEventListener("click", () => {
    document.getElementById("admin-overlay")?.classList.add("open");
  });
  document.getElementById("adm-close")?.addEventListener("click", () => {
    document.getElementById("admin-overlay")?.classList.remove("open");
  });
  document.getElementById("admin-overlay")?.addEventListener("click", (e) => {
    if (e.target.id === "admin-overlay") e.currentTarget.classList.remove("open");
  });
  document.getElementById("btn-fb-login")?.addEventListener("click", handleFBLogin);
 
  document.querySelectorAll(".adm-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".adm-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".adm-tab-content").forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(`tab-${tab.dataset.tab}`)?.classList.add("active");
      adminState.activeTab = tab.dataset.tab;
      if (tab.dataset.tab === "publish") checkPublishReady();
    });
  });
 
  document.querySelectorAll(".platform-toggle").forEach(toggle => {
    toggle.addEventListener("click", () => {
      const p = toggle.dataset.platform;
      adminState.platforms[p] = !adminState.platforms[p];
      toggle.classList.toggle("on", adminState.platforms[p]);
    });
  });
 
  document.getElementById("publish-caption")?.addEventListener("input", (e) => {
    const count = document.getElementById("caption-count");
    if (count) count.textContent = e.target.value.length;
  });
 
  document.getElementById("btn-publish")?.addEventListener("click", handlePublish);
}
 
/* ══════════════════════════════════════════════════════════════
   9. BOTÓN EN HEADER + INIT
══════════════════════════════════════════════════════════════ */
 
function addAdminButton() {
  const btnFollow = document.querySelector(".btn-new");
  if (!btnFollow) return;
  const adminBtn = document.createElement("button");
  adminBtn.id          = "admin-trigger";
  adminBtn.textContent = "⚙ Admin";
  btnFollow.parentNode.insertBefore(adminBtn, btnFollow.nextSibling);
}
 
function initAdminPanel() {
  injectAdminStyles();
  addAdminButton();
  renderAdminPanel();
  bindAdminEvents();
  initVideoEditor();
  initFacebookSDK();
  console.log("[Admin] ✓ Panel listo");
}
 
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAdminPanel);
} else {
  initAdminPanel();
}
 
javascript
function addAdminButton() {
  const btnFollow = document.querySelector(".btn-new");
  if (!btnFollow) return;
  const adminBtn = document.createElement("button");
  adminBtn.id          = "admin-trigger";
  adminBtn.textContent = "⚙ Admin";
  btnFollow.parentNode.insertBefore(adminBtn, btnFollow.nextSibling);
}

function initAdminPanel() {
  injectAdminStyles();
  addAdminButton();
  renderAdminPanel();
  bindAdminEvents();
  initVideoEditor();
  initFacebookSDK();
  console.log("[Admin] ✓ Panel listo");
}

// ══════════════════════════════════════════════════════════════
//   10. CONTROL DEL MODAL DEL BANNER
// ══════════════════════════════════════════════════════════════
function initBannerModal() {
  const bannerModal = document.getElementById('bannerModal');
  const closeBannerBtn = document.getElementById('closeBannerBtn');

  if (!bannerModal || !closeBannerBtn) {
    console.warn('[Banner] bannerModal o closeBannerBtn no existen en el DOM');
    return;
  }

  function closeBanner() { bannerModal.classList.add('hidden'); }
  function openBanner()  { bannerModal.classList.remove('hidden'); }

  closeBannerBtn.addEventListener('click', closeBanner);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBanner();
  });

  // Expuestos por si otro script necesita abrir/cerrar el banner manualmente
  window.closeBanner = closeBanner;
  window.openBanner  = openBanner;
}

// Genera la barra de segmentos dinámicamente según el progreso
function initSegBar() {
  const bar = document.getElementById('segBar');
  if (!bar) return;

  const total = 40;
  const progress = 12847 / 50000;
  const filled = Math.round(total * progress);

  for (let i = 0; i < total; i++) {
    const s = document.createElement('span');
    if (i < filled) s.className = 'on';
    bar.appendChild(s);
  }
}

function initAll() {
  initAdminPanel();
  initBannerModal();
  initSegBar();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll);
} else {
  initAll();
}
(function () {
    var translations = {
      es: {
        nav_home: "Inicio", nav_tech: "Tecnología", nav_coffee: "Café", nav_projects: "Proyectos", nav_b2b: "B2B", nav_blog: "Blog",
        meta_title: "AceroStudio — Diseño, Código y Café Filtrado",
        meta_description: "Estudio de diseño digital, desarrollo web y automatización con alma de café filtrado. Proyectamos marcas con estética técnica y funcional desde Bogotá.",
        hero_annot_tr: "Reto activo · #aceropress50k<br>抽出 / extracción<br>反転式 / inversión",
        hero_eyebrow: "Reto activo · Bogotá, 2.600 msnm",
        hero_h1: '50.000 tazas.<br><br><span class="hot">ONE BREW METHOD.</span>',
        hero_sub: "Publicamos el reto más largo en AeroPress. Documentado en Instagram, TikTok y YouTube.",
        hero_odo_label: "Tazas preparadas",
        hero_scroll_hint: "Explora",
        marquee: '<span class="mh">· Taza #012.847 </span><span>· Etiopía Yirgacheffe</span><span class="mc"> · 1:15 · 92°C </span><span>· Colombia Huila</span><span class="mh"> · 抽出 / extracción </span><span>· Brasil Cerrado</span><span class="mc"> · #aceropress50k </span><span>· Bourbon Rosado</span><span class="mh"> · 372 días restantes · </span><span>AeroPress Go™</span><span class="mc"> · Pink Bourbon · </span><span class="mh">· Taza #012.847 </span><span>· Etiopía Yirgacheffe</span><span class="mc"> · 1:15 · 92°C </span><span>· Colombia Huila</span><span class="mh"> · 抽出 / extracción </span><span>· Brasil Cerrado</span><span class="mc"> · #aceropress50k </span><span>· Bourbon Rosado</span><span class="mh"> · 372 días restantes · </span><span>AeroPress Go™</span><span class="mc"> · Pink Bourbon · </span>',
        tec_intro_eyebrow: "FIG. 03 — Tecnología · IA aplicada al café",
        tec_intro_title: 'Tu café,<br><span class="line2">reinventado.</span><span class="line3">con inteligencia.</span>',
        tec_intro_sub: "IA, datos y diseño al servicio de cada café de especialidad.<br>Del espacio físico a la presencia digital, del tueste al campo.",
        tec_stat1: "ticket promedio post-rediseño", tec_stat2: "diagnóstico → propuesta", tec_stat3: "alcance digital · 90 días", tec_stat4: "diseñado para Bogotá",
        tec_fig_tl: "FIG. 03.1 — REDISEÑO DE ESPACIO<br>Bogotá · 2.600 msnm · IA + Diseño",
        tec_fig_tr: "Flujo de clientes · Mapas de calor<br>Generación 3D · 72h diagnóstico",
        tec_c1_step: "01 · Espacio", tec_c1_title: 'Rediseña<br><span class="th-word">tu café</span>',
        tec_c1_body: "IA que analiza tu espacio, detecta zonas muertas y propone una nueva distribución. Del diagnóstico a la propuesta en 72 horas.",
        tec_c1_tag1: "Visión computacional", tec_c1_tag2: "Flujo de clientes", tec_c1_tag3: "Diseño 3D", tec_c1_tag4: "Mapas de calor",
        tec_c2_step: "02 · Identidad", tec_c2_title: 'Una carta<br><span class="th-word">que vende</span>',
        tec_c2_body: "Diseño de menú que comunica origen, proceso y notas de cata. Jerarquía visual que guía al cliente hacia los productos de mayor margen.",
        tec_c2_tag1: "Diseño editorial", tec_c2_tag2: "Trazabilidad QR", tec_c2_tag3: "Menú digital", tec_c2_tag4: "Presencia digital",
        tec_c3_step: "03 · Estándar", tec_c3_title: 'Bebidas<br><span class="th-word">perfectas</span>',
        tec_c3_body: "Cada bebida espresso documentada: dosis, ratio, tiempo, temperatura. El mismo estándar en cada turno, en cada barista, en cada taza.",
        tec_c3_tag1: "Protocolo espresso", tec_c3_tag2: "Recetas calibradas", tec_c3_tag3: "Manual de servicio",
        menu_header_logo: "· Cafetería de especialidad ·", menu_header_sub: "Bogotá · 2.600 msnm · temporada 2025",
        menu_section1: "Espresso base", menu_item1_name: "Espresso solo", menu_item1_desc: "30ml · 9 bar · 27 seg",
        menu_item2_desc: "Leche texturizada · 6oz", menu_item3_desc: "Doble ristretto · 160ml",
        menu_section2: "Filtrado", menu_item4_name: "V60 de temporada", menu_item5_desc: "20h inmersión · 16oz",
        std_header_title: "Estándar de bebidas", std_header_sub: "Base espresso · protocolo SCA · Bogotá 2.600 msnm",
        std_col1: "Bebida", std_col2: "Dosis", std_footer_text: "Tiempo extracción: 25–30 seg · presión: 9 bar",
        std_low: "bajo ←", std_high: "→ sobre",
        story_eyebrow: "FIG. 00 — CÓMO FUNCIONA",
        story_h1: "Tu cafetería,<br><em>reinventada</em><br>antes de mover un ladrillo.",
        story_lead: "acero.studio convierte una foto real de tu espacio en una propuesta de rediseño en minutos, y te conecta directo con un asesor para llevarla a obra.",
        story_scroll_desktop: "explora los pasos →", story_scroll_mobile: "desliza para ver cómo ↓",
        story_step1_fig: "FIG. 01 — CAPTURA", story_step1_title: "Sube una foto real",
        story_step1_body: "Desde la cámara o la galería. Interior o fachada, tal como está hoy — sin planos, sin medidas, sin renders previos.",
        story_step2_fig: "FIG. 02 — ESTILO", story_step2_title: "Elige un estilo",
        story_step2_body: "Minimalista, industrial, cálido, escandinavo, tropical — o describe el tuyo. Cada opción ajusta materiales, color y luz.",
        chip1: "Minimalista", chip2: "Industrial", chip3: "Cálido", chip4: "Escandinavo",
        story_step3_fig: "FIG. 03 — GENERACIÓN", story_step3_title: "La IA genera la propuesta",
        story_step3_body: "Mantenemos la estructura real del local — paredes, ventanas, columnas — y solo transformamos acabados, mobiliario y estilo.",
        story_step4_fig: "FIG. 04 — CONTACTO", story_step4_title: "Cotiza por WhatsApp",
        story_step4_body: "Con la propuesta lista, hablas directo con un asesor de acero.studio para llevarla a obra: materiales, tiempos y presupuesto.",
        story_wa_btn: "💬 Enviar a WhatsApp →",
        story_outro_desktop: "Pruébalo ahora en el panel de la derecha →", story_outro_mobile: "Pruébalo ahora ↓",
        chat_fig: "FIG. 05 — ASISTENTE", chat_state: "estado: bienvenida",
        si_lead: "Convierte una foto real de tu cafetería en una propuesta de rediseño en minutos.",
        si_step1_title: "Sube una foto", si_step1_body: "Cámara o galería, tal como está hoy.",
        si_step2_body: "Minimalista, industrial, cálido, escandinavo…",
        si_step3_body: "Misma estructura del local, nuevo estilo.",
        si_step4_body: "Habla directo con un asesor real.",
        si_cta: "↓ Usa los botones de abajo para empezar",
        btn_camera: "Tomar foto", btn_gallery: "Subir de galería", input_placeholder: "Escribe un mensaje…",
        composer_hint: "Enfocado en rediseño de interior y fachada de cafeterías",
        stat_designs: "DISEÑOS", stat_styles: "ESTILOS", stat_clients: "CLIENTES", stat_design: "DISEÑO",
        ig1_lbl: "Taza #012.846 · video corto", ig1_cap: "1:14 · tueste oscuro",
        ig2_lbl: "Taza #012.845 · Colombia Huila", ig2_cap: "Colombia Huila · clásico",
        ig3_lbl: "Taza #012.844 · nuevo saco Huila", ig3_cap: "Nuevo lote Huila · 5 días",
        ig4_lbl: "Reel — sesión 5 tazas · time-lapse", ig4_cap: "5 tazas · curvas de extracción",
        allies_title: "ALIADOS",
        ally_alt1: "Aliado 1", ally_alt2: "Aliado 2", ally_alt3: "Aliado 3", ally_alt4: "Aliado 4", ally_alt5: "Aliado 5",
        b2b_fig: "FIG. 05 — PROGRAMA COMERCIAL", b2b_sec_lbl: "// Para empresas y profesionales", b2b_h2: "ALIANZAS COMERCIALES",
        b2b_desc: "Programa comercial para restaurantes, hoteles, oficinas y baristas que necesitan trazabilidad completa y consistencia en cada entrega.",
        b2b_card1_title: "Restaurantes", b2b_card1_desc: "Variedades curadas para carta de café. Ficha técnica, capacitación y entregas semanales.",
        b2b_card2_title: "Hoteles", b2b_card2_desc: "Amenities con café de especialidad. Storytelling del productor para el huésped.",
        b2b_card3_title: "Oficinas", b2b_card3_desc: "Café de especialidad como beneficio corporativo. Entregas quincenales y variedad rotativa.",
        b2b_card4_title: "Baristas", b2b_card4_desc: "Acceso directo a lotes especiales. Especificaciones técnicas completas y precios de tostador.",
        blog_fig: "FIG. 06 — CONTENIDO TÉCNICO", blog_sec_lbl: "// Contenido técnico · jobs to be done", blog_h2: "Conocimiento",
        blog_desc: "Respuestas precisas a preguntas reales sobre café de especialidad colombiano.",
        blog1_tag: "Variedades", blog1_title: "¿Qué diferencia a la variedad Gesha del resto del café colombiano?", blog1_ex: "La Gesha tiene un perfil aromático único por su contenido de linalool. Puntajes SCA entre 88 y 93 puntos en altitudes sobre 1.700 msnm.",
        blog2_tag: "Procesos", blog2_title: "Lavado vs Natural vs Honey: cómo el proceso cambia el sabor del café", blog2_ex: "El proceso lavado elimina el 100% del mucílago antes del secado, produciendo acidez limpia. El natural retiene el fruto completo.",
        blog3_tag: "Preparación", blog3_title: "Cómo preparar correctamente un Pink Bourbon en V60", blog3_ex: "Relación 1:15, temperatura 94°C, molienda media. Bloom de 30ml por 30 segundos. Vertidos en 3 etapas. Tiempo total: 3 minutos 15 segundos.",
        blog4_tag: "Origen", blog4_title: "Por qué Nariño produce el Castillo con mayor acidez de Colombia", blog4_ex: "A 2.100 msnm y con temperaturas nocturnas de 10–12°C, el grano desarrolla mayor densidad celular y retiene más ácido málico y cítrico.",
        blog5_tag: "Evaluación", blog5_title: "Qué significa el puntaje SCA y cómo identificar un café de especialidad", blog5_ex: "La SCA define como especialidad cualquier lote que supere 80 puntos. A partir de 85 se considera excepcional; sobre 90, sobresaliente.",
        blog6_tag: "Trazabilidad", blog6_title: "Cómo leer la ficha técnica de un café de origen único", blog6_ex: "Variedad botánica, municipio, altitud, proceso, temperatura de tueste, puntaje SCA y nombre del productor. Si falta alguno, no es trazabilidad real.",
        foot1_fig: "FIG. 07.1 — IDENTIDAD", foot1_body: "Startup de IA aplicada al DISEÑO.  Finish: Brushed Chrome. Tolerancias: ±0.5mm.",
        foot2_fig: "FIG. 07.2 — ECOSISTEMA", foot2_h4: "Proyectos activos", foot2_line1: "Red hidropónica", foot2_line2: "Diario 50k tazas",
        foot3_body: "Packaging specs — layered storage & logistics data. Brand identification sistema activo.",
        footer_meta: "ACEROSTUDIO © 2026 — Todos los derechos reservados",
        wa_aria: "Escríbenos por WhatsApp"
      },
      en: {
        nav_home: "Home", nav_tech: "Technology", nav_coffee: "Coffee", nav_projects: "Projects", nav_b2b: "B2B", nav_blog: "Blog",
        meta_title: "AceroStudio — Design, Code & Filter Coffee",
        meta_description: "A digital design, web development and automation studio with the soul of filter coffee. We build brands with technical, functional aesthetics from Bogotá.",
        hero_annot_tr: "Active challenge · #aceropress50k<br>抽出 / extraction<br>反転式 / inversion",
        hero_eyebrow: "Active challenge · Bogotá, 2,600 masl",
        hero_h1: '50,000 cups.<br><br><span class="hot">ONE BREW METHOD.</span>',
        hero_sub: "We're documenting the longest AeroPress challenge ever — on Instagram, TikTok and YouTube.",
        hero_odo_label: "Cups brewed",
        hero_scroll_hint: "Explore",
        marquee: '<span class="mh">· Cup #012.847 </span><span>· Ethiopia Yirgacheffe</span><span class="mc"> · 1:15 · 92°C </span><span>· Colombia Huila</span><span class="mh"> · 抽出 / extraction </span><span>· Brazil Cerrado</span><span class="mc"> · #aceropress50k </span><span>· Pink Bourbon</span><span class="mh"> · 372 days left · </span><span>AeroPress Go™</span><span class="mc"> · Pink Bourbon · </span><span class="mh">· Cup #012.847 </span><span>· Ethiopia Yirgacheffe</span><span class="mc"> · 1:15 · 92°C </span><span>· Colombia Huila</span><span class="mh"> · 抽出 / extraction </span><span>· Brazil Cerrado</span><span class="mc"> · #aceropress50k </span><span>· Pink Bourbon</span><span class="mh"> · 372 days left · </span><span>AeroPress Go™</span><span class="mc"> · Pink Bourbon · </span>',
        tec_intro_eyebrow: "FIG. 03 — Technology · AI applied to coffee",
        tec_intro_title: 'Your café,<br><span class="line2">reinvented.</span><span class="line3">with intelligence.</span>',
        tec_intro_sub: "AI, data and design in service of every specialty coffee shop.<br>From physical space to digital presence, from the roast to the farm.",
        tec_stat1: "average ticket post-redesign", tec_stat2: "diagnosis → proposal", tec_stat3: "digital reach · 90 days", tec_stat4: "designed for Bogotá",
        tec_fig_tl: "FIG. 03.1 — SPACE REDESIGN<br>Bogotá · 2,600 masl · AI + Design",
        tec_fig_tr: "Customer flow · Heat maps<br>3D generation · 72h diagnosis",
        tec_c1_step: "01 · Space", tec_c1_title: 'Redesign<br><span class="th-word">your café</span>',
        tec_c1_body: "AI that analyzes your space, spots dead zones, and proposes a new layout. From diagnosis to proposal in 72 hours.",
        tec_c1_tag1: "Computer vision", tec_c1_tag2: "Customer flow", tec_c1_tag3: "3D design", tec_c1_tag4: "Heat maps",
        tec_c2_step: "02 · Identity", tec_c2_title: 'A menu<br><span class="th-word">that sells</span>',
        tec_c2_body: "Menu design that communicates origin, process and tasting notes. Visual hierarchy that guides customers toward higher-margin products.",
        tec_c2_tag1: "Editorial design", tec_c2_tag2: "QR traceability", tec_c2_tag3: "Digital menu", tec_c2_tag4: "Digital presence",
        tec_c3_step: "03 · Standard", tec_c3_title: 'Perfect<br><span class="th-word">drinks</span>',
        tec_c3_body: "Every espresso drink documented: dose, ratio, time, temperature. The same standard on every shift, every barista, every cup.",
        tec_c3_tag1: "Espresso protocol", tec_c3_tag2: "Calibrated recipes", tec_c3_tag3: "Service manual",
        menu_header_logo: "· Specialty coffee shop ·", menu_header_sub: "Bogotá · 2,600 masl · 2025 season",
        menu_section1: "Espresso basics", menu_item1_name: "Espresso", menu_item1_desc: "30ml · 9 bar · 27 sec",
        menu_item2_desc: "Textured milk · 6oz", menu_item3_desc: "Double ristretto · 160ml",
        menu_section2: "Filter", menu_item4_name: "Seasonal V60", menu_item5_desc: "20h immersion · 16oz",
        std_header_title: "Drink standards", std_header_sub: "Espresso base · SCA protocol · Bogotá 2,600 masl",
        std_col1: "Drink", std_col2: "Dose", std_footer_text: "Extraction time: 25–30 sec · pressure: 9 bar",
        std_low: "under ←", std_high: "→ over",
        story_eyebrow: "FIG. 00 — HOW IT WORKS",
        story_h1: "Your coffee shop,<br><em>reinvented</em><br>before moving a single brick.",
        story_lead: "acero.studio turns a real photo of your space into a redesign proposal in minutes, and connects you directly with an advisor to bring it to life.",
        story_scroll_desktop: "explore the steps →", story_scroll_mobile: "swipe to see how ↓",
        story_step1_fig: "FIG. 01 — CAPTURE", story_step1_title: "Upload a real photo",
        story_step1_body: "From camera or gallery. Interior or façade, exactly as it is today — no blueprints, no measurements, no prior renders.",
        story_step2_fig: "FIG. 02 — STYLE", story_step2_title: "Choose a style",
        story_step2_body: "Minimalist, industrial, warm, Scandinavian, tropical — or describe your own. Each option adjusts materials, color and light.",
        chip1: "Minimalist", chip2: "Industrial", chip3: "Warm", chip4: "Scandinavian",
        story_step3_fig: "FIG. 03 — GENERATION", story_step3_title: "The AI generates the proposal",
        story_step3_body: "We keep the real structure of your space — walls, windows, columns — and only transform finishes, furniture and style.",
        story_step4_fig: "FIG. 04 — CONTACT", story_step4_title: "Get a quote on WhatsApp",
        story_step4_body: "Once the proposal is ready, you talk directly with an acero.studio advisor to bring it to life: materials, timeline and budget.",
        story_wa_btn: "💬 Send on WhatsApp →",
        story_outro_desktop: "Try it now in the panel on the right →", story_outro_mobile: "Try it now ↓",
        chat_fig: "FIG. 05 — ASSISTANT", chat_state: "status: welcome",
        si_lead: "Turn a real photo of your coffee shop into a redesign proposal in minutes.",
        si_step1_title: "Upload a photo", si_step1_body: "Camera or gallery, just as it is today.",
        si_step2_body: "Minimalist, industrial, warm, Scandinavian…",
        si_step3_body: "Same structure, new style.",
        si_step4_body: "Talk directly with a real advisor.",
        si_cta: "↓ Use the buttons below to get started",
        btn_camera: "Take photo", btn_gallery: "Upload from gallery", input_placeholder: "Type a message…",
        composer_hint: "Focused on interior and façade redesign for coffee shops",
        stat_designs: "DESIGNS", stat_styles: "STYLES", stat_clients: "CLIENTS", stat_design: "DESIGN",
        ig1_lbl: "Cup #012.846 · short video", ig1_cap: "1:14 · dark roast",
        ig2_lbl: "Cup #012.845 · Colombia Huila", ig2_cap: "Colombia Huila · classic",
        ig3_lbl: "Cup #012.844 · new Huila bag", ig3_cap: "New Huila lot · 5 days",
        ig4_lbl: "Reel — 5-cup session · time-lapse", ig4_cap: "5 cups · extraction curves",
        allies_title: "PARTNERS",
        ally_alt1: "Partner 1", ally_alt2: "Partner 2", ally_alt3: "Partner 3", ally_alt4: "Partner 4", ally_alt5: "Partner 5",
        b2b_fig: "FIG. 05 — COMMERCIAL PROGRAM", b2b_sec_lbl: "// For businesses and professionals", b2b_h2: "COMMERCIAL PARTNERSHIPS",
        b2b_desc: "Commercial program for restaurants, hotels, offices and baristas who need full traceability and consistency in every delivery.",
        b2b_card1_title: "Restaurants", b2b_card1_desc: "Curated varieties for your coffee menu. Technical sheet, training and weekly deliveries.",
        b2b_card2_title: "Hotels", b2b_card2_desc: "Specialty-coffee amenities. Producer storytelling for your guests.",
        b2b_card3_title: "Offices", b2b_card3_desc: "Specialty coffee as a corporate perk. Biweekly deliveries and rotating variety.",
        b2b_card4_title: "Baristas", b2b_card4_desc: "Direct access to special lots. Full technical specs and roaster pricing.",
        blog_fig: "FIG. 06 — TECHNICAL CONTENT", blog_sec_lbl: "// Technical content · jobs to be done", blog_h2: "Knowledge",
        blog_desc: "Precise answers to real questions about Colombian specialty coffee.",
        blog1_tag: "Varieties", blog1_title: "What sets the Gesha variety apart from the rest of Colombian coffee?", blog1_ex: "Gesha has a unique aromatic profile due to its linalool content. SCA scores between 88 and 93 points at altitudes above 1,700 masl.",
        blog2_tag: "Processes", blog2_title: "Washed vs Natural vs Honey: how processing changes coffee flavor", blog2_ex: "The washed process removes 100% of the mucilage before drying, producing clean acidity. Natural process keeps the whole fruit intact.",
        blog3_tag: "Brewing", blog3_title: "How to properly brew a Pink Bourbon in a V60", blog3_ex: "Ratio 1:15, temperature 94°C, medium grind. 30ml bloom for 30 seconds. Three pour stages. Total time: 3 minutes 15 seconds.",
        blog4_tag: "Origin", blog4_title: "Why Nariño produces Colombia's highest-acidity Castillo", blog4_ex: "At 2,100 masl and with nighttime temperatures of 10–12°C, the bean develops greater cell density and retains more malic and citric acid.",
        blog5_tag: "Cupping", blog5_title: "What the SCA score means and how to spot a specialty coffee", blog5_ex: "SCA defines any lot scoring above 80 points as specialty. From 85 it's considered exceptional; above 90, outstanding.",
        blog6_tag: "Traceability", blog6_title: "How to read a single-origin coffee's technical sheet", blog6_ex: "Botanical variety, municipality, altitude, process, roast temperature, SCA score and producer's name. If any is missing, it isn't real traceability.",
        foot1_fig: "FIG. 07.1 — IDENTITY", foot1_body: "AI startup applied to DESING.  Finish: Brushed Chrome. Tolerances: ±0.5mm.",
        foot2_fig: "FIG. 07.2 — ECOSYSTEM", foot2_h4: "Active projects", foot2_line1: "Hydroponic network", foot2_line2: "50k Cups diary",
        foot3_body: "Packaging specs — layered storage & logistics data. Brand identification system active.",
        footer_meta: "ACEROSTUDIO © 2026 — All rights reserved",
        wa_aria: "Message us on WhatsApp"
      }
    };

    function detectLang() {
      try {
        var saved = localStorage.getItem('acero_lang');
        if (saved === 'es' || saved === 'en') return saved;
      } catch (e) {}
      var nav = (navigator.language || navigator.userLanguage || 'es').toLowerCase();
      return nav.indexOf('es') === 0 ? 'es' : 'en';
    }

    function applyLang(lang) {
      var dict = translations[lang] || translations.es;
      document.documentElement.setAttribute('lang', lang);

      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) el.textContent = dict[key];
      });
      document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-html');
        if (dict[key] !== undefined) el.innerHTML = dict[key];
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-placeholder');
        if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
      });
      document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-title');
        if (dict[key] !== undefined) el.setAttribute('title', dict[key]);
      });
      document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-aria');
        if (dict[key] !== undefined) el.setAttribute('aria-label', dict[key]);
      });
      document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-alt');
        if (dict[key] !== undefined) el.setAttribute('alt', dict[key]);
      });

      if (dict.meta_title) document.title = dict.meta_title;
      var metaDesc = document.getElementById('metaDescription');
      if (metaDesc && dict.meta_description) metaDesc.setAttribute('content', dict.meta_description);

      document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });

      try { localStorage.setItem('acero_lang', lang); } catch (e) {}
    }

    window.setAceroLang = applyLang; // exposed in case other scripts need to trigger it

    document.addEventListener('DOMContentLoaded', function () {
      applyLang(detectLang());
      document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          applyLang(btn.getAttribute('data-lang'));
        });
      });
    });
  })();

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
  igToken:     null,
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
    #admin-trigger {
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

function renderAdminPanel() {
  const overlay = document.createElement("div");
  overlay.id = "admin-overlay";
  overlay.innerHTML = 
    <div id="admin-panel">
      <div class="adm-header">
        <div class="adm-header-left">
          <span class="adm-logo">Acero.press · Admin</span>
          <span class="adm-user-badge" id="adm-user-badge">—</span>
        </div>
        <button class="adm-close" id="adm-close">✕</button>
      </div>

      <div id="adm-login">
        <div class="adm-login-icon">🔐</div>
        <div class="adm-login-title">Acceso administrativo</div>
        <p class="adm-login-sub">Ingresa con tu cuenta de Facebook para acceder a métricas, editor y publicación multiplataforma.</p>
        <button class="btn-fb-login" id="btn-fb-login">
          <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Continuar con Facebook
        </button>
      </div>

      <div id="adm-main">
        <div class="adm-tabs">
          <button class="adm-tab active" data-tab="metrics">📊 Métricas</button>
          <button class="adm-tab" data-tab="editor">🎬 Editor</button>
          <button class="adm-tab" data-tab="publish">🚀 Publicar</button>
        </div>

        <div class="adm-tab-content active" id="tab-metrics">
          <div id="metrics-container">
            <div class="metrics-loading">Cargando métricas de Instagram...</div>
          </div>
        </div>

        <div class="adm-tab-content" id="tab-editor">
          <div class="video-drop-zone" id="video-drop-zone">
            <div class="drop-icon">🎬</div>
            <p>Arrastra tu video aquí<br>o <span id="video-file-trigger">selecciona un archivo</span></p>
            <p style="margin-top:.5rem;font-size:.65rem;opacity:.5;">MP4, MOV · máx 500MB</p>
          </div>
          <input type="file" id="video-file-input" accept="video/*">

          <div class="editor-layout" id="editor-layout">
            <div class="video-preview-wrap">
              <video id="admin-video-preview" controls></video>
            </div>
            <div class="trim-section">
              <div class="trim-label">// Recorte de clip</div>
              <div class="trim-bar-wrap" id="trim-bar">
                <div class="trim-bar-fill" id="trim-fill" style="left:0%;width:100%"></div>
                <div class="trim-playhead" id="trim-playhead" style="left:0%"></div>
              </div>
              <div class="trim-times">
                <span id="trim-start-label">Inicio: 0:00</span>
                <span id="trim-end-label">Fin: 0:00</span>
                <span id="trim-duration-label">Duración: 0:00</span>
              </div>
            </div>
            <div class="subs-section">
              <div class="subs-header">
                <span class="subs-title">// Subtítulos</span>
                <button class="btn-add-sub" id="btn-add-sub">+ Agregar</button>
              </div>
              <div id="subs-list"><div class="subs-empty">Sin subtítulos — haz clic en "+ Agregar"</div></div>
            </div>
          </div>
        </div>

        <div class="adm-tab-content" id="tab-publish">
          <div class="publish-section">
            <div>
              <div class="recent-posts-title">Publicar en</div>
              <div class="publish-platforms">
                <div class="platform-toggle ig on" data-platform="ig"><div class="pt-icon">📸</div><div class="pt-name">Instagram</div></div>
                <div class="platform-toggle tk on" data-platform="tk"><div class="pt-icon">🎵</div><div class="pt-name">TikTok</div></div>
                <div class="platform-toggle yt on" data-platform="yt"><div class="pt-icon">▶️</div><div class="pt-name">YouTube</div></div>
              </div>
            </div>
            <div class="publish-caption-wrap">
              <div class="publish-caption-label">// Caption / descripción</div>
              <textarea id="publish-caption" placeholder="Taza #012.848 · Etiopía Yirgacheffe · 92°C · inversión&#10;#aceropress50k #aeropress #cafedeespecialidad"></textarea>
              <div class="caption-count"><span id="caption-count">0</span> / 2.200</div>
            </div>
            <div class="publish-schedule">
              <span class="schedule-label">Publicar</span>
              <input type="datetime-local" id="schedule-datetime">
              <button class="btn-adm-primary" id="btn-publish">Publicar ahora</button>
            </div>
            <div id="no-video-warning" class="no-video-warning" style="display:none;">
              ⚠ No hay video seleccionado — ve al tab Editor para cargar uno
            </div>
            <div class="upload-progress" id="upload-progress">
              <div class="progress-label" id="progress-label">Subiendo video...</div>
              <div class="progress-bar-wrap"><div class="progress-bar-fill" id="progress-bar"></div></div>
            </div>
            <div class="publish-status" id="publish-status"></div>
          </div>
        </div>
      </div>
    </div>
  ;
  document.body.appendChild(overlay);
}

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
    container.innerHTML = `
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
    `;
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
  list.innerHTML = adminState.subtitles.map(sub => `
    <div class="sub-item" data-id="${sub.id}">
      <input class="sub-input" type="number" min="0" step="0.1" placeholder="Inicio" value="${sub.start.toFixed(1)}" onchange="updateSubtitle(${sub.id},'start',+this.value)">
      <input class="sub-input" type="number" min="0" step="0.1" placeholder="Fin" value="${sub.end.toFixed(1)}" onchange="updateSubtitle(${sub.id},'end',+this.value)">
      <input class="sub-input" type="text" placeholder="Texto..." value="${sub.text}" oninput="updateSubtitle(${sub.id},'text',this.value)">
      <button class="btn-del-sub" onclick="removeSubtitle(${sub.id})">✕</button>
    </div>
  `).join("");
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


  initAdminPanel();
}

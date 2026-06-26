/* ══════════════════════════════════════════════════════════════
   1. FETCH
══════════════════════════════════════════════════════════════ */

const API = {
  URL: "https://tylylfrabjkaiukuilem.supabase.co/functions/v1/instagram-proxy",
  LIMIT: 9
};

async function fetchIGPosts() {

    const response = await fetch(
        `${API.URL}?limit=${API.LIMIT}`,
        {
            method: "GET",
            headers:{
                "Accept":"application/json"
            }
        }
    );

    if(!response.ok){
        throw new Error(`HTTP ${response.status}`);
    }

    const json = await response.json();

    return json.data || [];
}

/* ══════════════════════════════════════════════════════════════
   2. HELPERS
══════════════════════════════════════════════════════════════ */

function shortCaption(caption, max = 80) {
  if (!caption) return "";
  const clean = caption.replace(/#\S+/g, "").trim();       // quita hashtags
  return clean.length > max ? clean.slice(0, max) + "…" : clean;
}

function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60)  return `Hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `Hace ${h}h`;
  const d = Math.floor(h / 24);
  return `Hace ${d} día${d > 1 ? "s" : ""}`;
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit", month: "short", year: "numeric"
  });
}

function fmtNum(n) {
  if (!n) return "–";
  return n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n);
}

// Extrae número de taza del caption si aparece "#012.847" o "taza 12847" etc.
function extractCupNum(caption) {
  if (!caption) return null;
  const m = caption.match(/#(\d{1,3}[.,]\d{3})/);
  if (m) return "#" + m[1];
  const m2 = caption.match(/taza\s*#?(\d{4,6})/i);
  if (m2) return "#" + m2[1].padStart(6, "0").replace(/(\d{3})(\d{3})/, "$1.$2");
  return null;
}

/* ══════════════════════════════════════════════════════════════
   3. RENDER — POST DESTACADO (#feed)
══════════════════════════════════════════════════════════════ */

function renderFeaturedPost(post) {
  const isVideo  = post.media_type === "VIDEO";
  const mediaSrc = isVideo ? post.thumbnail_url : post.media_url;
  const cup      = extractCupNum(post.caption);
  const cap      = shortCaption(post.caption, 180);
  const when     = relativeTime(post.timestamp);

  // ── Media del post destacado ──
  const fpMedia = document.querySelector(".fp-media");
  if (fpMedia) {
    // Limpia placeholder
    fpMedia.innerHTML = `
      <img src="${mediaSrc}" alt="Post destacado" style="width:100%;height:100%;object-fit:cover;display:block;">
      <div class="fp-platform-badge badge-ig">📸 Instagram · @aceropress50k</div>
      ${cup ? `<div class="fp-cup-num">${cup}</div>` : ""}
    `;
  }

  // ── Cuerpo del post destacado ──
  const fpBody = document.querySelector(".fp-body");
  if (fpBody) {
    const likeEl  = fpBody.querySelector(".fp-stat:nth-child(1) .n");
    const captEl  = fpBody.querySelector(".fp-caption");
    const platEl  = fpBody.querySelector(".fp-platform");
    const titleEl = fpBody.querySelector(".fp-title");

    if (platEl)  platEl.textContent = `Última publicación · ${when}`;
    if (likeEl)  likeEl.textContent  = fmtNum(post.like_count);
    if (captEl)  captEl.innerHTML    = cap.replace(/\n/g, "<br>");
    if (titleEl && cup) titleEl.innerHTML = `${cup}<br><span style="opacity:.5;font-size:.85em;">${fmtDate(post.timestamp)}</span>`;

    // Agrega link real al botón de Instagram
    const btnIg = fpBody.querySelector(".btn-ig");
    if (btnIg) btnIg.href = post.permalink;
  }
}

/* ══════════════════════════════════════════════════════════════
   4. RENDER — GRID INSTAGRAM (#instagram)
══════════════════════════════════════════════════════════════ */

function renderIGGrid(posts) {
  const grid = document.querySelector("#instagram .ig-grid");
  if (!grid) return;

  grid.innerHTML = "";  // limpia los placeholders

  posts.forEach((post, idx) => {
    const isVideo    = post.media_type === "VIDEO";
    const isCarousel = post.media_type === "CAROUSEL_ALBUM";
    const mediaSrc   = isVideo ? post.thumbnail_url : post.media_url;
    const cup        = extractCupNum(post.caption);
    const cap        = shortCaption(post.caption, 60);
    const typeBadge  = isVideo ? "▶" : isCarousel ? "⊞" : "";

    const div = document.createElement("div");
    div.className = "ig-post" + (idx === 0 ? " large" : "");

    div.innerHTML = `
      <div class="ig-media">
        <img src="${mediaSrc}"
             alt="${cap || "Post de Instagram"}"
             loading="${idx < 3 ? "eager" : "lazy"}"
             style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s ease;">
      </div>
      ${typeBadge ? `<div class="ig-type-badge" style="
        position:absolute;top:.6rem;right:.6rem;z-index:3;
        font-size:.75rem;color:#fff;background:rgba(0,0,0,.55);
        padding:.2rem .4rem;border-radius:2px;
        font-family:'JetBrains Mono',monospace;">${typeBadge}</div>` : ""}
      <div class="ig-post-overlay"></div>
      <div class="ig-post-info">
        ${cup ? `<div class="ig-post-num">${cup}</div>` : ""}
        <div class="ig-post-cap">${cap}</div>
      </div>
    `;

    // Click → abre el post en Instagram
    div.style.cursor = "pointer";
    div.addEventListener("click", () => window.open(post.permalink, "_blank", "noopener"));

    grid.appendChild(div);
  });
}

/* ══════════════════════════════════════════════════════════════
   5. RENDER — HERO INSTAGRAM (#instagram .ig-hero)
══════════════════════════════════════════════════════════════ */

function renderIGHero(post) {
  const heroMedia = document.querySelector("#instagram .ig-hero .fs-media");
  if (!heroMedia) return;

  const isVideo  = post.media_type === "VIDEO";
  const mediaSrc = isVideo ? post.thumbnail_url : post.media_url;

  heroMedia.innerHTML = `<img src="${mediaSrc}" alt="Hero Instagram" style="width:100%;height:100%;object-fit:cover;">`;

  // Actualiza el subtítulo del hero
  const heroP = document.querySelector("#instagram .ig-hero-content p");
  if (heroP) {
    const cup = extractCupNum(post.caption);
    const cap = shortCaption(post.caption, 120);
    heroP.innerHTML = cup
      ? `<strong style="color:var(--hot)">${cup}</strong> — ${cap}`
      : cap;
  }
}

/* ══════════════════════════════════════════════════════════════
   6. ACTUALIZAR STATS BAR con datos reales
══════════════════════════════════════════════════════════════ */

function updateStatsBar(posts) {
  // Total likes de los posts traídos (aprox)
  const totalLikes = posts.reduce((s, p) => s + (p.like_count || 0), 0);
  const cells = document.querySelectorAll(".stat-cell .stat-v");

  // La primera celda ya tiene el contador de tazas hardcoded — la dejamos
  // La cuarta celda (likes aprox) la actualizamos si existe
  if (cells.length >= 4 && totalLikes > 0) {
    // No sobreescribimos días ni contador — solo mostramos likes en consola
    console.log(`[Acero.press] Likes totales (últimos ${posts.length} posts): ${totalLikes}`);
  }
}

/* ══════════════════════════════════════════════════════════════
   7. LOADING STATES
══════════════════════════════════════════════════════════════ */

function showIGLoading() {
  const grid = document.querySelector("#instagram .ig-grid");
  if (!grid) return;

  grid.innerHTML = Array(6).fill(0).map(() => `
    <div class="ig-post" style="
      background:rgba(255,255,255,.04);
      animation:igSkeleton 1.4s ease-in-out infinite;">
      <div class="ig-media" style="aspect-ratio:1/1;"></div>
    </div>
  `).join("");

  // Inyecta keyframe si no existe
  if (!document.getElementById("ig-skeleton-style")) {
    const st = document.createElement("style");
    st.id = "ig-skeleton-style";
    st.textContent = `
      @keyframes igSkeleton {
        0%,100% { opacity: 1; }
        50%      { opacity: .35; }
      }
      .ig-type-badge {
        position: absolute;
        top: .6rem; right: .6rem; z-index: 3;
        font-size: .75rem; color: #fff;
        background: rgba(0,0,0,.55);
        padding: .2rem .4rem; border-radius: 2px;
        font-family: 'JetBrains Mono', monospace;
      }
    `;
    document.head.appendChild(st);
  }
}

function showIGError() {
  const grid = document.querySelector("#instagram .ig-grid");
  if (!grid) return;

  grid.innerHTML = `
    <div style="
      grid-column: 1 / -1;
      display: flex; flex-direction: column; align-items: center;
      gap: 1rem; padding: 4rem 2rem; text-align: center;
      border: 1px dashed rgba(255,255,255,.1);">
      <span style="font-size:2rem">⚠</span>
      <p style="font-family:'JetBrains Mono',monospace;font-size:.8rem;color:rgba(255,255,255,.4);">
        No se pudo cargar el feed de Instagram.<br>
        Verifica el ACCESS_TOKEN en social-feed.js
      </p>
      <a href="https://instagram.com/aceropress50k"
         target="_blank" rel="noopener"
         class="btn-platform btn-ig"
         style="font-size:.7rem;padding:.7rem 1.4rem;">
        Ver en Instagram →
      </a>
    </div>
  `;
}

/* ══════════════════════════════════════════════════════════════
   8. MARQUEE — actualiza con datos del post más reciente
══════════════════════════════════════════════════════════════ */

function updateMarquee(post) {
  const track = document.querySelector(".mq-track");
  if (!track || !post) return;

  const cup  = extractCupNum(post.caption) || "–";
  const when = relativeTime(post.timestamp);
  const cap  = shortCaption(post.caption, 60);

  // Inserta al inicio del marquee un indicador del post más reciente
  const live = document.createElement("span");
  live.className = "mc";
  live.innerHTML = `· ${cup} · ${when} · `;
  track.insertBefore(live, track.firstChild);
}

/* ══════════════════════════════════════════════════════════════
   9. INIT
══════════════════════════════════════════════════════════════ */

async function initSocialFeed() {
  // Mostrar skeletons mientras carga
  showIGLoading();

  try {
    const posts = await fetchIGPosts();
    if (!posts.length) throw new Error("No posts");

    // Post más reciente → sección #feed destacada
    renderFeaturedPost(posts[0]);

    // Hero de la sección Instagram
    renderIGHero(posts[0]);

    // Grid completo de Instagram
    renderIGGrid(posts);

    // Stats
    updateStatsBar(posts);

    // Marquee con último post
    updateMarquee(posts[0]);

    console.log(`[Acero.press] ✓ ${posts.length} posts cargados desde Instagram`);

  } catch (err) {
    console.error("[Acero.press] Error cargando feed:", err);
    showIGError();
  }
}

// Arrancar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSocialFeed);
} else {
  initSocialFeed();
}

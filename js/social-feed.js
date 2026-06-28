/* ══════════════════════════════════════════════════════════════
   CONFIG
══════════════════════════════════════════════════════════════ */

const API = {
  URL:   "https://tylylfrabjkaiukuilem.supabase.co/functions/v1/instagram-proxy",
  WA:    "https://tylylfrabjkaiukuilem.supabase.co/functions/v1/whatsapp-link",
  ANON:  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bHlsZnJhYmprYWl1a3VpbGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODAwNDAsImV4cCI6MjA5ODA1NjA0MH0.Bqe1f2QBUBMiLmLCfAeownFsHLpSpxg6qaAkgvTB3uE", // ← reemplaza con tu anon key
  LIMIT: 9
};

/* ══════════════════════════════════════════════════════════════
   1. FETCH — INSTAGRAM
══════════════════════════════════════════════════════════════ */

async function fetchIGPosts() {
  const response = await fetch(
    `${API.URL}?limit=${API.LIMIT}`,
    { method: "GET", headers: { "Accept": "application/json" } }
  );
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const json = await response.json();
  return json.data || [];
}

/* ══════════════════════════════════════════════════════════════
   2. HELPERS
══════════════════════════════════════════════════════════════ */

function shortCaption(caption, max = 80) {
  if (!caption) return "";
  const clean = caption.replace(/#\S+/g, "").trim();
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

function extractCupNum(caption) {
  if (!caption) return null;
  const m = caption.match(/#(\d{1,3}[.,]\d{3})/);
  if (m) return "#" + m[1];
  const m2 = caption.match(/taza\s*#?(\d{4,6})/i);
  if (m2) return "#" + m2[1].padStart(6, "0").replace(/(\d{3})(\d{3})/, "$1.$2");
  return null;
}

/* ══════════════════════════════════════════════════════════════
   3. WHATSAPP — via Supabase Edge Function
══════════════════════════════════════════════════════════════ */

async function openWhatsApp(msgKey = "wa_msg_default") {
  try {
    const res = await fetch(
      `${API.WA}?msg=${msgKey}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${API.ANON}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) throw new Error(`WA proxy error ${res.status}`);

    const data = await res.json();
    if (data.error) throw new Error(data.error);
    if (data.url)   window.open(data.url, "_blank", "noopener");

  } catch (err) {
    console.error("[Acero.press] WhatsApp error:", err);
    // Fallback silencioso — abre WhatsApp sin mensaje
    window.open("https://wa.me/573152125327", "_blank", "noopener");
  }
}

function initWhatsApp() {
  // ── Botón flotante ──
  const waBtn = document.getElementById("wa-float-btn");
  if (waBtn) {
    waBtn.removeAttribute("href");
    waBtn.style.cursor = "pointer";
    waBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openWhatsApp("wa_msg_default");
    });
  }

  // ── Botones con data-wa-msg (Pedir / Diagnóstico) ──
  document.querySelectorAll("[data-wa-msg]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openWhatsApp(btn.dataset.waMsg);
    });
  });

  // ── Feedback visual: spinner mientras abre ──
  document.querySelectorAll("[data-wa-msg], #wa-float-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const original    = btn.innerHTML;
      const isFloat     = btn.id === "wa-float-btn";
      btn.innerHTML     = isFloat ? "⏳" : "Abriendo…";
      btn.style.opacity = ".7";
      setTimeout(() => {
        btn.innerHTML     = original;
        btn.style.opacity = "1";
      }, 1800);
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   4. RENDER — POST DESTACADO (#feed)
══════════════════════════════════════════════════════════════ */

function renderFeaturedPost(post) {
  const isVideo  = post.media_type === "VIDEO";
  const mediaSrc = isVideo ? post.thumbnail_url : post.media_url;
  const cup      = extractCupNum(post.caption);
  const cap      = shortCaption(post.caption, 180);
  const when     = relativeTime(post.timestamp);

  const fpMedia = document.querySelector(".fp-media");
  if (fpMedia) {
    fpMedia.innerHTML = `
      <img src="${mediaSrc}" alt="Post destacado" style="width:100%;height:100%;object-fit:cover;display:block;">
      <div class="fp-platform-badge badge-ig">📸 Instagram · @aceropress50k</div>
      ${cup ? `<div class="fp-cup-num">${cup}</div>` : ""}
    `;
  }

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

    const btnIg = fpBody.querySelector(".btn-ig");
    if (btnIg) btnIg.href = post.permalink;
  }
}

/* ══════════════════════════════════════════════════════════════
   5. RENDER — GRID INSTAGRAM (#instagram)
══════════════════════════════════════════════════════════════ */

function renderIGGrid(posts) {
  const grid = document.querySelector("#instagram .ig-grid");
  if (!grid) return;

  grid.innerHTML = "";

  posts.forEach((post, idx) => {
    const isVideo    = post.media_type === "VIDEO";
    const isCarousel = post.media_type === "CAROUSEL_ALBUM";
    const mediaSrc   = isVideo ? post.thumbnail_url : post.media_url;
    const cup        = extractCupNum(post.caption);
    const cap        = shortCaption(post.caption, 60);
    const typeBadge  = isVideo ? "▶" : isCarousel ? "⊞" : "";

    const div = document.createElement("div");
    div.className = "ig-post" + (idx === 0 ? " large" : "");

    div.innerHTML = 
      <div class="ig-media">
        <img src="${mediaSrc}"
             alt="${cap || "Post de Instagram"}"
             loading="${idx < 3 ? "eager" : "lazy"}"
             style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s ease;">
      </div>
      ${typeBadge ? <div class="ig-type-badge" style="
        position:absolute;top:.6rem;right:.6rem;z-index:3;
        font-size:.75rem;color:#fff;background:rgba(0,0,0,.55);
        padding:.2rem .4rem;border-radius:2px;
        font-family:'JetBrains Mono',monospace;">${typeBadge}</div> : ""}
      <div class="ig-post-overlay"></div>
      <div class="ig-post-info">
        ${cup ? <div class="ig-post-num">${cup}</div>`: ""}
        <div class="ig-post-cap">${cap}</div>
      </div>
    ;

    div.style.cursor = "pointer";
    div.addEventListener("click", () => window.open(post.permalink, "_blank", "noopener"));
    grid.appendChild(div);
  });
}

/* ══════════════════════════════════════════════════════════════
   6. RENDER — HERO INSTAGRAM
══════════════════════════════════════════════════════════════ */

function renderIGHero(post) {
  const heroMedia = document.querySelector("#instagram .ig-hero .fs-media");
  if (!heroMedia) return;

  const isVideo  = post.media_type === "VIDEO";
  const mediaSrc = isVideo ? post.thumbnail_url : post.media_url;
  heroMedia.innerHTML = <img src="${mediaSrc}" alt="Hero Instagram" style="width:100%;height:100%;object-fit:cover;">;

  const heroP = document.querySelector("#instagram .ig-hero-content p");
  if (heroP) {
    const cup = extractCupNum(post.caption);
    const cap = shortCaption(post.caption, 120);
    heroP.innerHTML = cup
      ? <strong style="color:var(--hot)">${cup}</strong> — ${cap}
      : cap;
  }
}

/* ══════════════════════════════════════════════════════════════
   7. STATS BAR
══════════════════════════════════════════════════════════════ */

function updateStatsBar(posts) {
  const totalLikes = posts.reduce((s, p) => s + (p.like_count || 0), 0);
  if (totalLikes > 0) {
    console.log(`[Acero.press] Likes totales (últimos ${posts.length} posts): ${totalLikes}`);
  }
}

/* ══════════════════════════════════════════════════════════════
   8. LOADING / ERROR STATES
══════════════════════════════════════════════════════════════ */

function showIGLoading() {
  const grid = document.querySelector("#instagram .ig-grid");
  if (!grid) return;

  grid.innerHTML = Array(6).fill(0).map(() => 
    <div class="ig-post" style="background:rgba(255,255,255,.04);animation:igSkeleton 1.4s ease-in-out infinite;">
      <div class="ig-media" style="aspect-ratio:1/1;"></div>
    </div>
  ).join("");

  if (!document.getElementById("ig-skeleton-style")) {
    const st = document.createElement("style");
    st.id = "ig-skeleton-style";
    st.textContent = 
      @keyframes igSkeleton { 0%,100%{opacity:1} 50%{opacity:.35} }
      .ig-type-badge {
        position:absolute; top:.6rem; right:.6rem; z-index:3;
        font-size:.75rem; color:#fff; background:rgba(0,0,0,.55);
        padding:.2rem .4rem; border-radius:2px;
        font-family:'JetBrains Mono',monospace;
      }
    ;
    document.head.appendChild(st);
  }
}

function showIGError() {
  const grid = document.querySelector("#instagram .ig-grid");
  if (!grid) return;

  grid.innerHTML = 
    <div style="grid-column:1/-1;display:flex;flex-direction:column;align-items:center;
      gap:1rem;padding:4rem 2rem;text-align:center;border:1px dashed rgba(255,255,255,.1);">
      <span style="font-size:2rem">⚠</span>
      <p style="font-family:'JetBrains Mono',monospace;font-size:.8rem;color:rgba(255,255,255,.4);">
        No se pudo cargar el feed de Instagram.
      </p>
      <a href="https://instagram.com/aceropress50k" target="_blank" rel="noopener"
         class="btn-platform btn-ig" style="font-size:.7rem;padding:.7rem 1.4rem;">
        Ver en Instagram →
      </a>
    </div>
  ;
}

/* ══════════════════════════════════════════════════════════════
   9. MARQUEE
══════════════════════════════════════════════════════════════ */

function updateMarquee(post) {
  const track = document.querySelector(".mq-track");
  if (!track || !post) return;
  const cup  = extractCupNum(post.caption) || "–";
  const when = relativeTime(post.timestamp);
  const live = document.createElement("span");
  live.className = "mc";
  live.innerHTML = `· ${cup} · ${when} · `;
  track.insertBefore(live, track.firstChild);
}

/* ══════════════════════════════════════════════════════════════
   10. INIT
══════════════════════════════════════════════════════════════ */

async function initSocialFeed() {
  showIGLoading();

  // WhatsApp arranca independiente — no depende del feed de IG
  initWhatsApp();

  try {
    const posts = await fetchIGPosts();
    if (!posts.length) throw new Error("No posts");

    renderFeaturedPost(posts[0]);
    renderIGHero(posts[0]);
    renderIGGrid(posts);
    updateStatsBar(posts);
    updateMarquee(posts[0]);

    console.log(`[Acero.press] ✓ ${posts.length} posts cargados desde Instagram`);

  } catch (err) {
    console.error("[Acero.press] Error cargando feed:", err);
    showIGError();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSocialFeed);
} else {
  initSocialFeed();
}

/* ══════════════════════════════════════════════════════════════
   11. DESING
══════════════════════════════════════════════════════════════ */
/* ── Header scroll ── */
const hdr = document.getElementById('main-header');
window.addEventListener('scroll',()=>{ hdr.classList.toggle('scrolled',window.scrollY>60); },{passive:true});

/* ── Seg bar hero ── */
(function(){
  const bar = document.getElementById('segBar');
  if(!bar) return;
  const total=50,filled=Math.round(12847/50000*total);
  for(let i=0;i<total;i++){
    const s=document.createElement('div');
    s.className='seg'+(i<filled?' on':'');
    bar.appendChild(s);
  }
})();


/* ════════════════════════════════════════
   SCROLLYTELLING — TECNOLOGÍA
════════════════════════════════════════ */
(function(){
  const wrap   = document.getElementById('tec-wrap');
  if(!wrap) return;

  const bg0  = document.getElementById('tec-bg0');
  const bg1  = document.getElementById('tec-bg1');
  const bg2  = document.getElementById('tec-bg2');
  const bg3  = document.getElementById('tec-bg3');
  const c1   = document.getElementById('tec-c1');
  const c2   = document.getElementById('tec-c2');
  const c3   = document.getElementById('tec-c3');
  const s2   = document.getElementById('tec-s2');
  const s3   = document.getElementById('tec-s3');
  const tp1  = document.getElementById('tp1');
  const tp2  = document.getElementById('tp2');
  const tp3  = document.getElementById('tp3');
  const figTL= document.getElementById('tec-fig-tl');
  const figTR= document.getElementById('tec-fig-tr');

  const FIGS = [
    {tl:'FIG. 03.1 — REDISEÑO DE ESPACIO\nBogotá · 2.600 msnm · IA + Diseño', tr:'Flujo de clientes · Mapas de calor\nGeneración 3D · 72h diagnóstico'},
    {tl:'FIG. 03.2 — IDENTIDAD DIGITAL\nDiseño de carta · Menú trazable',     tr:'Editorial · QR trazabilidad\nPresencia digital · Instagram'},
    {tl:'FIG. 03.3 — ESTÁNDAR ESPRESSO\nProtocolo SCA · Manual de servicio',  tr:'Dosis · Ratio · Temperatura\nReplicable · Taza a taza'},
  ];

  let current = -1;

  function setPanel(n){
    if(n===current) return;
    current = n;

    /* fondos */
    bg0.style.opacity = '1';
    bg1.style.opacity = n===0 ? '1':'0';
    bg2.style.opacity = n===1 ? '1':'0';
    bg3.style.opacity = n===2 ? '1':'0';

    /* copies */
    c1.classList.toggle('show', n===0);
    c2.classList.toggle('show', n===1);
    c3.classList.toggle('show', n===2);

    /* tarjetas laterales */
    s2.classList.toggle('show', n===1);
    s3.classList.toggle('show', n===2);

    /* puntos de progreso */
    [tp1,tp2,tp3].forEach((d,i)=>d.classList.toggle('on',i===n));

    /* anotaciones blueprint */
    if(figTL && FIGS[n]){
      figTL.style.opacity='0';
      figTR.style.opacity='0';
      setTimeout(()=>{
        figTL.textContent=FIGS[n].tl;
        figTR.textContent=FIGS[n].tr;
        figTL.style.opacity='1';
        figTR.style.opacity='1';
      },200);
    }
  }

  /* transición suave en las anotaciones */
  if(figTL){ figTL.style.transition='opacity .1s ease'; }
  if(figTR){ figTR.style.transition='opacity .1s ease'; }

  setPanel(0);

  window.addEventListener('scroll',()=>{
    const rect   = wrap.getBoundingClientRect();
    const total  = wrap.offsetHeight - window.innerHeight;
    const scrolled = Math.max(0, Math.min(-rect.top, total));
    const pct    = total>0 ? scrolled/total : 0;

    /* cada tercio del scroll es un panel */
    if     (pct < 0.50) setPanel(0);
    else if(pct < 0.80) setPanel(1);
    else                setPanel(2);
  },{passive:true});
})();

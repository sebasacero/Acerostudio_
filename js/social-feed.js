/* ══════════════════════════════════════════════════════════════
   CONFIG
══════════════════════════════════════════════════════════════ */

const API = {
  URL:   "https://tylylfrabjkaiukuilem.supabase.co/functions/v1/instagram-proxy",
  WA:    "https://tylylfrabjkaiukuilem.supabase.co/functions/v1/whatsapp-link",
  ANON:  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bHlsZnJhYmprYWl1a3VpbGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODAwNDAsImV4cCI6MjA5ODA1NjA0MH0.Bqe1f2QBUBMiLmLCfAeownFsHLpSpxg6qaAkgvTB3uE",
  LIMIT: 9
};

/* ══════════════════════════════════════════════════════════════
   1. FETCH INSTAGRAM
══════════════════════════════════════════════════════════════ */

async function fetchIGPosts() {
  const response = await fetch(
    `${API.URL}?limit=${API.LIMIT}`,
    {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${API.ANON}`
      }
    }
  );
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const json = await response.json();
  if (json.error) throw new Error(json.error);
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
  return `Hace ${d} dia${d > 1 ? "s" : ""}`;
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit", month: "short", year: "numeric"
  });
}

function fmtNum(n) {
  if (!n) return "-";
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
   3. WHATSAPP
══════════════════════════════════════════════════════════════ */

async function openWhatsApp(msgKey) {
  msgKey = msgKey || "wa_msg_default";
  try {
    const res = await fetch(
      `${API.WA}?msg=${msgKey}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${API.ANON}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (!res.ok) throw new Error("WA proxy error " + res.status);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    if (data.url) window.open(data.url, "_blank", "noopener");
  } catch (err) {
    console.error("[Acero.press] WhatsApp error:", err);
    // Fallback directo
    window.open("https://wa.me/573152125327", "_blank", "noopener");
  }
}

function initWhatsApp() {
  // Boton flotante
  var waBtn = document.getElementById("wa-float-btn");
  if (waBtn) {
    waBtn.removeAttribute("href");
    waBtn.style.cursor = "pointer";
    waBtn.addEventListener("click", function(e) {
      e.preventDefault();
      openWhatsApp("wa_msg_default");
    });
  }

  // Botones con data-wa-msg
  document.querySelectorAll("[data-wa-msg]").forEach(function(btn) {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      var key = btn.getAttribute("data-wa-msg");
      openWhatsApp(key);
    });
  });

  // Feedback visual
  document.querySelectorAll("[data-wa-msg], #wa-float-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var original = btn.innerHTML;
      var isFloat  = btn.id === "wa-float-btn";
      btn.innerHTML = isFloat ? "⏳" : "Abriendo...";
      btn.style.opacity = "0.7";
      setTimeout(function() {
        btn.innerHTML = original;
        btn.style.opacity = "1";
      }, 1800);
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   4. RENDER — POST DESTACADO
══════════════════════════════════════════════════════════════ */

function renderFeaturedPost(post) {
  var isVideo  = post.media_type === "VIDEO";
  var mediaSrc = isVideo ? post.thumbnail_url : post.media_url;
  var cup      = extractCupNum(post.caption);
  var cap      = shortCaption(post.caption, 180);
  var when     = relativeTime(post.timestamp);

  var fpMedia = document.querySelector(".fp-media");
  if (fpMedia) {
    fpMedia.innerHTML =
      '<img src="' + mediaSrc + '" alt="Post destacado" style="width:100%;height:100%;object-fit:cover;display:block;">' +
      '<div class="fp-platform-badge badge-ig">Instragram - @aceropress50k</div>' +
      (cup ? '<div class="fp-cup-num">' + cup + '</div>' : '');
  }

  var fpBody = document.querySelector(".fp-body");
  if (fpBody) {
    var likeEl  = fpBody.querySelector(".fp-stat:nth-child(1) .n");
    var captEl  = fpBody.querySelector(".fp-caption");
    var platEl  = fpBody.querySelector(".fp-platform");
    var titleEl = fpBody.querySelector(".fp-title");

    if (platEl)  platEl.textContent = "Ultima publicacion - " + when;
    if (likeEl)  likeEl.textContent = fmtNum(post.like_count);
    if (captEl)  captEl.innerHTML   = cap.replace(/\n/g, "<br>");
    if (titleEl && cup) titleEl.innerHTML = cup + '<br><span style="opacity:.5;font-size:.85em;">' + fmtDate(post.timestamp) + '</span>';

    var btnIg = fpBody.querySelector(".btn-ig");
    if (btnIg) btnIg.href = post.permalink;
  }
}

/* ══════════════════════════════════════════════════════════════
   5. RENDER — GRID INSTAGRAM
══════════════════════════════════════════════════════════════ */

function renderIGGrid(posts) {
  var grid = document.querySelector("#instagram .ig-grid");
  if (!grid) return;

  grid.innerHTML = "";

  posts.forEach(function(post, idx) {
    var isVideo    = post.media_type === "VIDEO";
    var isCarousel = post.media_type === "CAROUSEL_ALBUM";
    var mediaSrc   = isVideo ? post.thumbnail_url : post.media_url;
    var cup        = extractCupNum(post.caption);
    var cap        = shortCaption(post.caption, 60);
    var typeBadge  = isVideo ? "▶" : (isCarousel ? "⊞" : "");

    var div = document.createElement("div");
    div.className = "ig-post" + (idx === 0 ? " large" : "");

    var badgeHTML = "";
    if (typeBadge) {
      badgeHTML = '<div class="ig-type-badge" style="position:absolute;top:.6rem;right:.6rem;z-index:3;font-size:.75rem;color:#fff;background:rgba(0,0,0,.55);padding:.2rem .4rem;border-radius:2px;font-family:monospace;">' + typeBadge + '</div>';
    }

    var cupHTML = cup ? '<div class="ig-post-num">' + cup + '</div>' : "";

    div.innerHTML =
      '<div class="ig-media">' +
        '<img src="' + mediaSrc + '" alt="' + (cap || "Post") + '" loading="' + (idx < 3 ? "eager" : "lazy") + '" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s ease;">' +
      '</div>' +
      badgeHTML +
      '<div class="ig-post-overlay"></div>' +
      '<div class="ig-post-info">' + cupHTML + '<div class="ig-post-cap">' + cap + '</div></div>';

    div.style.cursor = "pointer";
    div.addEventListener("click", (function(permalink) {
      return function() { window.open(permalink, "_blank", "noopener"); };
    })(post.permalink));

    grid.appendChild(div);
  });
}

/* ══════════════════════════════════════════════════════════════
   6. RENDER — HERO INSTAGRAM
══════════════════════════════════════════════════════════════ */

function renderIGHero(post) {
  var heroMedia = document.querySelector("#instagram .ig-hero .fs-media");
  if (!heroMedia) return;

  var isVideo  = post.media_type === "VIDEO";
  var mediaSrc = isVideo ? post.thumbnail_url : post.media_url;
  heroMedia.innerHTML = '<img src="' + mediaSrc + '" alt="Hero Instagram" style="width:100%;height:100%;object-fit:cover;">';

  var heroP = document.querySelector("#instagram .ig-hero-content p");
  if (heroP) {
    var cup = extractCupNum(post.caption);
    var cap = shortCaption(post.caption, 120);
    heroP.innerHTML = cup
      ? '<strong style="color:var(--hot)">' + cup + '</strong> — ' + cap
      : cap;
  }
}

/* ══════════════════════════════════════════════════════════════
   7. LOADING / ERROR
══════════════════════════════════════════════════════════════ */

function showIGLoading() {
  var grid = document.querySelector("#instagram .ig-grid");
  if (!grid) return;

  var skeletons = "";
  for (var i = 0; i < 6; i++) {
    skeletons += '<div class="ig-post" style="background:rgba(255,255,255,.04);animation:igSkeleton 1.4s ease-in-out infinite;"><div class="ig-media" style="aspect-ratio:1/1;"></div></div>';
  }
  grid.innerHTML = skeletons;

  if (!document.getElementById("ig-skeleton-style")) {
    var st = document.createElement("style");
    st.id = "ig-skeleton-style";
    st.textContent = "@keyframes igSkeleton { 0%,100%{opacity:1} 50%{opacity:.35} } .ig-type-badge { position:absolute; top:.6rem; right:.6rem; z-index:3; font-size:.75rem; color:#fff; background:rgba(0,0,0,.55); padding:.2rem .4rem; border-radius:2px; font-family:'JetBrains Mono',monospace; }";
    document.head.appendChild(st);
  }
}

function showIGError() {
  var grid = document.querySelector("#instagram .ig-grid");
  if (!grid) return;
  grid.innerHTML =
    '<div style="grid-column:1/-1;display:flex;flex-direction:column;align-items:center;gap:1rem;padding:4rem 2rem;text-align:center;border:1px dashed rgba(255,255,255,.1);">' +
      '<span style="font-size:2rem">⚠</span>' +
      '<p style="font-family:monospace;font-size:.8rem;color:rgba(255,255,255,.4);">No se pudo cargar el feed de Instagram.</p>' +
      '<a href="https://instagram.com/aceropress50k" target="_blank" rel="noopener" class="btn-platform btn-ig" style="font-size:.7rem;padding:.7rem 1.4rem;">Ver en Instagram</a>' +
    '</div>';
}

/* ══════════════════════════════════════════════════════════════
   8. MARQUEE
══════════════════════════════════════════════════════════════ */

function updateMarquee(post) {
  var track = document.querySelector(".mq-track");
  if (!track || !post) return;
  var cup  = extractCupNum(post.caption) || "-";
  var when = relativeTime(post.timestamp);
  var live = document.createElement("span");
  live.className = "mc";
  live.innerHTML = "· " + cup + " · " + when + " · ";
  track.insertBefore(live, track.firstChild);
}

/* ══════════════════════════════════════════════════════════════
   9. INIT SOCIAL FEED
══════════════════════════════════════════════════════════════ */

async function initSocialFeed() {
  showIGLoading();
  initWhatsApp();

  try {
    var posts = await fetchIGPosts();
    if (!posts.length) throw new Error("No posts");

    renderFeaturedPost(posts[0]);
    renderIGHero(posts[0]);
    renderIGGrid(posts);
    updateMarquee(posts[0]);

    window.dispatchEvent(new Event("scroll"));
    console.log("[Acero.press] posts cargados: " + posts.length);

  } catch (err) {
    console.error("[Acero.press] Error:", err);
    showIGError();
  }
}

/* ══════════════════════════════════════════════════════════════
   10. HEADER SCROLL
══════════════════════════════════════════════════════════════ */

(function() {
  var hdr = document.getElementById("main-header") || document.getElementById("hdr");
  if (!hdr) return;
  window.addEventListener("scroll", function() {
    hdr.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });
})();

/* ══════════════════════════════════════════════════════════════
   11. SEG BAR HERO
══════════════════════════════════════════════════════════════ */

(function() {
  var bar = document.getElementById("segBar");
  if (!bar) return;
  var total  = 50;
  var filled = Math.round(12847 / 50000 * total);
  for (var i = 0; i < total; i++) {
    var s = document.createElement("div");
    s.className = "seg" + (i < filled ? " on" : "");
    bar.appendChild(s);
  }
})();

/* ══════════════════════════════════════════════════════════════
      12. SCROLLYTELLING — TECNOLOGIA
══════════════════════════════════════════════════════════════ */
 
(function() {
  var wrap = document.getElementById("tec-wrap");
  if (!wrap) return;
 
  var bg0  = document.getElementById("tec-bg0");
  var bg1  = document.getElementById("tec-bg1");
  var bg2  = document.getElementById("tec-bg2");
  var bg3  = document.getElementById("tec-bg3");
  var c1   = document.getElementById("tec-c1");
  var c2   = document.getElementById("tec-c2");
  var c3   = document.getElementById("tec-c3");
  var s2   = document.getElementById("tec-s2");
  var s3   = document.getElementById("tec-s3");
  var tp1  = document.getElementById("tp1");
  var tp2  = document.getElementById("tp2");
  var tp3  = document.getElementById("tp3");
  var figTL = document.getElementById("tec-fig-tl");
  var figTR = document.getElementById("tec-fig-tr");
 
  var FIGS = [
    { tl: "FIG. 03.1 — REDISENO DE ESPACIO\nBogota · 2.600 msnm · IA + Diseno", tr: "Flujo de clientes · Mapas de calor\nGeneracion 3D · 72h diagnostico" },
    { tl: "FIG. 03.2 — IDENTIDAD DIGITAL\nDiseno de carta · Menu trazable",     tr: "Editorial · QR trazabilidad\nPresencia digital · Instagram" },
    { tl: "FIG. 03.3 — ESTANDAR ESPRESSO\nProtocolo SCA · Manual de servicio",  tr: "Dosis · Ratio · Temperatura\nReplicable · Taza a taza" }
  ];
 
  var current = -1;
 
  function setPanel(n) {
    if (n === current) return;
    current = n;
 
    if (bg0) bg0.style.opacity = "1";
    if (bg1) bg1.style.opacity = n === 0 ? "1" : "0";
    if (bg2) bg2.style.opacity = n === 1 ? "1" : "0";
    if (bg3) bg3.style.opacity = n === 2 ? "1" : "0";
 
    if (c1) c1.classList.toggle("show", n === 0);
    if (c2) c2.classList.toggle("show", n === 1);
    if (c3) c3.classList.toggle("show", n === 2);
    if (s2) s2.classList.toggle("show", n === 1);
    if (s3) s3.classList.toggle("show", n === 2);
 
    if (tp1) tp1.classList.toggle("on", n === 0);
    if (tp2) tp2.classList.toggle("on", n === 1);
    if (tp3) tp3.classList.toggle("on", n === 2);
 
    if (figTL && FIGS[n]) {
      figTL.style.opacity = "0";
      figTR.style.opacity = "0";
      setTimeout(function() {
        figTL.textContent = FIGS[n].tl;
        figTR.textContent = FIGS[n].tr;
        figTL.style.opacity = "1";
        figTR.style.opacity = "1";
      }, 200);
    }
  }
 
  if (figTL) figTL.style.transition = "opacity .1s ease";
  if (figTR) figTR.style.transition = "opacity .1s ease";
 
  // ── Umbrales de scroll proporcionales a la duración de cada video ──
  // Por defecto, tercios iguales mientras cargan los metadatos.
  var t1 = 1 / 3;
  var t2 = 2 / 3;
 
  var v1 = bg1 ? bg1.querySelector("video") : null;
  var v2 = bg2 ? bg2.querySelector("video") : null;
  var v3 = bg3 ? bg3.querySelector("video") : null;
 
  function recalcThresholds() {
    var d1 = (v1 && v1.duration && !isNaN(v1.duration)) ? v1.duration : 1;
    var d2 = (v2 && v2.duration && !isNaN(v2.duration)) ? v2.duration : 1;
    var d3 = (v3 && v3.duration && !isNaN(v3.duration)) ? v3.duration : 1;
    var total = d1 + d2 + d3;
    if (total > 0) {
      t1 = d1 / total;
      t2 = (d1 + d2) / total;
    }
  }
 
  [v1, v2, v3].forEach(function(v) {
    if (!v) return;
    if (v.readyState >= 1) {
      // Metadatos ya disponibles (por ejemplo, video en cache)
      recalcThresholds();
    } else {
      v.addEventListener("loadedmetadata", recalcThresholds, { once: true });
    }
  });
 
  setPanel(0);
 
  window.addEventListener("scroll", function() {
    var rect    = wrap.getBoundingClientRect();
    var total   = wrap.offsetHeight - window.innerHeight;
    var scrolled = Math.max(0, Math.min(-rect.top, total));
    var pct     = total > 0 ? scrolled / total : 0;
 
    if      (pct < t1) setPanel(0);
    else if (pct < t2) setPanel(1);
    else                setPanel(2);
  }, { passive: true });
 
  // Re-calcular cuando carguen imagenes de IG
  window.addEventListener("load", function() {
    recalcThresholds();
    setPanel(0);
  });
 
})();
 
/* 
/* ══════════════════════════════════════════════════════════════
   ARRANCAR
══════════════════════════════════════════════════════════════ */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSocialFeed);
} else {
  initSocialFeed();
}

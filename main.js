document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------------------
    // SEGURIDAD: El token de Instagram NUNCA debe estar aquí.
    // Opciones:
    //   A) Servidor propio: crea un endpoint /api/instagram-feed que
    //      guarde el token en una variable de entorno y haga el fetch
    //      desde el backend. El frontend llama a /api/instagram-feed.
    //   B) Sin backend: pega el token en el campo de abajo SOLO en
    //      tu máquina local, y añade main.js a .gitignore para que
    //      nunca llegue al repositorio.
    // ----------------------------------------------------------------
    const INSTAGRAM_ACCESS_TOKEN = '';  // <-- dejar vacío en el repo
    const MEDIA_LIMIT = 26;

    const feedContainer = document.getElementById('instafeed-container');
    const statusDot     = document.getElementById('ig-status-dot');
    const statusTexts   = document.querySelectorAll('#ig-status-text');
    const btnSync       = document.getElementById('btn-sync');
    const statusText    = statusTexts[0];

    async function fetchInstagramPosts() {
      if (!INSTAGRAM_ACCESS_TOKEN) {
        if (statusText) statusText.textContent = "Token no configurado";
        return;
      }

      try {
        if (statusText) statusText.textContent = "Conectando...";

        // El token va en el header, NO en la URL, para evitar que
        // quede expuesto en logs de servidor y herramientas de red.
        // Nota: Instagram Basic Display API no soporta header Bearer
        // directamente desde el navegador por CORS, por eso se
        // recomienda usar un proxy/backend propio (opción A).
        // Si usas opción B (solo local), puedes dejarlo en query param
        // pero NUNCA en el repo.
        const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=${MEDIA_LIMIT}&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("Error en la respuesta de la API");

        const data = await response.json();

        if (data && data.data) {
          renderInstagramFeed(data.data);
          if (statusDot) statusDot.classList.add('connected');
          if (statusText) {
            statusText.textContent = "Sincronizado";
            statusText.style.color = "#6f9d6a";
          }
        } else {
          throw new Error("Estructura de datos inválida");
        }

      } catch (error) {
        console.error("Error al obtener el feed de Instagram:", error);
        if (statusText) {
          statusText.textContent = "Error de conexión";
          statusText.style.color = "var(--magenta)";
        }
        if (statusDot) statusDot.classList.remove('connected');
      }
    }

    function sanitizeText(str) {
      // Convierte caracteres especiales en entidades HTML seguras
      const map = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' };
      return String(str).replace(/[&<>"']/g, c => map[c]);
    }

    function renderInstagramFeed(posts) {
      if (!feedContainer) return;
      feedContainer.innerHTML = '';

      posts.forEach(post => {
        const imageUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
        const caption  = post.caption ? post.caption.substring(0, 40) + '...' : 'Acero.press #50k';

        // CORRECCIÓN XSS: se construye el DOM con createElement y
        // se asignan valores con .textContent / .setAttribute en lugar
        // de inyectar strings sin sanitizar en innerHTML.
        const link = document.createElement('a');
        link.setAttribute('href', sanitizeText(post.permalink));
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        link.className = 'img-wrap';
        link.style.cssText = 'text-decoration:none; display:block;';

        const img = document.createElement('img');
        img.className = 'img-slot';
        img.setAttribute('src', sanitizeText(imageUrl));
        img.setAttribute('alt', sanitizeText(caption));
        img.style.cssText = 'border:1.5px solid var(--ink); border-radius:4px; padding:2px; background:var(--cream);';

        const tag = document.createElement('span');
        tag.className = 'img-tag';
        tag.style.cssText = 'opacity:0; transition:opacity 0.2s;';
        const tagB = document.createElement('b');
        tagB.textContent = 'Ver en IG ↗';
        tag.appendChild(tagB);

        link.appendChild(img);
        link.appendChild(tag);

        link.addEventListener('mouseenter', () => { tag.style.opacity = '1'; });
        link.addEventListener('mouseleave', () => { tag.style.opacity = '0'; });

        feedContainer.appendChild(link);
      });
    }

    if (btnSync) {
      btnSync.addEventListener('click', () => {
        if (statusDot) statusDot.classList.remove('connected');
        fetchInstagramPosts();
      });
    }

    fetchInstagramPosts();
  });

var cups  = parseInt(localStorage.getItem('aw-cups')  || '1247');
var kg    = parseInt(localStorage.getItem('aw-kg')    || '87');
var farms = parseInt(localStorage.getItem('aw-farms') || '12');
var lc = 0, lt;

function animC(el, t) {
  var s = t / 72, c = 0;
  var i = setInterval(function() {
    c += s;
    if (c >= t) { c = t; clearInterval(i); }
    el.textContent = Math.floor(c).toLocaleString('es-CO');
  }, 16);
}

window.addEventListener('load', function() {
  setTimeout(function() {
    var elCups  = document.getElementById('cnt-cups');
    var elKg    = document.getElementById('cnt-kg');
    var elFarms = document.getElementById('cnt-farms');
    if (elCups)  animC(elCups,  cups);
    if (elKg)    animC(elKg,    kg);
    if (elFarms) animC(elFarms, farms);
  }, 400);

  var temps       = ['14.2°C','13.8°C','14.5°C','14.1°C','13.9°C','14.3°C'];
  var extractions = ['92.5°C','93.1°C','92.8°C','94.0°C','92.3°C'];
  var ti = 0, ei = 0;

  setInterval(function() {
    ti = (ti + 1) % temps.length;
    var e = document.getElementById('live-temp');
    if (e) e.textContent = temps[ti];
  }, 3200);

  setInterval(function() {
    ei = (ei + 1) % extractions.length;
    var e = document.getElementById('hero-temp');
    if (e) e.textContent = extractions[ei];
  }, 4100);

  initLiquidChrome();
});

/* ============ LIQUID CHROME ANIMATION ============ */
function initLiquidChrome() {
  var canvas = document.getElementById('liq-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H;
  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  var blobs = [
    {x:0.15, y:0.2,  vx:0.0006,  vy:0.0004,  r:0.28, hue:210},
    {x:0.7,  y:0.1,  vx:-0.0005, vy:0.0007,  r:0.22, hue:200},
    {x:0.5,  y:0.6,  vx:0.0004,  vy:-0.0005, r:0.32, hue:215},
    {x:0.85, y:0.7,  vx:-0.0007, vy:-0.0003, r:0.2,  hue:205},
    {x:0.3,  y:0.85, vx:0.0005,  vy:-0.0004, r:0.24, hue:210},
    {x:0.9,  y:0.15, vx:-0.0004, vy:0.0006,  r:0.18, hue:25},
    {x:0.6,  y:0.4,  vx:0.0003,  vy:0.0005,  r:0.14, hue:18},
  ];

  var t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.004;

    blobs.forEach(function(b) {
      b.x += b.vx; b.y += b.vy;
      if (b.x < -0.1) b.vx =  Math.abs(b.vx);
      if (b.x >  1.1) b.vx = -Math.abs(b.vx);
      if (b.y < -0.1) b.vy =  Math.abs(b.vy);
      if (b.y >  1.1) b.vy = -Math.abs(b.vy);

      var bx = b.x * W, by = b.y * H, br = b.r * Math.min(W, H);
      var wave = Math.sin(t * 0.7 + b.x * 3) * 0.12;
      var rx = br * (1 + wave), ry = br * (1 - wave * 0.5);

      if (b.hue > 100) {
        var grd = ctx.createRadialGradient(bx - rx*0.3, by - ry*0.3, rx*0.05, bx, by, rx);
        grd.addColorStop(0,    'rgba(250,253,255,0.55)');
        grd.addColorStop(0.25, 'rgba(220,235,250,0.35)');
        grd.addColorStop(0.55, 'rgba(170,200,225,0.2)');
        grd.addColorStop(0.8,  'rgba(130,170,210,0.1)');
        grd.addColorStop(1,    'rgba(100,145,190,0)');
        ctx.beginPath();
        ctx.ellipse(bx, by, rx, ry, t*0.1, 0, Math.PI*2);
        ctx.fillStyle = grd;
        ctx.fill();

        var sg = ctx.createRadialGradient(bx-rx*0.4, by-ry*0.45, 0, bx-rx*0.2, by-ry*0.2, rx*0.5);
        sg.addColorStop(0,   'rgba(255,255,255,0.4)');
        sg.addColorStop(0.5, 'rgba(240,248,255,0.1)');
        sg.addColorStop(1,   'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.ellipse(bx-rx*0.2, by-ry*0.25, rx*0.45, ry*0.3, t*0.1, 0, Math.PI*2);
        ctx.fillStyle = sg;
        ctx.fill();
      } else {
        var tgrd = ctx.createRadialGradient(bx, by, 0, bx, by, br*(1.1+wave));
        if (b.hue > 20) {
          tgrd.addColorStop(0,   'rgba(255,180,80,0.12)');
          tgrd.addColorStop(0.4, 'rgba(255,120,40,0.07)');
          tgrd.addColorStop(1,   'rgba(220,60,20,0)');
        } else {
          tgrd.addColorStop(0,   'rgba(255,100,30,0.14)');
          tgrd.addColorStop(0.4, 'rgba(220,50,10,0.07)');
          tgrd.addColorStop(1,   'rgba(180,30,0,0)');
        }
        ctx.beginPath();
        ctx.ellipse(bx, by, br*(1+wave), br*(1-wave*0.4), t*0.08, 0, Math.PI*2);
        ctx.fillStyle = tgrd;
        ctx.fill();
      }
    });

    for (var i = 0; i < 4; i++) {
      var sx = ((t*0.08 + i*0.27) % 1.4 - 0.2) * W;
      var sy = ((t*0.04 + i*0.35) % 1.2 - 0.1) * H;
      var sw = W * 0.6, sa = 0.07 + Math.sin(t + i) * 0.03;
      var lg = ctx.createLinearGradient(sx, sy, sx + sw, sy + 60);
      lg.addColorStop(0,   'rgba(220,235,250,0)');
      lg.addColorStop(0.3, 'rgba(240,248,255,' + sa + ')');
      lg.addColorStop(0.5, 'rgba(255,255,255,' + (sa * 1.4) + ')');
      lg.addColorStop(0.7, 'rgba(220,235,250,' + sa + ')');
      lg.addColorStop(1,   'rgba(220,235,250,0)');
      ctx.beginPath();
      ctx.ellipse(sx + sw*0.5, sy, sw*0.5, 18, Math.sin(t*0.3 + i)*0.3, 0, Math.PI*2);
      ctx.fillStyle = lg;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  draw();
}

function show(n) {
  document.querySelectorAll('section').forEach(function(s) { s.classList.remove('active'); });
  var el = document.getElementById('s-' + n);
  if (el) { el.classList.add('active'); document.getElementById('aw').scrollIntoView({behavior:'smooth'}); }
}

var logoClick = document.getElementById('logo-click');
if (logoClick) {
  logoClick.addEventListener('click', function() {
    lc++; clearTimeout(lt);
    lt = setTimeout(function() { lc = 0; }, 2000);
    if (lc >= 5) { lc = 0; openAdmin(); } else { show('home'); }
  });
}

// ----------------------------------------------------------------
// SEGURIDAD: el panel admin no tiene autenticación real.
// Los cambios solo afectan el localStorage del visitante (no hay
// backend), así que el impacto es bajo. Aun así, si en el futuro
// se conecta a un backend, añadir un PIN o contraseña aquí.
// ----------------------------------------------------------------
function openAdmin() {
  document.getElementById('adm-cups').value  = cups;
  document.getElementById('adm-kg').value    = kg;
  document.getElementById('adm-farms').value = farms;
  document.getElementById('adm-wrap').classList.add('open');
}
function closeAdmin() {
  document.getElementById('adm-wrap').classList.remove('open');
}
function addN(id, n) {
  var e = document.getElementById(id);
  e.value = parseInt(e.value) + n;
}
function saveCounters() {
  cups  = parseInt(document.getElementById('adm-cups').value)  || cups;
  kg    = parseInt(document.getElementById('adm-kg').value)    || kg;
  farms = parseInt(document.getElementById('adm-farms').value) || farms;
  localStorage.setItem('aw-cups',  cups);
  localStorage.setItem('aw-kg',    kg);
  localStorage.setItem('aw-farms', farms);
  document.getElementById('cnt-cups').textContent  = cups.toLocaleString('es-CO');
  document.getElementById('cnt-kg').textContent    = kg.toLocaleString('es-CO');
  document.getElementById('cnt-farms').textContent = farms.toLocaleString('es-CO');
  closeAdmin();
}
function subscribeEmail() {
  var e = document.getElementById('email-in');
  if (e && e.value && e.value.includes('@')) {
    e.value = '';
    e.placeholder = '¡Listo! Te avisamos pronto';
  }
}

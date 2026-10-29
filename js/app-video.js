/* ==========================================================================
   js/app-video.js — sección "La app": video del rediseño al instante
   El video corre solo cuando está en pantalla; los 4 pasos se encienden
   sincronizados con el tiempo del video y se puede saltar a cada uno.
   El botón "Instala la app" usa el aviso de instalación del navegador
   (manifest.webmanifest) y, si no existe (iPhone), explica cómo agregarla.
   ========================================================================== */
(function () {
  var video = document.getElementById('appVideo');
  if (!video) return;
  var steps = [].slice.call(document.querySelectorAll('#appSteps li'));
  var cap = document.getElementById('appCap'), bar = document.getElementById('appBar');
  var hud = document.getElementById('appHudStep'), play = document.getElementById('appPlay');
  var en = function () { return (document.documentElement.lang || 'es').indexOf('en') === 0; };
  var times = steps.map(function (li) { return +li.dataset.t; });
  var cur = -1, userPaused = false;

  function sync() {
    var t = video.currentTime, d = video.duration || 10, i = 0;
    for (var k = 0; k < times.length; k++) if (t >= times[k]) i = k;
    if (i !== cur) {
      cur = i;
      steps.forEach(function (li, k) { li.classList.toggle('on', k === i); });
      cap.textContent = steps[i].querySelector('b').textContent;
      hud.textContent = (i + 1) + '/' + steps.length;
    }
    var end = i + 1 < times.length ? times[i + 1] : d;
    bar.style.width = Math.min(100, ((t - times[i]) / (end - times[i])) * 100) + '%';
  }
  video.addEventListener('timeupdate', sync);
  (function loop() { if (!video.paused) sync(); requestAnimationFrame(loop); })();
  window.addEventListener('acero:lang', function () { cur = -1; sync(); });

  steps.forEach(function (li, k) {
    li.addEventListener('click', function () { video.currentTime = times[k] + 0.05; if (!userPaused) video.play().catch(function () {}); sync(); });
  });

  function setPlayLabel() {
    play.textContent = video.paused ? '▶' : '❚❚';
    play.setAttribute('aria-label', video.paused ? (en() ? 'Play video' : 'Reproducir video') : (en() ? 'Pause video' : 'Pausar video'));
  }
  play.addEventListener('click', function () {
    if (video.paused) { userPaused = false; video.play().catch(function () {}); } else { userPaused = true; video.pause(); }
  });
  video.addEventListener('play', setPlayLabel);
  video.addEventListener('pause', setPlayLabel);

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !userPaused && !reduce) video.play().catch(function () {});
        else if (!e.isIntersecting) video.pause();
      });
    }, { threshold: 0.35 }).observe(video);
  }
  setPlayLabel(); sync();

  /* ---------- instalar la app (PWA) ---------- */
  var btn = document.getElementById('installBtn'), note = document.getElementById('installNote'), deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; });
  window.addEventListener('appinstalled', function () {
    note.textContent = en() ? 'Installed. Open acero.studio from your home screen.' : 'Lista. Abre acero.studio desde tu pantalla de inicio.';
    window.gtag && gtag('event', 'app_installed');
  });
  btn.addEventListener('click', function () {
    window.gtag && gtag('event', 'app_install_click');
    if (deferred) { deferred.prompt(); deferred.userChoice.finally(function () { deferred = null; }); return; }
    var ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    var standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    note.textContent = standalone
      ? (en() ? 'You are already using the app.' : 'Ya estás usando la app.')
      : ios
        ? (en() ? 'On iPhone: tap Share ⬆ and then "Add to Home Screen".' : 'En iPhone: toca Compartir ⬆ y luego "Agregar a inicio".')
        : (en() ? 'Open your browser menu ⋮ and choose "Install app" or "Add to Home screen".' : 'Abre el menú del navegador ⋮ y elige "Instalar app" o "Agregar a la pantalla de inicio".');
    note.classList.add('hl');
  });
})();

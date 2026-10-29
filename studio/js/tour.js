// Recorrido cinemático y modo caminar a la altura de los ojos.
// El recorrido sobrevuela el modelo con el sol avanzando de 7:00 a 17:00 y aterriza adentro;
// al terminar queda en modo caminar (WASD o flechas, arrastrar para mirar, Shift para correr).
import * as THREE from 'three';

const EYE = 1.6;
const DURATION = 18;
const ease = (t) => t * t * (3 - 2 * t);

export function createTour(ctx) {
  const cam = ctx.camera;
  const ray = new THREE.Raycaster();
  ray.params.Line.threshold = 0;
  const keys = new Set();
  let mode = null; // 'cine' | 'walk' | null
  let t = 0, path = null, look0 = null, look1 = null, wasRender = false;
  let yaw = 0, pitch = 0, drag = null, pad = 0;

  const ui = document.createElement('div');
  ui.className = 'cine';
  ui.innerHTML = `<div class="bar bar-t"></div><div class="bar bar-b"></div>
    <div class="cap mono"><b>acero<i>.</i>studio</b> · <span data-cap></span></div>
    <div class="walkpad" aria-label="Caminar">
      <button data-pad="1" aria-label="Avanzar">▲</button><button data-pad="-1" aria-label="Retroceder">▼</button>
    </div>
    <button class="exit mono" data-exit>Salir · Esc</button>`;
  ctx.dom.parentElement.append(ui);
  const cap = ui.querySelector('[data-cap]');

  function setMode(m) {
    mode = m;
    document.body.classList.toggle('touring', !!m);
    ui.dataset.mode = m || '';
    ctx.orbit.enabled = !m;
  }

  function play() {
    stop(false);
    ctx.setView('3d');
    const b = ctx.bounds(), c = b.getCenter(new THREE.Vector3()), s = b.getSize(new THREE.Vector3());
    const r = Math.max(s.x, s.z, 4), top = b.max.y, elev = ctx.elev();
    const P = (x, y, z) => new THREE.Vector3(c.x + x, y, c.z + z);
    path = new THREE.CatmullRomCurve3([
      P(r * 1.7, top + r * 0.9, r * 1.6),
      P(-r * 1.4, top + r * 0.6, r * 1.2),
      P(-r * 1.3, top + r * 0.4, -r * 1.2),
      P(r * 0.9, top + r * 0.3, -r * 0.9),
      P(s.x * 0.3, top + 1.5, s.z * 0.3),
      P(s.x * 0.28, elev + EYE, s.z * 0.28),
    ], false, 'centripetal');
    look0 = c.clone();
    look1 = P(-s.x * 0.3, elev + 1.3, -s.z * 0.3);
    t = 0;
    wasRender = ctx.isRender();
    if (!wasRender) ctx.setRender(true);
    setMode('cine');
  }

  function walk(fromCurrent = true) {
    if (!fromCurrent) {
      const b = ctx.bounds(), c = b.getCenter(new THREE.Vector3()), s = b.getSize(new THREE.Vector3());
      cam.position.set(c.x + s.x * 0.28, ctx.elev() + EYE, c.z + s.z * 0.28);
      cam.lookAt(c.x - s.x * 0.3, ctx.elev() + 1.3, c.z - s.z * 0.3);
    }
    cam.position.y = ctx.elev() + EYE;
    const dir = cam.getWorldDirection(new THREE.Vector3());
    yaw = Math.atan2(-dir.x, -dir.z);
    pitch = 0;
    cap.textContent = 'Caminar · WASD o flechas · arrastra para mirar · Shift corre';
    setMode('walk');
  }

  function stop(restore = true) {
    if (!mode) return;
    const was = mode;
    setMode(null);
    keys.clear();
    if (was === 'cine' && !wasRender) ctx.setRender(false);
    if (restore) {
      const ahead = cam.getWorldDirection(new THREE.Vector3()).multiplyScalar(3).add(cam.position);
      ctx.orbit.target.copy(ahead);
      ctx.orbit.update();
    }
  }

  // Bloquea el paso contra muros, vidrios y muebles (dos alturas: rodilla y pecho).
  function blocked(from, dir, dist) {
    for (const h of [0.5, 1.3]) {
      ray.set(new THREE.Vector3(from.x, ctx.elev() + h, from.z), dir);
      ray.far = dist + 0.3;
      const hit = ray.intersectObjects(ctx.root.children, true).find((i) => i.object.isMesh && i.object.visible);
      if (hit) return true;
    }
    return false;
  }

  function update(dt) {
    if (!mode) return false;
    if (mode === 'cine') {
      t = Math.min(1, t + dt / DURATION);
      const k = ease(t);
      cam.position.copy(path.getPointAt(k));
      const lk = look0.clone().lerp(look1, ease(THREE.MathUtils.clamp((k - 0.7) / 0.3, 0, 1)));
      cam.lookAt(lk);
      const hour = 7 + 10 * k;
      ctx.setSunHour(hour);
      cap.textContent = `Recorrido · ${String(Math.floor(hour)).padStart(2, '0')}:${String(Math.floor((hour % 1) * 60)).padStart(2, '0')} · Bogotá`;
      if (t >= 1) walk();
      return true;
    }
    const fwd = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0) + pad;
    const side = (keys.has('d') ? 1 : 0) - (keys.has('a') ? 1 : 0);
    const turn = (keys.has('arrowleft') ? 1 : 0) - (keys.has('arrowright') ? 1 : 0);
    yaw += turn * dt * 1.6;
    if (fwd || side) {
      const speed = (keys.has('shift') ? 3.2 : 1.4) * dt;
      const f = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
      const rgt = new THREE.Vector3(-f.z, 0, f.x);
      const move = f.multiplyScalar(fwd).add(rgt.multiplyScalar(side)).normalize();
      if (!blocked(cam.position, move, speed)) cam.position.addScaledVector(move, speed);
    }
    cam.position.y = ctx.elev() + EYE;
    cam.rotation.set(pitch, yaw, 0, 'YXZ');
    return true;
  }

  addEventListener('keydown', (e) => {
    if (!mode) return;
    e.preventDefault();
    e.stopPropagation(); // que W, S, A o D no activen herramientas mientras se camina
    if (e.key === 'Escape') return stop();
    if (mode === 'cine') return; // cualquier otra tecla no interrumpe el recorrido
    keys.add(e.key.toLowerCase());
    if (e.shiftKey) keys.add('shift');
  }, true);
  addEventListener('keyup', (e) => { keys.delete(e.key.toLowerCase()); if (!e.shiftKey) keys.delete('shift'); });
  addEventListener('blur', () => keys.clear());

  ctx.dom.addEventListener('pointerdown', (e) => {
    if (mode === 'cine') return walk();
    if (mode === 'walk') drag = [e.clientX, e.clientY];
  });
  addEventListener('pointermove', (e) => {
    if (mode !== 'walk' || !drag) return;
    yaw -= (e.clientX - drag[0]) * 0.004;
    pitch = THREE.MathUtils.clamp(pitch - (e.clientY - drag[1]) * 0.004, -1.2, 1.2);
    drag = [e.clientX, e.clientY];
  });
  addEventListener('pointerup', () => { drag = null; pad = 0; });
  ui.querySelector('[data-exit]').addEventListener('click', () => stop());
  ui.querySelectorAll('[data-pad]').forEach((b) => b.addEventListener('pointerdown', (e) => { e.stopPropagation(); pad = +b.dataset.pad; }));

  return { play, walk, stop, update, get active() { return !!mode; } };
}

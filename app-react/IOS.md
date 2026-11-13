# AceroStudio en tu iPhone (con Xcode)

La app web (`app-react/`) se envuelve como app nativa de iPhone con **Capacitor**. Es la misma app que www.acerostudio.com/app/, pero instalada en el teléfono: la cámara abre más rápido y queda lista para sumar después el LiDAR (ARKit / RoomPlan), que el navegador no deja usar.

## Lo que necesitas (una sola vez)

1. **Un Mac** con **Xcode** (gratis en la App Store; la primera vez tarda en instalarse).
2. **Node.js 22 o más nuevo** (https://nodejs.org, botón "LTS").
3. Tu **Apple ID** (sirve el gratuito; no hace falta pagar el programa de desarrollador para probar en tu propio iPhone).
4. El iPhone con un **cable** al Mac (la primera vez).

## Pasos

Abre la app **Terminal** del Mac y pega, uno por uno:

```bash
git clone https://github.com/sebasacero/Acerostudio_.git
cd Acerostudio_
git checkout claude/project-thread-6l2y4n
cd app-react
npm install
npm run ios
```

(Cuando el cambio se fusione a main, el `git checkout` ya no hace falta.)

`npm run ios` compila la app, la copia al proyecto de iPhone y abre **Xcode**. En Xcode:

1. Espera a que termine de bajar "Swift Package Dependencies" (barra de arriba).
2. En la columna izquierda haz clic en **App** (el ícono azul) → pestaña **Signing & Capabilities**.
3. En **Team** elige tu Apple ID (si no aparece: *Add an Account…* e inicia sesión).
   Si dice que el *Bundle Identifier* ya está en uso, cámbialo por algo tuyo, por ejemplo `com.acerostudio.app.sebastian`.
4. Conecta el iPhone, desbloquéalo y acepta **"Confiar en este computador"**.
5. Arriba, junto al botón ▶, elige **tu iPhone** como destino y pulsa **▶ (Run)**.
6. La primera vez el iPhone pedirá activar el **Modo de desarrollador**: *Ajustes → Privacidad y seguridad → Modo de desarrollador → Activar* (se reinicia).
7. Si al abrir dice "Desarrollador no confiable": *Ajustes → General → VPN y gestión de dispositivos → tu Apple ID → Confiar*.

Listo: el ícono **AceroStudio** queda en la pantalla de inicio.

> Con Apple ID gratuito la firma dura **7 días**; después, vuelve a pulsar ▶ en Xcode. Para TestFlight o la App Store se necesita el programa de desarrollador de Apple (USD 99/año).

## Actualizar la app después de cambios

```bash
cd ~/Acerostudio_ && git pull && cd app-react && npm install && npm run ios
```

y ▶ en Xcode.

## Qué probar

- **Cámara**: tocar = foto, mantener = video. iOS pedirá permiso de cámara y micrófono.
- **Encajar**: después de la foto, **toca el espacio** (vano) donde va la puerta o el portón. La IA (Segment Anything de Meta, versión SlimSAM) lo recorta, pone las 4 esquinas y pregunta "¿Es este el espacio?".
- **Medir**: marca los 2 extremos de la referencia (por ejemplo un metro de flexómetro) y luego **un solo toque dentro del vano**: la app saca ancho × alto.
- La **primera vez** que usas la IA baja el modelo (~14 MB) de Hugging Face; necesita internet. Después queda guardado en el teléfono.

## Notas técnicas

- Capacitor fijo en **8.5.3** (`package.json`, versión exacta): el paquete de iOS 8.6.1 publicado en GitHub no coincide con su propia suma de verificación y Xcode no lo descarga ("checksum … does not match"). Subir de versión solo cuando eso esté corregido.
- Configuración: `capacitor.config.json` (id `com.acerostudio.app`). Proyecto Xcode en `ios/App` (Swift Package Manager, iOS 15+).
- Permisos en `ios/App/App/Info.plist`: cámara, micrófono y guardar en Fotos.
- `npm run build:ios` compila con rutas relativas a `dist-ios/` y sincroniza; la versión web sigue saliendo a `/app/` con `npm run build`.
- Siguiente paso nativo (Fase 3): plugin con **RoomPlan + LiDAR** para que el iPhone detecte puertas, ventanas y vanos con medidas reales.

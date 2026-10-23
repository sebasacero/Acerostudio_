# AceroStudio móvil — escaneo LiDAR

App iOS (Expo + React Native) que hace lo que muestra el video de la fachada
"SE ARRIENDA": apuntas el iPhone al espacio, el **LiDAR** lo mide, eliges un
estilo y la IA devuelve la propuesta. Funciona con espacios pequeños y grandes
porque el prompt se ajusta a las medidas reales (ver `src/lib/space.ts`).

## Cómo funciona

1. `modules/lidar-scanner/` — módulo nativo (Swift, Expo Modules API). Usa
   ARKit con `sceneReconstruction = .meshWithClassification`: el LiDAR
   reconstruye la malla del lugar y clasifica cada cara (piso, muro, techo).
   Con eso calcula área de piso, área de muros y la caja envolvente (ancho ×
   fondo × alto) en tiempo real, y al terminar exporta la foto y la malla OBJ.
2. `src/lib/space.ts` — clasifica el espacio (pequeño < 25 m², mediano < 80,
   grande), sugiere obras del catálogo y arma el prompt con las medidas reales.
3. `src/lib/backend.ts` — sube foto y malla a Supabase Storage
   (`disenos-cafe/originales`, `disenos-cafe/escaneos`), llama a la Edge
   Function `generar-dise-o` (modo `espacio`) y guarda la cotización en
   `quote_requests` (`scan_mesh_url`, `space_area_m2`).
4. `src/App.tsx` — flujo: escaneo con HUD de medidas → estilo → propuesta →
   WhatsApp.

## Requisitos

- iPhone con LiDAR (12 Pro o posterior), iOS 16+.
- Mac con Xcode y cuenta de Apple Developer (el módulo nativo exige un
  *development build*; no funciona en Expo Go).

```bash
cd mobile
npm install
cp .env.example .env
npx expo prebuild --platform ios
npx expo run:ios --device
```

## Estado

El TypeScript compila. **El código Swift no se ha compilado ni probado en
dispositivo** (este entorno no tiene macOS ni iPhone): la primera compilación
en Xcode puede requerir ajustes menores. Los puntos a vigilar:
`ARMeshAnchor.geometry` (lectura de buffers por `offset`/`stride`),
`arView.snapshot` y los permisos de cámara en `app.json`.

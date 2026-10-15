# AceroStudio — Herramienta de rediseño + cotización (React / Next.js)

App nueva, separada del sitio estático (`../index.html`), que implementa la
herramienta real de rediseño con IA (espacio **o** producto) y el flujo de
cotización. Se construyó en React (Next.js) a propósito para que, cuando se
decida portar a una app móvil, la lógica de negocio (hooks, llamadas a
Supabase, el flujo del wizard) sea directamente reutilizable con React
Native — solo la capa de UI cambia.

Usa el **mismo proyecto Supabase** que ya está en producción
(`acero-press`, ver [`../supabase/README.md`](../supabase/README.md)), así
que no hace falta backend nuevo.

## Qué hace

1. El visitante elige modo: **Espacio** (interior/fachada de cafetería) o
   **Producto** (empaque, etiqueta, merchandising).
2. Sube una foto real y elige un estilo.
3. La foto se sube a Supabase Storage (`disenos-cafe/originales`) y se llama
   a la Edge Function `generar-dise-o`, que usa Gemini 2.5 Flash Image para
   generar de verdad la propuesta (antes esta función existía pero ningún
   frontend la llamaba — el chat viejo solo mandaba la foto a un asesor
   humano por WhatsApp).
4. Se muestra un antes/después y el visitante puede pedir cotización:
   nombre, teléfono, email, presupuesto y notas se guardan en
   `public.quote_requests` y se abre WhatsApp con el resumen.

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # ya trae la URL y la anon key públicas del proyecto
npm run dev
```

Abre http://localhost:3000.

> **Nota sobre validación en este entorno**: el build, el typecheck, el
> lint y la interacción en navegador (cambio de modo, subida de archivo,
> selección de estilo) se probaron aquí con Playwright. La llamada real de
> red a Supabase Storage / la Edge Function **no** se pudo probar end-to-end
> desde este sandbox porque su política de red bloquea salida directa a
> `*.supabase.co` (solo permite un allowlist reducido de hosts). Esto es una
> restricción del entorno de desarrollo en la nube, no del código: un
> visitante real en internet sí podrá llegar a Supabase sin problema. Vale
> la pena probar el flujo completo una vez desplegado (o en un entorno con
> salida a internet sin restringir) antes de anunciarlo como terminado.

## Deploy

Pensado para **Vercel** (es la plataforma nativa de Next.js):

1. Importa este repo en Vercel, con **Root Directory = `redesign-app`**.
2. Variables de entorno (copiadas de `.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
3. Deploy. Luego, desde el sitio estático principal, agrega un enlace/CTA
   hacia la URL donde quede publicado (ej. `app.acerostudio.com` o
   `/rediseno`) — no se agregó automáticamente porque esa URL aún no existe.

## Siguientes pasos sugeridos (no incluidos en esta entrega)

- Slider real de comparación antes/después (hoy es lado a lado).
- Panel admin simple para ver `quote_requests` (ya protegido por RLS,
  solo falta la UI — podría vivir en esta misma app bajo `/admin`).
- Ajustar los estilos de "Producto" con el equipo (hoy son un punto de
  partida razonable, no vinieron del sitio original).

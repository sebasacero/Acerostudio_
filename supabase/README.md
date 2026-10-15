# Backend de AceroStudio (Supabase)

El sitio **acerostudio.com** y el ecosistema ACERO (café físico, POS, panel
admin) comparten un único proyecto de Supabase ya creado y en producción:

| | |
|---|---|
| **Proyecto** | `acero-press` |
| **Ref** | `tylylfrabjkaiukuilem` |
| **Región** | `sa-east-1` |
| **URL** | `https://tylylfrabjkaiukuilem.supabase.co` |
| **Estado** | ACTIVE_HEALTHY |

> ⚠️ Esta carpeta documenta y versiona (por primera vez) un proyecto que ya
> existía en Supabase y que el frontend (`js/rediseno-ia.js`,
> `js/social-feed.js`) ya consume en producción mediante su `anon key`
> pública. No se creó un proyecto nuevo porque el sitio ya está conectado a
> este; crear uno distinto habría roto el flujo de rediseño por IA y el
> feed de Instagram.

## Esquema (tablas principales)

- **`products` / `product_variants` / `inventory` / `inventory_movements`** — catálogo de café (bolsas, equipo AeroPress) y control de stock.
- **`tables` / `orders` / `order_items`** — POS del café físico A000/AOOO (pedidos web, WhatsApp, mesa).
- **`customers` / `admin_users`** — clientes con login (Supabase Auth) y staff del panel admin (`owner` / `cashier` / `staff`).
- **`config`** — pares clave/valor usados por la función `whatsapp-link` (número de WhatsApp, mensajes prellenados por producto). Lectura pública, edición solo admin (RLS agregado en esta tarea).
- **`leads`** — contador de clics en los botones de WhatsApp (`msg_key` + `created_at`), alimentado por la función `whatsapp-link`.
- **`redesign_leads`** *(creada en una tarea anterior, en desuso)* — pensada para leads del chat de rediseño viejo (`js/rediseno-ia.js`). Nunca recibió tráfico real porque ese frontend no llegó a desplegarse. Reemplazada por `quote_requests` (ver abajo); se deja la tabla intacta porque borrarla es una acción destructiva que debe decidir el dueño del proyecto.
- **`quote_requests`** *(nuevo)* — tabla real detrás de la nueva herramienta de rediseño en React (`../redesign-app/`): modo (`espacio` | `producto`), estilo, foto original, imagen generada por IA, datos de contacto, presupuesto, notas y `status` (`pending` → `contacted` → `won`/`lost`). Lectura/edición solo-admin, inserción pública (RLS).
- **`page_sections`** — CMS liviano para secciones editables de la landing (hero, banners).
- **`publications`** — cola de contenido para publicar en redes (Instagram/TikTok), usada por la función `publish-content`.
- **`analytics_sessions` / `analytics_events`** — analítica propia de sesiones/eventos del sitio.
- **`growth_algorithm_config` / `growth_ai_insights`** — pesos del algoritmo de crecimiento y el historial de insights generados por IA para el panel admin.

Funciones clave: `is_admin()` (gate de RLS para el rol admin), `compute_growth_metrics()`, `get_recent_sales()`, `get_sales_counts()`, `handle_new_customer()` (trigger de alta de cliente al registrarse).

## Storage

- `content` (público) — contenido general del CMS.
- `disenos-cafe` (público) — fotos originales subidas en el chat de rediseño IA (`originales/`).
- `marketing` (público) — assets de marketing/banners.

## Edge Functions

- `instagram-proxy` — feed de Instagram para la sección `#instagram` (`js/social-feed.js`).
- `whatsapp-link` — resuelve `msg_key` → número + mensaje prellenado de WhatsApp y registra el clic en `leads`.
- `publish-content` — publica entradas de `publications` en redes sociales.
- `generar-dise-o` — genera el render de rediseño llamando a **Gemini 2.5 Flash Image** (requiere el secreto `GEMINI_API_KEY` en el proyecto). Ya existía pero ningún frontend la llamaba; ahora la consume `../redesign-app/`. Se generalizó en esta tarea para aceptar un parámetro `mode` (`espacio` | `producto`), cada uno con sus propias reglas de sistema que acotan qué puede cambiar el modelo. Fuente versionada en `functions/generar-dise-o/index.ts`.

## Cambios aplicados en esta tarea

1. `supabase/migrations/20261015000001_enable_rls_on_config_table.sql` — la tabla `config` estaba expuesta vía PostgREST **sin RLS** (hallazgo `ERROR` del linter de seguridad de Supabase): cualquiera con la `anon key` pública podía editar el número de WhatsApp o los mensajes prellenados. Se habilitó RLS con lectura pública y escritura solo-admin, igual que `app_config`.
2. `supabase/migrations/20261015000002_create_redesign_leads_table.sql` — se creó `redesign_leads` y se corrigió `js/rediseno-ia.js` para que el guardado "best-effort" del lead del chat de rediseño realmente funcione (antes fallaba en silencio por columnas inexistentes). *(Superada por el cambio 3; ver nota sobre `redesign_leads` arriba.)*
3. `supabase/migrations/20261015010000_create_quote_requests_table.sql` + generalización de la función `generar-dise-o` — soporte de backend para la nueva herramienta de rediseño en React (`../redesign-app/`), que sí conecta de verdad con Gemini en vez de solo mandar la foto a un humano por WhatsApp.

## Pendiente / recomendado (no aplicado, requiere decisión del dueño del proyecto)

- `auth_leaked_password_protection` (WARN): activar la protección de contraseñas filtradas (HaveIBeenPwned) en Auth → Settings.
- Funciones `SECURITY DEFINER` expuestas por RPC (`get_recent_sales`, `get_sales_counts`, `is_admin`, `compute_growth_metrics`): ya validan `is_admin()` internamente o solo devuelven datos agregados no sensibles; revisar si alguna debería restringirse más.
- Afinar políticas RLS que llaman `auth.uid()` por fila (`customers`, `orders`, `order_items`) con `(select auth.uid())` para mejor rendimiento a escala (hallazgo de performance, no de seguridad).

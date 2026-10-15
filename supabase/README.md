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
- **`redesign_leads`** *(nuevo, esta tarea)* — leads del flujo de **rediseño con IA** del chat (`js/rediseno-ia.js`): foto subida a Storage, estilo elegido, estado. Antes de esta tarea, `rediseno-ia.js` intentaba insertar en una tabla con columnas que no existían, así que ningún lead del chat se guardaba.
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
- `generar-dise-o` — soporte del flujo de rediseño.

## Cambios aplicados en esta tarea

1. `supabase/migrations/20261015000001_enable_rls_on_config_table.sql` — la tabla `config` estaba expuesta vía PostgREST **sin RLS** (hallazgo `ERROR` del linter de seguridad de Supabase): cualquiera con la `anon key` pública podía editar el número de WhatsApp o los mensajes prellenados. Se habilitó RLS con lectura pública y escritura solo-admin, igual que `app_config`.
2. `supabase/migrations/20261015000002_create_redesign_leads_table.sql` — se creó `redesign_leads` y se corrigió `js/rediseno-ia.js` para que el guardado "best-effort" del lead del chat de rediseño realmente funcione (antes fallaba en silencio por columnas inexistentes).

## Pendiente / recomendado (no aplicado, requiere decisión del dueño del proyecto)

- `auth_leaked_password_protection` (WARN): activar la protección de contraseñas filtradas (HaveIBeenPwned) en Auth → Settings.
- Funciones `SECURITY DEFINER` expuestas por RPC (`get_recent_sales`, `get_sales_counts`, `is_admin`, `compute_growth_metrics`): ya validan `is_admin()` internamente o solo devuelven datos agregados no sensibles; revisar si alguna debería restringirse más.
- Afinar políticas RLS que llaman `auth.uid()` por fila (`customers`, `orders`, `order_items`) con `(select auth.uid())` para mejor rendimiento a escala (hallazgo de performance, no de seguridad).

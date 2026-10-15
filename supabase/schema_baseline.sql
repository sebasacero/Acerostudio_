-- ============================================================================
-- AceroStudio / ecosistema ACERO — baseline del esquema de Supabase
-- Proyecto: acero-press (ref: tylylfrabjkaiukuilem)
-- ============================================================================
-- Este archivo es una FOTOGRAFIA de solo lectura del esquema que YA EXISTE
-- en producción (resultado de 29 migraciones aplicadas directamente en el
-- dashboard de Supabase entre 2026-09-01 y 2026-09-28, nunca versionadas en
-- este repositorio hasta ahora). Se documenta aquí con fines de contexto y
-- de recuperación ante desastre.
--
-- NO ejecutar este archivo contra el proyecto "acero-press": ya existe.
-- Úsalo solo como referencia, o para levantar un proyecto Supabase nuevo
-- (otro entorno, staging, etc.) que deba partir de la misma base.
--
-- Los cambios posteriores a esta fotografía viven en supabase/migrations/.
-- ============================================================================

-- ---------- Enums ----------------------------------------------------------
create type public.product_category as enum ('coffee_bag', 'aeropress_equipment');
create type public.movement_reason as enum ('sale', 'restock', 'adjustment', 'waste');
create type public.table_status as enum ('free', 'occupied', 'closed');
create type public.order_source as enum ('web', 'whatsapp', 'pos', 'table', 'web_card');
create type public.order_status as enum ('pending', 'confirmed', 'completed', 'cancelled');
create type public.admin_role as enum ('owner', 'cashier', 'staff');
create type public.section_type as enum ('hero_video', 'text_banner', 'custom', 'banner_carousel');

-- ---------- Catálogo e inventario (café y equipo AeroPress) ----------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category public.product_category not null default 'coffee_bag',
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  recipe_text text
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id),
  label text not null,
  price numeric not null,
  sku text unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.inventory (
  variant_id uuid primary key references public.product_variants(id),
  stock_qty integer not null default 0,
  low_stock_threshold integer not null default 5,
  updated_at timestamptz not null default now()
);

-- ---------- POS del café físico A000/AOOO -----------------------------------
create table public.tables (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  status public.table_status not null default 'free',
  created_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id),
  email text,
  full_name text,
  avatar_url text,
  subscribed_offers boolean not null default true,
  monthly_subscription boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  source public.order_source not null,
  table_id uuid references public.tables(id),
  customer_id uuid references public.customers(id),
  status public.order_status not null default 'pending',
  customer_phone text,
  total numeric not null default 0,
  payment_provider text,
  payment_reference text,
  payment_method text,
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id),
  variant_id uuid references public.product_variants(id),
  product_name_snapshot text not null,
  variant_label_snapshot text,
  unit_price numeric not null,
  qty integer not null default 1,
  subtotal numeric not null
);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id),
  change_qty integer not null,
  reason public.movement_reason not null,
  reference_order_id uuid references public.orders(id),
  note text,
  created_at timestamptz not null default now()
);

-- ---------- Staff / panel admin ---------------------------------------------
create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id),
  full_name text,
  role public.admin_role not null default 'staff',
  created_at timestamptz not null default now()
);

-- ---------- Configuración ----------------------------------------------------
-- Clave/valor "legacy" consumida por la edge function whatsapp-link
-- (numero de WhatsApp y mensajes prellenados por producto).
create table public.config (
  id bigint generated by default as identity primary key,
  key text not null,
  value text
);

-- Clave/valor "moderna" para ajustes generales del sitio/CMS.
create table public.app_config (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- Contador de clics en los botones de WhatsApp (alimentado por whatsapp-link).
create table public.leads (
  id bigint generated by default as identity primary key,
  msg_key text not null,
  created_at timestamptz default now()
);

-- ---------- CMS liviano de la landing ---------------------------------------
create table public.page_sections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  section_type public.section_type not null default 'text_banner',
  order_index integer not null default 0,
  active boolean not null default true,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Cola de publicación en redes -------------------------------------
create table public.publications (
  id bigint generated by default as identity primary key,
  video_url text not null,
  caption text,
  caption_es text,
  trim_start double precision,
  trim_end double precision,
  subtitules jsonb,
  platforms jsonb,
  result jsonb,
  results jsonb,
  scheduled_at timestamptz,
  published boolean not null default false,
  created_at timestamptz default now()
);

-- ---------- Analítica propia del sitio ---------------------------------------
create table public.analytics_sessions (
  id uuid primary key default gen_random_uuid(),
  session_uid text not null unique,
  device text,
  language text,
  referrer text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds integer
);

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.analytics_sessions(id),
  event_type text not null,
  section text,
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index idx_events_session on public.analytics_events(session_id);
create index idx_events_type on public.analytics_events(event_type);
create index idx_events_created on public.analytics_events(created_at);

-- ---------- Panel de crecimiento / insights de IA ----------------------------
create table public.growth_algorithm_config (
  metric text primary key,
  label text not null,
  weight numeric not null,
  threshold numeric not null,
  description text,
  updated_at timestamptz not null default now()
);

create table public.growth_ai_insights (
  id uuid primary key default gen_random_uuid(),
  metrics_snapshot jsonb not null,
  insight text not null,
  model text not null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Funciones
-- ============================================================================

create or replace function public.is_admin()
 returns boolean
 language sql stable security definer set search_path to 'public'
as $$
  select exists (select 1 from public.admin_users where auth_user_id = auth.uid());
$$;

create or replace function public.handle_new_customer()
 returns trigger
 language plpgsql security definer set search_path to 'public'
as $$
begin
  insert into public.customers (auth_user_id, email, full_name, avatar_url)
  values (
    new.id, new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (auth_user_id) do nothing;
  return new;
end;
$$;
-- trigger: after insert on auth.users -> handle_new_customer()

create or replace function public.get_sales_counts()
 returns table(category public.product_category, total_qty bigint, total_amount numeric)
 language sql stable security definer set search_path to 'public'
as $$
  select p.category, coalesce(sum(oi.qty), 0)::bigint, coalesce(sum(oi.subtotal), 0)::numeric
  from public.order_items oi
  join public.orders o on o.id = oi.order_id
  left join public.product_variants pv on pv.id = oi.variant_id
  left join public.products p on p.id = pv.product_id
  where o.status in ('confirmed', 'completed')
  group by p.category;
$$;

create or replace function public.get_recent_sales(sale_limit integer default 20)
 returns table(category public.product_category, product_name text, amount numeric, sold_at timestamptz)
 language sql stable security definer set search_path to 'public'
as $$
  select p.category, oi.product_name_snapshot, oi.subtotal, o.closed_at
  from public.order_items oi
  join public.orders o on o.id = oi.order_id
  left join public.product_variants pv on pv.id = oi.variant_id
  left join public.products p on p.id = pv.product_id
  where o.status in ('confirmed', 'completed')
  order by o.closed_at desc nulls last
  limit least(sale_limit, 50);
$$;

create or replace function public.compute_growth_metrics()
 returns jsonb
 language plpgsql stable security definer set search_path to 'public'
as $$
-- Agrega ventas, rotación de inventario, tasa de recompra y top productos
-- de los últimos 30/60 días. Solo accesible para admins (ver cuerpo real
-- en la base de datos; resumido aquí por brevedad del baseline).
declare result jsonb;
begin
  if not public.is_admin() then
    raise exception 'No autorizado';
  end if;
  -- ver definición completa con: select pg_get_functiondef('public.compute_growth_metrics'::regproc);
  return result;
end;
$$;

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory enable row level security;
alter table public.tables enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.admin_users enable row level security;
alter table public.app_config enable row level security;
alter table public.leads enable row level security; -- habilitado, sin policies (ver supabase/README.md)
alter table public.page_sections enable row level security;
alter table public.publications enable row level security;
alter table public.analytics_sessions enable row level security;
alter table public.analytics_events enable row level security;
alter table public.growth_algorithm_config enable row level security;
alter table public.growth_ai_insights enable row level security;
-- public.config: sin RLS en este baseline — corregido en
-- supabase/migrations/20261015000001_enable_rls_on_config_table.sql

create policy "public puede ver productos activos" on public.products for select using (active = true or is_admin());
create policy "solo admin gestiona productos" on public.products for all using (is_admin()) with check (is_admin());

create policy "public puede ver variantes activas" on public.product_variants for select using (active = true or is_admin());
create policy "solo admin gestiona variantes" on public.product_variants for all using (is_admin()) with check (is_admin());

create policy "solo admin ve inventario" on public.inventory for all using (is_admin()) with check (is_admin());
create policy "solo admin ve movimientos" on public.inventory_movements for all using (is_admin()) with check (is_admin());
create policy "solo admin gestiona mesas" on public.tables for all using (is_admin()) with check (is_admin());

create policy "admin ve todos los clientes" on public.customers for select using (is_admin());
create policy "el cliente ve su propio perfil" on public.customers for select using (auth.uid() = auth_user_id);
create policy "el cliente edita su propio perfil" on public.customers for update using (auth.uid() = auth_user_id) with check (auth.uid() = auth_user_id);

create policy "cualquiera puede crear pedidos" on public.orders for insert with check (true);
create policy "el cliente ve sus propios pedidos" on public.orders for select
  using (customer_id in (select id from public.customers where auth_user_id = auth.uid()));
create policy "solo admin lee y edita pedidos" on public.orders for select using (is_admin());
create policy "solo admin actualiza pedidos" on public.orders for update using (is_admin()) with check (is_admin());
create policy "solo admin borra pedidos" on public.orders for delete using (is_admin());

create policy "cualquiera puede crear items de pedido" on public.order_items for insert with check (true);
create policy "el cliente ve items de sus propios pedidos" on public.order_items for select
  using (order_id in (select o.id from public.orders o join public.customers c on c.id = o.customer_id where c.auth_user_id = auth.uid()));
create policy "solo admin lee items de pedido" on public.order_items for select using (is_admin());
create policy "solo admin edita items de pedido" on public.order_items for update using (is_admin()) with check (is_admin());
create policy "solo admin borra items de pedido" on public.order_items for delete using (is_admin());

create policy "solo admin se ve a si mismo" on public.admin_users for select using (is_admin());

create policy "cualquiera puede leer la configuracion publica" on public.app_config for select using (true);
create policy "solo admin edita la configuracion" on public.app_config for all using (is_admin()) with check (is_admin());

create policy "cualquiera ve secciones activas" on public.page_sections for select using (active = true or is_admin());
create policy "solo admin gestiona secciones" on public.page_sections for all using (is_admin()) with check (is_admin());

create policy "solo admin gestiona publicaciones" on public.publications for all using (is_admin()) with check (is_admin());

create policy "cualquiera crea sesiones" on public.analytics_sessions for insert with check (true);
create policy "cualquiera actualiza su propia sesion" on public.analytics_sessions for update using (true) with check (true);
create policy "solo admin lee sesiones" on public.analytics_sessions for select using (is_admin());

create policy "cualquiera crea eventos" on public.analytics_events for insert with check (true);
create policy "solo admin lee eventos" on public.analytics_events for select using (is_admin());

create policy "solo admin ve y edita el algoritmo" on public.growth_algorithm_config for all using (is_admin()) with check (is_admin());
create policy "solo admin crea insights de ia" on public.growth_ai_insights for insert with check (is_admin());
create policy "solo admin ve el historial de ia" on public.growth_ai_insights for select using (is_admin());

-- ============================================================================
-- Storage (buckets públicos)
-- ============================================================================
-- content      — contenido general del CMS
-- disenos-cafe — fotos originales subidas en el chat de rediseño IA (originales/)
-- marketing    — assets de marketing/banners

-- Tabla para la nueva herramienta de rediseño (espacio o producto) + flujo
-- de cotización: cada render generado con IA que el visitante decide
-- cotizar queda guardado aquí junto con sus datos de contacto, en lugar de
-- perderse en un simple clic de WhatsApp.
--
-- Nota: la tabla public.redesign_leads (creada en una tarea anterior) queda
-- en desuso a partir de esta migración — nunca llegó a recibir tráfico real
-- porque el frontend que la usaba no se había desplegado. Se deja intacta
-- (no se borra) porque eliminar tablas es una acción destructiva que debe
-- decidir el dueño del proyecto; puede eliminarse manualmente cuando se
-- confirme que ya no se necesita.

create type public.redesign_mode as enum ('espacio', 'producto');
create type public.quote_status as enum ('pending', 'contacted', 'won', 'lost');

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  mode public.redesign_mode not null,
  style text not null,
  original_photo_url text not null,
  generated_image_url text,
  contact_name text,
  contact_phone text,
  contact_email text,
  budget_range text,
  notes text,
  status public.quote_status not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.quote_requests enable row level security;

-- El visitante crea su propia solicitud de cotizacion sin estar logueado.
create policy "cualquiera puede crear una cotizacion"
  on public.quote_requests
  for insert
  with check (true);

-- Solo el equipo (admin_users) puede leer y gestionar las cotizaciones.
create policy "solo admin lee cotizaciones"
  on public.quote_requests
  for select
  using (is_admin());

create policy "solo admin actualiza cotizaciones"
  on public.quote_requests
  for update
  using (is_admin())
  with check (is_admin());

-- Fábrica de AceroStudio: órdenes de producción, piezas con su estado y eventos de máquina.
-- NO está aplicada: correrla solo cuando el dueño del proyecto lo apruebe (supabase db push).
-- El agente de taller (fabrica/agente/agente.mjs) escribe en fab_eventos con una clave de servicio;
-- la web lee y actualiza el estado de las piezas (taller y obra) con usuarios autenticados.

create table if not exists public.fab_ordenes (
  orden text primary key,
  proyecto text not null,
  creada timestamptz not null default now(),
  resumen jsonb not null default '{}'::jsonb,   -- piezas, marcas, kg, agujeros…
  datos jsonb,                                  -- orden.json completo (marcas, placas, nesting)
  creada_por uuid references auth.users (id) default auth.uid()
);

create table if not exists public.fab_piezas (
  orden text not null references public.fab_ordenes (orden) on delete cascade,
  pieza text not null,                          -- serie, ej. V3-007
  marca text not null,
  piso text,
  secuencia int,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'fabricada', 'despachada', 'montada')),
  actualizada timestamptz not null default now(),
  actualizada_por uuid references auth.users (id) default auth.uid(),
  primary key (orden, pieza)
);
create index if not exists fab_piezas_estado on public.fab_piezas (orden, estado);

create table if not exists public.fab_eventos (
  id bigint generated always as identity primary key,
  orden text not null,
  pieza text,
  maquina text,
  tipo text not null,                           -- inicio, medicion, ajuste, recorte, rechazo, certificado, estado
  desvio numeric,
  compensacion numeric,
  t timestamptz not null default now()
);
create index if not exists fab_eventos_orden on public.fab_eventos (orden, t desc);

alter table public.fab_ordenes enable row level security;
alter table public.fab_piezas enable row level security;
alter table public.fab_eventos enable row level security;

-- Lectura y escritura para usuarios autenticados del equipo (taller, obra, oficina técnica).
create policy "equipo lee ordenes" on public.fab_ordenes for select to authenticated using (true);
create policy "equipo crea ordenes" on public.fab_ordenes for insert to authenticated with check (creada_por = (select auth.uid()));
create policy "equipo lee piezas" on public.fab_piezas for select to authenticated using (true);
create policy "equipo crea piezas" on public.fab_piezas for insert to authenticated with check (true);
create policy "equipo actualiza piezas" on public.fab_piezas for update to authenticated using (true) with check (true);
create policy "equipo lee eventos" on public.fab_eventos for select to authenticated using (true);
-- Los eventos de máquina los escribe el agente con la clave de servicio (salta RLS); sin política de insert pública.

-- Cada cambio de estado de una pieza queda también como evento (trazabilidad EN 1090).
create or replace function public.fab_registrar_estado() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.estado is distinct from old.estado then
    insert into public.fab_eventos (orden, pieza, tipo, maquina) values (new.orden, new.pieza, 'estado', new.estado);
  end if;
  new.actualizada := now();
  return new;
end $$;
create trigger fab_piezas_estado_evento before update on public.fab_piezas for each row execute function public.fab_registrar_estado();

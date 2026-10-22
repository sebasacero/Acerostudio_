-- Cotizaciones del estudio de obras en acero (redesign-app /estudio): guardan
-- la configuración exacta y el presupuesto estimado, y pueden no tener foto.
alter type public.redesign_mode add value if not exists 'obra';

alter table public.quote_requests alter column original_photo_url drop not null;

alter table public.quote_requests
  add column if not exists work_id text,
  add column if not exists tradition_id text,
  add column if not exists material_id text,
  add column if not exists finish_id text,
  add column if not exists quantity numeric,
  add column if not exists unit text,
  add column if not exists estimate_low numeric,
  add column if not exists estimate_high numeric,
  add column if not exists estimate_breakdown jsonb;

-- La app móvil (mobile/) escanea el espacio con el LiDAR del iPhone y guarda
-- la malla 3D y el área real de piso junto con la cotización.
alter table public.quote_requests
  add column if not exists scan_mesh_url text,
  add column if not exists space_area_m2 numeric;
